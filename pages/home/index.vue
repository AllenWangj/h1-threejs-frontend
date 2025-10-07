<template>
  <div class="w-full h-full flex">
    <!-- 项目列表 -->
    <div class="w-[280px] bg-[#f8f9fa] rounded-[4px] flex flex-col items-center">
      <div class="cursor-pointer flex flex-col justify-center items-center py-[30px]" @click="handleCreateProject">
        <img src="../../assets/images/home/addIcon.svg" alt="add" class="w-[44px] h-[44px]" />
        <span class="text-[#333333] text-[14px] mt-[10px]">新建项目</span>
      </div>
      <div class="w-[100%] h-[1px] bg-[#9CC6ED]"></div>
      <div class="mt-[20px] w-[100%] px-[10px]">
        <el-input v-model="searchText" placeholder="请输入项目名称" class="w-[100%]">
          <template #append>
            <el-button
              :icon="Search"
              class="!text-[#fff] !rounded-[0]"
              style="background: linear-gradient(#3a83fc 16%, #a0c6ff)"
              @click="handleSearchProject"
            />
          </template>
        </el-input>
      </div>
      <div class="list-wrap">
        <div
          class="list-wrap-item"
          v-for="item in projectList"
          :key="item.id"
          :class="{ 'is-active': currentProject === item.id }"
          @click="handleTapProject(item)"
        >
          <div class="list-wrap-item-header w-[100%] flex items-center justify-between">
            <p class="list-wrap-item-header__title">{{ item.name }}</p>
            <span class="flex-1"></span>
            <img
              class="list-wrap-item-header__edit !mr-0"
              src="../../assets/images/home/icon-delete.png"
              alt=""
              @click="handleRemoveProject(item)"
            />
            <img
              class="list-wrap-item-header__edit"
              src="../../assets/images/home/edit.svg"
              alt=""
              @click="handleEditProject(item)"
            />
            <div
              v-if="item.status === 1"
              class="list-wrap-item-header__status status-ongoing"
              @click="handlepushLibarty"
            >
              进行中
            </div>
            <div
              v-else-if="item.status === 2"
              class="list-wrap-item-header__status status-done"
              @click="handlepushLibarty"
            >
              已完成
            </div>
            <div v-else class="list-wrap-item-header__status" @click="handlepushLibarty">未选择</div>
          </div>
          <div class="list-wrap-item-body">
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">地址决策</span>
              <span class="status" v-if="item.siteStatus == 0">未选择</span>
              <span class="status status-ongoing" v-else-if="item.siteStatus == 1">进行中</span>
              <span class="status status-done" v-else-if="item.siteStatus == 2">已完成</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">规划布局</span>
              <span class="status" v-if="item.planLayoutStatus == 0">未选择</span>
              <span class="status status-ongoing" v-else-if="item.planLayoutStatus == 1">进行中</span>
              <span class="status status-done" v-else-if="item.planLayoutStatus == 2">已完成</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">内部结构</span>
              <span class="status" v-if="item.internalLayoutStatus == 0">未选择</span>
              <span class="status status-ongoing" v-else-if="item.internalLayoutStatus == 1">进行中</span>
              <span class="status status-done" v-else-if="item.internalLayoutStatus == 2">已完成</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">结构设计</span>
              <span class="status" v-if="item.structuralDesignStatus == 0">未选择</span>
              <span class="status status-ongoing" v-else-if="item.structuralDesignStatus == 1">进行中</span>
              <span class="status status-done" v-else-if="item.structuralDesignStatus == 2">已完成</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">部件生产</span>
              <span class="status" v-if="item.packingStatus == 0">未选择</span>
              <span class="status status-ongoing" v-else-if="item.packingStatus == 1">进行中</span>
              <span class="status status-done" v-else-if="item.packingStatus == 2">已完成</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">运输保障</span>
              <span class="status" v-if="item.partsProductionStatus == 0">未选择</span>
              <span class="status status-ongoing" v-else-if="item.partsProductionStatus == 1">进行中</span>
              <span class="status status-done" v-else-if="item.partsProductionStatus == 2">已完成</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/type.svg" alt="" />
              <span class="title">现场组装</span>
              <span class="status" v-if="item.assembleStatus == 0">未选择</span>
              <span class="status status-ongoing" v-else-if="item.assembleStatus == 1">进行中</span>
              <span class="status status-done" v-else-if="item.assembleStatus == 2">已完成</span>
            </div>
            <div class="body-item">
              <img class="w-[16px] h-[16px] icon" src="../../assets/images/home/timeIcon.svg" alt="" />
              <span class="title">创建时间</span>
              <span class="status">{{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="relative flex-1 ml-[15px] home-background" v-loading="detailLoading">
      <a
        class="cursor-pointer text-[#007bff] mx-[10px] step-button step-button-1"
        @click="handleStepClick('/process/one', currentProjectDetail.siteStatus)"
      >
        <div>
          <span v-if="currentProjectDetail.siteStatus == 0" class="status-unselected">未选择</span>
          <span v-if="currentProjectDetail.siteStatus == 1" class="status-ongoing">进行中</span>
          <span v-if="currentProjectDetail.siteStatus == 2" class="status-done">已完成</span>
        </div>
      </a>
      <a
        class="cursor-pointer text-[#007bff] mx-[10px] step-button step-button-2"
        @click="handleStepClick('/process/two', currentProjectDetail.planLayoutStatus)"
      >
        <div>
          <span v-if="currentProjectDetail.planLayoutStatus == 0" class="status-unselected">未选择</span>
          <span v-if="currentProjectDetail.planLayoutStatus == 1" class="status-ongoing">进行中</span>
          <span v-if="currentProjectDetail.planLayoutStatus == 2" class="status-done">已完成</span>
        </div>
      </a>
      <a
        class="cursor-pointer text-[#007bff] mx-[10px] step-button step-button-3"
        @click="handleStepClick('/process/three', currentProjectDetail.internalLayoutStatus)"
      >
        <div>
          <span v-if="currentProjectDetail.internalLayoutStatus == 0" class="status-unselected">未选择</span>
          <span v-if="currentProjectDetail.internalLayoutStatus == 1" class="status-ongoing">进行中</span>
          <span v-if="currentProjectDetail.internalLayoutStatus == 2" class="status-done">已完成</span>
        </div>
      </a>
      <a
        class="cursor-pointer text-[#007bff] mx-[10px] step-button step-button-4"
        @click="handleStepClick('/process/four', currentProjectDetail.structuralDesignStatus)"
      >
        <div>
          <span v-if="currentProjectDetail.structuralDesignStatus == 0" class="status-unselected">未选择</span>
          <span v-if="currentProjectDetail.structuralDesignStatus == 1" class="status-ongoing">进行中</span>
          <span v-if="currentProjectDetail.structuralDesignStatus == 2" class="status-done">已完成</span>
        </div>
      </a>
      <a
        class="cursor-pointer text-[#007bff] mx-[10px] step-button step-button-5"
        @click="handleStepClick('/process/five', currentProjectDetail.packingStatus)"
      >
        <div>
          <span v-if="currentProjectDetail.packingStatus == 0" class="status-unselected">未选择</span>
          <span v-if="currentProjectDetail.packingStatus == 1" class="status-ongoing">进行中</span>
          <span v-if="currentProjectDetail.packingStatus == 2" class="status-done">已完成</span>
        </div>
      </a>
      <a
        class="cursor-pointer text-[#007bff] mx-[10px] step-button step-button-6"
        @click="handleStepClick('/process/six', currentProjectDetail.partsProductionStatus)"
      >
        <div>
          <span v-if="currentProjectDetail.partsProductionStatus == 0" class="status-unselected">未选择</span>
          <span v-if="currentProjectDetail.partsProductionStatus == 1" class="status-ongoing">进行中</span>
          <span v-if="currentProjectDetail.partsProductionStatus == 2" class="status-done">已完成</span>
        </div>
      </a>
      <a
        class="cursor-pointer text-[#007bff] mx-[10px] step-button step-button-7"
        @click="handleStepClick('/process/seven', currentProjectDetail.assembleStatus)"
      >
        <div>
          <span v-if="currentProjectDetail.assembleStatus == 0" class="status-unselected">未选择</span>
          <span v-if="currentProjectDetail.assembleStatus == 1" class="status-ongoing">进行中</span>
          <span v-if="currentProjectDetail.assembleStatus == 2" class="status-done">已完成</span>
        </div>
      </a>
    </div>
    <!-- 新建项目 -->
    <ez-dialog
      v-model="dialogFlag"
      :loading="submitLoading"
      title="新建项目"
      width="720px"
      class="project-dialog-container"
      @confirm="handleSubmitProject"
    >
      <el-form ref="projectFormRef" :model="projectForm" :rules="projectFormRules" label-width="120px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="projectForm.name" placeholder="请输入项目名" />
        </el-form-item>
        <el-form-item label="选择建筑类型" prop="types">
          <div class="flex flex-wrap bg-[#f7f8fa] p-[8px] rounded-[4px]">
            <div
              v-for="type in typesList"
              :key="type.id"
              class="cursor-pointer flex flex-col items-center justify-center bg-[#fff] w-[120px] h-[120px] m-[8px] rounded-[4px]"
              :class="projectForm.types.includes(type.id) ? 'is-active' : ''"
              @click="handleSelectType(type.id)"
            >
              <img :src="type.src" alt="" width="46" height="46" />
              <span class="text-[13px]">{{ type.name }}</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </ez-dialog>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@maxtan/ez-ui-icons'
import ProjectStep1 from '../../assets/images/home/project-step-1.svg'
import ProjectStep2 from '../../assets/images/home/project-step-2.svg'
import ProjectStep3 from '../../assets/images/home/project-step-3.svg'
import ProjectStep4 from '../../assets/images/home/project-step-4.svg'
import ProjectStep5 from '../../assets/images/home/project-step-5.svg'
import ProjectStep6 from '../../assets/images/home/project-step-6.svg'
import ProjectStep7 from '../../assets/images/home/project-step-7.svg'

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
// 当前选择的项目id
const currentProject = ref(null)
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
  router.push({ path, query: { projectId: currentProject.value } })
}

// 搜索项目
const handleSearchProject = () => {
  fetchProjectList()
}

// 选择项目
const handleTapProject = (item) => {
  if (!item.id || item.id === currentProject.value) return
  currentProject.value = item.id
  // 当前项目详情
  fetchProjectDetail(item.id)
}

function handlepushLibarty() {
  router.push('/show-mode-libary')
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
      handleSearchProject()
    }
  } catch (error) {}
}
// 编辑项目
const handleEditProject = async (item) => {
  console.log('编辑项目')
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
    src: ProjectStep1
  },
  {
    id: 2,
    name: '规划布局',
    src: ProjectStep2
  },
  {
    id: 3,
    name: '内部布局',
    src: ProjectStep3
  },
  {
    id: 4,
    name: '结构设计',
    src: ProjectStep4
  },
  {
    id: 5,
    name: '部件生产',
    src: ProjectStep5
  },
  {
    id: 6,
    name: '运输保障',
    src: ProjectStep6
  },
  {
    id: 7,
    name: '现场组装',
    src: ProjectStep7
  }
]

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
      await updateProject(projectForm)
    } else {
      // 新建项目
      await createProject(projectForm)
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
    // 默认选择第一个项目
    handleTapProject(projectList.value[0])
  }
}

