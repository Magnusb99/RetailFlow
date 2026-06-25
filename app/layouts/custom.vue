<template>
  <div v-if="data">
    <CustomHeader :data="data" />
    <slot :data="data" />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const doorId = computed(() => route.params.id);

const doorData = useState("doorData");

const { data, error } = await useFetch(() => `/data/${doorId.value}.json`);

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Item not found",
    fatal: true,
  });
}

watch(
  data,
  (val) => {
    doorData.value = val;
  },
  { immediate: true },
);
</script>
