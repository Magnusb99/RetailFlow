<template>
  <div>
    <div v-if="data && themeSet">
      <CustomHeader :data="data" />
      <slot :data="data" />
      <AppFooter />
    </div>
    <div v-else>
      <p>Laddar in sida</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const doorId = computed(() => route.params.id);
const doorData = useState("doorData");
const themeSet = ref(false);
const { applyTheme, resetTheme } = useTheme();

const { data, error } = await useFetch(() => {
  const base = useRequestURL().origin;
  return `${base}/data/${doorId.value}.json`;
});

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Item not found",
    fatal: true,
  });
}

doorData.value = data.value;

const css = ref("");

if (data.value) {
  css.value = await applyTheme(
    data.value.primaryColor,
    data.value.backgroundColor,
  );
  themeSet.value = true;
}

// useHead anropas synkront i setup-kontexten
useHead({
  style: [{ innerHTML: () => `:root { ${css.value} }` }],
});
onUnmounted(() => resetTheme());
</script>
