<template>
  <div class="main-layout">
    <aside class="sidebar">
      <header class="sidebar-header">
        <h1>菜单</h1>
      </header>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/users">Users</router-link></li>
          <li><router-link to="/roles">Roles</router-link></li>
          <li><router-link to="/questions">Questions</router-link></li>
          <!-- 添加更多菜单项 -->
        </ul>
      </nav>
    </aside>
    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
// ...existing code...
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  padding: 10px;
  background-color: #ddd;
  text-align: center;
}
nav {
  flex: 1;
}
nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
nav li {
  margin: 0;
}
nav a {
  display: block;
  padding: 10px;
  color: #333;
  text-decoration: none;
}
nav a.router-link-active {
  background-color: #e0e0e0;
}
.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
