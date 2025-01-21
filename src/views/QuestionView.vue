<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-3 py-4 sm:p-6">
    <div class="max-w-2xl mx-auto">
      <el-card class="!border-none shadow-lg hover:shadow-xl transition-all duration-300">
        <!-- 标题样式优化 -->
        <h1
          class="text-lg sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight"
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
                :type="currentQuestion.question_type === 'single' ? 'success' : 'warning'"
                class="shrink-0 mt-1 sm:mt-0"
              >
                {{ currentQuestion.question_type === 'single' ? '单选题' : '多选题' }}
              </el-tag>
              <p class="text-base sm:text-lg font-medium text-gray-700 leading-relaxed">
                {{ currentQuestion.question_title }}
              </p>
            </div>

            <!-- 选项样式优化 -->
            <div class="space-y-2 sm:space-y-3">
              <el-radio-group
                v-if="currentQuestion.question_type === 'single'"
                v-model="currentQuestion.selectedAnswer"
                class="flex flex-col gap-2 sm:gap-3"
              >
                <el-radio
                  v-for="option in currentQuestion.options"
                  :key="option.id"
                  :label="option.option_value"
                  border
                  class="w-full !m-0 !h-auto !py-2.5 sm:!py-3 !px-3 sm:!px-4 text-sm sm:text-base hover:shadow-md transition-shadow"
                >
                  {{ option.option_text }}
                </el-radio>
              </el-radio-group>

              <el-checkbox-group
                v-else
                v-model="currentQuestion.selectedAnswer"
                class="flex flex-col gap-3"
              >
                <el-checkbox
                  v-for="option in currentQuestion.options"
                  :key="option.id"
                  :label="option.option_value"
                  border
                  class="w-full !m-0 hover:shadow-md transition-shadow"
                >
                  {{ option.option_text }}
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

        <!-- 按钮区域样式优化 -->
        <div class="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
          <el-button
            v-if="currentQuestionIndex < questions.length"
            type="primary"
            :disabled="!currentQuestion.selectedAnswer.length"
            @click="submitAnswer"
            :size="isMobile ? 'default' : 'large'"
            class="w-full sm:w-auto !min-w-[120px] !py-2 sm:!py-3"
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

      <!-- 弹窗样式优化 -->
      <el-dialog
        v-if="showDialog"
        v-model="showDialog"
        :center="true"
        :destroy-on-close="true"
        :close-on-click-modal="true"
        class="!rounded-lg sm:!rounded-xl"
        :fullscreen="isMobile"
        :class="{
          '!m-0': isMobile,
          'dialog-mobile': isMobile,
          'dialog-desktop': !isMobile,
        }"
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
                      v-for="option in currentQuestion?.selectedAnswer"
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
                      v-for="option in currentQuestion?.correct_answer"
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
                  {{ currentQuestion?.explanation_text }}
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
                  {{ currentQuestion?.explanation_text }}
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { Question } from '@/api/types/question'
import { questionApi } from '@/api'

// 扩展 Question 类型以适应测试需求
interface TestQuestion extends Question {
  selectedAnswer: string | number | (string | number)[]
  result: boolean | null
}

// 题目配置
const QUIZ_CONFIG = {
  QUESTIONS_PER_QUIZ: 10,
  POINTS_PER_QUESTION: 10,
  PASS_THRESHOLD: 0.6,
}

const questions = ref<TestQuestion[]>([])
const currentQuestionIndex = ref(0)
const totalScore = ref(0)
const submitting = ref(false)
const showDialog = ref(false)

// 获取题目列表并初始化测试题目
async function initQuestions() {
  try {
    const response = await questionApi.getQuestionList()
    if (response?.data) {
      // 将获取的题目转换为测试题目格式
      const testQuestions: TestQuestion[] = response.data.map((question) => ({
        ...question,
        selectedAnswer: question.question_type === 'single' ? '' : [],
        result: null,
      }))
      // 随机打乱并截取指定数量的题目
      questions.value = testQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, QUIZ_CONFIG.QUESTIONS_PER_QUIZ)
    }
  } catch (error) {
    ElMessage.error('获取题目失败：' + error.message)
    // 使用备用题目
    questions.value = getRandomQuestions()
  }
}

