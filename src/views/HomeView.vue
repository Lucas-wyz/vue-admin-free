<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 统计数据
const statistics = ref([
  { title: '总访问量', value: '8,846', increase: '13%', icon: 'View', color: '#409EFF' },
  { title: '新增用户', value: '1,234', increase: '25%', icon: 'User', color: '#67C23A' },
  { title: '订单数量', value: '9,280', increase: '20%', icon: 'ShoppingCart', color: '#E6A23C' },
  { title: '营业额', value: '￥126,560', increase: '15%', icon: 'Money', color: '#F56C6C' },
])

// 实时活动数据
const activities = ref([
  { user: '张三', action: '新建了订单 #1234', time: '10分钟前', type: 'success' },
  { user: '李四', action: '完成了任务 "系统升级"', time: '30分钟前', type: 'primary' },
  { user: '王五', action: '提交了 Bug 反馈', time: '1小时前', type: 'warning' },
  { user: '赵六', action: '更新了产品信息', time: '2小时前', type: 'info' },
])

// 待办事项
const todos = ref([
  { title: '完成首页开发', progress: 80, priority: 'high' },
  { title: '处理用户反馈', progress: 45, priority: 'medium' },
  { title: '系统性能优化', progress: 30, priority: 'low' },
])

// 销售数据
const salesData = ref({
  days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  values: [150, 230, 224, 218, 135, 147, 260],
  visits: [88, 120, 136, 150, 120, 132, 180],
})

// 销售地区数据
const regionData = ref([
  { value: 1048, name: '华东地区' },
  { value: 735, name: '华南地区' },
  { value: 580, name: '华北地区' },
  { value: 484, name: '西南地区' },
  { value: 300, name: '西北地区' },
])

// 产品分类数据
const productData = ref([
  { name: '电子产品', value: 320, increase: '12%' },
  { name: '服装服饰', value: 280, increase: '8%' },
  { name: '食品饮料', value: 250, increase: '15%' },
  { name: '家居用品', value: 220, increase: '20%' },
  { name: '美妆护理', value: 190, increase: '5%' },
])

// 热门商品数据
const hotProducts = ref([
  { name: 'iPhone 15', sales: 1234, trend: '+12%' },
  { name: '华为 Mate 60', sales: 998, trend: '+25%' },
  { name: '小米手环', sales: 856, trend: '+8%' },
  { name: 'MacBook Pro', sales: 666, trend: '+15%' },
])

// 定时器引用
let timer: number | null = null

// 随机更新数据
const updateRandomData = () => {
  statistics.value.forEach((stat) => {
    const randomIncrease = Math.floor(Math.random() * 5) + 1
    stat.increase = `${randomIncrease}%`
  })

  salesData.value.values = salesData.value.values.map(() => Math.floor(Math.random() * 200) + 100)
  salesData.value.visits = salesData.value.visits.map(() => Math.floor(Math.random() * 100) + 80)

  // 更新地区数据
  regionData.value = regionData.value.map((item) => ({
    ...item,
    value: Math.floor(Math.random() * 1000) + 300,
  }))

  // 更新产品数据
  productData.value = productData.value.map((item) => ({
    ...item,
    value: Math.floor(Math.random() * 300) + 150,
    increase: `${Math.floor(Math.random() * 20) + 5}%`,
  }))

  initCharts() // 重新渲染图表
}

// 初始化图表
const initCharts = () => {
  const salesChart = echarts.init(document.getElementById('salesChart'))
  salesChart.setOption({
    title: { text: '销售趋势' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['销售额', '访问量'],
    },
    xAxis: {
      type: 'category',
      data: salesData.value.days,
    },
    yAxis: [
      { type: 'value', name: '销售额' },
      { type: 'value', name: '访问量' },
    ],
    series: [
      {
        name: '销售额',
        type: 'bar',
        data: salesData.value.values,
      },
      {
        name: '访问量',
        type: 'line',
        yAxisIndex: 1,
        data: salesData.value.visits,
      },
    ],
  })

  // 地区分布饼图
  const regionChart = echarts.init(document.getElementById('regionChart'))
  regionChart.setOption({
    title: { text: '销售地区分布' },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
    },
    series: [
      {
        name: '销售额',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        data: regionData.value,
      },
    ],
  })

  // 产品分类柱状图
  const productChart = echarts.init(document.getElementById('productChart'))
  productChart.setOption({
    title: { text: '产品分类销售' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: productData.value.map((item) => item.name),
    },
    series: [
      {
        type: 'bar',
        data: productData.value.map((item) => item.value),
        label: {
          show: true,
          position: 'right',
        },
      },
    ],
  })
}

