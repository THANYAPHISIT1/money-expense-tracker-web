# 💰 Money Expense Tracker - Web Application

A modern, full-featured web application for tracking personal expenses with advanced analytics, filtering, and data export capabilities.

![Nuxt](https://img.shields.io/badge/Nuxt-4.2.1-00DC82?style=flat&logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.5.24-4FC08D?style=flat&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat&logo=typescript)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Pages](#pages)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Available Scripts](#available-scripts)
- [Production Build](#production-build)
- [Contributing](#contributing)

---

## 🎯 Overview

Money Expense Tracker is a comprehensive web application built with Nuxt 3 and Vue 3 that helps you manage and analyze your personal expenses. The application features a beautiful, responsive UI with gradient designs, real-time filtering, analytics dashboards, and data export functionality.

**Frontend runs on:** `http://localhost:3000`
**Backend API:** `http://localhost:5000`

---

## ✨ Features

### Core Functionality
- ✅ **Expense Management** - Create, read, update, and delete expenses
- ✅ **Advanced Filtering** - Filter by date range, amount, category, and search text
- ✅ **Real-time Search** - Instant search results as you type
- ✅ **Pagination** - Efficient data browsing with customizable page size
- ✅ **Category System** - 9 predefined categories with descriptions
- ✅ **Soft Delete** - Safely delete with option to restore

### Analytics & Insights
- 📊 **Summary Statistics** - Total spent, average, min/max amounts
- 📈 **Category Breakdown** - Visual bars showing spending by category
- 📉 **Monthly Trends** - Bar chart visualization of spending over time
- 🏆 **Top Expenses** - See your highest spending items
- 📅 **Period Analysis** - Analyze spending by custom date ranges

### Data Export
- 💾 **JSON Export** - Download filtered data as JSON
- 📄 **CSV Export** - Export to CSV for spreadsheet analysis

### User Experience
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Fast Performance** - Built with Nuxt 3 for optimal speed
- 🔔 **Loading States** - Clear feedback during data operations
- ❌ **Error Handling** - Friendly error messages and retry options
- ✅ **Form Validation** - Client-side validation with helpful messages

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Nuxt 4.2.1 |
| **UI Library** | Vue 3.5.24 |
| **Language** | TypeScript |
| **Routing** | Vue Router 4.6.3 |
| **Styling** | Scoped CSS with modern gradients |
| **API Client** | Nuxt $fetch |
| **State Management** | Vue 3 Composition API |

---

## 📦 Prerequisites

### Backend API Required

This frontend application requires the **Money Expense Tracker API** to be running. The backend provides:

- RESTful API with 18 endpoints
- MongoDB database for data persistence
- Category management
- Analytics calculations
- Data export functionality

**Backend Repository:** [money-expense-node](https://github.com/your-username/money-expense-node)
**Backend runs on:** `http://localhost:5000`

Please ensure the backend is set up and running before starting the frontend application.

### System Requirements

- Node.js 18.x or higher
- npm, pnpm, yarn, or bun package manager
- Backend API running on port 5000

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/THANYAPHISIT1/money-expense-tracker-web.git
cd money-expense-tracker-web
```

### 2. Install Dependencies

Choose your preferred package manager:

```bash
# npm
npm install

# pnpm (recommended for faster installs)
pnpm install

# yarn
yarn install

# bun
bun install
```

### 3. Ensure Backend is Running

Make sure the Money Expense Tracker API is running on `http://localhost:5000`. Check the health endpoint:

```bash
curl http://localhost:5000/health
```

You should see:
```json
{
  "success": true,
  "status": "OK",
  "database": "connected"
}
```

---

## 💻 Development

### Start Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

The application will automatically reload when you make changes to the source files.

### Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

---

## 📄 Pages

### 1. Expenses List (`/`)

The main page displaying all your expenses.

**Features:**
- View all expenses with pagination
- Advanced filtering sidebar:
  - Search by description
  - Filter by category
  - Date range (start/end date)
  - Amount range (min/max)
  - Sort options (date, amount, category, description)
  - Sort order (ascending/descending)
- Edit and delete actions for each expense
- Export to CSV
- Color-coded category tags
- Responsive card layout

### 2. Add Expense (`/add`)

Form to create a new expense.

**Features:**
- Description input (required, max 200 characters)
- Amount input (required, minimum $0.01)
- Category dropdown (9 categories available)
- Date/time picker (defaults to current time)
- Real-time validation
- Category guide showing all categories with descriptions
- Success message with auto-redirect

**Categories Available:**
1. **Food** - Groceries, restaurants, food delivery
2. **Transport** - Public transport, fuel, parking, car maintenance
3. **Entertainment** - Movies, games, hobbies, subscriptions
4. **Bills** - Utilities, rent, internet, phone bills
5. **Shopping** - Clothing, electronics, household items
6. **Health** - Medical, pharmacy, fitness, wellness
7. **Education** - Books, courses, tuition, supplies
8. **Travel** - Flights, hotels, vacation expenses
9. **Other** - Miscellaneous expenses

### 3. Edit Expense (`/edit/:id`)

Edit an existing expense with pre-populated data.

**Features:**
- Dynamic route based on expense ID
- Pre-filled form with current expense data
- Same validation as add form
- Shows original creation and last update timestamps
- Success message with auto-redirect
- Error handling for deleted/missing expenses

### 4. Analytics Dashboard (`/analytics`)

Comprehensive analytics and insights.

**Features:**
- **Summary Cards:**
  - Total amount spent
  - Total number of expenses
  - Average expense amount
  - Min/Max spending range

- **Category Breakdown:**
  - Visual progress bars for each category
  - Spending amount per category
  - Percentage of total spending
  - Number of expenses per category
  - Average amount per category

- **Monthly Trends:**
  - Bar chart showing spending over time
  - Trend indicator (increasing/decreasing/stable)
  - Percentage change comparison
  - Expense count per month

- **Top Expenses:**
  - Top 5 highest expenses
  - Ranked display with amounts
  - Category and date information

- **Date Filtering:**
  - Filter all analytics by date range
  - Apply to all analytics sections

- **Export Options:**
  - Export to JSON
  - Export to CSV

---

## 📁 Project Structure

```
money-expense-tracker-web/
├── app/
│   └── app.vue                 # Root application component
├── composables/
│   └── useExpenseAPI.ts        # API integration composable
├── layouts/
│   └── default.vue             # Main layout with header/footer
├── pages/
│   ├── index.vue               # Expenses listing page
│   ├── add.vue                 # Add expense page
│   ├── analytics.vue           # Analytics dashboard
│   └── edit/
│       └── [id].vue            # Edit expense (dynamic route)
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── nuxt.config.ts              # Nuxt configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── PROJECT_SUMMARY.md          # Project documentation
└── README.md                   # This file
```

---

## 🔌 API Integration

### Composable: `useExpenseAPI()`

All API calls are handled through a centralized composable located at `composables/useExpenseAPI.ts`.

**Available Methods:**

```typescript
// Expense Operations
getExpenses(params)              // List expenses with filters
getExpense(id)                   // Get single expense
createExpense(data)              // Create new expense
updateExpense(id, data)          // Update expense
deleteExpense(id)                // Soft delete expense
restoreExpense(id)               // Restore deleted expense
permanentlyDeleteExpense(id)     // Permanently delete
getDeletedExpenses(params)       // List deleted expenses

// Analytics Operations
getAnalyticsSummary(params)      // Get summary statistics
getAnalyticsByCategory(params)   // Get category breakdown
getAnalyticsByPeriod(params)     // Get period analysis
getAnalyticsTrends(params)       // Get spending trends
getCategories()                  // Get all categories

// Export Operations
exportToJSON(params)             // Export as JSON
exportToCSV(params)              // Get CSV download URL

// System
checkHealth()                    // API health check
```

### TypeScript Interfaces

The composable includes comprehensive TypeScript interfaces:

- `Expense` - Expense data structure
- `ExpenseInput` - Create/update expense payload
- `Pagination` - Pagination metadata
- `ExpenseListResponse` - List response structure
- `AnalyticsSummary` - Summary statistics
- `CategoryBreakdown` - Category analysis
- `Category` - Category information

### API Base URL

The API base URL is currently hardcoded to `http://localhost:5000`. For production, you should:

1. Create a `.env` file:
```env
NUXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

2. Update `composables/useExpenseAPI.ts`:
```typescript
const config = useRuntimeConfig();
const API_BASE = config.public.apiBaseUrl || 'http://localhost:5000';
```

---

## 📜 Available Scripts

```bash
# Development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate

# Prepare Nuxt (run after install)
npm run postinstall
```

---

## 🏗️ Production Build

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `.output` directory.

### Preview Production Build Locally

```bash
npm run preview
```

### Deployment Options

Nuxt 3 supports multiple deployment platforms:

- **Vercel** - Zero-config deployment
- **Netlify** - Static or server-side rendering
- **Cloudflare Pages** - Global CDN deployment
- **AWS** - Lambda or EC2 deployment
- **Docker** - Container deployment
- **Node.js Server** - Traditional hosting

For detailed deployment instructions, see the [Nuxt Deployment Documentation](https://nuxt.com/docs/getting-started/deployment).

### Environment Variables

For production, configure the following environment variables:

```env
# API Base URL
NUXT_PUBLIC_API_BASE_URL=https://your-api-domain.com

# Node environment
NODE_ENV=production
```

---

## 🎨 Design Features

### Color Scheme

- **Primary Gradient:** Purple to Violet (`#667eea` to `#764ba2`)
- **Success:** Green (`#10b981`)
- **Warning:** Orange/Yellow
- **Danger:** Red (`#ef4444`)
- **Neutral:** Grays (`#1f2937`, `#6b7280`, `#f3f4f6`)

### Category Colors

Each category has a unique color gradient:
- **Food:** Blue gradient
- **Transport:** Orange/Yellow gradient
- **Entertainment:** Pink gradient
- **Bills:** Red gradient
- **Shopping:** Purple gradient
- **Health:** Green gradient
- **Education:** Indigo gradient
- **Travel:** Cyan gradient
- **Other:** Gray gradient

### Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

---

## 🔧 Configuration

### Nuxt Configuration (`nuxt.config.ts`)

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
```

### TypeScript Configuration

TypeScript is fully enabled with strict type checking. All components and composables are type-safe.

---

## 🐛 Troubleshooting

### Backend Not Connected

**Error:** "Failed to load expenses. Please make sure the API is running."

**Solution:**
1. Ensure backend is running on port 5000
2. Check backend health: `curl http://localhost:5000/health`
3. Verify backend database connection
4. Check for CORS issues in backend configuration

### Port 3000 Already in Use

**Solution:**
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or specify a different port
PORT=3001 npm run dev
```

### TypeScript Errors

**Solution:**
```bash
# Regenerate Nuxt types
npm run postinstall
```

---

## 📖 Learn More

### Nuxt 3 Documentation
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Nuxt 3 Examples](https://nuxt.com/docs/examples)

### Vue 3 Documentation
- [Vue 3 Guide](https://vuejs.org/guide)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

### Backend API Documentation
- See `PROJECT_SUMMARY.md` for complete API documentation
- 18 endpoints covering all expense operations
- Comprehensive request/response examples

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**THANYAPHISIT**

---

## 🙏 Acknowledgments

- Built with [Nuxt 3](https://nuxt.com/)
- UI inspired by modern design trends
- Icons from Unicode emoji set
- Backend API: Money Expense Tracker API v3.0.0

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for API documentation
2. Review the [Nuxt Documentation](https://nuxt.com/docs)
3. Open an issue on GitHub

---

**Made with ❤️ and Vue 3**
