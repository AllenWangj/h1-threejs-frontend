<template>
  <div>
    <ez-fast-table
      ref="tableRef"
      v-model:params="searchParams"
      v-model:loading="loading"
      :columns="columns"
      :api="getStudentSettledPage"
      :max-height="tableMaxHeight"
    >
      <template #form>
        <el-form :model="searchParams" inline label-width="auto" @submit.prevent @keyup.enter="search">
          <el-form-item label="模型名称">
            <el-input v-model="searchParams.name" clearable />
          </el-form-item>
        </el-form>
      </template>
      <template #header>
        <el-button type="primary" :icon="Plus" @click="addItem">新增</el-button>
      </template>
      <template #operation="{ row }">
        <el-button link type="primary" @click="viewItem(row)">查看</el-button>
        <el-button link type="primary" @click="editItem(row)">编辑</el-button>
        <el-button link type="primary" @click="deleteItem(row)">删除</el-button>
      </template>
    </ez-fast-table>

    <ez-dialog v-model="dialogVisible" title="新增模型">
      <el-form ref="formRef" :model="formData" label-width="100px" :rules="rules">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="formData.name" clearable />
        </el-form-item>
        <el-form-item label="模型地址" prop="url">
          <!-- <el-input v-model="formData.url" clearable /> -->
          <p v-if="formData.url" class="mr-[20px]">{{ formData.url }}</p>
          <el-upload
            ref="uploadRef"
            accept=".zip"
            action=""
            :auto-upload="false"
            :on-change="uploadFile"
            :before-remove="removeFile"
            :show-file-list="false"
          >
            <el-button type="primary" :disabled="uploadLoading" :loading="uploadLoading">
              {{ uploadLoading ? '上传中...' : '点击上传' }}
            </el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" clearable />
        </el-form-item>
      </el-form>
    </ez-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@maxtan/ez-ui-icons'
import type { SelectOption, TableColumn } from '@maxtan/ez-ui'
import { useUpload } from '~/composables/use-upload'
definePageMeta({
  layout: 'management',
  permissions: 'management'
})

const router = useRouter()
const { fetchOssAuth, loadFile } = useUpload()

const loading = ref(false)
const { formatTime } = useUtils()
const { tableMaxHeight } = useLayout()
const searchParams = reactive({
  name: '',
  current: 1,
  size: 10
})

const columns = reactive<TableColumn<any>[]>([
  { prop: 'name', label: '模型名称', width: 200, fixed: 'left', sortable: true },
  {
    prop: 'previewUrl',
    label: '预览地址'
  },
  {
    prop: 'createTime',
    label: '创建时间'
  },
  { prop: 'operation', label: '操作', width: 200, fixed: 'right' }
])
const tableRef = ref()
/**
 * 搜索
 */
const search = () => {
  searchParams.current = 1
  tableRef.value.search()
}

/**
 * 新增
 */
const addItem = () => {
  dialogVisible.value = true
}

/**
 * 查看
 */
const viewItem = (_item) => {
  router.push(`/student/bank/detail?id=${_item.id}`)
}

/**
 * 编辑
 */
const editItem = (_item) => {
  router.push(`/student/bank/edit?id=${_item.id}`)
}

/**
 * 删除
 */
const deleteItem = (_item) => {
  // 删除逻辑
}

onMounted(() => {
  fetchOssAuth()
  search()
})

/**
 * 模拟请求
 */
const getStudentSettledPage = async (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          size: 10,
          current: 1,
          records: [
            {
              createTime: 1730988193411,
              createBy: '2d236942518d35cd',
              updateTime: 1754875131321,
              updateBy: '2d236942518d35cd',
              id: '2d236942518d35cd',
              name: null,
              password: null,
              email: null,
              realName: '谭鹏',
              avatar: null,
              status: 0,
              mobile: 'xxxx',
              source: 1,
              birth: null,
              gender: null,
              province: null,
              city: null,
              country: null
            }
          ],
          total: 1,
          pages: 1
        },
        message: '成功',
        success: true,
        timestamp: 1754879682677
      })
    }, 1000)
  })
}

// 新增对话框显示控制
const dialogVisible = ref(false)

const formData = reactive({
  name: '',
  url: 'wwww.baidu.com',
  remark: ''
})
const rules = reactive({
  name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
  url: [{ required: true, message: '请输入模型地址', trigger: 'blur' }]
})
const { uploadRef, uploadLoading, uploadFile, removeFile } = createdUploadFile()

/**
 * 创建文件上传相关方法和状态
 * @function createdUploadFile
 * @returns {Object} 上传文件相关的方法和状态
 */
function createdUploadFile() {
  const uploadRef = ref(null)
  const uploadLoading = ref(false)

  /**
   * 处理文件上传
   * @param {File} file - 上传的文件对象
   */
  const uploadFile = (file: any) => {
    formData.name = file.name
    submitFile(file)
  }

  /**
   * 移除已上传的文件
   */
  const removeFile = () => {
    uploadRef.value?.clearFiles()
    return true
  }

  /**
   * 提交文件到服务器
   * @param {File} file - 要上传的文件
   */
  const submitFile = async (file: any) => {
    try {
      uploadLoading.value = true
      const { url } = await loadFile(file.raw)
      ElMessage.success('上传成功')
      formData.url = url
    } catch (error) {
      formData.name = ''
      formData.url = ''
    } finally {
      uploadLoading.value = false
      removeFile()
    }
  }

  return {
    uploadRef,
    uploadLoading,
    uploadFile,
    removeFile
  }
}
</script>
