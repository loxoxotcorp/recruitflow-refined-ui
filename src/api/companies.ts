
import { Company, ApiResponse, PaginatedResponse } from './types';

// Mock company data
const companies: Company[] = [
  {
    id: '1',
    name: 'IT-Bilim',
    legalName: 'IT-Bilimlarni Rivojlantirish Markazi',
    description: 'IT-Bilim specializes in providing educational services in the field of information technology. The company offers courses and training programs for both beginners and experienced IT professionals.',
    industry: 'IT',
    totalVacancies: 7,
    activeVacancies: 3,
    logoUrl: '/lovable-uploads/f21c2e20-6daf-4512-94bf-fcf86408edc4.png',
    contacts: [
      {
        id: '1',
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: 'Иванович',
        position: 'CEO',
        phones: ['+998 99 999 99 99', '+998 88 888 88 88'],
        emails: ['ivan.ivanov@mail.ru', 'ivanov@it-bilim.uz'],
      },
      {
        id: '2',
        firstName: 'Сидоров',
        lastName: 'Сергей',
        middleName: 'Сергеевич',
        position: 'HR Manager',
        phones: ['+998 99 777 77 77', '+998 99 666 66 66'],
        emails: ['sergey.sidorov@mail.ru'],
      },
    ],
    createdBy: 'Сидоров',
    createdAt: '2023-04-15T10:30:00Z',
    updatedBy: 'Сидоров',
    updatedAt: '2023-04-20T14:15:00Z',
  },
  {
    id: '2',
    name: 'Tech Solutions',
    description: 'A leading software development company specializing in enterprise solutions.',
    industry: 'IT',
    totalVacancies: 5,
    activeVacancies: 2,
    contacts: [
      {
        id: '3',
        firstName: 'Alex',
        lastName: 'Johnson',
        position: 'CTO',
        phones: ['+1 234 567 890'],
        emails: ['alex@techsolutions.com'],
      },
    ],
    createdBy: 'System',
    createdAt: '2023-03-10T08:20:00Z',
  },
  {
    id: '3',
    name: 'Data Insights',
    description: 'Data analytics and machine learning solutions for businesses.',
    industry: 'Data Science',
    totalVacancies: 3,
    activeVacancies: 3,
    contacts: [
      {
        id: '4',
        firstName: 'Sarah',
        lastName: 'Williams',
        position: 'Head of HR',
        phones: ['+1 987 654 321'],
        emails: ['sarah@datainsights.com'],
      },
    ],
    createdBy: 'System',
    createdAt: '2023-02-05T11:45:00Z',
  },
];

// Get all companies
export const getCompanies = async (
  page = 1,
  limit = 10
): Promise<ApiResponse<PaginatedResponse<Company>>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedCompanies = companies.slice(start, end);

  return {
    success: true,
    data: {
      data: paginatedCompanies,
      total: companies.length,
      page,
      limit,
    },
  };
};

// Get company by ID
export const getCompanyById = async (
  id: string
): Promise<ApiResponse<Company>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const company = companies.find((c) => c.id === id);

  if (!company) {
    throw new Error('Company not found');
  }

  return {
    success: true,
    data: company,
  };
};

// Create company
export const createCompany = async (
  companyData: Omit<Company, 'id' | 'createdBy' | 'createdAt'>
): Promise<ApiResponse<Company>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  const userStr = localStorage.getItem('user');
  const userName = userStr ? JSON.parse(userStr).name : 'System';

  const newCompany: Company = {
    ...companyData,
    id: `${companies.length + 1}`,
    createdBy: userName,
    createdAt: new Date().toISOString(),
  };

  companies.push(newCompany);

  return {
    success: true,
    data: newCompany,
  };
};

// Update company
export const updateCompany = async (
  id: string,
  companyData: Partial<Company>
): Promise<ApiResponse<Company>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = companies.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error('Company not found');
  }

  const userStr = localStorage.getItem('user');
  const userName = userStr ? JSON.parse(userStr).name : 'System';

  const updatedCompany = {
    ...companies[index],
    ...companyData,
    updatedBy: userName,
    updatedAt: new Date().toISOString(),
  };

  companies[index] = updatedCompany;

  return {
    success: true,
    data: updatedCompany,
  };
};

// Delete company
export const deleteCompany = async (
  id: string
): Promise<ApiResponse<null>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = companies.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error('Company not found');
  }

  companies.splice(index, 1);

  return {
    success: true,
    data: null,
  };
};
