<template>
  <div class="error-page">
    <el-result icon="warning" title="404" sub-title="抱歉，请求的页面不存在">
      <template #extra>
        <el-button type="primary" @click="router.push('/')">返回首页 ({{ countdown }})</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const countdown = ref(5)

const startCountdown = () => {
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(interval)
      router.push('/')
    }
  }, 1000)
}

onMounted(() => {
  startCountdown()
})
</script>

<style scoped>
.error-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
