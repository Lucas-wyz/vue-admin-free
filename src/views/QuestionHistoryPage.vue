<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { questionHistoryApi } from '@/api'
import type { questionHistory } from '@/api'

// 表格相关
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 历史记录数据
const historyRecords = ref<questionHistory[]>([
  {
    id: '1',
    user_name: '张三',
    question_title: 'JavaScript 中，以下哪个是正确的变量声明方式？',
    answer: '4',
    correct_answer: '4',
    is_correct: true,
    score: 2,
    submit_time: '2024-01-20 14:30:00',
    time_spent: '120s',
  },
  // ... 更多记录
])

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchHistory()
}

// 获取历史记录
const fetchHistory = async () => {
  try {
    let { data } = await questionHistoryApi.getHistoryList()
    historyRecords.value.push(...data)
    loading.value = true
    // const response = await questionApi.getQuestionHistory({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   query: searchQuery.value
    // })
    // historyRecords.value = response.data
    // total.value = response.total
  } catch (error) {
    ElMessage.error('获取历史记录失败')
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchHistory()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchHistory()
}

// 查看答题详情
const detailsDialogVisible = ref(false)
const currentRecord = ref(null)

const viewDetails = (record: any) => {
  currentRecord.value = record
  detailsDialogVisible.value = true
}

onMounted(() => {
  fetchHistory()
})
</script>

<template>
  <div class="history-page">
    <h1>答题历史记录</h1>

    <div class="header-actions">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户或题目"
        clearable
        class="search-input"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><i-ep-search /></el-icon>
        </template>
      </el-input>
    </div>

    <el-table v-loading="loading" :data="historyRecords" style="width: 100%">
      <el-table-column prop="user_name" label="用户" width="120" />
      <el-table-column prop="question_title" label="题目" show-overflow-tooltip />
      <el-table-column prop="submit_time" label="提交时间" width="180" />
      <el-table-column prop="time_spent" label="用时" width="100" />
      <el-table-column label="答题结果" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.is_correct ? 'success' : 'danger'">
            {{ row.is_correct ? '正确' : '错误' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="得分" width="80" align="center" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="viewDetails(row)"> 查看详情 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:pageSize="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        background
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 答题详情弹窗 -->
    <el-dialog v-model="detailsDialogVisible" title="答题详情" width="50%">
      <div v-if="currentRecord" class="answer-details">
        <el-descriptions border>
          <el-descriptions-item label="用户">{{ currentRecord.user_name }}</el-descriptions-item>
          <el-descriptions-item label="题目">{{
            currentRecord.question_title
          }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{
            currentRecord.submit_time
          }}</el-descriptions-item>
          <el-descriptions-item label="用时">{{ currentRecord.time_spent }}</el-descriptions-item>
          <el-descriptions-item label="得分">{{ currentRecord.score }}</el-descriptions-item>
          <el-descriptions-item label="答题结果">
            <el-tag :type="currentRecord.is_correct ? 'success' : 'danger'">
              {{ currentRecord.is_correct ? '正确' : '错误' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户答案">{{ currentRecord.answer }}</el-descriptions-item>
          <el-descriptions-item label="正确答案">{{
            currentRecord.correct_answer
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.history-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.answer-details {
  padding: 20px;
}
</style>
