<template>
  <div class="question-view p-6 max-w-2xl mx-auto">
    <el-card class="box-card hover:shadow-xl transition-shadow duration-300">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">在线测试</h1>

      <transition name="fade" mode="out-in">
        <div v-if="currentQuestionIndex < questions.length" class="question space-y-6">
          <!-- 问题标题 -->
          <div class="flex items-center gap-4">
            <el-tag v-if="false" size="large" type="primary" class="text-xl">
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
          :loading="submitting"
        >
          {{ submitting ? '提交中...' : '提交答案' }}
        </el-button>
        <el-button v-else type="success" @click="resetQuiz" size="large" class="w-40">
          重新测试
        </el-button>
      </div>
    </el-card>
    <el-dialog v-model="showDialog">
      <!-- 答案反馈 -->
      <div
        v-if="currentQuestion.result !== null"
        class="p-6 rounded-lg border"
        :class="[currentQuestion.result ? 'border-green-200' : 'border-red-200']"
      >
        <!-- 答题结果头部 -->
        <div class="flex items-center justify-between mb-4 pb-3 border-b">
          <div class="flex items-center gap-2">
            <el-icon :size="24" :class="currentQuestion.result ? 'text-green-500' : 'text-red-500'">
              <component :is="currentQuestion.result ? 'CircleCheckFilled' : 'CircleCloseFilled'" />
            </el-icon>
            <span
              class="text-lg font-bold"
              :class="currentQuestion.result ? 'text-green-600' : 'text-red-600'"
            >
              {{ currentQuestion.result ? '回答正确' : '回答错误' }}
            </span>
          </div>
          <el-tag :type="currentQuestion.result ? 'success' : 'danger'">
            得分：{{ currentQuestion.result ? currentQuestion.score : 0 }}
          </el-tag>
        </div>

        <!-- 答案详情区域 -->
        <div class="space-y-4">
          <!-- 答错时的详细信息 -->
          <template v-if="!currentQuestion.result">
            <div class="bg-white/60 rounded-lg p-4 space-y-3">
              <!-- 您的答案 -->
              <div class="answer-item">
                <div class="flex items-center gap-2 mb-1">
                  <el-icon class="text-red-500"><CloseBold /></el-icon>
                  <span class="font-medium">您的答案</span>
                </div>
                <div class="pl-6">
                  <el-tag
                    v-for="option in currentQuestion.selectedOptions"
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
                  <el-icon class="text-green-500"><Check /></el-icon>
                  <span class="font-medium">正确答案</span>
                </div>
                <div class="pl-6">
                  <el-tag
                    v-for="option in currentQuestion.correctAnswers"
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
                <el-icon class="text-blue-500"><InfoFilled /></el-icon>
                <span class="font-medium">详细解释</span>
              </div>
              <div class="pl-6 text-gray-700 leading-relaxed">
                {{ currentQuestion.explanation }}
              </div>
            </div>

            <!-- 提示信息 -->
            <div class="mt-4 text-gray-500 text-sm flex items-center gap-2">
              <el-icon><Warning /></el-icon>
              <span>仔细阅读解释，这将帮助你更好地理解题目。</span>
            </div>
          </template>

          <!-- 答对时的反馈 -->
          <template v-else>
            <div class="bg-white/60 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-2">
                <el-icon class="text-green-500"><InfoFilled /></el-icon>
                <span class="font-medium">知识要点</span>
              </div>
              <div class="pl-6 text-gray-700 leading-relaxed">
                {{ currentQuestion.explanation }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  CircleCheckFilled,
  CircleCloseFilled,
  Check,
  CloseBold,
  InfoFilled,
  Warning,
} from '@element-plus/icons-vue'
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
