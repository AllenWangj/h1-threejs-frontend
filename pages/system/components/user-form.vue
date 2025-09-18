<template>
  <el-form ref="formRef" :model="formData" :label-width="80" :rules="rules" :loading="loading">
    <el-form-item label="用户名" prop="name">
      <el-input v-model="formData.name" class="w-[220px]"></el-input>
    </el-form-item>
    <el-form-item label="账号" prop="account">
      <el-input v-model="formData.account" class="w-[220px]"></el-input>
    </el-form-item>
    <el-form-item label="简介">
      <el-input v-model="formData.intro" type="textarea" class="w-[400px]"></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { getUserDetail } from '~/apis/account'
import type { UserItem } from '~/types/account'
import type { FormInstance } from 'element-plus'
interface PropsType {
  recordId: string
}
const props = withDefaults(defineProps<PropsType>(), {
  recordId: ''
})
const formData = ref<Partial<UserItem>>({
  name: '',
  account: '',
  intro: ''
})
const loading = ref(false)
const formRef = ref<FormInstance>()
const rules = reactive({
  name: { required: true, message: '请输入名称', trigger: 'blur' }
})
/**
 * 查询详情
 * @param id
 */
const getDetail = async (id: string) => {
  try {
    loading.value = false
    const { data } = await getUserDetail({ id })
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
