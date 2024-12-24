<template>
  <div class="question-page">
    <h1>题目页面</h1>
    <el-card class="question-card" v-for="(question, index) in questions1" :key="index">
      <h2>{{ question.title }}</h2>
      <template v-if="question.type === 'single'">
        <el-radio-group v-model="selectedAnswers[index]">
          <el-radio v-for="(option, idx) in question.options" :key="idx" :label="option.value">
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </template>
      <template v-else-if="question.type === 'multiple'">
        <el-checkbox-group v-model="selectedAnswers[index]">
          <el-checkbox v-for="(option, idx) in question.options" :key="idx" :label="option.value">
            {{ option.label }}
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <p>正确答案: {{ question.correctAnswer }}</p>
      <p>解释: {{ question.explanation }}</p>
      <el-button @click="viewDetails(index)" type="primary">查看详情</el-button>
      <el-button @click="editQuestion(index)">编辑</el-button>
      <el-button @click="deleteQuestion(index)" type="danger">删除</el-button>
    </el-card>
    <el-dialog :visible.sync="editDialogVisible" title="编辑题目">
      <el-form :model="currentQuestion">
        <el-form-item label="题目标题">
          <el-input v-model="currentQuestion.title"></el-input>
        </el-form-item>
        <el-form-item label="题目解释">
          <el-input v-model="currentQuestion.explanation"></el-input>
        </el-form-item>
        <!-- 可以添加更多的表单项来编辑其他字段 -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </div>
    </el-dialog>

    <!-- 添加查看详情对话框 -->
    <el-dialog :visible.sync="detailsDialogVisible" title="题目详情">
      <div v-if="currentQuestion" class="question-details">
        <h3>题目标题</h3>
        <p>{{ currentQuestion.title }}</p>

        <h3>题目类型</h3>
        <p>{{ currentQuestion.type === 'single' ? '单选题' : '多选题' }}</p>

        <h3>选项</h3>
        <ul>
          <li v-for="(option, idx) in currentQuestion.options" :key="idx">
            {{ option.label }} ({{ option.value }})
          </li>
        </ul>

        <h3>正确答案</h3>
        <p>{{ currentQuestion.correctAnswer }}</p>

        <h3>解释说明</h3>
        <p>{{ currentQuestion.explanation }}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailsDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { questionApi } from '@/api'
import type { Question, QuestionList } from '@/api'

const questions1 = ref<Question[]>([])

onMounted(async () => {
  // const response = await questionApi.getQuestionList()
  // console.log({ response })
  // questions1.value = response.data
})

// 定义题目的选择状态
const selectedAnswers = ref<(string | number | (string | number)[])[]>([])

// 模拟数据
questions1.value = [
  {
    type: 'single',
    title: 'JavaScript 中，以下哪个是正确的变量声明方式？',
    options: [
      { label: 'var myVar;', value: 1 },
      { label: 'let myVar;', value: 2 },
      { label: 'const myVar;', value: 3 },
      { label: '以上都是', value: 4 },
    ],
    correctAnswer: 4,
    explanation: '在 JavaScript 中，var、let 和 const 都可以用来声明变量。',
  },
  {
    type: 'single',
    title: 'Python 中，以下哪个是正确的列表声明方式？',
    options: [
      { label: 'myList = []', value: 'A' },
      { label: 'myList = list()', value: 'B' },
      { label: 'myList = Array()', value: 'C' },
      { label: 'A 和 B 都是', value: 'D' },
    ],
    correctAnswer: 'D',
    explanation: '在 Python 中，可以使用 [] 或 list() 来声明列表。',
  },
  {
    type: 'multiple',
    title: '以下哪些是 JavaScript 中的基本数据类型？',
    options: [
      { label: 'String', value: 1 },
      { label: 'Number', value: 2 },
      { label: 'Boolean', value: 3 },
      { label: 'Object', value: 4 },
    ],
    correctAnswer: [1, 2, 3],
    explanation: 'JavaScript 中的基本数据类型包括 String、Number 和 Boolean。',
  },
  {
    type: 'multiple',
    title: '以下哪些是 Python 中的内置数据类型？',
    options: [
      { label: 'list', value: 'A' },
      { label: 'tuple', value: 'B' },
      { label: 'dictionary', value: 'C' },
      { label: 'set', value: 'D' },
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Python 中的内置数据类型包括 list、tuple、dictionary 和 set。',
  },
  {
    type: 'single',
    title: 'JavaScript 中，以下哪个方法用于将字符串转换为整数？',
    options: [
      { label: 'parseInt()', value: 'X' },
      { label: 'parseFloat()', value: 'Y' },
      { label: 'Number()', value: 'Z' },
    ],
    correctAnswer: 'X',
    explanation: 'parseInt() 方法用于将字符串转换为整数。',
  },
  {
    type: 'multiple',
    title: '以下哪些是 JavaScript 中的循环结构？',
    options: [
      { label: 'for', value: '甲' },
      { label: 'while', value: '乙' },
      { label: 'do...while', value: '丙' },
      { label: 'foreach', value: '丁' },
    ],
    correctAnswer: ['甲', '乙', '丙'],
    explanation: 'JavaScript 中的循环结构包括 for、while 和 do...while。',
  },
]

const editDialogVisible = ref(false)
const currentQuestion = ref<Question | null>(null)
const currentIndex = ref<number | null>(null)

const editQuestion = (index: number) => {
  currentQuestion.value = { ...questions1.value[index] }
  currentIndex.value = index
  editDialogVisible.value = true
}

const saveEdit = () => {
  if (currentIndex.value !== null && currentQuestion.value) {
    questions1.value[currentIndex.value] = { ...currentQuestion.value }
    editDialogVisible.value = false
  }
}

const deleteQuestion = (index: number) => {
  questions1.value.splice(index, 1)
}

const detailsDialogVisible = ref(false)

// 查看详情方法
const viewDetails = (index: number) => {
  currentQuestion.value = { ...questions1.value[index] }
  detailsDialogVisible.value = true
}
</script>

<style scoped>
.question-page {
  padding: 20px;
}
.question-card {
  margin-bottom: 20px;
}
.question-details h3 {
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
}
.question-details ul {
  list-style: none;
  padding-left: 0;
}
.question-details li {
  margin-bottom: 8px;
}
</style>
