<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-primaryBlue/5 to-primaryGreen/5">
    <Navbar />
    <main class="flex-1 container mx-auto px-4 py-6">
      <router-view />
    </main>
    <footer class="text-center text-xs text-gray-600 py-6 border-t">
      © 2025 Travel Site. Images from Unsplash & Pexels.
    </footer>
  </div>
</template>
<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>
