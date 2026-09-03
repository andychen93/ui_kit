<script setup lang="ts">
defineProps<{
  columns: string[];
  rows: string[][];
}>();
</script>

<template>
  <table class="doc-api">
    <thead>
      <tr>
        <th v-for="c in columns" :key="c">{{ c }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in rows" :key="i">
        <td v-for="(cell, j) in row" :key="j">
          <code v-if="j === 0">{{ cell }}</code>
          <template v-else>{{ cell }}</template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
