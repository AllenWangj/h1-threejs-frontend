<template>
  <el-form ref="formRef" :model="formData" :label-width="80" :rules="rules" :loading="loading">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" class="w-[220px]"></el-input>
    </el-form-item>
    <el-form-item label="权限" prop="intro">
      <el-tree ref="menusRefs" class="w-[400px]" :data="menusOptions" :props="defaultProps" :default-checked-keys="defaultCheckedKeys" show-checkbox node-key="id" />
    </el-form-item>
    <el-form-item label="简介">
      <el-input v-model="formData.intro" type="textarea" class="w-[400px]"></el-input>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { getRoleDetail, getMenuTree } from '~/apis/account'
import type { RoleItem } from '~/types/account'
import type { FormInstance, TreeInstance } from 'element-plus'
interface PropsType {
  recordId: string
}
interface Tree {
  label: string
  children?: Tree[]
}
const props = withDefaults(defineProps<PropsType>(), {
  recordId: ''
})

const menusRefs = ref<TreeInstance>()
const defaultProps = {
  children: 'children',
  label: 'name',
}
const defaultCheckedKeys = ref<string[]>([]);
const menusOptions = reactive([]);



const formData = ref<Partial<RoleItem>>({
  name: '',
  intro: '',
  menus: []
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
    const { data } = await getRoleDetail({ id })
    if (data) {
      formData.value = data
      defaultCheckedKeys.value = data.menus || [];
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
    if (menusRefs.value) {
      const checkedNodes = menusRefs.value.getCheckedNodes();
      formData.value.menus = checkedNodes.map(node => node.id);
    }
    await formRef.value.validate()
    return formData.value
  } catch (err) {
    throw new Error(err);
  }
}

/**
 * 获取菜单列表
 */
const getMenus = async () => {
  try {
    const res = await getMenuTree()
    console.log('res', res);
    menusOptions.splice(0, menusOptions.length, ...res.data);
  } catch (err) {
    console.error('获取菜单列表失败', err);
  }
}

onMounted(() => {
  getMenus();
})

watch(
  () => props.recordId,
  (val) => {
    if (val) getDetail(val)
  },
  { immediate: true }
)
defineExpose({ getFormData })
</script>
