<template>
  <el-container>
    <el-header>
      <el-row class="w-full h-full">
        <el-col :span="5" class=""> </el-col>
        <el-col :span="15"> </el-col>
        <el-col :span="4" class="h-full">
          <div class="h-full flex justify-center items-center">
            <el-image class="rounded-full h-4/6" :src="'user.png'" />
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside>
        <el-scrollbar height="600px">
          <el-menu router :default-active="currentRoute" :collapse="isCollapse">
            <menu-recursive :menu-items="menus" />
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main class=" ">
        <el-scrollbar height="600px">
          <router-view></router-view>
        </el-scrollbar>
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

import { Search, Plus, Edit, Delete, UserFilled } from '@element-plus/icons-vue'

let title = import.meta.env.VITE_MENU_TITLE

const route = useRoute()
const currentRoute = ref(route.path)
const isCollapse = ref(false)

// 模拟菜单数据
const menus = ref<MenuItem[]>([])

onMounted(async () => {
  let { data } = await menuApi.getMenuList()
  menus.value = data
  currentRoute.value = route.path
})
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>
