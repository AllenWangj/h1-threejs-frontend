<template>
  <div>
    <div class="text-[10px] text-[#fff] text-center mb-[4px]">梁</div>
    <table>
      <thead>
        <tr>
          <th class="w-[38px]">编号</th>
          <th class="w-[44px]">规格(mm)</th>
          <th class="w-[44px]">长度(mm)</th>
          <th class="w-[44px]">数量(个)</th>
          <th class="w-[44px]">材质</th>
          <th class="w-[44px]">重量(kg)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.no">
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
const tableData = [
  {
    no: 'GKL-01',
    spec: '刚框梁1',
    length: 3800,
    quantity: 10,
    material: 'Q255B',
    weight: 107.882
  },
  {
    no: 'GKL-02',
    spec: '刚框梁2',
    length: 4200,
    quantity: 8,
    material: 'Q255B',
    weight: 107.882
  },
]
</script>

<style lang="less" scoped>
table {
  background: transparent;

  tr {
    border: 1px solid #333;
  }

  th,
  td {
    padding: 0;
    font-size: 8px;
    font-weight: normal;
    color: #fff;
    text-align: center;
    border-right: 1px solid #333;
  }
}
</style>
