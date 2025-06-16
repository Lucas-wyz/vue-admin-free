<template>
  <div
    class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 flex items-center justify-center"
  >
    <div v-if="opet" class="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-6 space-y-6">
      <!-- 题目类型标签 -->
      <div class="flex justify-between items-center">
        <el-tag
          class="text-sm px-3 py-1 rounded-full transition-all duration-300"
          :type="opet.question_type === 'single' ? 'primary' : 'success'"
          effect="light"
        >
          {{ opet.question_type === 'single' ? '单选题' : '多选题' }}
        </el-tag>
        <el-tag v-if="route.query.name">{{ route.query.name }}</el-tag>
        <span class="text-gray-400 text-sm">题目 #{{ opet.id }}</span>
      </div>

      <!-- 题目标题 -->
      <div class="space-y-4">
        <h2 class="text-lg md:text-xl font-medium text-gray-900 leading-relaxed">
          {{ opet.question_title }}
        </h2>
      </div>

      <!-- 选项列表 -->
      <div class="grid gap-3">
        <button
          v-for="(opt, index) in opet.options"
          :key="index"
          @click="() => toggleOption(opt)"
          class="w-full text-left p-4 rounded-lg transition-all duration-200 border-2"
          :class="[
            opt.correct
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300',
          ]"
        >
          <div class="flex items-center space-x-3">
            <span
              class="w-6 h-6 flex items-center justify-center rounded-full text-sm"
              :class="opt.correct ? 'bg-blue-500 text-white' : 'bg-gray-100'"
            >
              {{ String.fromCharCode(65 + index) }}
            </span>
            <span>{{ opt.option_text }}</span>
          </div>
        </button>
      </div>

      <!-- 提交按钮 -->
      <el-button
        @click="submitAnswer"
        type="primary"
        class="w-full h-12 text-base font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        提交答案
      </el-button>
    </div>

    <!-- 加载状态 -->
    <div v-else class="flex justify-center items-center min-h-[200px]">
      <el-loading />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { Question } from '@/api/types/question'
import { questionApi } from '@/api'
import { useRoute } from 'vue-router'

const route = useRoute()


const opet = ref<Question | null>(null)

// 切换选项
const toggleOption = (opt: any) => {
  if (opet.value?.question_type === 'single') {
    // 单选题逻辑：取消其他选项
    opet.value.options.forEach((o) => (o.correct = false))
  }
  opt.correct = !opt.correct
}

// 获取题目
const fetchQuestion = async () => {
  try {
    const { data } = await questionApi.getRandom({ category_name: route.query.name })
    opet.value = data
  } catch (error) {
    ElMessage.error('获取题目失败')
  }
}

// 提交答案
const submitAnswer = async () => {
  if (!opet.value) return

  // 验证是否已选择答案
  const hasSelected = opet.value.options.some((opt) => opt.correct)
  if (!hasSelected) {
    ElMessage.warning('请先选择答案')
    return
  }

  try {
    const { data } = await questionApi.verify(String(opet.value.id), { ...opet.value })

    ElMessage({
      message: data ? '答案正确！' : '答案错误，请重试',
      type: data ? 'success' : 'error',
      duration: 2000,
    })

    if (data) {
      // 答对后延迟获取下一题
      setTimeout(fetchQuestion, 1500)
    }
  } catch (error) {
    ElMessage.error('提交失败，请重试')
  }
}

// 初始化加载题目
fetchQuestion()
</script>

<style scoped>
.el-button {
  @apply shadow-sm;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .el-button {
    @apply text-sm py-2;
  }

  button {
    @apply p-3;
  }
}

/* 添加过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
