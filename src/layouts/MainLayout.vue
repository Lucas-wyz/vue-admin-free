<template>
  <el-container>
    <el-aside width="200px" class="sidebar">
      <el-menu class="sidebar-header h-50">
        <h1>{{ title }}</h1>
      </el-menu>
      <el-menu router :default-active="currentRoute" :collapse="isCollapse">
        <menu-recursive :menu-items="menus" />
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-row class="w-full h-full">
          <el-col :span="20"> </el-col>
          <el-col :span="4" class="h-full">
            <el-icon-user-filled class="w-full h-full" style="" />
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
import { menuApi } from '@/api'

let title = import.meta.env.VITE_MENU_TITLE

const route = useRoute()
const currentRoute = ref(route.path)
const isCollapse = ref(false)

// 模拟菜单数据
const menus = ref<MenuItem[]>()

onMounted(async () => {
  let { data } = await menuApi.getMenuList()
  menus.value = data
  currentRoute.value = route.path
})
</script>

<style scoped></style>
