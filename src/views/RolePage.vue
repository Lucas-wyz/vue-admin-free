<template>
  <div class="role-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">角色管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索角色名称"
              clearable
              class="search-input"
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleCreate">
              <el-icon><Plus /></el-icon>新建角色
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="filteredRoles"
        stripe
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="角色名称" min-width="120" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />

        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.is_active"
              :loading="row.statusLoading"
              @change="(val: boolean) => handleStatusChange(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
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

    <!-- 角色表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formMode === 'create' ? '新建角色' : '编辑角色'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" />
        </el-form-item>
        <el-form-item label="状态" prop="is_active">
          <el-switch v-model="formData.is_active" />
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
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { Role, RoleFormData } from '@/api'
import { roleApi } from '@/api'

// 表格相关
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<Role[]>([])

// 过滤后的角色列表
const filteredRoles = computed(() => {
  return roles.value.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchRoles()
}

// 处理状态变更
const handleStatusChange = async (role: Role, value: boolean) => {
  try {
    role.statusLoading = true
    await roleApi.updateRole(role.id, { is_active: value })
    ElMessage.success('状态更新成功')
  } catch (error) {
    role.is_active = !value // 恢复状态
    ElMessage.error('状态更新失败')
  } finally {
    role.statusLoading = false
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个角色吗？`, '提示', {
      type: 'warning',
    })
    loading.value = true
    await Promise.all(selectedRows.value.map((role) => roleApi.deleteRole(role.id)))
    ElMessage.success('批量删除成功')
    fetchRoles()
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
  fetchRoles()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchRoles()
}

const handleSelectionChange = (val: Role[]) => {
  selectedRows.value = val
}

// 角色列表数据
const roles = ref<Role[]>([])

// 获取角色列表
const fetchRoles = async () => {
  try {
    loading.value = true
    const response: Role[] = [
      { id: 1, name: '管理员', description: '系统管理员', is_active: true, statusLoading: false },
      { id: 2, name: '用户', description: '普通用户', is_active: false, statusLoading: false },
      { id: 3, name: '访客', description: '访客用户', is_active: true, statusLoading: false },
    ]

    roles.value = response
  } catch (error) {
    ElMessage.error('获取角色列表失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 表单相关
const dialogVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = reactive<RoleFormData>({
  name: '',
  description: '',
  is_active: true,
  statusLoading: false,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
}

// 处理函数
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.name = ''
  formData.description = ''
  formData.is_active = true
}

const handleCreate = () => {
  formMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (role: Role) => {
  formMode.value = 'edit'
  Object.assign(formData, {
    name: role.name,
    description: role.description,
    is_active: role.is_active,
  })
  dialogVisible.value = true
}

const handleDelete = async (role: Role) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色"${role.name}"吗？`, '提示', {
      type: 'warning',
    })
    await roleApi.deleteRole(role.id)
    ElMessage.success('删除成功')
    await fetchRoles() // 重新加载列表
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
          await roleApi.createRole(formData)
        } else {
          const currentRole = roles.value.find((r) => r.name === formData.name)
          if (currentRole) {
            await roleApi.updateRole(currentRole.id, formData)
          }
        }
        ElMessage.success(`${formMode.value === 'create' ? '创建' : '更新'}成功`)
        dialogVisible.value = false
        await fetchRoles() // 重新加载列表
      } catch (error) {
        ElMessage.error(`操作失败: ${error.message}`)
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchRoles()
})
</script>

<style scoped>
.role-page {
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
