<template>
  <div v-if="doorData">
    <CustomHeader :data="data" />
    <slot :data="data" />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const doorId = route.params.id as string;

const doorData = useState("doorData");

const { data } = await useFetch(`/api/items/${doorId}`);

doorData.value = data.value;
</script>
