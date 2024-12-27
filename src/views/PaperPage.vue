<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { request } from '@/api/request'
import { useRouter } from 'vue-router'

interface Paper {
  id: number
  title: string
  description: string
  totalScore: number
  passScore: number
  createTime: string
}

interface Question {
  id: number
  type: 'single' | 'multiple'
  content: string
  options: Option[]
}

interface Option {
  id: number
  content: string
}

const papers = ref<Paper[]>([])
const router = useRouter()
const selectedPaper = ref<Paper | null>(null)
const questions = ref<Question[]>([])
const dialogVisible = ref(false)

const fetchPaperDetails = async (paperId: number) => {
  // 模拟数据，实际项目中应该通过 API 获取
  selectedPaper.value = papers.value.find((paper) => paper.id === paperId) || null
  questions.value = [
    {
      id: 1,
      type: 'single',
      content: 'Vue.js 是什么？',
      options: [
        { id: 1, content: '前端框架' },
        { id: 2, content: '后端框架' },
        { id: 3, content: '数据库' },
      ],
    },
    {
      id: 2,
      type: 'multiple',
      content: '以下哪些是 Vue.js 的特性？',
      options: [
        { id: 1, content: '响应式' },
        { id: 2, content: '组件化' },
        { id: 3, content: '虚拟 DOM' },
      ],
    },
  ]
}

const viewPaperDetails = async (paperId: number) => {
  await fetchPaperDetails(paperId)
  dialogVisible.value = true
}

onMounted(async () => {
  // 模拟数据，实际项目中应该通过 API 获取
  papers.value = [
    {
      id: 1,
      title: '前端基础测试',
      description: '测试前端基础知识',
      totalScore: 100,
      passScore: 60,
      createTime: '2024-01-20 14:30:00',
    },
    {
      id: 2,
      title: 'Vue.js进阶测试',
      description: '测试Vue.js进阶知识',
      totalScore: 100,
      passScore: 70,
      createTime: '2024-01-21 15:45:00',
    },
  ]
})
</script>

<template>
  <div class="paper-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">试卷列表</span>
        </div>
      </template>

      <el-table :data="papers" style="width: 100%" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="试卷标题" width="180" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="totalScore" label="总分" width="100" />
        <el-table-column prop="passScore" label="及格分" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewPaperDetails(row.id)">
              <el-icon><i-ep-view /></el-icon>查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.paper-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

:deep(.el-card__header) {
  padding: 12px 20px;
}
</style>
