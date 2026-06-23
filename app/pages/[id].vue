<template>
  <UContainer :class="`px-5 mt-5 mb-25 ${doorData.class.body}`">
    <UContainer
      :class="`flex flex-col items-center gap-4 my-6 ${doorData.class.container}`"
      :style="doorData.style.container"
    >
      <UPageHeader
        :title="`Välkommen till ${doorData.label}`"
        :description="doorData.description"
        :ui="{ title: doorData.class.text, description: doorData.class.text }"
      />
      <UButton
        v-if="uiStatus === 'idle'"
        label="Öppna dörr med bankID"
        leading-icon="arcticons:bankid"
        size="xl"
        color="neutral"
        @click="startAuth"
      />
      <template v-if="uiStatus === 'waiting'">
        <img
          v-if="qrCode"
          :src="`data:image/png;base64,${qrCode}`"
          alt="BankID QR-kod"
        />
        <p v-else>Öppna BankID-appen på din telefon…</p>
        <p v-if="hintCode">{{ hintCode }}</p>
      </template>
      <p v-if="uiStatus === 'opened'">✅ Dörren är öppen!</p>
      <p v-if="uiStatus === 'failed'">❌ Något gick fel: {{ hintCode }}</p>
      <p v-if="uiStatus === 'blocked'">
        ⛔ Dörren är blockerad: {{ hintCode }}
      </p>
    </UContainer>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
});
export interface FederatedLoginResponse {
  sessionId: string;
  autoStartToken: string;
  qrCode?: string;
}
// types/grandid.ts
export interface DoorAccessResponse {
  status: "pending" | "opened" | "failed" | "blocked";
  hintCode?: string;
  qrCode?: string;
  autoStartToken?: string;
  reason?: string;
  user?: {
    name: string;
  };
}
export type UiStatus = "idle" | "waiting" | "opened" | "failed" | "blocked";

const route = useRoute();
const doorData = useState("doorData") as any;
const doorId = route.params.id;

const uiStatus = ref<UiStatus>("idle");
const hintCode = ref("");
const qrCode = ref("");
let pollInterval: ReturnType<typeof setInterval>;

const isMobile = () => /iPhone|Android/i.test(navigator.userAgent);

async function startAuth() {
  uiStatus.value = "waiting";

  // Första anropet startar sessionen
  const result = (await $fetch(`/api/door-access/${doorId}`, {
    method: "POST",
  })) as FederatedLoginResponse;

  if (isMobile() && result.autoStartToken) {
    window.location.href = `https://app.bankid.com/?autostarttoken=${result.autoStartToken}&redirect=null`;
  } else if (result.qrCode) {
    qrCode.value = result.qrCode;
  }

  // Börja polla samma endpoint
  pollInterval = setInterval(poll, 2000);
}

async function poll() {
  const result = (await $fetch(`/api/door-access/${doorId}`, {
    method: "POST",
  })) as DoorAccessResponse;

  if (result.status === "pending") {
    if (result.qrCode) qrCode.value = result.qrCode;
    if (result.hintCode) hintCode.value = result.hintCode;
    return;
  }

  clearInterval(pollInterval);
  uiStatus.value = result.status as UiStatus;
  if (result.hintCode) hintCode.value = result.hintCode;
}

onUnmounted(() => clearInterval(pollInterval));
</script>
