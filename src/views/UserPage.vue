<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { userApi } from '@/api'
import type { User, UserFormData, Accounts } from '@/api'

// 表格相关
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<User[]>([])

// 过滤后的用户列表

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

// 处理状态变更
const handleStatusChange = async (user: User, value: boolean) => {
  try {
    user.statusLoading = true
    await userApi.updateUser(user.id, { is_active: value })
    ElMessage.success('状态更新成功')
  } catch (error) {
    user.is_active = !value // 恢复状态
    ElMessage.error('状态更新失败')
  } finally {
    user.statusLoading = false
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个用户吗？`, '提示', {
      type: 'warning',
    })
    loading.value = true
    await Promise.all(selectedRows.value.map((user) => userApi.deleteUser(user.id)))
    ElMessage.success('批量删除成功')
    fetchUsers()
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
  fetchUsers()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchUsers()
}

const handleSelectionChange = (val: User[]) => {
  selectedRows.value = val
}

// 用户列表数据
const users = ref<User[]>([])

// 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await userApi.getUserList()
    users.value = response.data
  } catch (error) {
    ElMessage.error('获取用户列表失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 表单相关
const dialogVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = reactive<UserFormData>({
  id: 0,
  name: '',
  email: '',
  phone: '',
  address: '',
  is_active: true,
  statusLoading: false,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
}

// 处理函数
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.name = ''
  formData.email = ''
  formData.phone = ''
  formData.address = ''
  formData.is_active = true
}

const handleCreate = () => {
  formMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (user: User) => {
  formMode.value = 'edit'
  Object.assign(formData, {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    is_active: user.is_active,
  })
  dialogVisible.value = true
}

const handleDelete = async (user: User) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户"${user.name}"吗？`, '提示', {
      type: 'warning',
    })
    await userApi.deleteUser(user.id)
    ElMessage.success('删除成功')
    await fetchUsers() // 重新加载列表
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
          let { id, ...datas } = formData
          await userApi.createUser(datas)
        } else {
          await userApi.updateUser(formData.id, formData)
        }
        ElMessage.success(`${formMode.value === 'create' ? '创建' : '更新'}成功`)
        dialogVisible.value = false
        await fetchUsers() // 重新加载列表
      } catch (error) {
        ElMessage.error(`操作失败: ${error.message}`)
      } finally {
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchUsers()
})

// 编辑账户密码
const dialogVisiblePassword = ref(false)
const passwordForm = ref<Accounts>({
  id: null,
  uid: null,
  Name: null,
  account: null,
  password: null,
})
let handleEditPassword = async (user: User) => {
  dialogVisiblePassword.value = true
  let { data } = await userApi.getEdit(String(user.id))
  passwordForm.value = { ...data, uid: String(user.id) }
}
let handleSubmit1 = async () => {
  await userApi.postEdit(String(passwordForm.value.uid), passwordForm.value)
  dialogVisiblePassword.value = false
  ElMessage.success('密码重置成功')
  passwordForm.value = {
    id: null,
    uid: null,
    Name: null,
    account: null,
    password: null,
  }
}

//编辑角色
const dialogVisibleRole = ref(false)
let handleEditRole = async (user: User) => {
  dialogVisibleRole.value = true
  // let { data } = await userApi.getEdit(String(user.id))
  rolesarr.value = []
}
const rolesarr = ref([])
</script>

<template>
  <div class="user-page">
    <h1>用户列表</h1>
    <div class="header-actions">
      <el-input
        v-model="searchQuery"
        placeholder="搜索用户"
        clearable
        class="search-input"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><i-ep-search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleCreate">
        <el-icon><i-ep-plus /></el-icon>新建用户
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="users"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="address" label="地址" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.is_active"
            :loading="row.statusLoading"
            @change="(val: boolean) => handleStatusChange(row, val)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">
            <el-icon><i-ep-edit /></el-icon>编辑
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">
            <el-icon><i-ep-delete /></el-icon>删除
          </el-button>
          <el-button type="danger" link @click="handleEditPassword(row)">
            <el-icon><i-ep-editPen /></el-icon>重置密码
          </el-button>
          <el-button type="danger" link @click="handleEditRole(row)">
            <el-icon><i-ep-editPen /></el-icon>编辑角色
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

    <!-- 用户表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formMode === 'create' ? '新建用户' : '编辑用户'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" />
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

    <!-- 用户角色 -->
    <el-dialog v-model="dialogVisibleRole" :title="'编辑角色'" width="500px" destroy-on-close>
      <el-form ref="formRef" :model="passwordForm" :rules="rules" label-width="100px">
        <el-form-item label="角色">
          <el-select v-model="rolesarr" placeholder="选择角色" multiple style="width: 240px">
            <el-option
              v-for="(item, i) in ['admin', 'user', 'edit']"
              :key="i"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisibleRole = false">取消</el-button>
        <el-button type="primary" :loading="submitting"> 确定 </el-button>
      </template>
    </el-dialog>

    <!-- 用户表账号密码 -->
    <el-dialog v-model="dialogVisiblePassword" :title="'编辑密码'" width="500px" destroy-on-close>
      <el-form ref="formRef" :model="passwordForm" :rules="rules" label-width="100px">
        <el-form-item label="账号">
          <el-input v-model="passwordForm.account" type="text" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="passwordForm.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisiblePassword = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit1" :loading="submitting"> 确定 </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-page {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 20px;
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
</style>
