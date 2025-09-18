<template>
  <div>
    <ez-fast-table
      ref="tableRef"
      v-model:params="searchParams"
      v-model:loading="loading"
      :columns="columns"
      :api="getUserPage"
      :max-height="tableMaxHeight"
    >
      <template #form>
        <el-form :model="searchParams" inline label-width="auto" @submit.prevent @keyup.enter="search">
          <el-form-item label="用户名">
            <el-input v-model="searchParams.name" clearable/>
          </el-form-item>
        </el-form>
      </template>
      <template #header>
        <el-button type="primary" @click="addItem()">新建</el-button>
      </template>
      <template #operation="{ row }">
        <el-button link type="primary" @click="editItem(row)">编辑</el-button>
        <el-button v-if="row.id !== 'system'" link type="danger" @click="removeItem(row)">删除</el-button>
      </template>
    </ez-fast-table>
    <ez-dialog
      v-model="dialogFlag"
      :title="recordId ? '编辑用户' : '新建用户'"
      :loading="submitLoading"
      :width="600"
      @confirm="submit"
    >
      <user-form v-if="dialogFlag" ref="formRef" :record-id="recordId"/>
    </ez-dialog>
  </div>
</template>

<script setup lang="ts">
import UserForm from '../components/user-form.vue'
import { getUserPage, createUser, updateUser, removeUser } from '~/apis/account'
import type { UserItem } from '~/types/account'
import type { TableColumn } from '@maxtan/ez-ui'
definePageMeta({
  layout: 'management'
})

const loading = ref(false)
const dialogFlag = ref(false)
const recordId = ref('')
const submitLoading = ref(false)
const { tableMaxHeight } = useLayout()
const { formatTime } = useUtils()
const searchParams = reactive({
  name: '',
  account: '',
  current: 1,
  size: 10
})
const columns = reactive<TableColumn<UserItem>[]>([
  { prop: 'name', label: '用户名' },
  { prop: 'account', label: '账号' },
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
const formRef = ref<InstanceType<typeof UserForm>>()
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
      await removeUser({ id: item.id })
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
    if (formData.id) {
      await updateUser(formData)
    } else {
      await createUser(formData)
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
