<template>
  <el-popover placement="bottom-start" trigger="click" :width="314">
    <template #reference>
      <el-button ref="buttonRef" circle>
        <template #icon v-if="modelValue">
          <component :is="modelValue" />
        </template>
      </el-button>
    </template>
    <el-scrollbar :height="314">
      <div class="flex flex-wrap">
        <div
          class="flex items-center justify-center w-[32px] h-[32px] rounded-[4px] cursor-pointer hover:(text-[#b8201f])"
          :class="[modelValue === '' ? 'text-[#b8201f] bg-[#f7ebe9]' : '']"
          @click="selectIcon()"
        ></div>
        <div
          v-for="(icon, key) in icons"
          :key="key"
          class="flex items-center justify-center w-[32px] h-[32px] rounded-[4px] cursor-pointer hover:(text-[#b8201f])"
          :class="[modelValue === key ? 'text-[#b8201f] bg-[#f7ebe9]' : '']"
          @click="selectIcon(key)"
        >
          <ez-icon :size="20">
            <component :is="icon" />
          </ez-icon>
        </div>
      </div>
    </el-scrollbar>
  </el-popover>
</template>

<script lang="ts" setup>
import type { ButtonInstance } from 'element-plus'
import * as icons from '@ez-ui/icons'
const modelValue = defineModel<string | null>({ required: true, default: null })
const buttonRef = ref<ButtonInstance | null>(null)
const selectIcon = (icon = '') => {
  modelValue.value = icon
  buttonRef.value && buttonRef.value.$el.click()
}
</script>
