<template>
  <div class="option-card">
    <!-- <div class="option-title">请选择科目</div> -->
    <!-- <el-select v-model="obj" placeholder="输入名字" size="large" class="option-select">
      <el-option v-for="item in tytpearr" :key="item" :label="item" :value="item" />
    </el-select> -->

    <el-input v-model="obj" placeholder="输入名字" size="large" />
    <el-button type="primary" class="option-btn" @click="chen">确认</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useRouter, useRoute } from 'vue-router'
import { userApi } from '@/api'
import type { loginUser } from '@/api'
const router = useRouter()
const route = useRoute()

let obj = ref<string>('')

let chen = async () => {
  let { code, data } = await userApi.loginAnonymousJwt({
    username: obj.value,
    password: '',
    account: '',
  })

  if ((code = 200)) {
    localStorage.setItem('token', data.token)
    router.push({
      name: 'QuestionOption',
      query: {
        name: obj.value,
      },
    })
  }
}
</script>

<style scoped>
.option-card {
  min-height: 320px;
  width: 100%;
  max-width: 380px;
  margin: 60px auto 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.06);
  padding: 32px 28px 28px 28px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 28px;
  justify-content: center;
}
.option-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 8px;
}
.option-select {
  width: 100%;
}
.option-btn {
  width: 100%;
  height: 44px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 10px;
  transition: transform 0.2s;
}
.option-btn:active {
  transform: scale(0.98);
}

@media (max-width: 600px) {
  .option-card {
    max-width: 98vw;
    padding: 18px 6vw 18px 6vw;
    margin: 24px auto 0 auto;
    gap: 18px;
  }
  .option-title {
    font-size: 1rem;
  }
  .option-btn {
    font-size: 0.95rem;
    height: 40px;
  }
}
</style>
