<template>
  <div class="w-full h-full pt-[30px] px-[40px]">
    <ez-fast-table
      ref="tableRef"
      v-model:params="searchParams"
      v-model:loading="loading"
      :columns="columns"
      :api="getModelPage"
      :max-height="tableMaxHeight"
      :stripe="true"
      :border="false"
    >
      <template #form>
        <el-form :model="searchParams" size="large" inline label-width="auto" @submit.prevent @keyup.enter="search">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="模型名称" class="w-[100%]">
                <el-input
                  v-model="searchParams.name"
                  clearable
                  size="large"
                  placeholder="请输入模型名称"
                  class="!w-[100%]"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="模型编码" class="w-[100%]">
                <el-input
                  v-model="searchParams.code"
                  clearable
                  size="large"
                  placeholder="请输入模型编码"
                  class="!w-[100%]"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="模型类型" class="w-[100%]">
                <ez-select
                  v-model="searchParams.type"
                  :options="typeOptions"
                  clearable
                  size="large"
                  placeholder="请选择模型类型"
                  class="!w-[100%]"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template #header>
        <el-button class="add-model-button" type="primary" size="large" :icon="Plus" @click="addItem">新增</el-button>
      </template>
      <template #operation="{ row }">
        <el-button link type="primary" @click="editItem(row)">编辑</el-button>
        <el-button link type="primary" @click="deleteItem(row)">删除</el-button>
      </template>
    </ez-fast-table>
    <ez-dialog
      v-model="recordVisible"
      :loading="submitLoading"
      width="1200px"
      :title="recordId ? '编辑模型' : '新增模型'"
      @confirm="submit"
    >
      <model-form v-if="recordVisible" ref="modelFormRef" :recordId="recordId" />
    </ez-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@maxtan/ez-ui-icons'
import type { TableColumn } from '@maxtan/ez-ui'
import { createModel, getModelPage, updateModal, removeModel } from '~/apis/resource'
import dayjs from 'dayjs'
import type { ModelItem } from '~/types/model'
import ModelForm from '@/pages/model/components/model-form.vue'

