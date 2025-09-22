<template>
  <el-form ref="formRef" :model="formData" :label-width="80" :rules="rules" :loading="loading">
    <el-form-item label="父节点">
      <div class="w-[220px]">
        <el-tree-select
          v-model="formData.pid"
          :props="{ label: 'label' }"
          :data="props.data"
          :expand-on-click-node="false"
          check-on-click-node
          check-strictly
          node-key="id"
        />
      </div>
    </el-form-item>
    <el-form-item label="编码" prop="code">
      <el-input v-model="formData.code" class="w-[220px]"></el-input>
    </el-form-item>
    <el-form-item label="字典值" prop="label">
      <el-input v-model="formData.label" class="w-[220px]"></el-input>
    </el-form-item>
    <el-form-item label="字典key" prop="value">
      <el-input v-model="formData.value" class="w-[220px]"></el-input>
    </el-form-item>
    <el-form-item label="排序">
      <el-input v-model="formData.sort" class="w-[220px]"></el-input>
    </el-form-item>
    <el-form-item label="简介">
      <el-input v-model="formData.intro" type="textarea" class="w-[400px]"></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { getDictDetail } from '~/apis/system'
import type { DictItem, DictTree } from '~/types/system'
import type { FormInstance } from 'element-plus'
interface PropsType {
  recordId: string
  parentId?: string
  data: DictTree[]
}
const props = withDefaults(defineProps<PropsType>(), {
  recordId: '',
  parentId: null,
  data: () => []
})
const formData = ref<Partial<DictItem>>({
  pid: props.parentId || null,
  code: '',
  intro: null,
  sort: 0
})
const loading = ref(false)
const formRef = ref<FormInstance>()
const rules = reactive({
  value: { required: true, message: '请输入字典key', trigger: 'blur' },
  code: { required: true, message: '请输入权限标识', trigger: 'blur' },
  label: { required: true, message: '请输入字典值', trigger: 'blur' }
})
/**
 * 查询详情
 * @param id
 */
const getDetail = async (id: string) => {
  try {
    loading.value = false
    const { data } = await getDictDetail({ id })
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
    throw new Error(err)
  }
}
watch(
  () => props.recordId,
  (val) => {
    if (val) getDetail(val)
  },
  { immediate: true }
)
watch(
  () => formData.value.pid,
  (val) => {
    if (props.data && props.data.length) {
      const findNode = (nodes: DictTree[], matchFn): DictTree => {
        for (let node of nodes) {
          if (matchFn(node)) return node
          if (node.children && node.children.length > 0) {
            const result = findNode(node.children, matchFn)
            if (result) return result
          }
        }
        return null
      }
      const matchedNode = findNode(props.data, (node) => node.id === val)
      if (matchedNode) formData.value.code = matchedNode.code
    }
  },
  { immediate: true }
)

defineExpose({ getFormData })
</script>
