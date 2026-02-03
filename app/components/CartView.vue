<template>
  <UDrawer v-model:open="open" direction="right">
    <UChip :show="!!cartItem.id">
      <UButton
        trailing-icon="typcn:shopping-cart"
        :label="cartItem.id ? 'Varukorg' : ''"
        variant="soft"
      />
    </UChip>
    <template #body>
      <UContainer class="p-4">
        <div class="flex justify-between gap-10 items-center">
          <h2 class="font-semibold text-2xl">Din varukorg</h2>
          <UButton
            icon="line-md:close"
            variant="ghost"
            color="neutral"
            @click="open = false"
          />
        </div>
        <USeparator class="my-5" />
        <p class="mb-5 font-semibold">Varor:</p>
        <UCard v-if="cartItem.id" variant="subtle">
          <template #header>
            <div class="flex justify-between">
              <p>{{ cartItem.name }}</p>
              <UButton
                icon="line-md:close"
                color="error"
                variant="soft"
                @click="removeCartItem"
              />
            </div>
          </template>
          <p>Pris: {{ cartItem.price }} :-</p>
        </UCard>
        <UCard v-else variant="subtle" class="p-4">
          <p>Din varukorg är tom.</p>
        </UCard>
        <USeparator class="my-5" />
        <p v-if="cartItem.id">Total: {{ totalPrice }} kr</p>
        <UButton
          label="Betala med Swish"
          class="w-full my-5"
          size="xl"
          leading-icon="arcticons:swish"
          color="neutral"
          :disabled="!cartItem.id"
        />
      </UContainer>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
const open = ref(false);
const cartStore = useCartStore();
const cartItem = computed(() => cartStore.item);
const totalPrice = computed(() => {
  return cartItem.value ? cartItem.value.price : 0;
});
const removeCartItem = () => {
  cartStore.resetCart();
};
</script>

<style scoped></style>
