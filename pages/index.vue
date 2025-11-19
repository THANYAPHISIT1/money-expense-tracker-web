<template>
  <div class="expenses-page">
    <div class="page-header">
      <h1>My Expenses</h1>
      <div class="header-actions">
        <button @click="showFilters = !showFilters" class="filter-toggle-btn">
          🔍 {{ showFilters ? 'Hide' : 'Show' }} Filters
        </button>
        <NuxtLink to="/add" class="add-expense-btn">+ Add Expense</NuxtLink>
      </div>
    </div>

    <!-- Filters Section -->
    <div v-if="showFilters" class="filters-section">
      <div class="filters-grid">
        <div class="filter-group">
          <label>Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search description..."
            @input="applyFilters"
          />
        </div>

        <div class="filter-group">
          <label>Category</label>
          <select v-model="filters.category" @change="applyFilters">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat.name" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Start Date</label>
          <input
            v-model="filters.startDate"
            type="date"
            @change="applyFilters"
          />
        </div>

        <div class="filter-group">
          <label>End Date</label>
          <input
            v-model="filters.endDate"
            type="date"
            @change="applyFilters"
          />
        </div>

        <div class="filter-group">
          <label>Min Amount</label>
          <input
            v-model.number="filters.minAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            @input="applyFilters"
          />
        </div>

        <div class="filter-group">
          <label>Max Amount</label>
          <input
            v-model.number="filters.maxAmount"
            type="number"
            step="0.01"
            placeholder="0.00"
            @input="applyFilters"
          />
        </div>

        <div class="filter-group">
          <label>Sort By</label>
          <select v-model="filters.sortBy" @change="applyFilters">
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
            <option value="description">Description</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Order</label>
          <select v-model="filters.sortOrder" @change="applyFilters">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div class="filter-actions">
        <button @click="clearFilters" class="clear-btn">Clear Filters</button>
        <button @click="exportData" class="export-btn">📥 Export CSV</button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>Loading expenses...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="loadExpenses" class="retry-btn">Retry</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="expenses.length === 0" class="empty-state">
      <h2>No expenses found</h2>
      <p>Start tracking your expenses by adding your first one!</p>
      <NuxtLink to="/add" class="add-expense-btn">+ Add Your First Expense</NuxtLink>
    </div>

    <!-- Expenses List -->
    <div v-else class="expenses-list">
      <div v-for="expense in expenses" :key="expense._id" class="expense-card">
        <div class="expense-header">
          <h3>{{ expense.description }}</h3>
          <span class="expense-amount">${{ expense.amount.toFixed(2) }}</span>
        </div>
        <div class="expense-details">
          <span class="expense-category" :class="getCategoryClass(expense.category)">
            {{ expense.category }}
          </span>
          <span class="expense-date">{{ formatDate(expense.date) }}</span>
        </div>
        <div class="expense-actions">
          <NuxtLink :to="`/edit/${expense._id}`" class="edit-btn">✏️ Edit</NuxtLink>
          <button @click="confirmDelete(expense)" class="delete-btn">🗑️ Delete</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.pages > 1" class="pagination">
      <button
        @click="goToPage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="page-btn"
      >
        ← Previous
      </button>

      <div class="page-numbers">
        <span>Page {{ pagination.page }} of {{ pagination.pages }}</span>
        <span class="total-count">({{ pagination.total }} total)</span>
      </div>

      <button
        @click="goToPage(pagination.page + 1)"
        :disabled="pagination.page === pagination.pages"
        class="page-btn"
      >
        Next →
      </button>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteModal.show" class="modal-overlay" @click="deleteModal.show = false">
      <div class="modal-content" @click.stop>
        <h2>Delete Expense?</h2>
        <p>Are you sure you want to delete "{{ deleteModal.expense?.description }}"?</p>
        <p class="modal-note">This will be a soft delete - you can restore it later.</p>
        <div class="modal-actions">
          <button @click="deleteModal.show = false" class="cancel-btn">Cancel</button>
          <button @click="deleteExpenseConfirmed" class="confirm-delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Expense, Pagination, Category } from '~/composables/useExpenseAPI';

const api = useExpenseAPI();

const expenses = ref<Expense[]>([]);
const categories = ref<Category[]>([]);
const pagination = ref<Pagination | null>(null);
const loading = ref(false);
const error = ref('');
const showFilters = ref(false);

const filters = ref({
  search: '',
  category: '',
  startDate: '',
  endDate: '',
  minAmount: null as number | null,
  maxAmount: null as number | null,
  sortBy: 'date',
  sortOrder: 'desc' as 'asc' | 'desc',
  page: 1,
  limit: 10,
});

const deleteModal = ref({
  show: false,
  expense: null as Expense | null,
});

// Load categories on mount
onMounted(async () => {
  await loadCategories();
  await loadExpenses();
});

const loadCategories = async () => {
  try {
    const response = await api.getCategories();
    categories.value = response.data;
  } catch (e: any) {
    console.error('Failed to load categories:', e);
  }
};

