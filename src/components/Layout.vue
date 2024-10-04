<script setup lang="ts">
  import {routes} from "../router";
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-2 flex justify-between items-center">
        <h1 class="text-xl font-bold">Face Recognition</h1>
        <div class="flex gap-x-2">
          <RouterLink
            v-for="route in routes"
            :to="route.path"
            class="font-bold text-gray-500 hover:text-blue-500 hover:underline"
            exactActiveClass="!text-blue-500 underline"
            >{{ route.name }}</RouterLink
          >
        </div>
      </div>
    </nav>
    <slot></slot>
  </div>
</template>
