
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { KanbanDetailDrawer } from '@/components/kanban/KanbanDetailDrawer';
import { KanbanItem } from '@/components/kanban/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCandidates, getCandidateStages, updateCandidateStage } from '@/api/candidates';
import { Candidate } from '@/api/types';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

const CandidatesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<KanbanItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const queryClient = useQueryClient();

  // Get candidates
  const { data: candidatesData } = useQuery({
    queryKey: ['candidates'],
    queryFn: () => getCandidates(1, 100).then(res => res.data)
  });

  // Get stages
  const { data: stagesData } = useQuery({
    queryKey: ['candidate-stages'],
    queryFn: () => getCandidateStages().then(res => res.data)
  });

  // Update stage mutation
  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) => 
      updateCandidateStage(id, stage),
    onSuccess: () => {
      toast.success('Candidate stage updated');
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
    onError: (err: Error) => {
      toast.error(`Failed to update candidate stage: ${err.message}`);
    }
  });

  // Convert candidates to kanban items
  const candidateItems: KanbanItem[] = candidatesData?.data
    ? candidatesData.data.map((candidate: Candidate) => ({
        id: candidate.id,
        title: `${candidate.firstName} ${candidate.lastName}`,
        subtitle: candidate.position,
        stage: candidate.stage || 'Screening',
        tags: candidate.skills,
        type: 'candidate',
      }))
    : [];

  // Filtered items based on search
  const filteredItems = searchQuery
    ? candidateItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : candidateItems;

  // Prepare columns from stages
  const columns = stagesData
    ? stagesData.map((stage: string) => ({
        id: stage,
        title: stage,
      }))
    : [];

  // Handle card click
  const handleCardClick = (item: KanbanItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  // Handle drag end
  const handleDragEnd = (item: KanbanItem, destinationId: string) => {
    if (item.stage !== destinationId) {
      updateStageMutation.mutate({
        id: item.id,
        stage: destinationId,
      });
    }
  };

  return (
    <Layout>
      <div className="mb-4 bg-recruitflow-beigeDark rounded-lg p-3 flex flex-wrap gap-3 items-center">
        <div className="flex-1">
          <div className="flex items-center">
            <span className="whitespace-nowrap mr-2 font-medium">Сортировать по</span>
            <Input 
              value="Дате изменения"
              readOnly
              className="input-field bg-white cursor-default"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="relative">
            <Input
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
        
        <div className="flex-none">
          <Button variant="outline" className="bg-white">
            Показывать только активные
          </Button>
        </div>
      </div>
      
      <div className="bg-recruitflow-beigeDark rounded-lg p-2 h-[calc(100vh-200px)] overflow-hidden">
        {columns.length > 0 && (
          <KanbanBoard
            columns={columns}
            items={filteredItems}
            onItemDragEnd={handleDragEnd}
            onItemClick={handleCardClick}
          />
        )}
      </div>

      <KanbanDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        item={selectedItem}
      />
    </Layout>
  );
};

export default CandidatesPage;
