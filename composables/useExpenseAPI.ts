/**
 * Composable for Money Expense Tracker API
 * Base URL: http://localhost:5000
 */

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseInput {
  description: string;
  amount: number;
  category: string;
  date?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ExpenseListResponse {
  success: boolean;
  data: Expense[];
  pagination: Pagination;
  filters?: any;
}

export interface ExpenseResponse {
  success: boolean;
  message?: string;
  data: Expense;
}

export interface AnalyticsSummary {
  totalExpenses: number;
  totalAmount: number;
  averageAmount: number;
  minAmount: number;
  maxAmount: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  totalAmount: number;
  averageAmount: number;
  minAmount: number;
  maxAmount: number;
  percentage: number;
}

export interface Category {
  name: string;
  description: string;
}

export const useExpenseAPI = () => {
  const config = useRuntimeConfig();
  const API_BASE = 'http://localhost:5000';

  // Fetch expenses with filters
  const getExpenses = async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    includeDeleted?: boolean;
  }): Promise<ExpenseListResponse> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
    }

    const url = `${API_BASE}/expenses${query.toString() ? '?' + query.toString() : ''}`;
    const response = await $fetch<ExpenseListResponse>(url);
    return response;
  };

  // Get single expense by ID
  const getExpense = async (id: string): Promise<ExpenseResponse> => {
    const response = await $fetch<ExpenseResponse>(`${API_BASE}/expenses/${id}`);
    return response;
  };

  // Create new expense
  const createExpense = async (expense: ExpenseInput): Promise<ExpenseResponse> => {
    const response = await $fetch<ExpenseResponse>(`${API_BASE}/expenses/add`, {
      method: 'POST',
      body: expense,
    });
    return response;
  };

  // Update expense
  const updateExpense = async (id: string, expense: ExpenseInput): Promise<ExpenseResponse> => {
    const response = await $fetch<ExpenseResponse>(`${API_BASE}/expenses/${id}`, {
      method: 'PUT',
      body: expense,
    });
    return response;
  };

  // Soft delete expense
  const deleteExpense = async (id: string): Promise<ExpenseResponse> => {
    const response = await $fetch<ExpenseResponse>(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE',
    });
    return response;
  };

  // Restore deleted expense
  const restoreExpense = async (id: string): Promise<ExpenseResponse> => {
    const response = await $fetch<ExpenseResponse>(`${API_BASE}/expenses/${id}/restore`, {
      method: 'PUT',
    });
    return response;
  };

  // Permanently delete expense
  const permanentlyDeleteExpense = async (id: string): Promise<ExpenseResponse> => {
    const response = await $fetch<ExpenseResponse>(`${API_BASE}/expenses/${id}/permanent`, {
      method: 'DELETE',
    });
    return response;
  };

  // Get deleted expenses
  const getDeletedExpenses = async (params?: { page?: number; limit?: number }): Promise<ExpenseListResponse> => {
    const query = new URLSearchParams();
    if (params) {
      if (params.page) query.append('page', String(params.page));
      if (params.limit) query.append('limit', String(params.limit));
    }

    const url = `${API_BASE}/expenses/deleted/list${query.toString() ? '?' + query.toString() : ''}`;
    const response = await $fetch<ExpenseListResponse>(url);
    return response;
  };

  // Analytics - Summary
  const getAnalyticsSummary = async (params?: {
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<{ success: boolean; data: AnalyticsSummary; filters?: any }> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, String(value));
      });
    }

    const url = `${API_BASE}/analytics/summary${query.toString() ? '?' + query.toString() : ''}`;
    const response = await $fetch<{ success: boolean; data: AnalyticsSummary; filters?: any }>(url);
    return response;
  };

  // Analytics - By Category
  const getAnalyticsByCategory = async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{ success: boolean; data: CategoryBreakdown[]; summary: any }> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, String(value));
      });
    }

    const url = `${API_BASE}/analytics/by-category${query.toString() ? '?' + query.toString() : ''}`;
    const response = await $fetch<{ success: boolean; data: CategoryBreakdown[]; summary: any }>(url);
    return response;
  };

  // Analytics - By Period
  const getAnalyticsByPeriod = async (params?: {
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate?: string;
    endDate?: string;
    category?: string;
  }): Promise<any> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, String(value));
      });
    }

    const url = `${API_BASE}/analytics/by-period${query.toString() ? '?' + query.toString() : ''}`;
    const response = await $fetch(url);
    return response;
  };

  // Analytics - Trends
  const getAnalyticsTrends = async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<any> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, String(value));
      });
    }

    const url = `${API_BASE}/analytics/trends${query.toString() ? '?' + query.toString() : ''}`;
    const response = await $fetch(url);
    return response;
  };

  // Get all categories
  const getCategories = async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await $fetch<{ success: boolean; data: Category[] }>(`${API_BASE}/analytics/categories`);
    return response;
  };

  // Export to JSON
  const exportToJSON = async (params?: any): Promise<any> => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
    }

    const url = `${API_BASE}/export/json${query.toString() ? '?' + query.toString() : ''}`;
    const response = await $fetch(url);
    return response;
  };

  // Export to CSV (download)
  const exportToCSV = (params?: any): string => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });
    }

    return `${API_BASE}/export/csv${query.toString() ? '?' + query.toString() : ''}`;
  };

  // Health check
  const checkHealth = async (): Promise<any> => {
    const response = await $fetch(`${API_BASE}/health`);
    return response;
  };

  return {
    getExpenses,
    getExpense,
    createExpense,
    updateExpense,
    deleteExpense,
    restoreExpense,
    permanentlyDeleteExpense,
    getDeletedExpenses,
    getAnalyticsSummary,
    getAnalyticsByCategory,
    getAnalyticsByPeriod,
    getAnalyticsTrends,
    getCategories,
    exportToJSON,
    exportToCSV,
    checkHealth,
  };
};