const loadExpenses = async () => {
  loading.value = true;
  error.value = '';

  try {
    const params: any = {
      page: filters.value.page,
      limit: filters.value.limit,
      sortBy: filters.value.sortBy,
      sortOrder: filters.value.sortOrder,
    };

    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.category) params.category = filters.value.category;
    if (filters.value.startDate) params.startDate = filters.value.startDate;
    if (filters.value.endDate) params.endDate = filters.value.endDate;
    if (filters.value.minAmount !== null) params.minAmount = filters.value.minAmount;
    if (filters.value.maxAmount !== null) params.maxAmount = filters.value.maxAmount;

    const response = await api.getExpenses(params);
    expenses.value = response.data;
    pagination.value = response.pagination;
  } catch (e: any) {
    error.value = e.message || 'Failed to load expenses. Please make sure the API is running.';
    console.error('Error loading expenses:', e);
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  filters.value.page = 1; // Reset to first page when filters change
  loadExpenses();
};

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    startDate: '',
    endDate: '',
    minAmount: null,
    maxAmount: null,
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  };
  loadExpenses();
};

const goToPage = (page: number) => {
  filters.value.page = page;
  loadExpenses();
};

const confirmDelete = (expense: Expense) => {
  deleteModal.value.show = true;
  deleteModal.value.expense = expense;
};

const deleteExpenseConfirmed = async () => {
  if (!deleteModal.value.expense) return;

  try {
    await api.deleteExpense(deleteModal.value.expense._id);
    deleteModal.value.show = false;
    deleteModal.value.expense = null;
    await loadExpenses(); // Reload expenses
  } catch (e: any) {
    error.value = e.message || 'Failed to delete expense';
    console.error('Error deleting expense:', e);
  }
};

const exportData = () => {
  const params: any = {};
  if (filters.value.search) params.search = filters.value.search;
  if (filters.value.category) params.category = filters.value.category;
  if (filters.value.startDate) params.startDate = filters.value.startDate;
  if (filters.value.endDate) params.endDate = filters.value.endDate;
  if (filters.value.minAmount !== null) params.minAmount = filters.value.minAmount;
  if (filters.value.maxAmount !== null) params.maxAmount = filters.value.maxAmount;

  const url = api.exportToCSV(params);
  window.open(url, '_blank');
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getCategoryClass = (category: string) => {
  return `category-${category.toLowerCase()}`;
};
</script>

<style scoped>
.expenses-page {
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h1 {
  color: #1f2937;
  font-size: 2rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.filter-toggle-btn {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.filter-toggle-btn:hover {
  background: #4f46e5;
}

.add-expense-btn {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.3s;
  display: inline-block;
}

.add-expense-btn:hover {
  background: #059669;
}

.filters-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.filter-group input,
.filter-group select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.filter-group input:focus,
.filter-group select:focus {
  outline: none;
  border-color: #6366f1;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.clear-btn,
.export-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.clear-btn {
  background: #ef4444;
  color: white;
}

.clear-btn:hover {
  background: #dc2626;
}

.export-btn {
  background: #8b5cf6;
  color: white;
}

.export-btn:hover {
  background: #7c3aed;
}

.loading,
.error-message,
.empty-state {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.error-message {
  color: #ef4444;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.empty-state h2 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.expenses-list {
  display: grid;
  gap: 1.5rem;
}

.expense-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.expense-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.expense-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.expense-header h3 {
  color: #1f2937;
  font-size: 1.25rem;
  margin: 0;
  flex: 1;
}

.expense-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
}

.expense-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.expense-category {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  background: #e0e7ff;
  color: #4338ca;
}

.expense-date {
  color: #6b7280;
  font-size: 0.9rem;
}

.expense-actions {
  display: flex;
  gap: 0.75rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background: #2563eb;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

.pagination {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-btn {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #4f46e5;
}

.page-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.page-numbers {
  text-align: center;
}

.total-count {
  display: block;
  color: #6b7280;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
  color: #1f2937;
  margin-bottom: 1rem;
}

.modal-content p {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.modal-note {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-btn,
.confirm-delete-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.cancel-btn {
  background: #e5e7eb;
  color: #374151;
}

.cancel-btn:hover {
  background: #d1d5db;
}

.confirm-delete-btn {
  background: #ef4444;
  color: white;
}

.confirm-delete-btn:hover {
  background: #dc2626;
}

/* Category color variations */
.category-food { background: #dbeafe; color: #1e40af; }
.category-transport { background: #fef3c7; color: #92400e; }
.category-entertainment { background: #fce7f3; color: #9f1239; }
.category-bills { background: #fee2e2; color: #991b1b; }
.category-shopping { background: #e0e7ff; color: #4338ca; }
.category-health { background: #d1fae5; color: #065f46; }
.category-education { background: #ddd6fe; color: #5b21b6; }
.category-travel { background: #cffafe; color: #164e63; }
.category-other { background: #f3f4f6; color: #374151; }

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .filter-toggle-btn,
  .add-expense-btn {
    width: 100%;
    text-align: center;
  }

  .filters-grid {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    flex-direction: column;
  }

  .clear-btn,
  .export-btn {
    width: 100%;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .page-btn {
    width: 100%;
  }
}
</style>
