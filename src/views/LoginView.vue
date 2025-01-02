<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500"
  >
    <el-card
      class="w-[420px] shadow-2xl hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-lg"
    >
      <template #header>
        <div class="text-center p-4">
          <div class="flex justify-center mb-4">
            <el-icon class="text-4xl text-primary animate-bounce"><Platform /></el-icon>
          </div>
          <h2 class="text-2xl font-bold text-gray-700">系统登录</h2>
          <p class="text-gray-500 text-sm mt-2">欢迎使用在线测试系统</p>
        </div>
      </template>

      <el-form ref="formRef" :model="loginForm" :rules="rules" class="p-4 space-y-6">
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <div class="relative w-full">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              class="h-11 w-full"
              autocomplete="off"
            >
              <!-- <template #prefix>
                <div class="flex items-center h-full text-gray-400">
                  <el-icon class="text-lg"><User /></el-icon>
                </div>
              </template> -->
            </el-input>
          </div>
        </el-form-item>

        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <div class="relative w-full">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              class="h-11 w-full"
              show-password
              autocomplete="off"
            >
              <!-- <template #prefix>
                <div class="flex items-center h-full text-gray-400">
                  <el-icon class="text-lg"><Lock /></el-icon>
                </div>
              </template> -->
            </el-input>
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            class="w-full h-11 text-base bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            :loading="loading"
            @click="handleLogin"
          >
            <template #icon>
              <el-icon v-if="!loading"><Right /></el-icon>
              <el-icon v-else class="is-loading"><Loading /></el-icon>
            </template>
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Right, Loading, Platform } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const formRef = ref()

// 登录表单 - 设置默认值
const loginForm = reactive({
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
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (loginForm.username === MOCK_USER.username && loginForm.password === MOCK_USER.password) {
      // 存储登录状态
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify({ username: loginForm.username }))

      ElMessage.success('登录成功')
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
:deep(.el-input__wrapper) {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
  background-color: #f9fafb;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff !important;
  background-color: white;
}

:deep(.el-input__wrapper:hover) {
  background-color: white;
}

:deep(.el-button--primary) {
  border: none;
  font-weight: 500;
}

:deep(.el-card) {
  border: none;
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
