<template>
  <div>
    <div class="p-[10px] bg-[#fff]">
      <div class="mb-[10px]">
        <el-button type="primary" @click="addItem()">新建</el-button>
      </div>
      <ez-table ref="tableRef" v-model:loading="loading" :columns="columns" row-key="id" :data="tableData">
        <template #icon="{ row }">
          <ez-icon v-if="row.icon" class="flex justify-center">
            <component :is="row.icon"/>
          </ez-icon>
        </template>
        <template #operation="{ row }">
          <el-button link type="primary" @click="addItem(row.id)">新增</el-button>
          <el-button link type="primary" @click="editItem(row)">编辑</el-button>
          <el-button link type="danger" @click="removeItem(row)">删除</el-button>
        </template>
      </ez-table>
    </div>
    <ez-dialog
      v-model="dialogFlag"
      :title="recordId ? '编辑菜单' : '新建菜单'"
      :loading="submitLoading"
      :width="600"
      @confirm="submit"
    >
      <menu-form
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
import MenuForm from '~/pages/system/components/menu-form.vue'
import { getMenuTree, createMenu, updateMenu, removeMenu } from '~/apis/account'
import type { MenuTree } from '~/types/account'
import { useSystem } from '~/pages/system/composables/use-system'
import type { TableColumn } from '@maxtan/ez-ui'
definePageMeta({
  layout: 'management'
})

const loading = ref(false)
const dialogFlag = ref(false)
const recordId = ref('')
const parentId = ref(null)
const tableData = ref<MenuTree[]>()
const submitLoading = ref(false)
const { formatTime, getLabel } = useUtils()
const { MENU_TYPES } = useSystem()
const columns = reactive<TableColumn<MenuTree>[]>([
  { prop: 'name', label: '名称' },
  { prop: 'icon', label: '图标', width: 100 },
  { prop: 'type', label: '类型', width: 100, formatter: (item) => getLabel(item.type, MENU_TYPES) },
  { prop: 'path', label: '路由' },
  { prop: 'code', label: '权限' },
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
const formRef = ref<InstanceType<typeof MenuForm>>()
/**
 * 搜索
 */
const search = async () => {
  try {
    const { data } = await getMenuTree()
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
const editItem = (item: MenuTree) => {
  recordId.value = item.id
  dialogFlag.value = true
}
/**
 * 删除
 */
const removeItem = async (item: MenuTree) => {
  try {
    const confirm = await ElMessageBox.confirm('是否删除?', '提示')
    if (confirm === 'confirm') {
      await removeMenu({ id: item.id })
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
      await updateMenu(formData)
    } else {
      await createMenu(formData)
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
