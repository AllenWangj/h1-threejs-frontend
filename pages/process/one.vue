<template>
  <div class="flex h-full w-full bg-[transparent]">
    <!-- 初始化选择地块 -->
    <div v-if="pageState === 'list'" class="w-full">
      <div class="flex items-center px-[14px]">
        <div class="add-block-button" @click="handleAddPlot">
          <img src="../../assets/images/home/icon-add.png" alt="" width="22px" height="22px" />
          <span>新增地块</span>
        </div>
      </div>
      <div class="plot-wrapper">
        <div
          class="plot-item"
          v-for="(item, index) in plotList"
          :key="index"
          :class="{ 'is-active': currentPlot === item.id }"
          @click="handlePlotClick(item)"
        >
          <div class="w-[100%] pb-[72%] relative">
            <div class="absolute top-0 left-0 right-0 bottom-0">
              <img :src="item.satelliteUrl" alt="" class="w-[100%] h-[100%] object-cover" />
              <span class="absolute right-[23px] bottom-[27px] text-[16px] text-[#fff]">
                {{ formatTime(item.updateTime, 'YYYY-MM-DD HH:mm:ss') }}
              </span>
            </div>
          </div>
          <div class="flex flex-col flex-1 px-[20px] pt-[20px] pb-[36px]">
            <div class="flex items-center">
              <span class="flex-1 text-[28px] text-[#ffffff] font-black">{{ item.name }}</span>
              <div class="flex items-center pb-[10px]">
                <!-- 删除 -->
                <img
                  class="cursor-pointer mx-[9px]"
                  src="../../assets/images/home/icon-project-item-delete.png"
                  alt=""
                  width="22px"
                  height="22px"
                  @click.stop="handleDeletePlot(item)"
                />
                <!-- 修改 -->
                <img
                  class="cursor-pointer"
                  src="../../assets/images/home/icon-project-item-edit.png"
                  alt=""
                  width="22px"
                  height="22px"
                  @click.stop="handleEditPlot(item)"
                />
              </div>
            </div>
            <span class="text-[16px] text-[#69AAEE] mt-[13px]">总面积: {{ item.area }}平方公里</span>
            <span class="text-[16px] text-[#69AAEE] mt-[5px]">经&nbsp;&nbsp;&nbsp;度: {{ item.minX }} ~ {{ item.maxX }}</span>
            <span class="text-[16px] text-[#69AAEE] mt-[5px]">纬&nbsp;&nbsp;&nbsp;度: {{ item.minY }} ~ {{ item.maxY }}</span>
          </div>
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
    <ez-dialog
      v-model="dialogVisible"
      :title="`${plotForm.id ? '编辑' : '新增'}地块`"
      width="600px"
      :loading="submitLoading"
      @confirm="add"
    >
      <el-form ref="PlotFormRef" :model="plotForm" label-width="120px">
        <el-form-item
          label="地块名称"
          prop="name"
          :rules="{ required: true, message: '请输入地块名称', trigger: 'blur' }"
        >
          <el-input v-model="plotForm.name" placeholder="请输入地块名称"></el-input>
        </el-form-item>
        <el-form-item
          v-if="!plotForm.id"
          label="dem文件"
          prop="demUrl"
          :rules="{ required: true, message: '请选择dem文件', trigger: 'blur' }"
        >
          <el-upload
            ref="uploadRef"
            action=""
            accept=".tif"
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="uploadFile"
            :auto-upload="false"
          >
            <template #trigger>
              <el-button type="primary" :loading="uploadLoading">上传dem文件</el-button>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item
          v-if="!plotForm.id"
          label="纹理底图"
          prop="satelliteUrl"
          :rules="{ required: true, message: '请选择纹理底图', trigger: 'blur' }"
        >
          <ez-image-upload
            :limit-size="100"
            v-model="plotForm.satelliteUrl"
            v-loading="uploadImgFlag"
            :api="uploadApi"
          ></ez-image-upload>
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
:deep(.add-block-button) {
  width: 165px;
  height: 73px;
  background-image: url('../../assets/images/home/icon-input-button-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #ffffff;
  line-height: 33px;
  margin-left: auto;

  span {
    margin-left: 10px;
  }
}

.plot-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 14px 54px;

  .plot-item {
    display: flex;
    flex-direction: column;
    width: 406px;
    margin: 0 55px 55px 0;
    background: linear-gradient(180deg, #0865bc 0%, #002051 100%);
    box-shadow:
      0px 0px 12px 0px #125091,
      inset 0px 0px 13px 0px #0796fd;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      box-shadow:
        0px 0px 24px 0px #125091,
        inset 0px 0px 27px 0px #0796fd;
    }
  }
}
</style>
