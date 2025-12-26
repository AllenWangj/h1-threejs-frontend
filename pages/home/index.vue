<template>
  <div class="w-full h-full flex pt-[70px] px-[6%] pb-[20px]">
    <!-- 项目列表 -->
    <div class="w-[436px] rounded-[4px] flex flex-col items-center home-side-bar">
      <div class="w-[100%] side-bar-search-box">
        <el-input
          v-model="searchText"
          placeholder="搜索"
          @keydown.enter="handleSearchProject"
          @blur="handleSearchProject"
          class="w-[282px] h-[73px] rounded-[16px] text-[24px]"
        >
          <template #prefix>
            <div class="pl-[20px]">
              <img src="../../assets/images/home/icon-input-search.png" alt="" width="25px" height="25px" />
            </div>
          </template>
        </el-input>
        <div class="side-bar-search-box-botton" @click="handleCreateProject">
          <img src="../../assets/images/home/icon-add.png" alt="" width="22px" height="22px" />
          <span>新建</span>
        </div>
      </div>
      <div class="list-wrap">
        <div
          class="list-wrap-item"
          v-for="item in projectList"
          :key="item.id"
          :class="{ 'is-active': currentProject.id === item.id }"
          @click="handleTapProject(item)"
        >
          <div class="list-wrap-item-header w-[100%] flex items-center justify-between">
            <p class="list-wrap-item-header__title">{{ item.name }}</p>
            <div v-if="item.status === 1" class="status-ongoing ml-[10px]">
              <!-- 进行中 -->
              <img src="../../assets/images/home/icon-project-status-ongoing.png" alt="" class="w-[66px] h-[31px]" />
            </div>
            <div v-else-if="item.status === 2" class="status-done ml-[10px]">
              <!-- 已完成 -->
              <img src="../../assets/images/home/icon-project-status-done.png" alt="" class="w-[66px] h-[31px]" />
            </div>
            <div v-else class="status-waiting ml-[10px]">
              <!-- 未开始 -->
              <img src="../../assets/images/home/icon-project-status-waiting.png" alt="" class="w-[66px] h-[31px]" />
            </div>
            <span class="flex-1"></span>
            <img
              class="cursor-pointer mr-[9px] ml-[10px]"
              src="../../assets/images/home/icon-project-item-delete.png"
              alt=""
              width="22px"
              height="22px"
              @click.stop="handleRemoveProject(item)"
            />
            <img
              class="cursor-pointer"
              src="../../assets/images/home/icon-project-item-edit.png"
              alt=""
              width="22px"
              height="22px"
              @click.stop="handleEditProject(item)"
            />
          </div>
          <div class="list-wrap-item-body">
            <span class="title">创建时间</span>
            <span class="status">{{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="relative flex-1 ml-[118px] home-background" v-loading="detailLoading" element-loading-background="rgba(0,0,0,0.5)">
      <div
        v-for="item in projectDetailList"
        :key="item.id"
        class="h-[50%] w-[25%] min-w-[250px]"
        @click="handleStepClick(item.path, item.status)"
      >
        <div class="home-main-item">
          <div class="relative h-[100%]">
            <img class="home-main-item-bg" src="../../assets/images/home/icon-project-step-bg.png" alt="" />
            <img
              class="home-main-item-bg-active"
              src="../../assets/images/home/icon-project-step-bg-active.png"
              alt=""
            />
            <div class="content">
              <img class="content-img" :src="item.src" alt="" />
              <span class="title">{{ item.name }}</span>
              <div class="step-status-box">
                <img
                  v-if="item.status === 0"
                  src="../../assets/images/home/icon-project-step-status-waiting.png"
                  alt=""
                  width="24px"
                  height="24px"
                />
                <img
                  v-else-if="item.status === 1"
                  src="../../assets/images/home/icon-project-step-status-ongoing.png"
                  alt=""
                  width="24px"
                  height="24px"
                />
                <img
                  v-else-if="item.status === 2"
                  src="../../assets/images/home/icon-project-step-status-done.png"
                  alt=""
                  width="24px"
                  height="24px"
                />
                <span>{{ item.status === 2 ? '已完成' : item.status === 1 ? '进行中' : '未选择' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h-[50%] w-[25%] min-w-[250px]" @click="handleModelLibraryClick()">
        <div class="home-main-item">
          <div class="relative h-[100%]">
            <img class="home-main-item-bg" src="../../assets/images/home/icon-project-step-bg.png" alt="" />
            <img
              class="home-main-item-bg-active"
              src="../../assets/images/home/icon-project-step-bg-active.png"
              alt=""
            />
            <div class="content">
              <img class="content-img" src="../../assets/images/home/icon-project-step-8.png" alt="" />
              <span class="title">模型库</span>
              <div class="step-status-box opacity-0">
                <!-- 占位 -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新建项目 -->
    <el-drawer v-model="dialogFlag" direction="rtl" title="新建项目" class="project-dialog-container">
      <el-form ref="projectFormRef" label-position="top" :model="projectForm" :rules="projectFormRules">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectForm.name" placeholder="请输入项目名" size="large" />
        </el-form-item>
        <el-form-item label="选择建筑类型" prop="types">
          <div class="flex flex-wrap justify-between p-[8px] rounded-[4px]">
            <div
              v-for="type in typesList"
              :key="type.id"
              class="add-project-type-item"
              :class="projectForm.types.includes(type.id) ? 'is-active' : ''"
              @click="handleSelectType(type.id)"
            >
              <img :src="type.icon" alt="" width="101" height="101" />
              <span class="text-[13px]">{{ type.name }}</span>
            </div>
            <!-- 占位 -->
            <div class="w-[149px]"></div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex items-center justify-center project-dialog-footer">
          <el-button class="button-comfirm" @click="handleSubmitProject">确定</el-button>
          <el-button class="button-cancel" @click="dialogFlag = false">取消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import ProjectStep1 from '../../assets/images/home/icon-project-step-1.png'
import ProjectStep2 from '../../assets/images/home/icon-project-step-2.png'
import ProjectStep3 from '../../assets/images/home/icon-project-step-3.png'
import ProjectStep4 from '../../assets/images/home/icon-project-step-4.png'
import ProjectStep5 from '../../assets/images/home/icon-project-step-5.png'
import ProjectStep6 from '../../assets/images/home/icon-project-step-6.png'
import ProjectStep7 from '../../assets/images/home/icon-project-step-7.png'

import IconProjectItem1 from '../../assets/images/home/icon-project-item-1.png'
import IconProjectItem2 from '../../assets/images/home/icon-project-item-2.png'
import IconProjectItem3 from '../../assets/images/home/icon-project-item-3.png'
import IconProjectItem4 from '../../assets/images/home/icon-project-item-4.png'
import IconProjectItem5 from '../../assets/images/home/icon-project-item-5.png'
import IconProjectItem6 from '../../assets/images/home/icon-project-item-6.png'
import IconProjectItem7 from '../../assets/images/home/icon-project-item-7.png'

import { getProjectList, createProject, removeProject, getProjectDetail, updateProject } from '~~/apis/project'
import dayjs from 'dayjs'

definePageMeta({
  permissions: 'home'
})

const router = useRouter()
// 搜索条件
const searchText = ref('')
// 项目列表
const projectList = ref([])
// 当前选择的项目
const currentProject = ref<any>({})
// 项目详情loading
const detailLoading = ref(false)
// 当前查看详情的项目
const currentProjectDetail = ref({
  siteStatus: 0,
  planLayoutStatus: 0,
  internalLayoutStatus: 0,
  structuralDesignStatus: 0,
  packingStatus: 0,
  partsProductionStatus: 0,
  assembleStatus: 0
})

// 步骤点击
const handleStepClick = (path, status) => {
  if (status <= 0) {
    ElMessage.warning('当前状态不能操作')
    return
  }
  router.push({ path, query: { projectId: currentProject.value.id } })
}

const handleModelLibraryClick = () => {
  router.push({ path: '/model-library' })
}

// 搜索项目
const handleSearchProject = () => {
  if (!searchText.value.trim()) return
  fetchProjectList()
}

// 选择项目
const handleTapProject = (item) => {
  if (!item.id || item.id === currentProject.value.id) return
  currentProject.value = item
  // 本地缓存
  sessionStorage.setItem('currentProject', JSON.stringify(item))
  // 当前项目详情
  fetchProjectDetail(item.id)
}

// 删除项目
const handleRemoveProject = async (item) => {
  console.log('删除项目')
  try {
    const confirm = await ElMessageBox.confirm('此操作将永久删除该项目, 是否继续?', '提示')
    if (confirm === 'confirm') {
      // 删除项目逻辑
      await removeProject({ id: item.id })
      ElMessage.success('操作成功！')
      // 刷新列表
      fetchProjectList()
    }
  } catch (error) {}
}
// 编辑项目
const handleEditProject = async (item) => {
  dialogFlag.value = true
  projectForm.id = item.id
  projectForm.name = item.name
  projectForm.types = item.types ? item.types.split(',').map((type) => Number(type)) : []
}

// 新增弹窗
const dialogFlag = ref(false)
const submitLoading = ref(false)
const projectFormRef = ref(null)
// 项目数据
const projectForm = reactive({
  id: '',
  name: '',
  types: []
})
const projectFormRules = {
  name: [{ required: true, message: '请输入项目名', trigger: 'blur' }],
  types: [{ required: true, message: '请选择建筑类型', trigger: 'change' }]
}
const typesList = [
  {
    id: 1,
    name: '选址决策',
    src: ProjectStep1,
    icon: IconProjectItem1,
    path: '/process/list-one'
  },
  {
    id: 2,
    name: '规划布局',
    src: ProjectStep2,
    icon: IconProjectItem2,
    path: '/process/two'
  },
  {
    id: 3,
    name: '内部布局',
    src: ProjectStep3,
    icon: IconProjectItem3,
    path: '/process/three'
  },
  {
    id: 4,
    name: '结构设计',
    src: ProjectStep4,
    icon: IconProjectItem4,
    path: '/process/four'
  },
  {
    id: 5,
    name: '部件生产',
    src: ProjectStep5,
    icon: IconProjectItem5,
    path: '/process/five'
  },
  {
    id: 6,
    name: '运输保障',
    src: ProjectStep6,
    icon: IconProjectItem6,
    path: '/process/six'
  },
  {
    id: 7,
    name: '现场组装',
    src: ProjectStep7,
    icon: IconProjectItem7,
    path: '/process/seven'
  }
]

const projectDetailList = ref<any[]>([...typesList])

// 打开新增弹窗
const handleCreateProject = () => {
  dialogFlag.value = true
  projectForm.id = ''
  projectForm.name = ''
  projectForm.types = []
}

// 新建/编辑项目数据提交
const handleSubmitProject = async () => {
  try {
    submitLoading.value = true
    await projectFormRef.value.validate()
    const params = JSON.parse(JSON.stringify(projectForm))
    params.types = params.types.join(',')
    if (projectForm.id) {
      // 编辑项目
      await updateProject(params)
    } else {
      // 新建项目
      await createProject(params)
    }
    ElMessage.success('操作成功！')
    dialogFlag.value = false
    // 刷新列表
    fetchProjectList()
  } catch (error) {
    console.error('验证失败', error)
  } finally {
    submitLoading.value = false
  }
}

// 选择建筑类型
const handleSelectType = (id: number) => {
  if (projectForm.types.includes(id)) {
    projectForm.types = projectForm.types.filter((item) => item !== id)
  } else {
    projectForm.types.push(id)
  }
}

/**
 * 获取项目详情
 */
async function fetchProjectDetail(id: number) {
  try {
    detailLoading.value = true
    const { data } = await getProjectDetail({ id })
    console.log('项目详情', data)
    currentProjectDetail.value = data

    projectDetailList.value = projectDetailList.value.map((item) => {
      let status = 0
      switch (item.id) {
        case 1:
          status = data.siteStatus
          break
        case 2:
          status = data.planLayoutStatus
          break
        case 3:
          status = data.internalLayoutStatus
          break
        case 4:
          status = data.structuralDesignStatus
          break
        case 5:
          status = data.partsProductionStatus
          break
        case 6:
          status = data.packingStatus
          break
        case 7:
          status = data.assembleStatus
          break
        default:
          break
      }
      return {
        ...item,
        status
      }
    })
  } catch (error) {
    console.error('获取项目详情失败', error)
  } finally {
    detailLoading.value = false
  }
}
/**
 * 获取项目列表
 */
async function fetchProjectList() {
  const res = await getProjectList({
    name: searchText.value,
    current: 1,
    size: 1000
  })
  projectList.value = res.data.records || []
  if (projectList.value.length) {
    const currentProjectCache = JSON.parse(sessionStorage.getItem('currentProject') || '{}')
    const item = projectList.value.find((p) => p.id === currentProjectCache.id)
    // 默认选择第一个项目
    handleTapProject(item ? item : projectList.value[0])
  }
}

onMounted(() => {
  fetchProjectList()
})
</script>

<style lang="less" scoped>
.home-side-bar {
  :deep(.el-input) {
    --el-text-color-placeholder: #94b8de;
  }
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0 transparent inset;
    background: transparent;
    background-image: url('../../assets/images/home/icon-input-bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .el-input__inner {
      color: #fff;
    }
  }

  .side-bar-search-box {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .side-bar-search-box-botton {
      cursor: pointer;
      width: 137px;
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

      span {
        margin-left: 10px;
      }
    }
  }
}

.list-wrap {
  margin-top: 30px;
  flex: 1;
  width: 100%;
  overflow-y: auto;

  // 隐藏滚动条
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE / Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome / Safari */
  }

  .list-wrap-item {
    cursor: pointer;
    width: 100%;
    height: 107px;
    padding: 0px 34px;
    margin-bottom: 18px;
    background-image: url('../../assets/images/home/icon-project-item-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .list-wrap-item-header {
      .list-wrap-item-header__title {
        font-weight: 600;
        font-size: 24px;
        color: #ffffff;
        line-height: 33px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }

    .list-wrap-item-body {
      margin-top: 7px;
      font-weight: 400;
      font-size: 18px;
      color: #69aaee;
      line-height: 25px;
    }

    &:hover {
      background-image: url('../../assets/images/home/icon-project-item-bg-active.png');
    }
  }

  .list-wrap-item.is-active {
    background-image: url('../../assets/images/home/icon-project-item-bg-active.png');
    // .list-wrap-item-header {
    //   .list-wrap-item-header__title {
    //     color: #398eff;
    //   }
    // }
  }
}

.home-background {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  overflow-y: auto;
  // 隐藏滚动条
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE / Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome / Safari */
  }

  .home-main-item {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .home-main-item-bg {
      display: block;
      width: auto;
      height: 100%;
    }

    .home-main-item-bg-active {
      display: none;
      width: auto;
      height: 100%;
    }

    &:hover {
      .home-main-item-bg {
        display: none;
      }
      .home-main-item-bg-active {
        display: block;
      }

      .content {
        .title {
          color: #398eff;
          font-weight: bold;
        }
      }
    }

    .content {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .content-img {
        // min-width: 150px;
        width: 50%;
        object-fit: contain;
      }

      .title {
        margin-top: 20%;
        font-weight: 400;
        font-size: 35px;
        color: #d8e9ff;
        line-height: 49px;
        letter-spacing: 3px;
      }

      .step-status-box {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 3px;

        span {
          margin-left: 9px;
          font-weight: 400;
          font-size: 20px;
          color: #69aaee;
          line-height: 28px;
        }
      }
    }
  }
}

:deep(.project-dialog-container) {
  background: #022e67;
  width: 714px !important;

  .el-drawer__header {
    background: #10427d;
    color: #fff;
    padding-bottom: 20px;

    .el-drawer__close-btn {
      color: #ffffff;
    }
  }

  .el-drawer__body {
    .el-input {
      --el-text-color-placeholder: #69aaee;
      --el-input-border-color: #3a78c0;
    }

    .el-form-item__label {
      font-weight: 600;
      font-size: 18px;
      color: #69aaee;
      line-height: 25px;
    }

    .el-input__wrapper {
      background: #114e8e;

      .el-input__inner {
        color: #fff;
      }
    }

    .add-project-type-item {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 148px;
      height: 149px;
      background: #114e8e;
      border-radius: 6px;
      border: 1px solid #3a78c0;
      margin-bottom: 16px;

      span {
        margin-top: 4px;
        font-weight: 400;
        font-size: 18px;
        color: #69aaee;
        line-height: 25px;
      }
    }

    .add-project-type-item.is-active {
      background: #114e8e;
      box-shadow: inset 0px 0px 27px 0px #0796fd;
      border-radius: 6px;
      border: 1px solid #3a78c0;
    }
  }

  .project-dialog-footer {
    .el-button {
      position: relative;
      width: 137px;
      height: 63px;
      font-size: 24px;
      color: #238ce8;
      border-radius: 16px; /* 与伪元素圆角一致 */
      overflow: hidden; /* 裁剪伪元素超出的圆角部分 */
      background-color: #022e67; /* 内容区背景 */
      border-width: 0;
    }

    .el-button + .el-button {
      margin-left: 30px;
    }

    /* 伪元素实现渐变边框 */
    .button-comfirm::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 16px; /* 继承父元素圆角 */
      padding: 2px; /* 边框宽度 */
      background: linear-gradient(
        180deg,
        rgba(185, 221, 255, 1),
        rgba(65, 158, 255, 1),
        rgba(185, 221, 255, 1)
      ); /* 渐变样式 */
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor; /* 仅显示 padding 区域（边框） */
      mask-composite: exclude; /* 标准写法，兼容现代浏览器 */
      pointer-events: none; /* 不影响鼠标交互 */
    }

    .button-cancel {
      background-image: url('../../assets/images/home/icon-input-button-bg.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      color: #fff;
    }
  }
}
</style>
