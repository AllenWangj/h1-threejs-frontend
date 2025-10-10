<template>
  <div class="form-layout" v-loading="loading">
    <!-- 左侧表单 -->
    <div class="form-left">
      <el-form ref="formRef" :model="formData" label-width="auto" :rules="rules">
        <el-form-item label="模型类型" prop="type">
          <ez-select v-model="formData.type" :options="typeOptions" class="w-full" />
        </el-form-item>
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="formData.name" class="w-full" clearable  />
        </el-form-item>
        <el-form-item label="模型编码" prop="code">
          <el-input v-model="formData.code" class="w-full" clearable />
        </el-form-item>
        <el-form-item label="模型文件" prop="url">
          <el-upload 
            multiple 
            :file-list="fileList" 
            :on-exceed="handleExceed" 
            :limit="1" 
            ref="uploadRef" 
            accept=".gltf,.glb"
            action="" 
            :auto-upload="false" 
            :on-change="uploadFile" 
            :before-remove="removeFile" 
            :show-file-list="true"
          >
            <el-button type="primary" :loading="uploadLoading">
              {{ uploadLoading ? '上传中...' : '点击上传' }}
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持 .gltf 和 .glb 格式，上传后将自动计算模型尺寸
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="长度(单位mm)" prop="length">
          <el-input-number 
            v-model="formData.length" 
            class="w-full"
            clearable 
            :controls="false" 
            align="left"
            :precision="2"
          >
            <template #append>
              <el-tag v-if="calculatedDimensions.length" type="info" size="small">
                计算值: {{ calculatedDimensions.length.toFixed(2) }}mm
              </el-tag>
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="宽度(单位mm)" prop="width">
          <el-input-number 
            v-model="formData.width" 
            clearable 
            :controls="false" 
            class="w-full"
            align="left"
            :precision="2"
          >
            <template #append>
              <el-tag v-if="calculatedDimensions.width" type="info" size="small">
                计算值: {{ calculatedDimensions.width.toFixed(2) }}mm
              </el-tag>
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="高度(单位mm)" prop="height">
          <el-input-number 
            v-model="formData.height" 
            clearable 
            :controls="false" 
            class="w-full"
            align="left"
            :precision="2"
          >
            <template #append>
              <el-tag v-if="calculatedDimensions.height" type="info" size="small">
                计算值: {{ calculatedDimensions.height.toFixed(2) }}mm
              </el-tag>
            </template>
          </el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <!-- 右侧模型预览区域 -->
    <div class="form-right" v-if="formData.url">
      <div class="model-preview-container" v-loading="previewLoading" element-loading-text="正在加载模型...">
        <div ref="previewContainer" class="preview-canvas"></div>
        <div class="model-info" v-if="calculatedDimensions.length">
          <el-descriptions title="模型尺寸" :column="1">
            <el-descriptions-item label="长度" :span="1" width="140px">
              {{ calculatedDimensions.length.toFixed(2) }}mm
            </el-descriptions-item>
            <el-descriptions-item label="宽度" :span="1" width="140px">
              {{ calculatedDimensions.width.toFixed(2) }}mm
            </el-descriptions-item>
            <el-descriptions-item label="高度" :span="1" width="140px">
              {{ calculatedDimensions.height.toFixed(2) }}mm
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </div>
    <!-- 右侧占位提示（未上传模型时） -->
    <div class="form-right form-right-placeholder" v-else>
      <div class="placeholder-content">
        <el-icon :size="64" color="#c0c4cc">
          <Upload />
        </el-icon>
        <p>上传模型后将显示预览</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch, onUnmounted, nextTick } from 'vue'
import { useOss } from '~~/composables/use-oss'
import { genFileId, type FormInstance, type FormRules } from 'element-plus'
import type { ModelItem } from '~/types/model'
import { getModelDetail } from '~/apis/resource'

interface PropsType {
  recordId?: string
}

const props = defineProps<PropsType>()
const { LibaryModal } = useThree()

const typeOptions = [
  { label: 'glb', value: 1 },
  { label: 'gltf', value: 2 }
]

const formRef = ref<FormInstance>()
const { putFile } = useOss()
const fileList = ref([])
const previewContainer = ref<HTMLElement>()
const previewLoading = ref(false)
const loading = ref(false)

let previewInstance: InstanceType<typeof LibaryModal> | null = null

const formData = ref<Partial<ModelItem>>({
  name: '',
  code: '',
  type: 1,
  length: null,
  width: null,
  height: null,
  url: '',
  hash: ''
})

// 存储计算得到的尺寸
const calculatedDimensions = ref({
  length: 0,
  width: 0,
  height: 0
})

const { uploadLoading, uploadFile, removeFile, handleExceed, uploadRef } = createdUploadFile()

