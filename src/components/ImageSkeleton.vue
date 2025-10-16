<template>
  <div class="relative w-full h-full">
    <img v-if="loaded" :src="src" :alt="alt" class="w-full h-full object-cover" @load="onLoad" />
    <div v-else class="animate-pulse bg-gray-200 w-full h-full" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
interface Props { src: string; alt: string }
const props = defineProps<Props>();
const loaded = ref(false);
function onLoad(){ loaded.value = true; }
onMounted(() => { const img = new Image(); img.src = props.src; img.onload = () => loaded.value = true; });
</script>
