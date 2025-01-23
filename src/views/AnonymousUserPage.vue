<template>
  <div class="anonymous-user-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">匿名用户信息管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索匿名用户ID"
              clearable
              class="search-input"
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleCreate">
              <el-icon><Plus /></el-icon>新建匿名用户
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="filteredAnonymousUsers"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="匿名用户ID" min-width="120" show-overflow-tooltip />
        <el-table-column prop="ip_address" label="IP地址" min-width="200" show-overflow-tooltip />
        <el-table-column
          prop="last_active"
          label="最后活跃时间"
          min-width="180"
          show-overflow-tooltip
        />

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <div class="batch-actions" v-if="selectedRows.length">
          <el-button type="danger" @click="handleBatchDelete">
            批量删除({{ selectedRows.length }})
          </el-button>
        </div>
        <el-pagination
          v-model:currentPage="currentPage"
          v-model:pageSize="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          background
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 匿名用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formMode === 'create' ? '新建匿名用户' : '编辑匿名用户'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="IP地址" prop="ip_address">
          <el-input v-model="formData.ip_address" />
        </el-form-item>
        <el-form-item label="最后活跃时间" prop="last_active">
          <el-input v-model="formData.last_active" type="datetime" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 表格相关
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<any[]>([])

// 过滤后的匿名用户列表
const filteredAnonymousUsers = computed(() => {
  return anonymousUsers.value.filter(
    (user) =>
      user.id.toString().includes(searchQuery.value) ||
      user.ip_address.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchAnonymousUsers()
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个匿名用户吗？`,
      '提示',
      {
        type: 'warning',
      },
    )
    loading.value = true
    await Promise.all(
      selectedRows.value.map((user) => anonymousUserApi.deleteAnonymousUser(user.id)),
    )
    ElMessage.success('批量删除成功')
    fetchAnonymousUsers()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchAnonymousUsers()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchAnonymousUsers()
}

const handleSelectionChange = (val: AnonymousUser[]) => {
  selectedRows.value = val
}

// 匿名用户列表数据
const anonymousUsers = ref<AnonymousUser[]>([])

// 获取匿名用户列表
const fetchAnonymousUsers = async () => {
  try {
    loading.value = true
    const response: AnonymousUser[] = [
      { id: 1, ip_address: '192.168.1.1', last_active: '2023-10-01T12:00:00Z' },
      { id: 2, ip_address: '192.168.1.2', last_active: '2023-10-02T12:00:00Z' },
      { id: 3, ip_address: '192.168.1.3', last_active: '2023-10-03T12:00:00Z' },
    ]

    anonymousUsers.value = response
  } catch (error) {
    ElMessage.error('获取匿名用户列表失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 表单相关
const dialogVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = reactive<AnonymousUserFormData>({
  ip_address: '',
  last_active: '',
})

const rules: FormRules = {
  ip_address: [{ required: true, message: '请输入IP地址', trigger: 'blur' }],
  last_active: [{ required: true, message: '请输入最后活跃时间', trigger: 'blur' }],
}

// 处理函数
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.ip_address = ''
  formData.last_active = ''
}

const handleCreate = () => {
  formMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (user: AnonymousUser) => {
  formMode.value = 'edit'
  Object.assign(formData, {
    ip_address: user.ip_address,
    last_active: user.last_active,
  })
  dialogVisible.value = true
}

const handleDelete = async (user: AnonymousUser) => {
  try {
    await ElMessageBox.confirm(`确定要删除匿名用户"${user.id}"吗？`, '提示', {
      type: 'warning',
    })
    await anonymousUserApi.deleteAnonymousUser(user.id)
    ElMessage.success('删除成功')
    await fetchAnonymousUsers() // 重新加载列表
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + error.message)
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (formMode.value === 'create') {
          await anonymousUserApi.createAnonymousUser(formData)
        } else {
          const currentUser = anonymousUsers.value.find((u) => u.id === formData.id)
          if (currentUser) {
            await anonymousUserApi.updateAnonymousUser(currentUser.id, formData)
          }
        }
        ElMessage.success(`${formMode.value === 'create' ? '创建' : '更新'}成功`)
        dialogVisible.value = false
        await fetchAnonymousUsers() // 重新加载列表
      } catch (error) {
        ElMessage.error(`操作失败: ${error.message}`)
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchAnonymousUsers()
})
</script>

<style scoped>
.anonymous-user-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.search-input {
  width: 200px;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.batch-actions {
  display: flex;
  gap: 8px;
}

:deep(.el-card__header) {
  padding: 12px 20px;
}

:deep(.el-table) {
  margin: 16px 0;
}

.title {
  font-size: 18px;
  font-weight: bold;
}
</style>
