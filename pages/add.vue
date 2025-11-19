<template>
  <div class="add-expense-page">
    <div class="form-container">
      <div class="form-header">
        <h1>➕ Add New Expense</h1>
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
          Expense added successfully! Redirecting...
        </div>

        <div class="form-actions">
          <button type="button" @click="navigateTo('/')" class="cancel-btn">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="submit-btn">
            {{ loading ? 'Adding...' : 'Add Expense' }}
          </button>
        </div>
      </form>

      <!-- Category Guide -->
      <div class="category-guide">
        <h3>📋 Category Guide</h3>
        <div class="category-list">
          <div v-for="cat in categories" :key="cat.name" class="category-item">
            <strong>{{ cat.name }}</strong>
            <span>{{ cat.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/composables/useExpenseAPI';

const api = useExpenseAPI();
const router = useRouter();

const categories = ref<Category[]>([]);
const loading = ref(false);
const error = ref('');
const success = ref(false);

const form = ref({
  description: '',
  amount: null as number | null,
  category: '',
  date: new Date().toISOString().slice(0, 16), // Default to current date/time
});

const errors = ref({
  description: '',
  amount: '',
  category: '',
  date: '',
});

// Load categories on mount
onMounted(async () => {
  await loadCategories();
});

const loadCategories = async () => {
  try {
    const response = await api.getCategories();
    categories.value = response.data;
  } catch (e: any) {
    console.error('Failed to load categories:', e);
    error.value = 'Failed to load categories. Please refresh the page.';
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

    await api.createExpense(expenseData);

    success.value = true;

    // Redirect after short delay
    setTimeout(() => {
      navigateTo('/');
    }, 1500);
  } catch (e: any) {
    error.value = e.data?.message || e.message || 'Failed to add expense. Please try again.';
    console.error('Error adding expense:', e);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.add-expense-page {
  min-height: 100vh;
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
  background: #10b981;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.category-guide {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f3f4f6;
}

.category-guide h3 {
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.category-list {
  display: grid;
  gap: 0.75rem;
}

.category-item {
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-item strong {
  color: #1f2937;
  font-size: 0.95rem;
}

.category-item span {
  color: #6b7280;
  font-size: 0.85rem;
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
