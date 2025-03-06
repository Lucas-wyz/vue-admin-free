<template>
  <div class="question-page">
    <h1>题目页面</h1>
    <el-button @click="addQuestion" type="primary" style="margin-bottom: 20px">添加题目</el-button>
    <el-card class="question-card" v-for="(question, index) in questions1" :key="question.id">
      <h2>{{ question.question_title }}</h2>
      <template v-if="question.question_type === 'single'">
        <el-radio-group v-model="selectedAnswers[index]">
          <el-radio
            v-for="(option, idx) in question.options"
            :key="idx"
            :label="option.option_value"
            :value="option.option_value"
          >
            {{ option.option_text }}
          </el-radio>
        </el-radio-group>
      </template>
      <template v-else-if="question.question_type === 'multiple'">
        <el-checkbox-group v-model="selectedAnswers[index]">
          <el-checkbox
            v-for="(option, idx) in question.options"
            :key="idx"
            :label="option.option_value"
            :value="option.option_value"
          >
            {{ option.option_text }}
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <p>正确答案: {{ question.correct_answer }}</p>
      <p>解释: {{ question.explanation_text }}</p>
      <el-tag
        size="small"
        :type="
          question.difficulty_level === 'easy'
            ? 'success'
            : question.difficulty_level === 'medium'
              ? 'warning'
              : 'danger'
        "
      >
        {{ question.difficulty_level }}
      </el-tag>
      <el-tag size="small" type="info" style="margin-left: 10px">{{
        question.category_name
      }}</el-tag>
      <el-tag v-for="tag in question.tag_names" :key="tag" size="small" style="margin-left: 5px">{{
        tag
      }}</el-tag>
      <el-button @click="viewDetails(index)" type="primary" :loading="loading">查看详情</el-button>
      <el-button @click="editQuestion(index)" type="primary" plain :loading="loading"
        >编辑</el-button
      >
      <el-button @click="deleteQuestion(index)" type="danger" :loading="loading">删除</el-button>
    </el-card>
    <el-dialog
      v-model="editDialogVisible"
      title="编辑题目"
      width="50%"
      :before-close="handleDialogClose"
    >
      <el-form :model="currentQuestion" label-width="100px">
        <el-form-item label="题目类型">
          <el-select v-model="currentQuestion.question_type">
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目标题">
          <el-input v-model="currentQuestion.question_title" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="选项">
          <div v-for="(option, index) in currentQuestion.options" :key="index" class="option-item">
            <el-input v-model="option.option_text" placeholder="选项内容" style="width: 60%" />
            <el-input
              v-model="option.option_value"
              placeholder="选项值"
              style="width: 20%; margin: 0 10px"
            />
            <el-button type="danger" @click="removeOption(index)">删除</el-button>
          </div>
          <el-button type="primary" @click="addOption">添加选项</el-button>
        </el-form-item>
        <el-form-item label="正确答案">
          <template v-if="currentQuestion.question_type === 'single'">
            <el-select v-model="currentQuestion.correct_answer">
              <el-option
                v-for="option in currentQuestion.options"
                :key="option.option_value"
                :label="option.option_text"
                :value="option.option_value"
              />
            </el-select>
          </template>
          <template v-else>
            <el-select v-model="currentQuestion.correct_answer" multiple>
              <el-option
                v-for="option in currentQuestion.options"
                :key="option.option_value"
                :label="option.option_text"
                :value="option.option_value"
              />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="解释说明">
          <el-input v-model="currentQuestion.explanation_text" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogClose" :disabled="submitLoading">取消</el-button>
        <el-button type="primary" @click="saveEdit" :loading="submitLoading">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加查看详情对话框 -->
    <!-- <el-dialog v-model="detailsDialogVisible" title="题目详情">
      <div v-if="currentQuestion" class="question-details">
        <h3>题目标题</h3>
        <p>{{ currentQuestion.question_title }}</p>

        <h3>题目类型</h3>
        <p>{{ currentQuestion.question_type === 'single' ? '单选题' : '多选题' }}</p>

        <h3>选项</h3>
        <ul>
          <li v-for="(option, idx) in currentQuestion.options" :key="idx">
            {{ option.option_text }} ({{ option.option_value }})
          </li>
        </ul>

        <h3>正确答案</h3>
        <p>{{ currentQuestion.correct_answer }}</p>

        <h3>解释说明</h3>
        <p>{{ currentQuestion.explanation_text }}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailsDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Question, Option } from '@/api'
import { questionApi } from '@/api'

// 定义新的类型接口

const questions1 = ref<Question[]>([])

onMounted(async () => {
  // const response = await questionApi.getQuestionList()
  // console.log({ response })
  // questions1.value = response.data
})

// 定义题目的选择状态
const selectedAnswers = ref<(string | number | (string | number)[])[]>([])

