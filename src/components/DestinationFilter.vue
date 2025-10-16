<template>
  <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
    <input v-model="$props.search" @input="$emit('update:search', $props.search)" type="text" placeholder="搜索目的地" class="w-full sm:w-64 px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-primaryBlue" />
    <div class="flex gap-2 flex-wrap">
      <button v-for="c in categories" :key="c.value" @click="toggle(c.value)" :class="['px-3 py-1 rounded-full text-sm', category===c.value ? 'bg-primaryBlue text-white':'bg-gray-100 hover:bg-gray-200']">{{ c.label }}</button>
      <button v-if="category" @click="toggle(null)" class="px-3 py-1 rounded-full text-sm bg-primaryGreen text-white">清除</button>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props { search: string; category: string | null }
interface Emits { (e:'update:search',v:string):void; (e:'update:category',v:string|null):void }
const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { search, category } = props;
const categories = [
  { value: 'island', label: '海岛' },
  { value: 'city', label: '城市' },
  { value: 'mountain', label: '山地' },
  { value: 'nature', label: '自然' },
  { value: 'culture', label: '文化' }
];
function toggle(val: string | null){ emit('update:category', val); }
</script>
