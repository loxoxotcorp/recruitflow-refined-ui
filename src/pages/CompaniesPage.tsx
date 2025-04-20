
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import CompanyList from '@/components/companies/CompanyList';
import CompanyDetail from '@/components/companies/CompanyDetail';
import CompanyVacancies from '@/components/companies/CompanyVacancies';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Company } from '@/api/types';
import { Search } from 'lucide-react';

const CompaniesPage = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
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
            Показывать только активные вакансии
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        <div className="col-span-1 bg-recruitflow-beigeLight rounded-lg shadow-sm overflow-hidden">
          <CompanyList 
            onSelectCompany={handleSelectCompany} 
            selectedCompanyId={selectedCompany?.id} 
          />
        </div>
        
        <div className="col-span-1 bg-recruitflow-beigeLight rounded-lg shadow-sm overflow-hidden">
          {selectedCompany ? (
            <CompanyDetail companyId={selectedCompany.id} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-4">
                <h3 className="font-medium text-lg mb-2">Не выбрана компания</h3>
                <p className="text-gray-500">Выберите компанию из списка слева</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="col-span-1 bg-recruitflow-beigeLight rounded-lg shadow-sm overflow-hidden">
          {selectedCompany ? (
            <CompanyVacancies companyId={selectedCompany.id} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-4">
                <h3 className="font-medium text-lg mb-2">Не выбрана компания</h3>
                <p className="text-gray-500">Выберите компанию для просмотра вакансий</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CompaniesPage;
