<template>
  <div class="url-page">
    <h1>URL 列表</h1>
    <div class="header-actions">
      <el-input
        v-model="searchQuery"
        placeholder="搜索 URL"
        clearable
        class="search-input"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><i-ep-search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleCreate">
        <el-icon><i-ep-plus /></el-icon>新建 URL
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="filteredUrls"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="180" />
      <el-table-column prop="name" label="名称" width="180" />
      <el-table-column prop="url" label="URL" />
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
            <el-icon><i-ep-edit /></el-icon>编辑
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">
            <el-icon><i-ep-delete /></el-icon>删除
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

    <!-- URL 表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formMode === 'create' ? '新建 URL' : '编辑 URL'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="formData.url" />
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
import type { FormInstance, FormRules } from 'element-plus'

// 表格相关
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<Url[]>([])

// 过滤后的 URL 列表
const filteredUrls = computed(() => {
  return urls.value.filter(
    (url) =>
      url.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      url.url.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchUrls()
}

// 处理状态变更
const handleStatusChange = async (url: Url, value: boolean) => {
  url.statusLoading = true
  // 模拟 API 调用
  setTimeout(() => {
    url.is_active = value
    url.statusLoading = false
    ElMessage.success('状态更新成功')
  }, 500)
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个 URL 吗？`, '提示', {
      type: 'warning',
    })
    loading.value = true
    // 模拟 API 调用
    setTimeout(() => {
      selectedRows.value.forEach((url) => {
        const index = urls.value.findIndex((u) => u.id === url.id)
        if (index !== -1) {
          urls.value.splice(index, 1)
        }
      })
      ElMessage.success('批量删除成功')
      fetchUrls()
      loading.value = false
    }, 500)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchUrls()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchUrls()
}

const handleSelectionChange = (val: Url[]) => {
  selectedRows.value = val
}

// URL 列表数据
const urls = ref<Url[]>([])

// 获取 URL 列表
const fetchUrls = async () => {
  loading.value = true
  // 模拟 API 调用
  setTimeout(() => {
    urls.value = [
      { id: 1, name: 'Google', url: 'https://www.google.com', is_active: true, statusLoading: false },
      { id: 2, name: 'Bing', url: 'https://www.bing.com', is_active: false, statusLoading: false },
      { id: 3, name: 'Yahoo', url: 'https://www.yahoo.com', is_active: true, statusLoading: false },
    ]
    loading.value = false
  }, 500)
}

// 表单相关
const dialogVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = reactive<UrlFormData>({
  name: '',
  url: '',
  is_active: true,
  statusLoading: false,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入 URL', trigger: 'blur' }],
}

// 处理函数
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  formData.name = ''
  formData.url = ''
  formData.is_active = true
}

const handleCreate = () => {
  formMode.value = 'create'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (url: Url) => {
  formMode.value = 'edit'
  Object.assign(formData, {
    name: url.name,
    url: url.url,
    is_active: url.is_active,
  })
  dialogVisible.value = true
}

const handleDelete = async (url: Url) => {
  try {
    await ElMessageBox.confirm(`确定要删除 URL "${url.name}" 吗？`, '提示', {
      type: 'warning',
    })
    // 模拟 API 调用
    setTimeout(() => {
      const index = urls.value.findIndex((u) => u.id === url.id)
      if (index !== -1) {
        urls.value.splice(index, 1)
      }
      ElMessage.success('删除成功')
      fetchUrls() // 重新加载列表
    }, 500)
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
          // 模拟 API 调用
          setTimeout(() => {
            urls.value.push({
              id: urls.value.length + 1,
              name: formData.name,
              url: formData.url,
              is_active: formData.is_active,
              statusLoading: false,
            })
            ElMessage.success('创建成功')
            dialogVisible.value = false
            fetchUrls() // 重新加载列表
            submitting.value = false
          }, 500)
        } else {
          const currentUrl = urls.value.find((u) => u.id === formData.id)
          if (currentUrl) {
            Object.assign(currentUrl, formData)
            ElMessage.success('更新成功')
            dialogVisible.value = false
            fetchUrls() // 重新加载列表
            submitting.value = false
          }
        }
      } catch (error) {
        ElMessage.error(`操作失败: ${error.message}`)
        submitting.value = false
      }
    }
  })
}

onMounted(() => {
  fetchUrls()
})
</script>

<style scoped>
.url-page {
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