<template>
  <div class="app-container">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>💰 Money Expense Tracker</h1>
        </div>
        <nav class="nav">
          <NuxtLink to="/" class="nav-link">Expenses</NuxtLink>
          <NuxtLink to="/analytics" class="nav-link">Analytics</NuxtLink>
          <NuxtLink to="/add" class="nav-link add-btn">+ Add Expense</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="footer">
      <p>&copy; 2024 Money Expense Tracker | API v3.0.0</p>
    </footer>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo h1 {
  font-size: 1.5rem;
  color: #667eea;
  font-weight: 700;
}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  padding: 0.6rem 1.2rem;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: #f3f4f6;
  color: #667eea;
}

.nav-link.router-link-active {
  background: #667eea;
  color: white;
}

.nav-link.add-btn {
  background: #10b981;
  color: white;
}

.nav-link.add-btn:hover {
  background: #059669;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 2rem;
}

.footer {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .logo h1 {
    font-size: 1.2rem;
  }

  .main-content {
    padding: 0 1rem;
    margin: 1rem auto;
  }
}
</style>
