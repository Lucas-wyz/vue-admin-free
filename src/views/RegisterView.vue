<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 flex items-center justify-center"
  >
    <el-card
      class="w-full max-w-md !border-none shadow-lg sm:shadow-xl transition-shadow duration-300"
    >
      <template #header>
        <h2
          class="text-lg sm:text-xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          临时注册
        </h2>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="space-y-4 sm:space-y-6"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" :prefix-icon="User" clearable />
        </el-form-item>

        <div class="flex gap-3 sm:gap-4 mt-6">
          <el-button
            type="primary"
            :loading="loading"
            class="flex-1 !h-10 sm:!h-11 !text-sm sm:!text-base !bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            @click="handleSubmit"
          >
            {{ loading ? '注册中...' : '注册' }}
          </el-button>
          <el-button
            type="default"
            class="flex-1 !h-10 sm:!h-11 !text-sm sm:!text-base"
            @click="resetForm"
          >
            重置
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, School } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

interface FormData {
  name: string
}

let router = useRouter()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = ref<FormData>({
  name: '',
})

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, message: '姓名至少2个字符', trigger: 'blur' },
  ],
}

const handleSubmit = async () => {
  console.log(formRef.value)
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟注册请求
      setTimeout(() => {
        ElMessage.success('注册成功！')
        loading.value = false
        // 存储用户信息到 localStorage
        localStorage.setItem('userInfo', JSON.stringify(form.value))
        router.push({ name: 'QuestionView' })
        resetForm()
      }, 1000)
    }
  })
}

const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}
</script>

<style scoped>
:deep(.el-form-item__label) {
  @apply font-medium text-gray-600 text-sm sm:text-base pb-1;
}

:deep(.el-input__wrapper) {
  @apply shadow-none border border-gray-200 hover:border-blue-400 focus:border-blue-500 !h-10 sm:!h-11;
}

:deep(.el-input__inner) {
  @apply text-sm sm:text-base;
}

:deep(.el-button) {
  @apply rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300;
}

:deep(.el-form-item__error) {
  @apply text-xs sm:text-sm mt-1;
}
</style>
