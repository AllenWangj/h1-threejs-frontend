<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    size="large"
    :disabled="loading"
    label-position="top"
    hide-required-asterisk
    @keyup.enter="submit"
  >
    <el-form-item prop="account" label="账号">
      <el-input v-model="formData.account" placeholder="请输入账号"></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input v-model="formData.password" type="password" placeholder="请输入密码" />
    </el-form-item>
    <div class="pt-[10px]">
      <el-button class="w-full" type="primary" size="large" :loading="loading" @click="submit">
        登录
      </el-button>
    </div>
  </el-form>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { login } from '~~/apis/account'
const { updateToken } = useAuth()
const $emits = defineEmits(['success'])
const formRef = ref<FormInstance>()
const loading = ref(false)
const formData = reactive({
  account: '',
  password: ''
})

const rules = reactive({
  account: [{ required: true, message: '账号不能为空', trigger: 'change' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'change' }]
})

const submit = async () => {
  try {
    if (loading.value) return
    await formRef.value.validate()
    loading.value = true
    const { data } = await login(formData)
    if (data.token) {
      updateToken(data.token)
      $emits('success')
    }
  } finally {
    loading.value = false
  }
}
</script>
<style>
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px #fff inset;
  -webkit-text-fill-color: #333;
  font-size: 16px;
}

.el-form-item {
  margin-bottom: 44px;
}

.el-form-item__label {
  font-size: 18px;
  color: #666;
  margin-bottom: 10px;
}
.el-input__wrapper:hover,
.el-input__wrapper,
.el-input__wrapper.is-focus {
  box-shadow: none !important;
  border-radius: 0;
}

.el-input__wrapper {
  padding: 0 !important;
  border-bottom: 1px solid #e9ebf0;
  font-size: 16px;
  position: relative;
}
.el-input__wrapper:hover,
.el-input__wrapper.is-focus {
  border-bottom-color: #d11f25;
}

.el-input__wrapper::before {
  content: '';
  position: absolute;
  display: block;
  width: 100%;
  height: 3px;
  background: #fff;
  top: -1px;
  z-index: 10;
}

.el-form-item__error {
  font-size: 14px;
}

input::placeholder {
  color: #a0a0a0 !important;
  font-size: 16px !important;
}

.el-button {
  height: 48px;
  font-size: 22px;
  font-weight: 600;
  background: #d11f25;
}
</style>
