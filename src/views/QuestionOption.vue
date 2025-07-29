<template>
  <div class="option-card">
    <div class="option-title">请选择科目</div>
    <el-select v-model="obj" placeholder="请选择科目" size="large" class="option-select">
      <el-option v-for="item in tytpearr" :key="item" :label="item" :value="item" />
    </el-select>
    <el-button type="primary" class="option-btn" @click="chen">确认</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

let obj = ref()

let tytpearr = ['数学', '语文', '英语', '物理']

let chen = () => {
  console.log(obj.value)

  router.push({
    name: 'QuestionViewTest',
    query: {
      name: obj.value,
      anonymous: 'true',
    },
  })
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
