<template>
  <div class="mb-[10px]" style="display: flex;">
    <div class="text-[14px] text-[#fff] text-center mb-[4px]" style="width: 80px;">{{props.name}}</div>
    <table>
      <thead>
        <tr>
          <th class="w-[90px]">编号</th>
          <th class="w-[74px]">规格(mm)</th>
          <th class="w-[74px]">长度(mm)</th>
          <th class="w-[70px]">数量(个)</th>
          <th class="w-[70px]">材质</th>
          <th class="w-[70px]">重量(kg)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in props.list" :key="item.no">
          <td>{{ item.no }}</td>
          <td>{{ item.spec }}</td>
          <td>{{ item.length }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.material }}</td>
          <td>{{ item.weight }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string
  list: any[]
}>()
</script>

<style lang="less" scoped>
table {
  background: transparent;

  tr {
   border: 1px solid #77B7F9;
  }

  th,
  td {
    padding: 0;
    font-size: 12px;
    font-weight: normal;
    color: #CEE6FF;
    text-align: center;
    border-right: 1px solid #77B7F9;
  }
}
</style>
