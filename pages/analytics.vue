<template>
  <div class="analytics-page">
    <div class="page-header">
      <h1>📊 Analytics Dashboard</h1>
      <div class="header-actions">
        <button @click="showDateFilter = !showDateFilter" class="filter-btn">
          📅 {{ showDateFilter ? 'Hide' : 'Show' }} Date Filter
        </button>
      </div>
    </div>

    <!-- Date Filter -->
    <div v-if="showDateFilter" class="date-filter-section">
      <div class="filter-grid">
        <div class="filter-group">
          <label>Start Date</label>
          <input v-model="dateFilter.startDate" type="date" @change="loadAllAnalytics" />
        </div>
        <div class="filter-group">
          <label>End Date</label>
          <input v-model="dateFilter.endDate" type="date" @change="loadAllAnalytics" />
        </div>
        <div class="filter-group">
          <button @click="clearDateFilter" class="clear-filter-btn">Clear Filter</button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <p>Loading analytics...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="loadAllAnalytics" class="retry-btn">Retry</button>
    </div>

    <!-- Analytics Content -->
    <div v-else class="analytics-content">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card total">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <h3>Total Spent</h3>
            <p class="card-value">${{ summary.totalAmount.toFixed(2) }}</p>
          </div>
        </div>

        <div class="summary-card count">
          <div class="card-icon">📝</div>
          <div class="card-content">
            <h3>Total Expenses</h3>
            <p class="card-value">{{ summary.totalExpenses }}</p>
          </div>
        </div>

        <div class="summary-card average">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <h3>Average Amount</h3>
            <p class="card-value">${{ summary.averageAmount.toFixed(2) }}</p>
          </div>
        </div>

        <div class="summary-card range">
          <div class="card-icon">📈</div>
          <div class="card-content">
            <h3>Range</h3>
            <p class="card-value">
              ${{ summary.minAmount.toFixed(2) }} - ${{ summary.maxAmount.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="section-card">
        <h2>💳 Spending by Category</h2>
        <div v-if="categoryBreakdown.length === 0" class="empty-state">
          <p>No expenses to analyze yet</p>
        </div>
        <div v-else class="category-breakdown">
          <div
            v-for="cat in categoryBreakdown"
            :key="cat.category"
            class="category-row"
          >
            <div class="category-info">
              <div class="category-header">
                <span class="category-name">{{ cat.category }}</span>
                <span class="category-amount">${{ cat.totalAmount.toFixed(2) }}</span>
              </div>
              <div class="category-stats">
                <span>{{ cat.count }} expenses</span>
                <span>Avg: ${{ cat.averageAmount.toFixed(2) }}</span>
                <span>{{ cat.percentage.toFixed(1) }}%</span>
              </div>
            </div>
            <div class="category-bar-container">
              <div
                class="category-bar"
                :style="{ width: cat.percentage + '%' }"
                :class="getCategoryClass(cat.category)"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Trends -->
      <div class="section-card">
        <h2>📈 Monthly Trends</h2>
        <div v-if="trends.monthlyTrends && trends.monthlyTrends.length === 0" class="empty-state">
          <p>No trend data available yet</p>
        </div>
        <div v-else-if="trends.monthlyTrends" class="trends-section">
          <div class="trend-summary">
            <div class="trend-indicator" :class="trends.trend">
              <span class="trend-label">Overall Trend:</span>
              <span class="trend-value">
                {{ trends.trend === 'increasing' ? '📈' : trends.trend === 'decreasing' ? '📉' : '➡️' }}
                {{ trends.trend }}
                <span v-if="trends.trendPercentage" class="trend-percentage">
                  ({{ Math.abs(trends.trendPercentage).toFixed(1) }}%)
                </span>
              </span>
            </div>
          </div>

          <div class="monthly-chart">
            <div
              v-for="(month, index) in trends.monthlyTrends"
              :key="index"
              class="month-bar"
            >
              <div class="bar-container">
                <div
                  class="bar"
                  :style="{
                    height: getBarHeight(month.totalAmount, trends.monthlyTrends) + '%'
                  }"
                >
                  <span class="bar-value">${{ month.totalAmount.toFixed(0) }}</span>
                </div>
              </div>
              <div class="month-label">
                {{ getMonthLabel(month.year, month.month) }}
              </div>
              <div class="month-count">{{ month.count }} exp.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Expenses -->
      <div class="section-card">
        <h2>🏆 Top Expenses</h2>
        <div v-if="trends.topExpenses && trends.topExpenses.length === 0" class="empty-state">
          <p>No expenses yet</p>
        </div>
        <div v-else-if="trends.topExpenses" class="top-expenses">
          <div
            v-for="(expense, index) in trends.topExpenses"
            :key="expense._id"
            class="top-expense-item"
          >
            <div class="rank">{{ index + 1 }}</div>
            <div class="expense-details">
              <div class="expense-header">
                <span class="expense-description">{{ expense.description }}</span>
                <span class="expense-amount">${{ expense.amount.toFixed(2) }}</span>
              </div>
              <div class="expense-meta">
                <span class="expense-category">{{ expense.category }}</span>
                <span class="expense-date">{{ formatDate(expense.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Section -->
      <div class="export-section">
        <h3>📥 Export Data</h3>
        <div class="export-actions">
          <button @click="exportJSON" class="export-btn json">
            Export as JSON
          </button>
          <button @click="exportCSV" class="export-btn csv">
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsSummary, CategoryBreakdown } from '~/composables/useExpenseAPI';

const api = useExpenseAPI();

const loading = ref(true);
const error = ref('');
const showDateFilter = ref(false);

const dateFilter = ref({
  startDate: '',
  endDate: '',
});

const summary = ref<AnalyticsSummary>({
  totalExpenses: 0,
  totalAmount: 0,
  averageAmount: 0,
  minAmount: 0,
  maxAmount: 0,
});

const categoryBreakdown = ref<CategoryBreakdown[]>([]);

const trends = ref<any>({
  monthlyTrends: [],
  trend: 'stable',
  trendPercentage: 0,
  topExpenses: [],
});

// Load analytics on mount
onMounted(async () => {
  await loadAllAnalytics();
});

const loadAllAnalytics = async () => {
  loading.value = true;
  error.value = '';

  try {
    const params = {
      startDate: dateFilter.value.startDate || undefined,
      endDate: dateFilter.value.endDate || undefined,
    };

    const [summaryRes, categoryRes, trendsRes] = await Promise.all([
      api.getAnalyticsSummary(params),
      api.getAnalyticsByCategory(params),
      api.getAnalyticsTrends(params),
    ]);

    summary.value = summaryRes.data;
    categoryBreakdown.value = categoryRes.data;
    trends.value = trendsRes.data;
  } catch (e: any) {
    error.value = e.message || 'Failed to load analytics. Please make sure the API is running.';
    console.error('Error loading analytics:', e);
  } finally {
    loading.value = false;
  }
};

const clearDateFilter = () => {
  dateFilter.value = {
    startDate: '',
    endDate: '',
  };
  loadAllAnalytics();
};

const exportJSON = async () => {
  try {
    const params = {
      startDate: dateFilter.value.startDate || undefined,
      endDate: dateFilter.value.endDate || undefined,
    };

    const data = await api.exportToJSON(params);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e: any) {
    console.error('Error exporting JSON:', e);
    alert('Failed to export JSON');
  }
};

const exportCSV = () => {
  const params = {
    startDate: dateFilter.value.startDate || undefined,
    endDate: dateFilter.value.endDate || undefined,
  };

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

const getMonthLabel = (year: number, month: number) => {
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
};

const getBarHeight = (amount: number, allMonths: any[]) => {
  const max = Math.max(...allMonths.map(m => m.totalAmount));
  return max > 0 ? (amount / max) * 100 : 0;
};

const getCategoryClass = (category: string) => {
  return `category-${category.toLowerCase()}`;
};
</script>

<style scoped>
.analytics-page {
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

.filter-btn {
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.filter-btn:hover {
  background: #4f46e5;
}

.date-filter-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
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

.filter-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.clear-filter-btn {
  padding: 0.75rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.loading,
.error-message {
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
}

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s;
}

.summary-card:hover {
  transform: translateY(-4px);
}

.card-icon {
  font-size: 2.5rem;
}

.card-content h3 {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.card-value {
  color: #1f2937;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.section-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-card h2 {
  color: #1f2937;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.category-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 1.1rem;
}

.category-amount {
  font-weight: 700;
  color: #10b981;
  font-size: 1.25rem;
}

.category-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.category-bar-container {
  width: 100%;
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.category-bar {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.category-food { background: linear-gradient(90deg, #3b82f6, #2563eb); }
.category-transport { background: linear-gradient(90deg, #f59e0b, #d97706); }
.category-entertainment { background: linear-gradient(90deg, #ec4899, #db2777); }
.category-bills { background: linear-gradient(90deg, #ef4444, #dc2626); }
.category-shopping { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
.category-health { background: linear-gradient(90deg, #10b981, #059669); }
.category-education { background: linear-gradient(90deg, #6366f1, #4f46e5); }
.category-travel { background: linear-gradient(90deg, #06b6d4, #0891b2); }
.category-other { background: linear-gradient(90deg, #6b7280, #4b5563); }

.trends-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.trend-summary {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
}

.trend-indicator {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 1.1rem;
}

.trend-label {
  font-weight: 600;
  color: #374151;
}

.trend-value {
  font-weight: 700;
}

.trend-indicator.increasing .trend-value {
  color: #ef4444;
}

.trend-indicator.decreasing .trend-value {
  color: #10b981;
}

.trend-indicator.stable .trend-value {
  color: #6b7280;
}

.trend-percentage {
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

.monthly-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  gap: 1rem;
  padding: 2rem 1rem;
  background: #f9fafb;
  border-radius: 8px;
  min-height: 300px;
}

.month-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar-container {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bar {
  width: 80%;
  background: linear-gradient(180deg, #6366f1, #4f46e5);
  border-radius: 8px 8px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
  transition: height 0.5s ease;
}

.bar-value {
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
}

.month-label {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
}

.month-count {
  color: #6b7280;
  font-size: 0.8rem;
}

.top-expenses {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.top-expense-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  transition: background 0.3s;
}

.top-expense-item:hover {
  background: #f3f4f6;
}

.rank {
  width: 40px;
  height: 40px;
  background: #6366f1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.expense-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.expense-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expense-description {
  font-weight: 600;
  color: #1f2937;
}

.expense-amount {
  font-weight: 700;
  color: #10b981;
  font-size: 1.1rem;
}

.expense-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.expense-category {
  padding: 0.25rem 0.5rem;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 4px;
}

.export-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.export-section h3 {
  color: #1f2937;
  margin-bottom: 1rem;
}

.export-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.export-btn {
  flex: 1;
  min-width: 200px;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
}

.export-btn.json {
  background: #8b5cf6;
}

.export-btn.json:hover {
  background: #7c3aed;
}

.export-btn.csv {
  background: #10b981;
}

.export-btn.csv:hover {
  background: #059669;
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .monthly-chart {
    overflow-x: auto;
    justify-content: flex-start;
  }

  .month-bar {
    min-width: 60px;
  }

  .export-actions {
    flex-direction: column;
  }

  .export-btn {
    width: 100%;
  }
}
</style>
