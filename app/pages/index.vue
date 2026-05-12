<template>
  <UContainer class="px-5 mt-5 mb-25">
    <UPageHeader
      title="Välkommen till RetailFlow"
      class="text-center py-2"
      :ui="{
        title: 'mx-auto',
      }"
    />

    <UContainer class="flex flex-col items-center gap-4 my-6">
      <p v-if="status === 'pending'">Väntar på BankID...</p>
      <p v-if="message">{{ message }}</p>
      <UButton
        label="Öppna dörr med bankID"
        leading-icon="arcticons:bankid"
        size="xl"
        color="neutral"
        :disabled="status === 'pending'"
        @click="openDoor"
      />
    </UContainer>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute();
const doorId = route.params.doorId as string;

const status = ref<"idle" | "pending" | "opened" | "failed">("idle");
const message = ref("");

let requestId: string | null = null;
let interval: ReturnType<typeof setInterval> | null = null;

async function openDoor() {
  status.value = "pending";

  const res = await $fetch("/api/door-access/start", {
    method: "POST",
    body: { doorId },
  });

  requestId = res.requestId;

  window.location.href = res.startUrl;

  interval = setInterval(async () => {
    const state = await $fetch(`/api/door-access/${requestId}/status`);

    status.value = state.status;

    if (state.status === "opened") {
      message.value = "Dörren är öppnad.";
      clearInterval(interval!);
    }

    if (state.status === "failed") {
      message.value = `BankID misslyckades: ${state.hintCode}`;
      clearInterval(interval!);
    }
  }, 2000);
}
</script>

<style scoped></style>