function createdUploadFile() {
  const uploadRef = ref(null)
  const uploadLoading = ref(false)

  /**
   * 处理文件上传
   */
  const uploadFile = async (file: any) => {
    uploadLoading.value = true
    await submitFile(file)
  }

  /**
   * 移除已上传的文件
   */
  const removeFile = () => {
    formData.value.url = ''
    formData.value.hash = ''
    // 清理预览
    cleanupPreview()
    // 重置计算值
    calculatedDimensions.value = { length: 0, width: 0, height: 0 }
    return true
  }

  const handleExceed = (files) => {
    uploadRef.value!.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
  }

  /**
   * 提交文件到服务器
   */
  const submitFile = async (file: any) => {
    try {
      const { data } = await putFile(file.raw)
      formData.value.url = data.url
      formData.value.hash = data.hash
      
      // 上传成功后自动加载预览并计算尺寸
      await nextTick()
      await initPreview()
    } catch (error) {
      formData.value.url = ''
      ElMessage.error('文件上传失败')
    } finally {
      uploadLoading.value = false
    }
  }

  return {
    uploadRef,
    uploadLoading,
    uploadFile,
    removeFile,
    handleExceed
  }
}

/**
 * 初始化模型预览
 */
const initPreview = async () => {
  if (!formData.value.url || !previewContainer.value) return

  try {
    previewLoading.value = true
    
    // 清理旧实例
    cleanupPreview()

    await nextTick()

    // 创建新实例
    previewInstance = new LibaryModal(previewContainer.value, {
      progress: (progress) => {
        console.log(`模型加载进度: ${progress}%`)
      }
    })

    // 加载模型并获取尺寸
    const dimensions = await previewInstance.handleLoadModelByUrl(formData.value.url)
    
    // 保存计算得到的尺寸
    calculatedDimensions.value = {
      length: dimensions.len,
      width: dimensions.width,
      height: dimensions.height
    }

    // 自动填充尺寸数据
    formData.value.length = Number(dimensions.len.toFixed(2))
    formData.value.width = Number(dimensions.width.toFixed(2))
    formData.value.height = Number(dimensions.height.toFixed(2))
  } catch (error) {
    console.error('模型预览加载失败:', error)
    ElMessage.error('模型预览加载失败，请检查文件格式')
  } finally {
    previewLoading.value = false
  }
}

/**
 * 清理预览实例
 */
const cleanupPreview = () => {
  if (previewInstance) {
    previewInstance.handleDestoryResource()
    previewInstance.destory()
    previewInstance = null
  }
}

const rules = reactive<FormRules>({
  name: { required: true, message: '请输入模型名称', trigger: 'blur' },
  code: { required: true, message: '请输入模型编码', trigger: 'blur' },
  url: { required: true, message: '请上传模型文件', trigger: 'blur' },
  length: { required: true, message: '请输入模型长度(单位mm)', trigger: 'blur' },
  width: { required: true, message: '请输入模型宽度(单位mm)', trigger: 'blur' },
  height: { required: true, message: '请输入模型高度(单位mm)', trigger: 'blur' }
})

const getDetail = async (id: string) => {
  try {
    loading.value = true
    const { data } = await getModelDetail({ id })
    formData.value = { ...data }
    
    // 如果有URL，初始化预览
    if (data.url) {
      await nextTick()
      await initPreview()
    }
  } catch (error) {
    console.error('获取模型详情失败', error)
  } finally {
    loading.value = false
  }
}

const getFormData = async () => {
  try {
    await formRef.value.validate()
    return formData.value
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入项')
    throw error
  }
}

watch(
  () => props.recordId,
  (newVal) => {
    if (newVal) {
      getDetail(newVal)
    }
  },
  { immediate: true }
)

// 组件卸载时清理资源
onUnmounted(() => {
  cleanupPreview()
})

defineExpose({
  getFormData
})
</script>

<style lang="less" scoped>
.form-layout {
  display: flex;
  gap: 24px;
  width: 100%;
  height: 100%;
  
  .form-left {
    flex: 0 0 400px;
    overflow-y: auto;
  }
  
  .form-right {
    flex: 1;
    min-width: 0;
    
    &.form-right-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      border: 2px dashed #dcdfe6;
      border-radius: 4px;
      
      .placeholder-content {
        text-align: center;
        
        p {
          margin-top: 16px;
          color: #909399;
          font-size: 14px;
        }
      }
    }
  }
}

.model-preview-container {
  width: 100%;
  height: 100%;
  position: relative;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  
  .preview-canvas {
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px),
        linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px);
      background-size: 20px 20px;
      pointer-events: none;
    }
  }
  
  .model-info {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #ffffff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
}

:deep(.el-input-number) {
  .el-input-group__append {
    padding: 0 8px;
    background: #f5f7fa;
  }
  
  .el-tag {
    font-size: 12px;
    border-radius: 2px;
  }
}

:deep(.el-upload__tip) {
  margin-top: 8px;
  color: #909399;
  font-size: 12px;
}
</style>