<template>
  <UContainer class="px-5 mt-5 mb-25">
    <UPageHero
      title="Välkommen till Retail flow"
      description="Om du ser detta har du nog hamnat fel!"
    />
    <UPageCard
      title="Ingen fara!"
      description="Fyll i koden från skåpet och klicka på knappen !! Giltiga koder = [CU-0001] & [CU-0002] !!"
    >
      <UInput
        v-model="doorNumber"
        label="Skåpnummer"
        placeholder="Skriv in skåpnummer"
        size="lg"
        class="w-full"
      />
      <UButton
        label="Öppna skåp"
        size="lg"
        color="primary"
        class="w-full mt-4"
        @click="reRoute()"
      />
    </UPageCard>
  </UContainer>
</template>

<script setup lang="ts">
const doorNumber = ref("");
const reRoute = () => {
  if (doorNumber.value.trim() !== "") {
    // Redirect to the dynamic route with the entered door number
    window.location.href = `/${doorNumber.value}`;
  } else {
    alert("Vänligen ange ett giltigt skåpnummer.");
  }
};
</script>

<style scoped></style>
