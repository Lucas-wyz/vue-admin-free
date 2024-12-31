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
            <p class="text-lg font-semibold text-gray-700">{{ currentQuestion.text }}</p>
          </div>

          <!-- 选项 -->
          <div class="space-y-3 pl-4">
            <el-radio-group v-model="currentQuestion.selectedOptions" class="flex flex-col gap-3">
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

<script setup>
import { ref, computed } from 'vue'
import { ElCard, ElRadio, ElButton, ElProgress, ElTag, ElResult } from 'element-plus'

const questions = ref(getRandomQuestions())
const currentQuestionIndex = ref(0)
const totalScore = ref(0) // 修复 totalScore 初始值为 null 的问题

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

function getRandomQuestions() {
  const allQuestions = [
    {
      text: '中国的首都是哪里？',
      options: ['北京', '上海', '广州', '深圳'],
      correctAnswers: ['北京'],
      explanation: '中国的首都是北京。',
      selectedOptions: [],
      result: null,
      score: 10,
    },
    {
      text: '2 + 2 等于多少？',
      options: ['3', '4', '5', '6'],
      correctAnswers: ['4'],
      explanation: '2 + 2 等于 4。',
      selectedOptions: [],
      result: null,
      score: 10,
    },
    {
      text: '太阳系的中心是什么？',
      options: ['地球', '月球', '太阳', '火星'],
      correctAnswers: ['太阳'],
      explanation: '太阳系的中心是太阳。',
      selectedOptions: [],
      result: null,
      score: 10,
    },
    {
      text: '水的化学式是什么？',
      options: ['H2O', 'CO2', 'O2', 'H2'],
      correctAnswers: ['H2O'],
      explanation: '水的化学式是 H2O。',
      selectedOptions: [],
      result: null,
      score: 10,
    },
    // 添加更多中文问题
  ]
  return allQuestions.sort(() => 0.5 - Math.random()).slice(0, 4)
}

function submitAnswer() {
  const question = currentQuestion.value
  question.result = checkAnswer(question)
  if (question.result) {
    totalScore.value += question.score
  }
  currentQuestionIndex.value++
}

function checkAnswer(question) {
  return (
    question.selectedOptions.length === question.correctAnswers.length &&
    question.selectedOptions.every((opt) => question.correctAnswers.includes(opt))
  )
}

function resetQuiz() {
  questions.value = getRandomQuestions()
  currentQuestionIndex.value = 0
  totalScore.value = 0
}

const format = (percentage) => `进度 ${percentage}%`

function getResultMessage(score) {
  if (score >= questions.value.length * 10) return '太棒了！满分通过！'
  if (score >= questions.value.length * 7) return '不错的表现！'
  if (score >= questions.value.length * 6) return '还需要继续努力！'
  return '加油，继续学习！'
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.el-radio) {
  height: auto;
  padding: 12px 20px;
}

:deep(.el-radio.is-bordered.is-checked) {
  border-color: rgb(59, 130, 246);
  background-color: rgb(239, 246, 255);
}

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
