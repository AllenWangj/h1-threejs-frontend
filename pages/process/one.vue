<template>
  <div class="flex h-full w-full bg-white rounded-[4px] process-page-container">
    <!-- 初始化选择地块 -->
    <div v-if="pageState === 'list'" class="w-full">
      <div class="flex items-center px-[14px] h-[54px] border-b-[1px] border-[#e4ecfd]">
        <img src="../../assets/images/icon-header.svg" alt="" width="20" height="20" />
        <span class="text-[16px] text-[#1e1e1e] ml-[10px]">地块列表</span>
        <el-button class="ml-auto" type="primary" @click="handleAddPlot">新增地块</el-button>
      </div>
      <div class="plot-wrapper">
        <div
          class="plot-item cursor-pointer flex px-[14px] py-[10px] bg-[#f8f9fd] border border-[#e8e9ef] rounded-[2px] mb-[10px]"
          v-for="(item, index) in plotList" :key="index" :class="{ 'is-active': currentPlot === item.id }"
          @click="handlePlotClick(item)">
          <img :src="item.satelliteUrl" alt="" class="w-[80px] h-[100%] object-cover rounded-[4px]" />
          <div class="flex flex-col flex-1 ml-[10px]">
            <span class="text-[16px] text-[#1e1e1e] font-black">{{ item.name }}</span>
            <span class="text-[14px] text-[#666] mt-[6px]]">经度: {{item.minX}} ~ {{ item.maxX }}</span>
            <span class="text-[14px] text-[#666]">纬度: {{item.minY}} ~ {{ item.maxY }}</span>
            <span class="text-[14px] text-[#666]">总面积: {{item.area}}平方公里</span>
            <span class="text-[12px] text-[#a7aebb] mt-[8px]">
              {{ formatTime(item.updateTime, 'YYYY-MM-DD HH:mm:ss') }}
            </span>
          </div>
          <img class="ml-[15px] w-[20px] h-[20px]" src="../../assets/images/icon-plot-edit.svg" alt=""
            @click.stop="handleEditPlot(item)" />
          <img class="ml-[15px] w-[20px] h-[20px]" src="../../assets/images/icon-plot-delete.svg" alt=""
            @click.stop="handleDeletePlot(item)" />
        </div>
      </div>
    </div>
    <!-- 地块信息 -->
    <div v-else-if="pageState === 'detail'" class="flex h-full w-full bg-white rounded-[4px] process-page-container">
      <div class="flex flex-col">
        <div class="w-[100%] flex item-center justify-center pt-[20px] border-r border-[#adcdf7]">
          <el-button type="info" text :icon="ArrowLeftBold" @click="pageState = 'list'">返回地块列表</el-button>
        </div>
        <sub-menu-sidebar class="flex-1" :active-tab="isActiveTab" @on-change="tabChange" />
      </div>
      <div class="flex-1 mx-[20px] my-[20px]">
        <keep-alive>
          <nuxt-page />
        </keep-alive>
      </div>
    </div>
    <!-- 新增地块 -->
    <ez-dialog v-model="dialogVisible" :title="`${plotForm.id ? '编辑' : '新增'}地块`" width="600px" :loading="submitLoading"
      @confirm="add">
      <el-form ref="PlotFormRef" :model="plotForm" label-width="120px">
        <el-form-item label="地块名称" prop="name" :rules="{ required: true, message: '请输入地块名称', trigger: 'blur' }">
          <el-input v-model="plotForm.name" placeholder="请输入地块名称"></el-input>
        </el-form-item>
        <el-form-item v-if="!plotForm.id" label="dem文件" prop="demUrl"
          :rules="{ required: true, message: '请选择dem文件', trigger: 'blur' }">
          <el-upload ref="uploadRef" action="" accept=".tif" :limit="1" :on-exceed="handleExceed"
            :on-change="uploadFile" :auto-upload="false">
            <template #trigger>
              <el-button type="primary" :loading="uploadLoading">上传dem文件</el-button>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="!plotForm.id" label="纹理底图" prop="satelliteUrl"
          :rules="{ required: true, message: '请选择纹理底图', trigger: 'blur' }">
          <ez-image-upload :limit-size="100" v-model="plotForm.satelliteUrl" v-loading="uploadImgFlag"
            :api="uploadApi"></ez-image-upload>
        </el-form-item>
      </el-form>
    </ez-dialog>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftBold } from '@maxtan/ez-ui-icons'
import { genFileId } from 'element-plus'
import { getResourceList, createResource, updateResource, removeResource } from '@/apis/resource'

