<template>
  <div>
    <ez-fast-table ref="tableRef" v-model:params="searchParams" v-model:loading="loading" :columns="columns"
      :api="getModelPage" :max-height="tableMaxHeight">
      <template #form>
        <el-form :model="searchParams" inline label-width="auto" @submit.prevent @keyup.enter="search">
          <el-form-item label="模型名称">
            <el-input v-model="searchParams.name" clearable />
          </el-form-item>
          <el-form-item label="模型编码">
            <el-input v-model="searchParams.code" clearable />
          </el-form-item>
          <el-form-item label="模型类型">
            <ez-select v-model="searchParams.type" :options="typeOptions" clearable />
          </el-form-item>
        </el-form>
      </template>
      <template #header>
        <el-button type="primary" :icon="Plus" @click="addItem">新增</el-button>
      </template>
      <template #operation="{ row }">
        <el-button link type="primary" @click="editItem(row)">编辑</el-button>
        <el-button link type="primary" @click="deleteItem(row)">删除</el-button>
      </template>
    </ez-fast-table>
    <ez-dialog v-model="recordVisible" :loading="submitLoading" width="1200px" :title="recordId ? '编辑模型' : '新增模型'"
      @confirm="submit">
      <model-form v-if="recordVisible" ref="modelFormRef" :recordId="recordId" />
    </ez-dialog>
  </div>
</template>
<script setup lang="ts">
import { Plus } from '@maxtan/ez-ui-icons'
import type { TableColumn } from '@maxtan/ez-ui'
import { createModel, getModelPage, updateModal, removeModel } from '~/apis/resource'
import dayjs from 'dayjs';
import type { ModelItem } from '~/types/model';
import ModelForm from './components/model-form.vue';
definePageMeta({
  layout: 'management',
  permissions: 'model:list'
})
const recordVisible = ref(false)
const modelFormRef = ref<InstanceType<typeof ModelForm>>(null)
const recordId = ref('')
const loading = ref(false)
const submitLoading = ref(false)
const { tableMaxHeight } = useLayout()
const searchParams = ref({
  name: '',
  code: '',
  type: null,
  current: 1,
  size: 10
})
const typeOptions = [
  { label: 'glb', value: 1 },
  { label: 'gltf', value: 2 },
]
const columns = reactive<TableColumn<ModelItem>[]>([
  { prop: 'name', label: '模型名称', width: 200, fixed: 'left', sortable: true },
  { prop: 'type', label: '模型类型', formatter: (row) => row.type === 1 ? 'glb' : row.type === 2 ? 'gltf' : '' },
  { prop: 'code', label: '模型编码' },
  { prop: 'length', label: '长度', formatter: (row) => `${row.length}mm` },
  { prop: 'width', label: '宽度', formatter: (row) => `${row.width}mm` },
  { prop: 'height', label: '高度', formatter: (row) => `${row.height}mm` },
  { prop: 'createTime', label: '创建时间', formatter: (row) => dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') },
  { prop: 'operation', label: '操作', width: 200, fixed: 'right' }
])
const tableRef = ref()
/**
 * 搜索
 */
const search = () => {
  searchParams.value.current = 1
  tableRef.value.search()
}

/**
 * 新增
 */
const addItem = () => {
  recordId.value = ''
  recordVisible.value = true
}

/**
 * 编辑
 */
const editItem = (item: ModelItem) => {
  recordId.value = item.id
  recordVisible.value = true
}

/**
 * 删除
 */
const deleteItem = async (_item) => {
  // 删除逻辑
  try {
    const confirm = await ElMessageBox.confirm('是否删除?', '提示')
    if (confirm === 'confirm') {
      await removeModel({ id: _item.id })
      ElMessage.success('操作成功！')
      search()
    }
  } catch (error) { }
}
const submit = async () => {
  try {
    const formData = await modelFormRef.value?.getFormData()
    if (submitLoading.value === true) return
    submitLoading.value = true
    if (recordId.value) {
      await updateModal({ ...formData, id: recordId.value })
      ElMessage.success("修改成功")
      search()
    } else {
      await createModel({ ...formData })
      ElMessage.success("保存成功")
      search()
    }
    recordVisible.value = false
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  search()
})
</script>
