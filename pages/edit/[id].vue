<template>
  <div class="edit-expense-page">
    <!-- Loading State -->
    <div v-if="loadingExpense" class="loading-container">
      <p>Loading expense...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadError" class="error-container">
      <h2>Error Loading Expense</h2>
      <p>{{ loadError }}</p>
      <NuxtLink to="/" class="back-btn">← Back to Expenses</NuxtLink>
    </div>

    <!-- Edit Form -->
    <div v-else class="form-container">
      <div class="form-header">
        <h1>✏️ Edit Expense</h1>
        <NuxtLink to="/" class="back-link">← Back to Expenses</NuxtLink>
      </div>

      <form @submit.prevent="handleSubmit" class="expense-form">
        <div class="form-group">
          <label for="description">Description *</label>
          <input
            id="description"
            v-model="form.description"
            type="text"
            placeholder="e.g., Grocery shopping, Coffee, Gas"
            required
            maxlength="200"
          />
          <span v-if="errors.description" class="error-text">{{ errors.description }}</span>
        </div>

        <div class="form-group">
          <label for="amount">Amount ($) *</label>
          <input
            id="amount"
            v-model.number="form.amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            required
          />
          <span v-if="errors.amount" class="error-text">{{ errors.amount }}</span>
        </div>

        <div class="form-group">
          <label for="category">Category *</label>
          <select id="category" v-model="form.category" required>
            <option value="">Select a category</option>
            <option v-for="cat in categories" :key="cat.name" :value="cat.name">
              {{ cat.name }} - {{ cat.description }}
            </option>
          </select>
          <span v-if="errors.category" class="error-text">{{ errors.category }}</span>
        </div>

        <div class="form-group">
          <label for="date">Date *</label>
          <input
            id="date"
            v-model="form.date"
            type="datetime-local"
            required
          />
          <span v-if="errors.date" class="error-text">{{ errors.date }}</span>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          Expense updated successfully! Redirecting...
        </div>

        <div class="form-actions">
          <button type="button" @click="navigateTo('/')" class="cancel-btn">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="submit-btn">
            {{ loading ? 'Updating...' : 'Update Expense' }}
          </button>
        </div>
      </form>

      <!-- Original Expense Info -->
      <div v-if="originalExpense" class="original-info">
        <h3>📝 Original Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Created:</span>
            <span>{{ formatDate(originalExpense.createdAt) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Last Updated:</span>
            <span>{{ formatDate(originalExpense.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category, Expense } from '~/composables/useExpenseAPI';

const api = useExpenseAPI();
const route = useRoute();
const router = useRouter();

const expenseId = route.params.id as string;

const categories = ref<Category[]>([]);
const originalExpense = ref<Expense | null>(null);
const loadingExpense = ref(true);
const loadError = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

const form = ref({
  description: '',
  amount: null as number | null,
  category: '',
  date: '',
});

const errors = ref({
  description: '',
  amount: '',
  category: '',
  date: '',
});

// Load categories and expense on mount
onMounted(async () => {
  await Promise.all([loadCategories(), loadExpense()]);
});

const loadCategories = async () => {
  try {
    const response = await api.getCategories();
    categories.value = response.data;
  } catch (e: any) {
    console.error('Failed to load categories:', e);
  }
};

const loadExpense = async () => {
  loadingExpense.value = true;
  loadError.value = '';

  try {
    const response = await api.getExpense(expenseId);
    originalExpense.value = response.data;

    // Populate form with existing data
    form.value = {
      description: response.data.description,
      amount: response.data.amount,
      category: response.data.category,
      date: new Date(response.data.date).toISOString().slice(0, 16),
    };
  } catch (e: any) {
    loadError.value = e.data?.message || e.message || 'Failed to load expense. It may have been deleted.';
    console.error('Error loading expense:', e);
  } finally {
    loadingExpense.value = false;
  }
};

const validateForm = (): boolean => {
  errors.value = {
    description: '',
    amount: '',
    category: '',
    date: '',
  };

  let isValid = true;

  if (!form.value.description || form.value.description.trim().length === 0) {
    errors.value.description = 'Description is required';
    isValid = false;
  } else if (form.value.description.length > 200) {
    errors.value.description = 'Description must be less than 200 characters';
    isValid = false;
  }

  if (!form.value.amount || form.value.amount <= 0) {
    errors.value.amount = 'Amount must be greater than 0';
    isValid = false;
  }

  if (!form.value.category) {
    errors.value.category = 'Category is required';
    isValid = false;
  }

  if (!form.value.date) {
    errors.value.date = 'Date is required';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  error.value = '';
  success.value = false;

  try {
    const expenseData = {
      description: form.value.description.trim(),
      amount: form.value.amount!,
      category: form.value.category,
      date: new Date(form.value.date).toISOString(),
    };

    await api.updateExpense(expenseId, expenseData);

    success.value = true;

    // Redirect after short delay
    setTimeout(() => {
      navigateTo('/');
    }, 1500);
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Failed to update expense. Please try again.';
    console.error('Error updating expense:', e);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.edit-expense-page {
  min-height: 100vh;
}

.loading-container,
.error-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.error-container h2 {
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-container p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.back-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #4f46e5;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.form-header h1 {
  color: #1f2937;
  font-size: 1.75rem;
  margin: 0;
}

.back-link {
  color: #6366f1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: #4f46e5;
}

.expense-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  padding: 0.875rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.error-text {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background: #e5e7eb;
  color: #374151;
}

.cancel-btn:hover {
  background: #d1d5db;
}

.submit-btn {
  background: #3b82f6;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.original-info {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f3f4f6;
}

.original-info h3 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.info-grid {
  display: grid;
  gap: 0.75rem;
}

.info-item {
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-weight: 600;
  color: #374151;
}

@media (max-width: 768px) {
  .form-container {
    padding: 1.5rem;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