onMounted(() => {
  initCharts()
  // 每30秒更新一次数据
  timer = setInterval(updateRandomData, 30000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="home-view">
    <h1>工作台</h1>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics">
      <el-col :span="6" v-for="item in statistics" :key="item.title">
        <el-card shadow="hover" class="stat-card">
          <el-icon><component :is="item.icon" /></el-icon>
          <div class="stat-info">
            <div class="stat-title">{{ item.title }}</div>
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-increase">同比增长 {{ item.increase }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表和活动区域 -->
    <el-row :gutter="20" class="charts">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>销售趋势分析</span>
              <el-button type="primary" size="small" @click="updateRandomData">
                刷新数据
              </el-button>
            </div>
          </template>
          <div id="salesChart" style="height: 350px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="activity-card">
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
              <el-tag size="small">实时</el-tag>
            </div>
          </template>
          <div class="activity-list">
            <div v-for="(activity, index) in activities" :key="index" class="activity-item">
              <el-tag size="small" :type="activity.type" class="activity-tag">
                {{ activity.user }}
              </el-tag>
              <span class="activity-action">{{ activity.action }}</span>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </el-card>

        <!-- 待办事项 -->
        <el-card class="todo-card">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
            </div>
          </template>
          <div class="todo-list">
            <div v-for="(todo, index) in todos" :key="index" class="todo-item">
              <div class="todo-info">
                <span class="todo-title">{{ todo.title }}</span>
                <el-tag
                  size="small"
                  :type="
                    todo.priority === 'high'
                      ? 'danger'
                      : todo.priority === 'medium'
                        ? 'warning'
                        : 'info'
                  "
                >
                  {{ todo.priority }}
                </el-tag>
              </div>
              <el-progress
                :percentage="todo.progress"
                :status="todo.progress === 100 ? 'success' : ''"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增图表区域 -->
    <el-row :gutter="20" class="charts">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>地区分布</span>
            </div>
          </template>
          <div id="regionChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>产品分类</span>
            </div>
          </template>
          <div id="productChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 热门商品榜单 -->
    <el-row>
      <el-col :span="24">
        <el-card class="hot-products">
          <template #header>
            <div class="card-header">
              <span>热门商品榜</span>
            </div>
          </template>
          <el-table :data="hotProducts" style="width: 100%">
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="sales" label="销量" />
            <el-table-column prop="trend" label="环比">
              <template #default="scope">
                <span :class="scope.row.trend.includes('+') ? 'text-success' : 'text-danger'">
                  {{ scope.row.trend }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home-view {
  padding: 20px;
}

.statistics {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-info {
  margin-left: 15px;
}

.stat-title {
  font-size: 14px;
  color: #909399;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 5px 0;
}

.stat-increase {
  font-size: 12px;
  color: #67c23a;
}

.chart-card,
.activity-card {
  margin-bottom: 20px;
}

.activity-list {
  .activity-item {
    padding: 12px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  .activity-user {
    font-weight: bold;
    margin-right: 8px;
  }

  .activity-time {
    float: right;
    color: #909399;
    font-size: 12px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-card {
  margin-top: 20px;
}

.todo-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.todo-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.todo-title {
  font-size: 14px;
}

.activity-tag {
  margin-right: 8px;
}

.stat-card:hover {
  transform: translateY(-2px);
  transition: all 0.3s;
}

.hot-products {
  margin-top: 20px;
}

.text-success {
  color: #67c23a;
}

.text-danger {
  color: #f56c6c;
}
</style>
