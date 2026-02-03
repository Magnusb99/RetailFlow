<template>
  <UContainer class="px-5 my-5">
    <UPageHeader
      title="Välkommen till RetailFlow"
      description="Du kan bara köpa en vara i taget"
      class="text-center py-2"
      :ui="{
        title: 'mx-auto',
      }"
    />

    <UContainer
      class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 my-6"
    >
      <UCard
        v-for="product in products"
        :key="product.id"
        :variant="isInCart(product.id) ? 'solid' : 'subtle'"
        class="hover:bg-accented cursor-pointer active:scale-98 active:ring-2 transition active:bg-neutral-800 focus:ring-black/40"
        @click="addItem(product)"
      >
        <template #header
          ><div class="flex justify-between">
            <p>Lucka: {{ product.slot }}</p>
            <UButton
              variant="soft"
              class="ml-auto"
              :icon="{isInCart(product.id) ? 'line-md:plus' : 'line-md:check-all'}"
              color="success"
            /></div
        ></template>
        {{ product.name }}
        <br />
        {{ product.price }} :-
      </UCard>
    </UContainer>
  </UContainer>
</template>

<script setup lang="ts">
const products = [
  { id: 1, name: "Ros", price: 39.99, slot: 1 },
  { id: 2, name: "Tulpan", price: 29.99, slot: 2 },
  { id: 3, name: "Orkidé", price: 89.99, slot: 3 },
  { id: 4, name: "Lilja", price: 49.99, slot: 4 },
  { id: 5, name: "Solros", price: 19.99, slot: 5 },
  { id: 6, name: "Krysantemum", price: 34.99, slot: 6 },
  { id: 7, name: "Gerbera", price: 24.99, slot: 7 },
  { id: 8, name: "Dahlia", price: 44.99, slot: 8 },
];

const cartStore = useCartStore();

function addItem(product: CartItem) {
  cartStore.addToCart(product);
}
const isInCart = (id: number) => cartStore.item?.id === id;
</script>

<style scoped></style>
