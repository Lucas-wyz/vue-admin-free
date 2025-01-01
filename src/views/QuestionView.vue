<template>
  <div class="question-view p-6 max-w-2xl mx-auto">
    <el-card class="box-card hover:shadow-xl transition-shadow duration-300">
      <!-- 进度条 -->
      <el-progress
        :percentage="(currentQuestionIndex / questions.length) * 100"
        :format="format"
        class="mb-4"
      />

      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">在线测试</h1>

      <transition name="fade" mode="out-in">
        <div v-if="currentQuestionIndex < questions.length" class="question space-y-6">
          <!-- 问题标题 -->
          <div class="flex items-center gap-4">
            <el-tag size="large" type="primary" class="text-xl">
              {{ currentQuestionIndex + 1 }}/{{ questions.length }}
            </el-tag>
            <el-tag size="small" :type="currentQuestion.type === 'single' ? 'success' : 'warning'">
              {{ currentQuestion.type === 'single' ? '单选题' : '多选题' }}
            </el-tag>
            <p class="text-lg font-semibold text-gray-700">{{ currentQuestion.text }}</p>
          </div>

          <!-- 选项 -->
          <div class="space-y-3 pl-4">
            <el-radio-group
              v-if="currentQuestion.type === 'single'"
              v-model="currentQuestion.selectedOptions[0]"
              class="flex flex-col gap-3"
            >
              <el-radio
                v-for="(option, optIndex) in currentQuestion.options"
                :key="optIndex"
                :label="option"
                border
                class="w-full !m-0 hover:shadow-md transition-shadow"
              >
                {{ option }}
              </el-radio>
            </el-radio-group>

            <el-checkbox-group
              v-else
              v-model="currentQuestion.selectedOptions"
              class="flex flex-col gap-3"
            >
              <el-checkbox
                v-for="(option, optIndex) in currentQuestion.options"
                :key="optIndex"
                :label="option"
                border
                class="w-full !m-0 hover:shadow-md transition-shadow"
              >
                {{ option }}
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <!-- 答案反馈 -->
          <div
            v-if="currentQuestion.result !== null"
            class="p-4 rounded-lg"
            :class="currentQuestion.result ? 'bg-green-50' : 'bg-red-50'"
          >
            <p
              class="font-medium mb-2"
              :class="{
                'text-green-600': currentQuestion.result,
                'text-red-600': !currentQuestion.result,
              }"
            >
              {{ currentQuestion.result ? '✓ 回答正确!' : '✗ 回答错误!' }}
            </p>
            <p class="text-gray-600">{{ currentQuestion.explanation }}</p>
            <p class="mt-2 font-semibold">
              得分: {{ currentQuestion.result ? currentQuestion.score : 0 }}
            </p>
          </div>
        </div>

        <!-- 测试结果 -->
        <div v-else class="result-panel space-y-6">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">测试完成!</h2>
            <el-result
              icon="success"
              :title="`总分: ${totalScore}`"
              :sub-title="getResultMessage(totalScore)"
            />
          </div>
        </div>
      </transition>

      <!-- 按钮区域 -->
      <div class="flex justify-center gap-4 mt-8">
        <el-button
          v-if="currentQuestionIndex < questions.length"
          type="primary"
          :disabled="!currentQuestion.selectedOptions.length"
          @click="submitAnswer"
          size="large"
          class="w-40"
        >
          提交答案
        </el-button>
        <el-button v-else type="success" @click="resetQuiz" size="large" class="w-40">
          重新测试
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElCard, ElRadio, ElButton, ElProgress, ElTag, ElResult, ElCheckbox } from 'element-plus'

// 定义问题类型
interface Question {
  text: string
  type: 'single' | 'multiple'
  options: string[]
  correctAnswers: string[]
  explanation: string
  selectedOptions: string[]
  result: boolean | null
  score: number
}

// 题目配置
const QUIZ_CONFIG = {
  QUESTIONS_PER_QUIZ: 4, // 每次测试题目数量
  POINTS_PER_QUESTION: 10, // 每题分数
  PASS_THRESHOLD: 0.6, // 及格线
}

// 初始化状态
const questions = ref<Question[]>(getRandomQuestions())
const currentQuestionIndex = ref(0)
const totalScore = ref(0)

