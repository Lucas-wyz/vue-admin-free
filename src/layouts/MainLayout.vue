<template>
  <el-container class="main-layout">
    <el-aside width="200px" class="sidebar">
      <el-header class="sidebar-header">
        <h1>菜单</h1>
      </el-header>
      <el-menu router :default-active="currentRoute" :collapse="isCollapse">
        <menu-recursive :menu-items="menus" />
      </el-menu>
    </el-aside>
    <el-main class="content">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MenuRecursive from '@/components/MenuRecursive.vue'
import type { MenuItem } from '@/api'

const route = useRoute()
const currentRoute = ref(route.path)
const isCollapse = ref(false)

// <el-icon>< /></el-icon>

// 模拟菜单数据
const menus = ref<MenuItem[]>([
  {
    path: '/',
    title: '首页',
    icon: 'Setting',
  },
  {
    path: '/system',
    title: '系统管理',
    icon: 'Setting',
    children: [
      {
        path: '/users',
        title: '用户管理',
        icon: 'UserFilled',
      },
      {
        path: '/roles',
        title: '角色管理',
        icon: 'UserFilled',
      },
    ],
  },
  {
    path: '/content',
    title: '内容管理',
    icon: 'Setting',
    children: [
      {
        path: '/questions',
        title: '题目管理',
        icon: 'Document',
      },
      {
        path: '/categories',
        title: '分类管理',
        icon: 'Document',
        children: [
          {
            path: '/questions',
            title: '题目管理',
            icon: 'Document',
          },
        ],
      },
    ],
  },
])

onMounted(() => {
  currentRoute.value = route.path
})
</script>

<style scoped>
.main-layout {
  height: 100vh;
}
.sidebar {
  background-color: #f4f4f4;
}
.sidebar-header {
  padding: 10px;
  background-color: #ddd;
  text-align: center;
}
.content {
  padding: 20px;
  overflow-y: auto;
}
</style>
