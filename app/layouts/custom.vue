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

const { data } = await useFetch(() => `/api/items/${doorId.value}`);

doorData.value = data.value;
</script>
