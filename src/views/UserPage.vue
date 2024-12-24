<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { request } from '@/api/request'
import { userApi } from '@/api'
import type { User } from '@/api'

const users = ref<User[]>([])

onMounted(async () => {
  // const response = await request('/user.json')
  // users.value = response
  const response = await userApi.getUserList()
  console.log({ response })
  users.value = response.data
})
</script>

<template>
  <div class="user-page">
    <h1>用户列表</h1>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
    </el-table>
  </div>
</template>

<style scoped>
.user-page {
  padding: 20px;
}
</style>