const { formatTime } = useUtils()
const { putFile } = useOss()

const router = useRouter()
const route = useRoute()

const projectId = ref('')
const uploadImgFlag = ref(false)
const pageState = ref('list') // list | detail
// 地块列表
const plotList = ref([])
const currentPlot = ref(null)
const handlePlotClick = (item) => {
  currentPlot.value = item.index
  // 跳转到地块详情页
  pageState.value = 'detail'
  tabChange(2)
}

const isActiveTab = ref(2)
const tabChange = (tab: number) => {
  isActiveTab.value = tab
  if (tab === 1) {
    router.push({
      path: '/process/one/file',
      query: {
        projectId: projectId.value
      }
    })
  } else if (tab === 2) {
    router.push({
      path: '/process/one/form',
      query: {
        projectId: projectId.value
      }
    })
  } else if (tab === 3) {
    router.push({
      path: '/process/one/render',
      query: {
        projectId: projectId.value
      }
    })
  }
}

const { fileUrl, uploadRef, uploadLoading, uploadFile, handleExceed } = createdUploadFile()
// 新增地块
const submitLoading = ref(false)
const dialogVisible = ref(false)
const PlotFormRef = ref(null)
const plotForm = ref({
  id: '',
  name: '',
  demUrl: '',
  satelliteUrl: ''
})
watchEffect(() => {
  plotForm.value.demUrl = fileUrl.value || plotForm.value.demUrl
})
const handleAddPlot = () => {
  plotForm.value = {
    id: '',
    name: '',
    demUrl: '',
    satelliteUrl: ''
  }
  dialogVisible.value = true
}

// 编辑地块
const handleEditPlot = (item) => {
  plotForm.value = JSON.parse(JSON.stringify(item))
  dialogVisible.value = true
}

// 删除地块
const handleDeletePlot = async (item) => {
  try {
    await ElMessageBox.confirm('确定删除该地块吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await removeResource({
      id: item.id
    })
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    console.error('删除失败', error)
  }
}

// 新增/编辑地块数据提交方法
const add = async () => {
  try {
    await PlotFormRef.value.validate()
    submitLoading.value = true
    console.log('新增地块', plotForm.value)
    const params = JSON.parse(JSON.stringify(plotForm.value))
    if (plotForm.value.id) {
      await updateResource(params)
      ElMessage.success('编辑成功')
    } else {
      await createResource(params)
      ElMessage.success('新增成功')
    }

    // 刷新地块列表
    loadData()
    dialogVisible.value = false
  } catch (error) {
    console.error('新增地块失败', error)
  } finally {
    submitLoading.value = false
  }
}

// 获取地块列表
async function loadData() {
  try {
    const { data } = await getResourceList({
      current: 1,
      size: 1000
    })
    console.log('地块列表', data)
    plotList.value = data.records
  } catch (error) {
    console.error('获取地块列表失败', error)
  }
}

onMounted(() => {
  if (route.query.projectId) {
    projectId.value = route.query.projectId as string
  }
  loadData()
})

const uploadApi = async (file) => {
  try {
    uploadImgFlag.value = true
    const { data } = await putFile(file)
    return { url: data.url }
  } finally {
    uploadImgFlag.value = false
  }
}

function createdUploadFile() {
  const uploadRef = ref(null)
  const uploadLoading = ref(false)
  const fileUrl = ref('')
  /**
   * 处理文件上传
   * @param {File} file - 上传的文件对象
   */
  const uploadFile = (file: any) => {
    const isTIF = file.name.includes('.tif')
    if (!isTIF) {
      ElMessage.error('请上传TIF文件')
      return false
    }
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
      fileUrl.value = data.url
    } catch (error) {
      console.error('上传失败', error)
      fileUrl.value = ''
    } finally {
      uploadLoading.value = false
    }
  }
  return {
    fileUrl,
    uploadRef,
    uploadLoading,
    uploadFile,
    handleExceed
  }
}
</script>

<style lang="less" scoped>
.plot-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 14px;

  .plot-item {
    width: calc(25% - 20px);
    min-width: 360px;
    margin: 0 20px 20px 0;

    &:hover {
      background: #f4f9ff;
      box-shadow: 0 4px 4px 0 rgba(58, 131, 252, 0.25);
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #3a83fc;
    }

    &.is-active {
      background: #f4f9ff;
      box-shadow: 0 4px 4px 0 rgba(58, 131, 252, 0.25);
      border-radius: 2px 2px 2px 2px;
      border: 1px solid #3a83fc;
    }
  }
}
</style>
