<template>
  <div v-if="destination" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
    <div class="relative bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden">
      <img :src="destination.imageUrl" :alt="destination.name" class="h-56 w-full object-cover" />
      <div class="p-6 space-y-3">
        <h2 class="text-xl font-semibold text-primaryBlue">{{ destination.name }}</h2>
        <p class="text-sm text-gray-700">{{ destination.description }}</p>
        <div v-if="destination.bestSeason" class="text-xs text-gray-500">最佳季节: {{ destination.bestSeason }}</div>
        <div v-if="destination.basePrice" class="text-sm font-medium text-primaryGreen">参考价格: ¥{{ destination.basePrice }}</div>
        <div class="flex gap-2 flex-wrap">
          <span v-for="t in destination.tags" :key="t" class="text-[10px] px-2 py-0.5 bg-primaryBlue/10 text-primaryBlue rounded-full">{{ t }}</span>
        </div>
        <RouterLink :to="'/booking?dest=' + destination.id" class="inline-block px-4 py-2 bg-primaryBlue text-white rounded hover:bg-primaryBlue/90">前往预定</RouterLink>
        <button @click="$emit('close')" class="ml-2 inline-block px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">关闭</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Destination } from '../types/destination';
import { RouterLink } from 'vue-router';
interface Props { destination: Destination | null }
defineProps<Props>();
</script>
