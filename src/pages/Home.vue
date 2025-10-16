<template>
  <div>
    <section class="mb-10 rounded-xl overflow-hidden relative">
      <div class="h-48 sm:h-64 w-full bg-gradient-to-r from-primaryBlue to-primaryGreen flex items-center justify-center text-white">
        <div class="text-center px-4">
          <h1 class="text-2xl sm:text-3xl font-bold mb-2">探索你的下一次旅程</h1>
          <p class="text-sm sm:text-base mb-4">精心挑选的目的地，立即开始预定</p>
          <RouterLink to="/booking" class="px-5 py-2 bg-white text-primaryBlue rounded shadow hover:bg-gray-100">开始预定</RouterLink>
        </div>
      </div>
    </section>

    <DestinationFilter :search="search" :category="category" @update:search="search = $event" @update:category="category = $event" />

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <DestinationCard v-for="d in filtered" :key="d.id" :destination="d" @select="open(d)" />
    </div>

    <section v-if="recent.length" class="mt-12">
      <h2 class="text-lg font-semibold text-primaryBlue mb-4">最近浏览</h2>
      <div class="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <DestinationCard v-for="d in recent" :key="d.id" :destination="d" @select="open(d)" />
      </div>
    </section>

    <DestinationModal :destination="selected" @close="selected=null" />
  </div>
</template>
<script setup lang="ts">
import { useDestinations } from '../composables/useDestinations';
import { useRecent } from '../composables/useRecent';
import DestinationCard from '../components/DestinationCard.vue';
import DestinationFilter from '../components/DestinationFilter.vue';
import DestinationModal from '../components/DestinationModal.vue';
import { RouterLink } from 'vue-router';

const { search, category, filtered, selected, selectDestination } = useDestinations();
const { recent, add } = useRecent();
function open(d:any){ selectDestination(d); add(d); }
</script>
