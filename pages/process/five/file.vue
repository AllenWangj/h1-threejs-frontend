<template>
  <div class="h-full w-full flex flex-col">
    <div class="flex-shrink-0 flex items-center h-[56px] px-[14px] border-b border-[#e4ecfd]">
      <img src="../../../assets/images/home/file-icon.svg" width="20" height="20" alt="" />
      <span class="text-[16px] text-[#333] ml-[8px]">上传文件</span>
      <p class="text-[14px] text-[#999] ml-[8px]">（请上传项目相关的DWG、DXF或PDF文件，支持拖拽上传）</p>
    </div>
    <div class="flex-1 flex px-[14px] py-[14px]">
      <div
        v-loading="uploadLoading"
        class="h-full flex-shrink-0 flex flex-col items-center justify-center w-[33.3%] min-w-[200px] border-[1px] border-[#adcdf7]"
      >
        <el-upload
          ref="uploadRef"
          :file-list="updateFileList"
          :on-exceed="handleExceed"
          :limit="1"
          accept=".pdf,.dwg,.dxf"
          action=""
          :drag="true"
          :auto-upload="false"
          :on-change="uploadFile"
          :show-file-list="false"
          class="w-[100%] h-[100%]"
        >
          <div class="w-[100%] h-[100%] flex flex-col items-center justify-center px-[14px]">
            <img src="../../../assets/images/home/tianjiashangchuan.svg" width="90" height="110" alt="" />
            <div v-if="currentFile">
              <span class="text-[20px] text-[#333] mt-[15px] text-center">{{ currentFile }}</span>
            </div>
            <div v-else class="flex flex-col items-center justify-center">
              <span class="text-[20px] text-[#333] mt-[15px]">点击或拖拽到此区域上传</span>
              <p class="text-[14px] text-[#999] mt-[7px]">支持单个文件上传，仅支持DWG、DXF或PDF文件格式</p>
            </div>
          </div>
        </el-upload>
      </div>
      <div class="flex-1 file-list">
        <div class="flex items-center h-[44px] px-[14px] mb-[14px] border-b border-[#e4ecfd]">
          <img src="../../../assets/images/home/upload-file-icon.svg" width="20" height="20" alt="" />
          <span class="text-[16px] text-[#333] ml-[8px]">
            已上传文件
            <span class="text-[14px] text-[#999]">({{ fileList.length }}个)</span>
          </span>
        </div>
        <div
          v-for="item in fileList"
          :key="item.id"
          class="flex items-center justify-between bg-[#f8f9fd] rounded-[2px] border-[1px] border-[#e4ecfd] py-[10px] px-[14px] ml-[14px] mb-[10px] file-item"
        >
          <img src="../../../assets/images/icon-pdf.svg" alt="pdf" class="w-[26px] h-[26px]" />
          <div class="flex-1 flex flex-col px-[14px]">
            <span>{{ item.name }}</span>
            <span class="text-[12px] text-[#999]">{{ formatFileSize(item.size || 0) }}</span>
          </div>
          <img
            src="../../../assets/images/icon-plot-delete.svg"
            alt="remove"
            class="cursor-pointer w-[20px] h-[20px]"
            @click="handleRemoveFile(item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getPartsProductionDetail, updatePartsProductionFile } from '@/apis/project'
import { genFileId } from 'element-plus'

const route = useRoute()

const { putFile } = useOss()
const { formatFileSize } = useUtils()

const projectId = ref('')
const pageLoading = ref(false)

const updateFileList = ref([])
const fileList = ref([])
const currentFile = ref('')

const handleRemoveFile = async (file) => {
  try {
    await ElMessageBox.confirm('确定删除该文件吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const fileIdList = fileList.value.filter((item) => item.id !== file.id).map((item) => item.id)
    await updatePartsProductionFile({
      projectId: projectId.value,
      fileIds: fileIdList
    })
    ElMessage.success('删除成功')
    fetchDetail()
  } catch (error) {
    console.error('删除失败', error)
  }
}

// 获取详情
async function fetchDetail() {
  try {
    pageLoading.value = true
    const { data } = await getPartsProductionDetail({
      projectId: projectId.value
    })
    fileList.value = data.files || []
    console.log('获取部件生产详情', data)
  } catch (error) {
    console.error('获取部件生产详情失败', error)
  } finally {
    pageLoading.value = false
  }
}

const { uploadRef, uploadLoading, uploadFile, handleExceed } = createdUploadFile()

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  fetchDetail()
})

function createdUploadFile() {
  const uploadRef = ref(null)
  const uploadLoading = ref(false)
  /**
   * 处理文件上传
   * @param {File} file - 上传的文件对象
   */
  const uploadFile = (file: any) => {
    currentFile.value = file.name
    submitFile(file)
  }

  const handleExceed = (files) => {
    uploadRef.value!.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
  }
  /**
   * 提交文件到服务器
   * @param {File} file - 要上传的文件
   */
  const submitFile = async (file: any) => {
    try {
      uploadLoading.value = true
      const { data } = await putFile(file.raw)
      console.log('上传成功', data)
      const fileIdList = fileList.value.map((item) => item.id)
      fileIdList.push(data.id)
      await updatePartsProductionFile({
        projectId: projectId.value,
        fileIds: fileIdList
      })
      // 更新列表
      fetchDetail()
      ElMessage.success('上传成功')
    } catch (error) {
      console.error('上传失败', error)
    } finally {
      uploadLoading.value = false
      currentFile.value = ''
    }
  }
  return {
    uploadRef,
    uploadLoading,
    uploadFile,
    handleExceed
  }
}
</script>
<style lang="less" scoped>
::v-deep(.el-upload) {
  width: 100%;
  height: 100%;

  .el-upload-dragger {
    width: 100%;
    height: 100%;
    background: transparent;
  }
}

.file-list {
  .file-item {
    &:hover {
      background: linear-gradient(180deg, #fff, #deecff);
      border-color: #adcdf7;
    }
  }
}
</style>
