<template>
  <el-container class="main-layout">
    <el-aside width="200px" class="sidebar">
      <el-header class="sidebar-header h-30">
        <h1>{{ title }}</h1>
      </el-header>
      <el-menu router :default-active="currentRoute" :collapse="isCollapse">
        <menu-recursive :menu-items="menus" />
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header bg-gray-300">
        <el-row class="w-full h-full">
          <el-col :span="22"> </el-col>
          <el-col :span="2" class="h-full text-[#130606] bg-gray-300">
            <svg fill="currentColor" viewBox="0 0 24 24" class="h-full">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="content p-5 overflow-y-auto">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MenuRecursive from '@/components/MenuRecursive.vue'
import type { MenuItem } from '@/api'

let title = import.meta.env.VITE_MENU_TITLE

const route = useRoute()
const currentRoute = ref(route.path)
const isCollapse = ref(false)

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
      {
        path: '/urls',
        title: '路由管理',
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
            path: '/papers',
            title: '试卷列表',
            icon: 'Document',
          },
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
  @apply h-screen;
}

.sidebar {
  @apply bg-gray-300;
}

.sidebar-header {
  @apply p-2 bg-gray-300 text-center;
}

.content {
  @apply p-5 overflow-y-auto;
}
</style>
