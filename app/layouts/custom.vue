<template>
  <div v-if="data">
    <CustomHeader :data="data" />
    <slot :data="data" />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const doorId = route.params.id as string;

const doorData = useState("doorData");

const { data } = await useFetch(`/data/${doorId}.json`);

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Item not found",
    fatal: true,
  });
}

doorData.value = data.value;
</script>
