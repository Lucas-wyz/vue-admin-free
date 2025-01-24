<template>
  <div class="register-page">
    <!-- 背景装饰 -->
    <div class="register-bg">
      <div class="bg-pattern"></div>
      <div class="bg-gradient"></div>
    </div>

    <!-- 注册布局容器 -->
    <div class="register-container">
      <div class="register-card-wrapper">
        <el-card class="register-card">
          <template #header>
            <div class="card-header">
              <h2 class="card-title">用户注册</h2>
            </div>
          </template>

          <el-form
            :model="form"
            :rules="rules"
            ref="formRef"
            label-position="top"
            class="register-form"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" :prefix-icon="Message" />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="form.confirmPassword"
                type="password"
                placeholder="请确认密码"
                :prefix-icon="Lock"
                show-password
              />
            </el-form-item>

            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" :prefix-icon="Phone" />
            </el-form-item>

            <div class="form-actions">
              <el-button type="primary" class="submit-btn" :loading="loading" @click="handleSubmit">
                {{ loading ? '注册中...' : '立即注册' }}
              </el-button>
              <el-button class="reset-btn" @click="resetForm"> 重置 </el-button>
            </div>

            <div class="login-link">
              已有账号？
              <router-link to="/login">立即登录</router-link>
            </div>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, Phone } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)

// 注册表单数据（包含默认值）
const form = reactive({
  username: 'test_user',
  email: 'test@example.com',
  password: '123456',
  confirmPassword: '123456',
  phone: '13800138000',
})

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] },
  ],
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    // 模拟注册请求
    await new Promise((resolve) => setTimeout(resolve, 1000))

    ElMessage.success('注册成功！')
    router.push('/login')
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入')
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}
</script>

<style scoped>
.register-page {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom right, #ebf8ff, #e0e7ff);
}

.register-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bg-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-size: 32px 32px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.04)'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.9)
  );
}

.register-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  scroll-behavior: smooth;
}

.register-card-wrapper {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.register-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.5s;
}

.register-card:hover {
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  transform: scale(1.01);
}

.card-header {
  text-align: center;
  padding: 2rem 1.5rem;
}

.card-title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  -webkit-background-clip: text;
  color: transparent;
}

.register-form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.submit-btn {
  flex: 1;
  height: 3rem;
  font-size: 1.125rem;
  font-weight: 500;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.submit-btn:hover {
  background: linear-gradient(to right, #1d4ed8, #4338ca);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
}

.submit-btn:active {
  transform: scale(0.95);
}

.reset-btn {
  flex: 1;
  height: 3rem;
  font-size: 1.125rem;
  font-weight: 500;
  background: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background: #e5e7eb;
}

.login-link {
  text-align: center;
  margin-top: 2rem;
  font-size: 1rem;
  color: #4b5563;
}

.login-link a {
  color: #2563eb;
  font-weight: 500;
  margin-left: 0.25rem;
  text-decoration: none;
  transition: color 0.3s;
}

.login-link a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.el-form-item__label {
  font-weight: 500;
  color: #4b5563;
  font-size: 1rem;
  padding-bottom: 0.25rem;
}

.el-input__wrapper {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  height: 3rem;
}

.el-input__wrapper:hover {
  border-color: #2563eb;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-input__wrapper.is-focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  background: #fff;
}

.el-input__inner {
  font-size: 1rem;
}

.el-form-item__error {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  color: #f87171;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .register-card {
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 2rem;
  }

  .register-form {
    padding: 1.5rem;
    gap: 1.25rem;
  }

  .form-actions {
    margin-top: 2rem;
  }

  .submit-btn,
  .reset-btn {
    height: 2.75rem;
    font-size: 1rem;
  }

  .el-input__wrapper {
    height: 2.75rem;
  }

  .el-form-item__label {
    font-size: 0.875rem;
    padding-bottom: 0.125rem;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .register-page {
    background: linear-gradient(to bottom right, #1f2937, #111827);
  }

  .register-card {
    background: rgba(31, 41, 55, 0.9);
  }

  .card-title {
    background: linear-gradient(to right, #3b82f6, #6366f1);
  }

  .el-input__wrapper {
    background: rgba(55, 65, 81, 0.7);
    border-color: #4b5563;
  }

  .login-link {
    color: #9ca3af;
  }

  .login-link a {
    color: #3b82f6;
  }

  .login-link a:hover {
    color: #2563eb;
  }
}
</style>
