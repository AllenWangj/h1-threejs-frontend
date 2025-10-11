<template>
  <div>
    <ez-fast-table
      ref="tableRef"
      v-model:params="searchParams"
      v-model:loading="loading"
      :columns="columns"
      :api="getRolePage"
      :max-height="tableMaxHeight"
    >
      <template #form>
        <el-form :model="searchParams" inline label-width="auto" @submit.prevent @keyup.enter="search">
          <el-form-item label="名称">
            <el-input v-model="searchParams.name" clearable/>
          </el-form-item>
        </el-form>
      </template>
      <template #header>
        <el-button type="primary" @click="addItem()">新建</el-button>
      </template>
      <template #operation="{ row }">
        <el-button link type="primary" @click="editItem(row)">编辑</el-button>
        <el-button link type="primary" @click="removeItem(row)">删除</el-button>
      </template>
    </ez-fast-table>
    <ez-dialog
      v-model="dialogFlag"
      :title="recordId ? '编辑角色' : '新建角色'"
      :loading="submitLoading"
      :width="600"
      @confirm="submit"
    >
      <role-form v-if="dialogFlag" ref="formRef" :record-id="recordId"/>
    </ez-dialog>
  </div>
</template>

<script setup lang="ts">
import RoleForm from '../components/role-form.vue'
import { getRolePage, createRole, updateRole, removeRole } from '~/apis/account'
import type { RoleItem } from '~/types/account'
import type { TableColumn } from '@maxtan/ez-ui'
definePageMeta({
  layout: 'management',
  permissions: 'system:account:role'
})

const loading = ref(false)
const dialogFlag = ref(false)
const recordId = ref('')
const submitLoading = ref(false)
const { tableMaxHeight } = useLayout()
const { formatTime } = useUtils()
const searchParams = reactive({
  name: '',
  current: 1,
  size: 10
})
const columns = reactive<TableColumn<RoleItem>[]>([
  { prop: 'name', label: '角色名称' },
  { prop: 'intro', label: '简介' },
  {
    prop: 'updateTime',
    label: '更新时间',
    formatter: (item) => formatTime(item.updateTime)
  },
  { prop: 'updateBy', label: '更新人' },
  { prop: 'operation', label: '操作', width: 200, fixed: 'right' }
])
const tableRef = ref()
const formRef = ref<InstanceType<typeof RoleForm>>()
/**
 * 搜索
 */
const search = () => {
  searchParams.current = 1
  tableRef.value.search()
}
/**
 * 新增
 */
const addItem = () => {
  recordId.value = ''
  dialogFlag.value = true
}
/**
 * 编辑
 */
const editItem = (item) => {
  recordId.value = item.id
  dialogFlag.value = true
}
/**
 * 删除
 */
const removeItem = async (item) => {
  try {
    const confirm = await ElMessageBox.confirm('是否删除?', '提示')
    if (confirm === 'confirm') {
      await removeRole({ id: item.id })
      ElMessage.success('操作成功！')
      search()
    }
  } catch (error) {}
}
/**
 * 提交
 */
const submit = async () => {
  try {
    const formData = await formRef.value.getFormData()
    submitLoading.value = true
    if (formData.id) {
      await updateRole(formData)
    } else {
      await createRole(formData)
    }
    ElMessage.success('操作成功！')
    dialogFlag.value = false
    search()
  } catch (err) {
    console.log(err)
  } finally {
    submitLoading.value = false
  }
}
onMounted(() => {
  search()
})
</script>
