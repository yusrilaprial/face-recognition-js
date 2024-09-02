<script setup lang="ts">
  // // Navigation
  // const bars = ["detection", "recognition"];
  // const curBar = ref("detection");

  // const capitalize = (str: string) => {
  //   if (typeof str !== "string" || str.length === 0) return "";
  //   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  // };
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-2 flex justify-between items-center">
        <h1 class="text-xl font-bold">Face Recognition</h1>
        <!-- <div class="flex gap-x-2">
          <button
            v-for="bar in bars"
            :class="['text-white font-bold py-2 px-4 rounded', curBar === bar ? 'bg-blue-500' : 'bg-gray-500']"
            :disabled="curBar === bar"
            @click="curBar = bar">
            {{ capitalize(bar) }}
          </button>
        </div> -->
      </div>
    </nav>
    <slot></slot>
  </div>
</template>
