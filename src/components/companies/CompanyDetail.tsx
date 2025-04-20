
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompanyById, updateCompany } from '@/api/companies';
import { Company, CompanyContact } from '@/api/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Trash } from 'lucide-react';

interface CompanyDetailProps {
  companyId: string;
}

const CompanyDetail = ({ companyId }: CompanyDetailProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [editedValues, setEditedValues] = useState<Partial<Company>>({});
  const [editingContact, setEditingContact] = useState<Record<string, boolean>>({});
  const [newContact, setNewContact] = useState<Partial<CompanyContact>>({
    firstName: '',
    lastName: '',
    middleName: '',
    position: '',
    phones: [''],
    emails: [''],
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompanyById(companyId).then(res => res.data)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) => 
      updateCompany(id, data),
    onSuccess: () => {
      toast.success('Company updated successfully');
      queryClient.invalidateQueries({ queryKey: ['company', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsEditing({});
    },
    onError: (err: Error) => {
      toast.error(`Failed to update company: ${err.message}`);
    }
  });

  const handleEdit = (field: string) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
    setEditedValues(prev => ({ ...prev, [field]: data?.[field as keyof Company] }));
  };

  const handleSave = (field: string) => {
    if (editedValues[field as keyof Partial<Company>] !== undefined) {
      updateMutation.mutate({
        id: companyId,
        data: { [field]: editedValues[field as keyof Partial<Company>] }
      });
    }
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const handleCancel = (field: string) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
    setEditedValues(prev => ({ ...prev, [field]: undefined }));
  };

  const handleChange = (field: string, value: any) => {
    setEditedValues(prev => ({ ...prev, [field]: value }));
  };

  const handleAddContact = () => {
    if (!newContact.firstName || !newContact.lastName) {
      toast.error('First name and last name are required');
      return;
    }

    const updatedContacts = [
      ...(data?.contacts || []),
      {
        ...newContact,
        id: `new-${Date.now()}`
      } as CompanyContact
    ];

    updateMutation.mutate({
      id: companyId,
      data: { contacts: updatedContacts }
    });

    setNewContact({
      firstName: '',
      lastName: '',
      middleName: '',
      position: '',
      phones: [''],
      emails: [''],
    });
  };

  const handleEditContact = (contactIndex: number, field: string, value: string | string[]) => {
    const updatedContacts = [...(data?.contacts || [])];
    (updatedContacts[contactIndex] as any)[field] = value;

    updateMutation.mutate({
      id: companyId,
      data: { contacts: updatedContacts }
    });
  };

  const handleAddContactPhone = (contactIndex: number) => {
    if (!data?.contacts) return;
    
    const updatedContacts = [...data.contacts];
    updatedContacts[contactIndex].phones.push('');

    updateMutation.mutate({
      id: companyId,
      data: { contacts: updatedContacts }
    });
  };

  const handleAddContactEmail = (contactIndex: number) => {
    if (!data?.contacts) return;
    
    const updatedContacts = [...data.contacts];
    updatedContacts[contactIndex].emails.push('');

    updateMutation.mutate({
      id: companyId,
      data: { contacts: updatedContacts }
    });
  };

  const handleAddNewContactPhone = () => {
    setNewContact(prev => ({
      ...prev,
      phones: [...(prev.phones || []), '']
    }));
  };

  const handleAddNewContactEmail = () => {
    setNewContact(prev => ({
      ...prev,
      emails: [...(prev.emails || []), '']
    }));
  };

  const handleRemoveContact = (contactIndex: number) => {
    const updatedContacts = [...(data?.contacts || [])];
    updatedContacts.splice(contactIndex, 1);

    updateMutation.mutate({
      id: companyId,
      data: { contacts: updatedContacts }
    });
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading company details...</div>;
  }

  if (error || !data) {
    return <div className="p-4 text-center text-red-500">Error loading company details</div>;
  }

  const company = data;

  return (
    <div className="h-full scrollable-container p-4">
      <div className="card-container mb-4">
        <h2 className="text-lg font-bold mb-4 text-recruitflow-brownDark uppercase">О КОМПАНИИ</h2>
        
        <div className="space-y-4">
          {/* Company Name */}
          <div>
            <Label>Название компании</Label>
            {isEditing.name ? (
              <div className="mt-1 flex space-x-2">
                <Input
                  value={editedValues.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="input-field"
                />
                <Button size="sm" onClick={() => handleSave('name')}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => handleCancel('name')}>Cancel</Button>
              </div>
            ) : (
              <div className="mt-1 flex justify-between items-center">
                <Input
                  value={company.name}
                  readOnly
                  className="input-field bg-gray-100 cursor-default"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEdit('name')}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Legal Name */}
          <div>
            <Label>Юридическое название компании</Label>
            {isEditing.legalName ? (
              <div className="mt-1 flex space-x-2">
                <Input
                  value={editedValues.legalName || ''}
                  onChange={(e) => handleChange('legalName', e.target.value)}
                  className="input-field"
                />
                <Button size="sm" onClick={() => handleSave('legalName')}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => handleCancel('legalName')}>Cancel</Button>
              </div>
            ) : (
              <div className="mt-1 flex justify-between items-center">
                <Input
                  value={company.legalName || ''}
                  readOnly
                  className="input-field bg-gray-100 cursor-default"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEdit('legalName')}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Industry */}
          <div>
            <Label>Сфера деятельности</Label>
            {isEditing.industry ? (
              <div className="mt-1 flex space-x-2">
                <Input
                  value={editedValues.industry || ''}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  className="input-field"
                />
                <Button size="sm" onClick={() => handleSave('industry')}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => handleCancel('industry')}>Cancel</Button>
              </div>
            ) : (
              <div className="mt-1 flex justify-between items-center">
                <Input
                  value={company.industry || ''}
                  readOnly
                  className="input-field bg-gray-100 cursor-default"
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleEdit('industry')}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-container mb-4">
        <h2 className="text-lg font-bold mb-4 text-recruitflow-brownDark uppercase">ОПИСАНИЕ КОМПАНИИ</h2>
        
        {isEditing.description ? (
          <div className="space-y-2">
            <Textarea
              value={editedValues.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="input-field min-h-[100px]"
              placeholder="Введите описание компании..."
            />
            <div className="flex justify-end space-x-2">
              <Button size="sm" onClick={() => handleSave('description')}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => handleCancel('description')}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-md p-3 border border-recruitflow-beigeDark min-h-[100px]">
              {company.description || 'No description available.'}
            </div>
            <div className="mt-2 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleEdit('description')}
              >
                Edit
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="card-container mb-4">
        <h2 className="text-lg font-bold mb-4 text-recruitflow-brownDark uppercase">ПРЕДСТАВИТЕЛИ КОМПАНИИ</h2>
        
        <div className="space-y-6">
          {company.contacts.map((contact, index) => (
            <div key={contact.id} className="border-b border-dashed border-recruitflow-beigeDark pb-4 last:border-b-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{index + 1}. {contact.firstName} {contact.middleName || ''} {contact.lastName}</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveContact(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Contact details editable */}
              {editingContact[contact.id] ? (
                <div className="space-y-2">
                  {/* Fields for editing contact */}
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Phone numbers */}
                  {contact.phones.map((phone, phoneIndex) => (
                    <div key={`${contact.id}-phone-${phoneIndex}`} className="flex items-center">
                      <Label className="w-24">Телефон</Label>
                      <Input
                        value={phone}
                        className="input-field"
                        onChange={(e) => {
                          const updatedPhones = [...contact.phones];
                          updatedPhones[phoneIndex] = e.target.value;
                          handleEditContact(index, 'phones', updatedPhones);
                        }}
                      />
                    </div>
                  ))}
                  <div className="ml-24">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddContactPhone(index)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Добавить телефон
                    </Button>
                  </div>

                  {/* Email addresses */}
                  {contact.emails.map((email, emailIndex) => (
                    <div key={`${contact.id}-email-${emailIndex}`} className="flex items-center">
                      <Label className="w-24">Почта</Label>
                      <Input
                        value={email}
                        className="input-field"
                        onChange={(e) => {
                          const updatedEmails = [...contact.emails];
                          updatedEmails[emailIndex] = e.target.value;
                          handleEditContact(index, 'emails', updatedEmails);
                        }}
                      />
                    </div>
                  ))}
                  <div className="ml-24">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddContactEmail(index)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Добавить email
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Add new contact form */}
          <div className="border-t border-recruitflow-beigeDark pt-4 mt-4">
            <h3 className="font-medium mb-3">Добавить представителя</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Фамилия</Label>
                  <Input
                    value={newContact.lastName || ''}
                    onChange={(e) => setNewContact({...newContact, lastName: e.target.value})}
                    className="input-field"
                    placeholder="Фамилия"
                  />
                </div>
                <div>
                  <Label>Имя</Label>
                  <Input
                    value={newContact.firstName || ''}
                    onChange={(e) => setNewContact({...newContact, firstName: e.target.value})}
                    className="input-field"
                    placeholder="Имя"
                  />
                </div>
              </div>
              <div>
                <Label>Отчество</Label>
                <Input
                  value={newContact.middleName || ''}
                  onChange={(e) => setNewContact({...newContact, middleName: e.target.value})}
                  className="input-field"
                  placeholder="Отчество"
                />
              </div>
              
              {/* Phone numbers */}
              {newContact.phones?.map((phone, index) => (
                <div key={`new-phone-${index}`} className="flex items-center">
                  <Label className="w-24">Телефон</Label>
                  <Input
                    value={phone}
                    className="input-field"
                    onChange={(e) => {
                      const updatedPhones = [...(newContact.phones || [])];
                      updatedPhones[index] = e.target.value;
                      setNewContact({...newContact, phones: updatedPhones});
                    }}
                    placeholder="+998 99 999 99 99"
                  />
                </div>
              ))}
              <div className="ml-24">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddNewContactPhone}
                >
                  <Plus className="h-4 w-4 mr-1" /> Добавить телефон
                </Button>
              </div>

              {/* Email addresses */}
              {newContact.emails?.map((email, index) => (
                <div key={`new-email-${index}`} className="flex items-center">
                  <Label className="w-24">Почта</Label>
                  <Input
                    value={email}
                    className="input-field"
                    onChange={(e) => {
                      const updatedEmails = [...(newContact.emails || [])];
                      updatedEmails[index] = e.target.value;
                      setNewContact({...newContact, emails: updatedEmails});
                    }}
                    placeholder="email@example.com"
                  />
                </div>
              ))}
              <div className="ml-24">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddNewContactEmail}
                >
                  <Plus className="h-4 w-4 mr-1" /> Добавить email
                </Button>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleAddContact}>Добавить представителя</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-container">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Кем создан</Label>
            <Input value={company.createdBy} readOnly className="input-field bg-gray-100" />
          </div>
          <div>
            <Label>Когда создан</Label>
            <Input 
              value={new Date(company.createdAt).toLocaleDateString()} 
              readOnly 
              className="input-field bg-gray-100" 
            />
          </div>
          {company.updatedBy && (
            <>
              <div>
                <Label>Кем изменен</Label>
                <Input value={company.updatedBy} readOnly className="input-field bg-gray-100" />
              </div>
              <div>
                <Label>Когда изменен</Label>
                <Input 
                  value={company.updatedAt ? new Date(company.updatedAt).toLocaleDateString() : ''} 
                  readOnly 
                  className="input-field bg-gray-100" 
                />
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button variant="outline">
            Открыть историю изменений
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
