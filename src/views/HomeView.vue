<script setup lang="ts">
import { ElCard } from 'element-plus'
</script>

<template>
  <div class="home-view">
    <h1>欢迎来到首页</h1>
    <p>这是一个示例项目，展示了 Vue 3 和 Element Plus 的使用。</p>
    <p>请浏览左侧菜单以查看不同的页面。</p>

    <div class="charts">
      <el-card class="chart">
        <h2>状态图表 1</h2>
        <!-- 添加图表组件或图表代码 -->
      </el-card>
      <el-card class="chart">
        <h2>状态图表 2</h2>
        <!-- 添加图表组件或图表代码 -->
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 20px;
}

.charts {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.chart {
  flex: 1;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