const recordVisible = ref(false)
const modelFormRef = ref<InstanceType<typeof ModelForm>>(null)
const recordId = ref('')
const loading = ref(false)
const submitLoading = ref(false)
const { tableMaxHeight } = useLayout()
const searchParams = ref({
  name: '',
  code: '',
  type: null,
  current: 1,
  size: 10
})
const typeOptions = [
  { label: 'glb', value: 1 },
  { label: 'gltf', value: 2 }
]
const columns = reactive<TableColumn<ModelItem>[]>([
  { prop: 'name', label: '模型名称', width: 200, fixed: 'left', sortable: true },
  { prop: 'type', label: '模型类型', formatter: (row) => (row.type === 1 ? 'glb' : row.type === 2 ? 'gltf' : '') },
  { prop: 'code', label: '模型编码' },
  { prop: 'length', label: '长度', formatter: (row) => `${row.length}mm` },
  { prop: 'width', label: '宽度', formatter: (row) => `${row.width}mm` },
  { prop: 'height', label: '高度', formatter: (row) => `${row.height}mm` },
  { prop: 'createTime', label: '创建时间', formatter: (row) => dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') },
  { prop: 'operation', label: '操作', width: 200, fixed: 'right' }
])
const tableRef = ref()
/**
 * 搜索
 */
const search = () => {
  searchParams.value.current = 1
  tableRef.value.search()
}

/**
 * 新增
 */
const addItem = () => {
  recordId.value = ''
  recordVisible.value = true
}

/**
 * 编辑
 */
const editItem = (item: ModelItem) => {
  recordId.value = item.id
  recordVisible.value = true
}

/**
 * 删除
 */
const deleteItem = async (_item) => {
  // 删除逻辑
  try {
    const confirm = await ElMessageBox.confirm('是否删除?', '提示')
    if (confirm === 'confirm') {
      await removeModel({ id: _item.id })
      ElMessage.success('操作成功！')
      search()
    }
  } catch (error) {}
}
const submit = async () => {
  try {
    const formData = await modelFormRef.value?.getFormData()
    if (submitLoading.value === true) return
    submitLoading.value = true
    if (recordId.value) {
      await updateModal({ ...formData, id: recordId.value })
      ElMessage.success('修改成功')
      search()
    } else {
      await createModel({ ...formData })
      ElMessage.success('保存成功')
      search()
    }
    recordVisible.value = false
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  search()
})
</script>

<style lang="less" scoped>
:deep(.ez-fast-table) {
  background: transparent;

  .ez-search-from {
    --el-text-color-placeholder: #69aaee;
    --el-text-color-regular: #69aaee;

    .el-form-item {
      .el-form-item__label {
        font-weight: 600;
        font-size: 18px;
        color: #69aaee;
      }

      .el-input__wrapper {
        background: #114e8e;
        border-radius: 6px;
        --el-input-border-color: #3a78c0;

        .el-input__inner {
          color: #fff;
          font-size: 18px;
        }
      }

      .el-select__wrapper {
        background: #114e8e;
        border-radius: 6px;
        color: #fff;
        font-size: 18px;
        --el-select-multiple-input-color: #fff;
        --el-text-color-regular: #fff;
        --el-border-color: #3a78c0;

        .el-input__inner {
          color: #fff;
          font-weight: 600;
          font-size: 18px;
        }
      }
    }
    .ez-search-from_operate {
      .el-button.el-button--small.is-circle {
        display: none;
      }

      .el-button {
        position: relative;
        height: 41px;
        font-size: 18px;
        padding: 0 27px;
        color: #238ce8;
        border-radius: 8px; /* 与伪元素圆角一致 */
        overflow: hidden; /* 裁剪伪元素超出的圆角部分 */
        background-color: #022e67; /* 内容区背景 */
        border-width: 0;
      }

      /* 伪元素实现渐变边框 */
      .el-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 8px; /* 继承父元素圆角 */
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

      .el-button--primary {
        background-image: url('../../assets/images/home/icon-input-button-bg.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        color: #fff;
      }

      .el-button--primary::before {
        background: transparent;
      }
    }
  }

  .ez-fast-table-wrapper_header {
    padding: 10px 0;
    align-items: center;

    .add-model-button {
      position: relative;
      height: 41px;
      font-size: 18px;
      padding: 0 27px;
      color: #238ce8;
      border-radius: 8px; /* 与伪元素圆角一致 */
      overflow: hidden; /* 裁剪伪元素超出的圆角部分 */
      background-color: #022e67; /* 内容区背景 */
      border-width: 0;
    }

    /* 伪元素实现渐变边框 */
    .add-model-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 8px; /* 继承父元素圆角 */
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

    .el-button.is-circle {
      color: #fff;
      background-color: #022e67;
      --el-border-color: #3689f7;
    }
  }

  .ez-fast-table-wrapper {
    background: transparent;

    .el-table {
      --el-table-bg-color: transparent;
      --el-table-tr-bg-color: linear-gradient(180deg, #00589f 0%, #79b8ff 100%);
      --el-fill-color-lighter: #0b3867;
      --el-table-row-hover-bg-color: #1458b0;
      --el-table-header-bg-color: linear-gradient(180deg, #0c3463, #1d3c68);
      --el-table-header-text-color: #69aaee;
      --el-table-border-color: transparent;
      .el-table__header {
        border-radius: 16px 16px 0px 0px;
        background: var(--el-table-header-bg-color);
      }

      .el-table__row {
        background: #03244b;
      }
      .el-table__cell {
        padding: 20px 0;
      }
      .cell {
        font-weight: 600;
        font-size: 18px;
        color: #69aaee;
      }
    }

    .el-pagination {
      --el-text-color-regular: rgba(255, 255, 255, 0.65);
      --el-pagination-bg-color: #114e8e;
      --el-pagination-button-color: rgba(255, 255, 255, 0.5);
      --el-pagination-button-disabled-bg-color: rgba(255, 255, 255, 0.2);
      --el-pagination-button-disabled-color: rgba(255, 255, 255, 0.2);
      margin-top: 17px;

      li {
        margin: 0 2px;
      }

      .el-select__wrapper {
        background: #114e8e;
        color: #fff;
        --el-select-multiple-input-color: #fff;
        --el-text-color-regular: #fff;
        --el-border-color: rgba(255, 255, 255, 0.5);
      }

      .el-input__wrapper {
        background: #114e8e;
        border-radius: 6px;
        --el-input-border-color: #3a78c0;

        .el-input__inner {
          color: #fff;
        }
      }
    }
  }
}
</style>
