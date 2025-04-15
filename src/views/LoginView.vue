<template>
  <div class="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- 背景装饰 -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-grid-slate-100 opacity-40"></div>
      <div
        class="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white/90"
      ></div>
    </div>

    <!-- 登录布局容器 -->
    <div class="relative w-full min-h-screen flex items-center justify-end pr-[15%]">
      <!-- 登录卡片区域 -->
      <div class="w-[420px] mx-4">
        <el-card class="backdrop-blur-sm bg-white/90 hover:shadow-xl transition-all duration-500">
          <template #header>
            <div class="text-center py-6">
              <div class="flex justify-center mb-6">
                <div class="p-4 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                  <el-icon
                    class="text-5xl text-blue-600 transform hover:rotate-180 transition-all duration-500"
                  >
                    <Platform />
                  </el-icon>
                </div>
              </div>
              <h2
                class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                SYSTEM
              </h2>
            </div>
          </template>

          <el-form :ref="'el-form'" :model="loginForm" :rules="rules" class="p-6 space-y-5">
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
                class="login-input"
                autocomplete="off"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                class="login-input"
                show-password
                autocomplete="off"
              />
            </el-form-item>

            <div class="flex items-center justify-between py-2 text-sm">
              <el-checkbox class="text-gray-600">记住密码</el-checkbox>
              <a href="#" class="text-blue-600 hover:text-blue-800 transition-colors">忘记密码？</a>
            </div>

            <el-form-item class="mt-4">
              <el-button
                type="primary"
                class="w-full h-11 text-base font-medium login-btn"
                :loading="loading"
                @click="handleLogin"
              >
                <template #icon>
                  <el-icon v-if="!loading" class="mr-1"><Right /></el-icon>
                  <el-icon v-else class="is-loading mr-1"><Loading /></el-icon>
                </template>
                {{ loading ? '登录中...' : '登 录' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { User, Lock, Right, Loading, Platform } from '@element-plus/icons-vue'
import { userApi } from '@/api'
import type { loginUser } from '@/api'

const router = useRouter()
const loading = ref(false)
const formRef = useTemplateRef<FormInstance>('el-form')

// 登录表单 - 设置默认值
const loginForm = reactive<loginUser>({
  username: 'admin', // 默认用户名
  password: '123456', // 默认密码
})

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 模拟用户数据
const MOCK_USER = {
  username: 'admin',
  password: '123456',
}

// 处理登录
async function handleLogin() {
  if (!formRef.value) return

  await formRef.value.validate()
  loading.value = true

  try {
    // 模拟登录请求
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    let { data } = await userApi.login(loginForm)

    // if (loginForm.username === MOCK_USER.username && loginForm.password === MOCK_USER.password)
    if (data.authentication) {
      // 存储登录状态
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify({ username: loginForm.username }))

      ElMessage.success('登录成功')
      localStorage.setItem('token', data.token) // 存储 token
      router.push('/')
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    ElMessage.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-grid-slate-100 {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
}

.login-input :deep(.el-input__wrapper) {
  @apply bg-white/70 border border-gray-200 rounded-lg shadow-sm transition-all duration-300;
  height: 44px;
}

.login-input :deep(.el-input__wrapper:hover) {
  @apply border-blue-400 bg-white shadow;
}

.login-input :deep(.el-input__wrapper.is-focus) {
  @apply border-blue-500 ring-2 ring-blue-500/20 bg-white;
}

.login-btn {
  @apply !bg-gradient-to-r from-blue-600 to-indigo-600 
         hover:from-blue-700 hover:to-indigo-700 
         shadow-md hover:shadow-lg hover:scale-[1.02]
         border-0 rounded-lg
         transition-all duration-300 !important;
}

.is-loading {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
