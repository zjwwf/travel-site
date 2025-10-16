<template>
  <div class="group rounded-xl overflow-hidden shadow hover:shadow-md transition cursor-pointer bg-white" @click="$emit('select')" role="button" :aria-label="destination.name">
    <div class="aspect-video overflow-hidden">
      <ImageSkeleton :src="destination.imageUrl" :alt="destination.name" />
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-primaryBlue mb-1 text-base">{{ destination.name }}</h3>
      <p class="text-xs text-gray-600 line-clamp-2">{{ destination.shortDescription }}</p>
      <div class="mt-2 flex flex-wrap gap-1">
        <span v-for="t in destination.tags" :key="t" class="text-[10px] px-2 py-0.5 bg-primaryGreen/10 text-primaryGreen rounded-full">{{ t }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Destination } from '../types/destination';
import ImageSkeleton from './ImageSkeleton.vue';
interface Props { destination: Destination }
defineProps<Props>();
</script>
