<template>
  <UHeader>
    <template #title>
      <Logo class="h-6 w-auto" />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
       
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const route = useRoute();
const items = computed(() => [
  {
    label: "Produkter",
    to: "/",
    active: route.path.startsWith("/"),
  },
  {
    label: "Support",
    to: "/support",
    active: route.path.startsWith("/support"),
  },
  {
    label: "Test",
    to: "/test",
    active: route.path.startsWith("/test"),
  },
]);
</script>

<style scoped></style>
