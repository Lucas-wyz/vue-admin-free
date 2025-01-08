<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-3 py-4 sm:p-6">
    <div class="max-w-2xl mx-auto">
      <el-card class="!border-none shadow-lg hover:shadow-xl transition-all duration-300">
        <!-- 标题 -->
        <h1
          class="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          在线测试
        </h1>

        <transition name="fade" mode="out-in">
          <div
            v-if="currentQuestionIndex < questions.length"
            class="question space-y-4 sm:space-y-6"
          >
            <!-- 问题标题 -->
            <div class="flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-2 sm:gap-4">
              <el-tag
                size="small"
                :type="currentQuestion.type === 'single' ? 'success' : 'warning'"
                class="shrink-0 mt-1 sm:mt-0"
              >
                {{ currentQuestion.type === 'single' ? '单选题' : '多选题' }}
              </el-tag>
              <p class="text-base sm:text-lg font-medium text-gray-700 leading-relaxed">
                {{ currentQuestion.text }}
              </p>
            </div>

            <!-- 选项 -->
            <div class="space-y-2 sm:space-y-3 sm:pl-4">
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
        <div class="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          <el-button
            v-if="currentQuestionIndex < questions.length"
            type="primary"
            :disabled="!currentQuestion.selectedOptions.length"
            @click="submitAnswer"
            :size="isMobile ? 'default' : 'large'"
            class="flex-1 sm:flex-none sm:w-40 !bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50"
            :loading="submitting"
          >
            {{ submitting ? '提交中...' : '提交答案' }}
          </el-button>
          <el-button
            v-else
            type="success"
            @click="resetQuiz"
            :size="isMobile ? 'default' : 'large'"
            class="flex-1 sm:flex-none sm:w-40 !bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
          >
            重新测试
          </el-button>
        </div>
      </el-card>

      <!-- 弹出框 -->
      <el-dialog
        v-if="showDialog"
        v-model="showDialog"
        :center="true"
        :destroy-on-close="true"
        :close-on-click-modal="true"
        class="!rounded-xl overflow-hidden"
        :fullscreen="isMobile"
        :class="{ '!m-0': isMobile }"
        @close="handleNextQuestion"
      >
        <!-- 答案反馈 -->
        <div
          v-if="currentQuestion?.result !== null"
          class="rounded-lg border p-3 sm:p-6"
          :class="[
            currentQuestion?.result
              ? 'border-green-200 bg-green-50/50'
              : 'border-red-200 bg-red-50/50',
          ]"
        >
          <!-- 答题结果头部 -->
          <div
            class="flex items-center justify-between pb-2 sm:pb-3 mb-3 sm:mb-4 border-b border-gray-200"
          >
            <div class="flex items-center gap-2">
              <el-icon
                :size="isMobile ? 18 : 24"
                :class="currentQuestion?.result ? 'text-green-500' : 'text-red-500'"
              >
                <component
                  :is="currentQuestion?.result ? 'CircleCheckFilled' : 'CircleCloseFilled'"
                />
              </el-icon>
              <span
                class="text-sm sm:text-base font-bold"
                :class="currentQuestion?.result ? 'text-green-600' : 'text-red-600'"
              >
                {{ currentQuestion?.result ? '回答正确' : '回答错误' }}
              </span>
            </div>
            <el-tag
              :type="currentQuestion?.result ? 'success' : 'danger'"
              class="!text-xs sm:!text-sm !px-2 sm:!px-3 !py-1 !rounded-full"
            >
              得分：{{ currentQuestion?.result ? currentQuestion.score : 0 }}
            </el-tag>
          </div>

          <!-- 答案详情区域 -->
          <div class="space-y-3">
            <!-- 答错时的详细信息 -->
            <template v-if="!currentQuestion?.result">
              <div class="bg-white/60 rounded-lg p-4 space-y-3">
                <!-- 您的答案 -->
                <div class="answer-item">
                  <div class="flex items-center gap-2 mb-1">
                    <el-icon class="text-red-500"><i-ep-CloseBold /></el-icon>
                    <span class="font-medium">您的答案</span>
                  </div>
                  <div class="pl-6">
                    <el-tag
                      v-for="option in currentQuestion?.selectedOptions"
                      :key="option"
                      class="mr-2 mb-2"
                      type="danger"
                    >
                      {{ option }}
                    </el-tag>
                  </div>
                </div>

                <!-- 正确答案 -->
                <div class="answer-item">
                  <div class="flex items-center gap-2 mb-1">
                    <el-icon class="text-green-500"><i-ep-check /></el-icon>
                    <span class="font-medium">正确答案</span>
                  </div>
                  <div class="pl-6">
                    <el-tag
                      v-for="option in currentQuestion?.correctAnswers"
                      :key="option"
                      class="mr-2 mb-2"
                      type="success"
                    >
                      {{ option }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <!-- 解释说明 -->
              <div class="bg-white/60 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <el-icon class="text-blue-500"><i-ep-InfoFilled /></el-icon>
                  <span class="font-medium">详细解释</span>
                </div>
                <div class="pl-6 text-gray-700 leading-relaxed">
                  {{ currentQuestion?.explanation }}
                </div>
              </div>

              <!-- 提示信息 -->
              <div class="mt-4 text-gray-500 text-sm flex items-center gap-2">
                <el-icon><i-ep-warning /></el-icon>
                <span>仔细阅读解释，这将帮助你更好地理解题目。</span>
              </div>
            </template>

            <!-- 答对时的反馈 -->
            <template v-else>
              <div class="bg-white/60 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <el-icon class="text-green-500"><i-ep-InfoFilled /></el-icon>
                  <span class="font-medium">知识要点</span>
                </div>
                <div class="pl-6 text-gray-700 leading-relaxed">
                  {{ currentQuestion?.explanation }}
                </div>
              </div>
            </template>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50">
            <!-- <el-button
              @click="showDialog = false"
              :size="isMobile ? 'default' : 'large'"
              class="flex-1 sm:flex-none !border-gray-300 hover:!border-gray-400 transition-colors"
            >
              关闭
            </el-button> -->
            <el-button
              type="primary"
              @click="handleNextQuestion"
              :size="isMobile ? 'default' : 'large'"
              class="flex-1 sm:flex-none !bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
            >
              {{ currentQuestionIndex < questions.length - 1 ? '下一题' : '查看结果' }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// ...existing code...
const showDialog = ref(false)
// ...existing code...

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
const submitting = ref(false)

// 计算当前问题
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

// 添加移动端检测
const isMobile = computed(() => window.innerWidth < 640)

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

  // 检查是否已选择答案
  if (!question.selectedOptions.length) {
    ElMessage.warning('请选择答案后再提交')
    return
  }

  submitting.value = true
  question.result = checkAnswer(question)
  showDialog.value = currentQuestion.value.result !== null
  // setTimeout(() => {
  //   if (question.result) {
  //     totalScore.value += question.score
  //     ElMessage({
  //       message: '答对了！继续保持！',
  //       type: 'success',
  //       duration: 2000,
  //     })
  //   } else {
  //     ElMessage({
  //       message: '答错了，请仔细查看解释',
  //       type: 'error',
  //       duration: 2000,
  //     })
  //   }
  //   currentQuestionIndex.value++
  //   submitting.value = false
  // }, 5000)
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

// 处理下一题或查看结果
const handleNextQuestion = () => {
  showDialog.value = false
  console.log(currentQuestion.value)
  if (currentQuestion.value?.result) {
    totalScore.value += currentQuestion.value.score
  }
  showDialog.value = false
  currentQuestionIndex.value++
  submitting.value = false
}
</script>

<style scoped>
/* 使用 Tailwind 处理大部分样式 */
:deep(.el-radio),
:deep(.el-checkbox) {
  @apply h-auto px-4 sm:px-5 py-2.5 sm:py-3 mb-0 rounded-lg transition-all duration-200 hover:shadow-md text-sm sm:text-base;
}

:deep(.el-radio.is-bordered.is-checked),
:deep(.el-checkbox.is-bordered.is-checked) {
  @apply border-blue-500 bg-blue-50;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  @apply transition-all duration-300 ease-out;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0 transform translate-y-2;
}

/* 移动端弹窗优化 */
@media (max-width: 640px) {
  :deep(.el-dialog__body) {
    @apply p-3 max-h-[calc(100vh-120px)] overflow-y-auto;
  }

  :deep(.el-tag) {
    @apply text-xs leading-normal;
  }

  :deep(.quiz-dialog .el-dialog__footer) {
    @apply p-3 border-t border-gray-200;
  }
}

/* 滚动条美化 */
:deep(.el-dialog__body)::-webkit-scrollbar {
  @apply w-1.5;
}

:deep(.el-dialog__body)::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full;
}

:deep(.el-dialog__body)::-webkit-scrollbar-track {
  @apply bg-gray-100;
}
</style>
