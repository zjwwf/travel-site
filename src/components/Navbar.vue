<template>
  <nav class="bg-white/90 backdrop-blur sticky top-0 z-40 border-b shadow-sm">
    <div class="container flex items-center justify-between h-14">
      <div class="flex items-center gap-2 font-semibold text-primaryBlue">
        <span class="text-lg">TravelSite</span>
      </div>
      <button class="md:hidden" @click="mobileOpen = !mobileOpen" aria-label="Toggle navigation">☰</button>
      <ul class="hidden md:flex gap-6 text-sm">
        <li><RouterLink class="hover:text-primaryGreen" to="/">主页</RouterLink></li>
        <li><RouterLink class="hover:text-primaryGreen" to="/booking">预定</RouterLink></li>
      </ul>
    </div>
    <transition name="fade">
      <div v-if="mobileOpen" class="md:hidden border-t bg-white">
        <ul class="flex flex-col px-4 py-2 gap-2">
          <li><RouterLink class="py-2" @click="close" to="/">主页</RouterLink></li>
          <li><RouterLink class="py-2" @click="close" to="/booking">预定</RouterLink></li>
        </ul>
      </div>
    </transition>
  </nav>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
const mobileOpen = ref(false);
function close(){ mobileOpen.value = false; }
</script>
<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s; }
.fade-enter-from,.fade-leave-to{ opacity:0; }
</style>