// 在组件挂载时初始化题目
onMounted(async () => {
  await initQuestions()
})

// 计算当前问题
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

/**
 * 从题库中随机获取指定数量的题目
 */
function getRandomQuestions(): TestQuestion[] {
  const allQuestions: TestQuestion[] = [
    // 可以添加更多题目...
  ]

  return allQuestions.sort(() => 0.5 - Math.random()).slice(0, QUIZ_CONFIG.QUESTIONS_PER_QUIZ)
}

/**
 * 提交答案并处理结果
 */
function submitAnswer(): void {
  const question = currentQuestion.value

  if (!question.selectedAnswer) {
    ElMessage.warning('请选择答案后再提交')
    return
  }

  submitting.value = true
  question.result = checkAnswer(question)
  showDialog.value = true
}

/**
 * 检查答案是否正确
 */
function checkAnswer(question: TestQuestion): boolean {
  if (question.question_type === 'single') {
    return question.selectedAnswer === question.correct_answer
  } else {
    const selectedAnswers = Array.isArray(question.selectedAnswer)
      ? question.selectedAnswer
      : [question.selectedAnswer]
    const correctAnswers = Array.isArray(question.correct_answer)
      ? question.correct_answer
      : [question.correct_answer]

    return (
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every((answer) => correctAnswers.includes(answer))
    )
  }
}

/**
 * 重置测试
 */
async function resetQuiz(): Promise<void> {
  await initQuestions()
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
    totalScore.value += currentQuestion.value.score_value
  }
  showDialog.value = false
  currentQuestionIndex.value++
  submitting.value = false
}

// 添加移动端检测逻辑
const isMobile = computed(() => window.innerWidth < 640)

// 添加窗口大小变化监听
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  // 可以添加其他响应式处理逻辑
}
</script>

<style scoped>
/* 基础组件样式 */
:deep(.el-radio),
:deep(.el-checkbox) {
  @apply h-auto px-3 sm:px-4 py-2.5 sm:py-3 mb-0 rounded-lg;
  @apply transition-all duration-200 hover:bg-gray-50;
  @apply border-gray-200 hover:border-blue-400;
}

:deep(.el-radio.is-bordered.is-checked),
:deep(.el-checkbox.is-bordered.is-checked) {
  @apply border-blue-500 bg-blue-50/50 shadow-sm;
}

/* 按钮和标签样式 */
:deep(.el-button) {
  @apply rounded-lg font-medium transition-all duration-300;
  @apply hover:shadow-md active:shadow-sm disabled:opacity-50;
}

:deep(.el-button--primary) {
  @apply bg-gradient-to-r from-blue-500 to-indigo-500;
  @apply hover:from-blue-600 hover:to-indigo-600;
}

:deep(.el-tag) {
  @apply rounded-full font-medium text-xs sm:text-sm;
  @apply transform transition-all duration-200;
}

/* 容器样式 */
.question-container {
  @apply space-y-4 sm:space-y-6 animate-fadeIn;
}

/* 弹窗样式 */
.dialog-mobile {
  :deep(.el-dialog__header) {
    @apply p-3 border-b border-gray-100;
  }

  :deep(.el-dialog__body) {
    @apply p-3 max-h-[calc(100vh-120px)] overflow-y-auto;
  }

  :deep(.el-dialog__footer) {
    @apply p-3 border-t border-gray-100;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* 暗色主题 */
@media (prefers-color-scheme: dark) {
  :deep(.el-radio),
  :deep(.el-checkbox) {
    @apply hover:bg-gray-800 text-gray-200 border-gray-700;
  }

  :deep(.el-tag) {
    @apply bg-opacity-20;
  }

  .question-card {
    @apply bg-gray-800/90 border-gray-700/50;
  }
}

/* 响应式适配 */
@screen sm {
  .mobile-container {
    @apply max-w-lg mx-auto;
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  * {
    @apply transition-none transform-none animate-none;
  }
}
</style>
