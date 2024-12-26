<template>
  <template v-for="item in menuItems" :key="item.path">
    <el-sub-menu v-if="item.children?.length" :index="item.path">
      <template #title>
        <el-icon v-if="item.icon"
          ><component :is="icons[item.icon as keyof typeof icons]"
        /></el-icon>
        <span>{{ item.title }}</span>
      </template>
      <menu-recursive :menu-items="item.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.path">
      <el-icon v-if="item.icon"><component :is="icons[item.icon as keyof typeof icons]" /></el-icon>
      <span>{{ item.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/api'
import * as icons from '@element-plus/icons-vue'

defineProps<{
  menuItems: MenuItem[]
}>()
</script>
