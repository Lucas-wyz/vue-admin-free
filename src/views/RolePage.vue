<template>
  <div class="role-page">
    <h1>角色页面</h1>
    <!-- 添加角色页面内容 -->
    <el-card v-for="role in roles" :key="role.id" style="margin-bottom: 20px">
      <el-descriptions :title="role.name" :column="1" border>
        <el-descriptions-item label="描述">{{ role.description }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElCard, ElDescriptions, ElDescriptionsItem } from 'element-plus' // 添加 Element Plus 组件

// 添加模拟数据
const roles = ref([
  { id: 1, name: '管理员', description: '拥有最高权限' },
  { id: 2, name: '编辑', description: '可以编辑内容' },
  { id: 3, name: '访客', description: '只能查看内容' },
])
</script>

<style scoped>
.role-page {
  padding: 20px;
}
/* 添加角色卡片的样式 */
.el-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
/* 添加描述项的样式 */
.el-descriptions {
  margin-top: 10px;
}
</style>
