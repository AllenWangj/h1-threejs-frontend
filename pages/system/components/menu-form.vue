<template>
  <el-form ref="formRef" :model="formData" :label-width="80" :rules="rules" :loading="loading">
    <el-form-item label="父节点">
      <div class="w-[220px]">
        <el-tree-select
          v-model="formData.parentId"
          :props="{ label: 'name' }"
          :data="props.data"
          :expand-on-click-node="false"
          check-on-click-node
          check-strictly
          node-key="id"
        />
      </div>
    </el-form-item>
    <el-form-item label="类型" prop="name">
      <ez-select v-model="formData.type" :options="MENU_TYPES" class="w-[220px]"></ez-select>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" class="w-[220px]"></el-input>
    </el-form-item>
    <el-form-item v-if="formData.type !== 3" label="路由" prop="path">
      <el-input v-model="formData.path" class="w-[220px]"></el-input>
    </el-form-item>
    <el-form-item label="权限标识" prop="code">
      <el-input v-model="formData.code" class="w-[220px]"></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input v-model="formData.sort" class="w-[220px]"></el-input>
    </el-form-item>
    <el-form-item label="图标">
      <icon-select v-model="formData.icon" />
    </el-form-item>
    <el-form-item label="简介">
      <el-input v-model="formData.intro" type="textarea" class="w-[400px]"></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { getMenuDetail } from '~/apis/account'
import { useSystem } from '~/pages/system/composables/use-system'
import type { MenuItem, MenuTree } from '~/types/account'
import type { FormInstance } from 'element-plus'
interface PropsType {
  recordId: string
  parentId?: string
  data: MenuTree[]
}
const { MENU_TYPES } = useSystem()
const props = withDefaults(defineProps<PropsType>(), {
  recordId: '',
  parentId: null,
  data: () => []
})
const formData = ref<Partial<MenuItem>>({
  name: '',
  type: 2,
  code: '',
  intro: '',
  path: '',
  parentId: props.parentId || null
})
const loading = ref(false)
const formRef = ref<FormInstance>()
const rules = reactive({
  name: { required: true, message: '请输入名称', trigger: 'blur' },
  code: { required: true, message: '请输入权限标识', trigger: 'blur' },
  path: { required: true, message: '请输入路由', trigger: 'blur' }
})
/**
 * 查询详情
 * @param id
 */
const getDetail = async (id: string) => {
  try {
    loading.value = false
    const { data } = await getMenuDetail({ id })
    if (data) {
      formData.value = data
    }
  } finally {
    loading.value = false
  }
}
/**
 * 获取表单数据
 */
const getFormData = async () => {
  try {
    loading.value = true
    await formRef.value.validate()
    return formData.value
  } catch (err) {
    throw new Error(err);
  }
}
watch(
  () => props.recordId,
  (val) => {
    if (val) getDetail(val)
  },
  { immediate: true }
)
defineExpose({ getFormData })
</script>