// 计算当前问题
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

/**
 * 从题库中随机获取指定数量的题目
 * @returns Question[] 随机题目数组
 */
function getRandomQuestions(): Question[] {
  const allQuestions: Question[] = [
    {
      text: '中国的首都是哪里？',
      type: 'single',
      options: ['北京', '上海', '广州', '深圳'],
      correctAnswers: ['北京'],
      explanation: '中国的首都是北京。',
      selectedOptions: [],
      result: null,
      score: 10,
    },
    {
      text: '以下哪些是中国的一线城市？',
      type: 'multiple',
      options: ['北京', '上海', '广州', '深圳', '成都', '武汉'],
      correctAnswers: ['北京', '上海', '广州', '深圳'],
      explanation: '北京、上海、广州、深圳被认定为中国的一线城市。',
      selectedOptions: [],
      result: null,
      score: 10,
    },
    {
      text: '以下哪些是编程语言？',
      type: 'multiple',
      options: ['Python', 'Word', 'Java', 'Excel', 'JavaScript', 'PowerPoint'],
      correctAnswers: ['Python', 'Java', 'JavaScript'],
      explanation: 'Python、Java和JavaScript是编程语言，其他是办公软件。',
      selectedOptions: [],
      result: null,
      score: 10,
    },
    {
      text: 'HTML的全称是什么？',
      type: 'single',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Hyper Transfer Markup Language',
        'Home Tool Markup Language',
      ],
      correctAnswers: ['Hyper Text Markup Language'],
      explanation: 'HTML全称是Hyper Text Markup Language（超文本标记语言）。',
      selectedOptions: [],
      result: null,
      score: 10,
    },
    {
      text: '以下哪些是操作系统？',
      type: 'multiple',
      options: ['Windows', 'Office', 'Linux', 'Chrome', 'macOS', 'Firefox'],
      correctAnswers: ['Windows', 'Linux', 'macOS'],
      explanation: 'Windows、Linux和macOS是操作系统，Chrome和Firefox是浏览器，Office是办公软件。',
      selectedOptions: [],
      result: null,
      score: 10,
    },
  ]
  // 随机打乱并截取指定数量的题目
  return allQuestions.sort(() => 0.5 - Math.random()).slice(0, QUIZ_CONFIG.QUESTIONS_PER_QUIZ)
}

/**
 * 提交答案并处理结果
 */
function submitAnswer(): void {
  const question = currentQuestion.value
  question.result = checkAnswer(question)
  if (question.result) {
    totalScore.value += question.score
  }
  currentQuestionIndex.value++
}

/**
 * 检查答案是否正确
 * @param question 当前题目
 * @returns boolean 是否答对
 */
function checkAnswer(question: Question): boolean {
  // 检查选择数量和内容是否完全匹配
  return (
    question.selectedOptions.length === question.correctAnswers.length &&
    question.selectedOptions.every((opt) => question.correctAnswers.includes(opt))
  )
}

/**
 * 重置测试
 */
function resetQuiz(): void {
  questions.value = getRandomQuestions()
  currentQuestionIndex.value = 0
  totalScore.value = 0
}

/**
 * 格式化进度条显示
 */
const format = (percentage: number): string => `进度 ${percentage}%`

/**
 * 根据分数获取评价信息
 */
function getResultMessage(score: number): string {
  const totalPossibleScore = questions.value.length * QUIZ_CONFIG.POINTS_PER_QUESTION
  const scorePercentage = score / totalPossibleScore

  if (scorePercentage === 1) return '太棒了！满分通过！'
  if (scorePercentage >= 0.7) return '不错的表现！'
  if (scorePercentage >= QUIZ_CONFIG.PASS_THRESHOLD) return '还需要继续努力！'
  return '加油，继续学习！'
}
</script>

<style scoped>
/* 样式分类 */
/* 动画相关 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-radio),
:deep(.el-checkbox) {
  height: auto;
  padding: 12px 20px;
}

:deep(.el-radio.is-bordered.is-checked),
:deep(.el-checkbox.is-bordered.is-checked) {
  border-color: rgb(59, 130, 246);
  background-color: rgb(239, 246, 255);
}

/* 布局相关 */
.result-panel {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.box-card {
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
