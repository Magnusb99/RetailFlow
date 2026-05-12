<template>
  <div class="h-[10vh] flex items-center justify-between gap-4 px-5 border-b">
    <h1 class="font-bold text-2xl">{{ doorData.label }}</h1>
    <UButton to="/support" label="Support" />
  </div>
</template>

<script setup lang="ts">
const doorData = useState("doorData");
console.log("Door data in CustomHeader:", doorData.value);
</script>

<style scoped></style>
