<template>
  <div>
    <div class="p-[10px] bg-[#fff]">
      <div class="mb-[10px]">
        <el-button type="primary" @click="addItem()">新建</el-button>
      </div>
      <ez-table
        ref="tableRef"
        v-model:loading="loading"
        :columns="columns"
        row-key="id"
        :data="tableData"
      >
        <template #operation="{ row }">
          <el-button link type="primary" @click="addItem(row.id)">新增</el-button>
          <el-button link type="primary" @click="editItem(row)">编辑</el-button>
          <el-button link type="danger" @click="removeItem(row)">删除</el-button>
        </template>
      </ez-table>
    </div>
    <ez-dialog
      v-model="dialogFlag"
      :title="recordId ? '编辑字典' : '新建字典'"
      :loading="submitLoading"
      :width="600"
      @confirm="submit"
    >
      <dict-form
        v-if="dialogFlag"
        ref="formRef"
        :data="tableData"
        :record-id="recordId"
        :parent-id="parentId"
      />
    </ez-dialog>
  </div>
</template>

<script setup lang="ts">
import DictForm from '~/pages/system/components/dict-form.vue'
import { createDict, updateDict, removeDict, getDictTree } from '~/apis/system'
import type { DictTree } from '~/types/system'
import type { TableColumn } from '@maxtan/ez-ui'
definePageMeta({
  layout: 'management'
})

const loading = ref(false)
const dialogFlag = ref(false)
const recordId = ref('')
const parentId = ref(null)
const tableData = ref<DictTree[]>()
const submitLoading = ref(false)
const { formatTime } = useUtils()
const columns = reactive<TableColumn<DictTree>[]>([
  { prop: 'label', label: '字典名称' },
  { prop: 'code', label: '字典编码' },
  { prop: 'value', label: '字典值' },
  { prop: 'sort', label: '排序' },
  {
    prop: 'updateTime',
    label: '更新时间',
    formatter: (item) => formatTime(item.updateTime)
  },
  { prop: 'updateBy', label: '更新人' },
  { prop: 'operation', label: '操作', width: 200, fixed: 'right' }
])
const tableRef = ref()
const formRef = ref<InstanceType<typeof DictForm>>()
/**
 * 搜索
 */
const search = async () => {
  try {
    const { data } = await getDictTree()
    tableData.value = data
  } catch (error) {}
}
/**
 * 新增
 */
const addItem = (id?: string) => {
  parentId.value = id || null
  recordId.value = ''
  dialogFlag.value = true
}
/**
 * 编辑
 */
const editItem = (item: DictTree) => {
  recordId.value = item.id
  dialogFlag.value = true
}
/**
 * 删除
 */
const removeItem = async (item: DictTree) => {
  try {
    const confirm = await ElMessageBox.confirm('是否删除?', '提示')
    if (confirm === 'confirm') {
      await removeDict({ id: item.id })
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
      await updateDict(formData)
    } else {
      await createDict(formData)
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