// 更新模拟数据
questions1.value = [
  {
    id: 1,
    question_type: 'single',
    question_title: 'JavaScript 中，以下哪个是正确的变量声明方式？',
    options: [
      {
        id: 1,
        question_id: 1,
        option_text: 'var myVar;',
        option_value: 1,
        sort_order: 1,
        is_active: true,
      },
      {
        id: 2,
        question_id: 1,
        option_text: 'let myVar;',
        option_value: 2,
        sort_order: 2,
        is_active: true,
      },
      {
        id: 3,
        question_id: 1,
        option_text: 'const myVar;',
        option_value: 3,
        sort_order: 3,
        is_active: true,
      },
      {
        id: 4,
        question_id: 1,
        option_text: '以上都是',
        option_value: 4,
        sort_order: 4,
        is_active: true,
      },
    ],
    correct_answer: 4,
    explanation_text: '在 JavaScript 中，var、let 和 const 都可以用来声明变量。',
    difficulty_level: 'easy',
    category_id: 1,
    category_name: 'JavaScript',
    tag_ids: [1, 2],
    tag_names: ['变量声明', '基础语法'],
    is_active: true,
    score_value: 2,
  },
  {
    id: 2,
    question_type: 'multiple',
    question_title: '以下哪些是 JavaScript 中的基本数据类型？',
    options: [
      {
        id: 5,
        question_id: 2,
        option_text: 'String',
        option_value: 1,
        sort_order: 1,
        is_active: true,
      },
      {
        id: 6,
        question_id: 2,
        option_text: 'Number',
        option_value: 2,
        sort_order: 2,
        is_active: true,
      },
      {
        id: 7,
        question_id: 2,
        option_text: 'Boolean',
        option_value: 3,
        sort_order: 3,
        is_active: true,
      },
      {
        id: 8,
        question_id: 2,
        option_text: 'Object',
        option_value: 4,
        sort_order: 4,
        is_active: true,
      },
    ],
    correct_answer: [1, 2, 3],
    explanation_text: 'JavaScript 中的基本数据类型包括 String、Number 和 Boolean。',
    difficulty_level: 'medium',
    category_id: 1,
    category_name: 'JavaScript',
    tag_ids: [1, 2],
    tag_names: ['数据类型', '基础概念'],
    is_active: true,
    score_value: 3,
  },
]

onMounted(async () => {
  const response = await questionApi.getQuestionList()
  questions1.value = response.data
})

const editDialogVisible = ref(false)
const currentQuestion = ref<Question | null>(null)
const currentIndex = ref<number | null>(null)

const editQuestion = (index: number) => {
  currentQuestion.value = { ...questions1.value[index] }
  currentIndex.value = index
  editDialogVisible.value = true
}

const saveEdit = async () => {
  if (!currentQuestion.value || currentIndex.value === null) return

  if (!currentQuestion.value.question_title.trim()) {
    ElMessage.warning('请填写题目标题')
    return
  }

  if (currentQuestion.value.options.length < 2) {
    ElMessage.warning('至少需要添加两个选项')
    return
  }

  if (currentQuestion.value.options.some((opt) => !opt.option_text.trim())) {
    ElMessage.warning('选项内容不能为空')
    return
  }

  try {
    submitLoading.value = true
    // 这里可以添加调用更新API的代码
    // await questionApi.updateQuestion(currentQuestion.value)
    // questions1.value[currentIndex.value] = { ...currentQuestion.value }
    if (!currentQuestion.value?.id) {
      questions1.value.push({ ...currentQuestion.value })
    } else {
      if (!currentQuestion.value || currentIndex.value === null) return

      console.log({ a: '修改', a1: currentQuestion.value })
    questions1.value[currentIndex.value] = { ...currentQuestion.value }
    }

    ElMessage.success('保存成功')
    handleDialogClose()
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    submitLoading.value = false
  }
}

const deleteQuestion = async (index: number) => {
  try {
    await ElMessageBox.confirm('确认删除这道题目吗？删除后将无法恢复', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    loading.value = true
    // 这里可以添加调用删除API的代码
    // await questionApi.deleteQuestion(questions1.value[index].id)
    questions1.value.splice(index, 1)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + error.message)
    }
  } finally {
    loading.value = false
  }
}

const detailsDialogVisible = ref(false)

// 查看详情方法
const viewDetails = (index: number) => {
  try {
    currentQuestion.value = { ...questions1.value[index] }
    detailsDialogVisible.value = true
  } catch (error) {
    ElMessage.error('加载详情失败：' + error.message)
  }
}

// 添加选项
const addOption = () => {
  if (!currentQuestion.value) return
  if (currentQuestion.value.options.length >= 6) {
    ElMessage.warning('最多只能添加6个选项')
    return
  }
  const newOption: Option = {
    id: Date.now(), // 临时ID
    question_id: currentQuestion.value.id,
    option_text: '',
    option_value: currentQuestion.value.options.length + 1,
    sort_order: currentQuestion.value.options.length + 1,
    is_active: true,
  }
  currentQuestion.value.options.push(newOption)
}

// 删除选项
const removeOption = (index: number) => {
  if (!currentQuestion.value) return
  if (currentQuestion.value.options.length <= 2) {
    ElMessage.warning('至少需要保留两个选项')
    return
  }
  currentQuestion.value.options.splice(index, 1)
}

// 添加题目
const addQuestion = () => {
  editDialogVisible.value = true
  currentQuestion.value = {
    options: [],
  }
}

// 对话框关闭处理
const handleDialogClose = () => {
  editDialogVisible.value = false
  currentQuestion.value = null
  currentIndex.value = null
}

const loading = ref(false)
const submitLoading = ref(false)
</script>

<style scoped>
.question-page {
  padding: 20px;
}
.question-card {
  margin-bottom: 20px;
}
.question-details h3 {
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
}
.question-details ul {
  list-style: none;
  padding-left: 0;
}
.question-details li {
  margin-bottom: 8px;
}
.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.el-tag {
  margin-bottom: 10px;
}
.el-button {
  margin: 0 5px;
}
.el-button + .el-button {
  margin-left: 10px;
}
</style>