onMounted(() => {
  fetchProjectList()
})
</script>

<style lang="less" scoped>
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #9cc6ed inset;
}

.list-wrap {
  flex: 1;
  width: 100%;
  margin-top: 10px;
  padding: 0 10px 10px;
  overflow-y: auto;

  .list-wrap-item {
    cursor: pointer;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(116, 166, 248, 0.2);
    border-radius: 4px;
    border: 1px solid #fff;
    padding: 10px;
    margin-bottom: 15px;

    &:hover {
      border: 1px solid #3a83fc;

      .list-wrap-item-header {
        .list-wrap-item-header__title {
          color: #3a83fc;
        }
      }
    }

    .list-wrap-item-header {
      padding: 10px 0;
      border-bottom: 1px solid #9cc6ed;

      .list-wrap-item-header__title {
        font-size: 14px;
        color: #333;
        font-weight: bold;
        // 超出省略号
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .list-wrap-item-header__edit {
        flex-shrink: 0;
        margin: 0 8px;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }

      .list-wrap-item-header__status {
        width: 60px;
        line-height: 24px;
        text-align: center;
        flex-shrink: 0;
        font-size: 12px;
        color: #fff;
        background: #acb3c1;
        border-radius: 23px;
      }

      .list-wrap-item-header__status.status-ongoing {
        background: linear-gradient(270deg, rgba(255, 218, 55, 0.4), #ffc118);
        color: #ff8206;
      }

      .list-wrap-item-header__status.status-done {
        background: linear-gradient(270deg, #e5eeff, #b3cfff);
        color: #3a83fc;
      }
    }

    .list-wrap-item-body {
      margin-top: 10px;

      .body-item {
        display: flex;
        align-items: center;
        padding: 5px 0;

        .icon {
          flex-shrink: 0;
          margin-right: 8px;
        }

        .title {
          flex: 1;
          font-size: 13px;
          color: #333;
          // 超出省略号
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status {
          font-size: 13px;
          color: #777;
        }

        .status-ongoing {
          color: #ff8206;
        }

        .status-done {
          color: #3a83fc;
        }
      }
    }
  }

  .list-wrap-item.is-active {
    border: 1px solid #3a83fc;

    .list-wrap-item-header {
      .list-wrap-item-header__title {
        color: #3a83fc;
      }
    }
  }
}

.home-background {
  position: relative;
  background-image: url('../../assets/images/home/homeRightBk.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;

  .step-button {
    position: absolute;
    background: rgba(255, 255, 255, 0);
    width: 13%;
    height: 27%;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    & > div {
      position: relative;
      width: 172px;
      height: 49px;

      & > span {
        position: absolute;
        top: -12px;
        right: -30px;
        display: inline-block;
        width: 60px;
        height: 24px;
        border-radius: 23px 23px 23px 23px;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }

      & > .status-unselected {
        background: #acb3c1;
        color: #fff;
      }

      & > .status-ongoing {
        background: linear-gradient(270deg, rgba(255, 218, 55, 0.4), #ffc118);
        color: #ff8206;
      }

      & > .status-done {
        background: linear-gradient(270deg, #e5eeff, #b3cfff);
        color: #3a83fc;
      }
    }
  }

  .step-button-1 {
    top: 40%;
    left: 3.5%;

    & > div {
      background-image: url('../../assets/images/home/1-1.svg');
    }

    &:hover {
      & > div {
        background-image: url('../../assets/images/home/1-2.svg');
      }
    }
  }

  .step-button-2 {
    top: 60%;
    left: 14.5%;

    & > div {
      background-image: url('../../assets/images/home/2-1.svg');
    }

    &:hover {
      & > div {
        background-image: url('../../assets/images/home/2-2.svg');
      }
    }
  }

  .step-button-3 {
    top: 67%;
    left: 31.5%;

    & > div {
      background-image: url('../../assets/images/home/3-1.svg');
    }

    &:hover {
      & > div {
        background-image: url('../../assets/images/home/3-2.svg');
      }
    }
  }

  .step-button-4 {
    top: 67%;
    left: 51.5%;

    & > div {
      background-image: url('../../assets/images/home/4-1.svg');
    }

    &:hover {
      & > div {
        background-image: url('../../assets/images/home/4-2.svg');
      }
    }
  }

  .step-button-5 {
    top: 60%;
    left: 69.5%;

    & > div {
      background-image: url('../../assets/images/home/5-1.svg');
    }

    &:hover {
      & > div {
        background-image: url('../../assets/images/home/5-2.svg');
      }
    }
  }

  .step-button-6 {
    top: 40%;
    left: 82.5%;

    & > div {
      background-image: url('../../assets/images/home/6-1.svg');
    }

    &:hover {
      & > div {
        background-image: url('../../assets/images/home/6-2.svg');
      }
    }
  }

  .step-button-7 {
    top: 21%;
    left: 66.5%;

    & > div {
      background-image: url('../../assets/images/home/7-1.svg');
    }

    &:hover {
      & > div {
        background-image: url('../../assets/images/home/7-2.svg');
      }
    }
  }
}

.project-dialog-container {
  .is-active {
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(116, 166, 248, 0.2);
    border-radius: 4px;
    border: 1px solid #3a83fc;

    span {
      color: #3a83fc;
    }
  }
}
</style>
