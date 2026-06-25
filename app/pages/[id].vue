<template>
  <UContainer
    :class="`flex flex-col justify-center px-5 pb-5 bg-elevated ${doorData.class.body}`"
  >
    <UPageHeader
      :title="`Välkommen till ${doorData.label}`"
      :description="doorData.description"
      :ui="{ title: doorData.class.text, description: doorData.class.text }"
      orientation="vertical"
    />

    <UPageCard
      :class="`flex flex-col items-center mt-5 ${doorData.class.container}`"
    >
      <UButton
        icon="circum:lock"
        class="mx-auto cursor-default! rounded-full p-2"
        variant="soft"
        size="xl"
      />
      <h2 class="font-semibold text-2xl text-center">
        Säker autentisering med bankID
      </h2>
      <UButton
        v-if="uiStatus === 'idle'"
        label="Öppna dörr med bankID"
        leading-icon="arcticons:bankid"
        size="xl"
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
      <USeparator class="my-2" />
      <div class="flex items-center gap-2 mr-auto">
        <UButton
          icon="uiw:safety"
          class="mx-auto cursor-default! rounded-full p-2"
          variant="soft"
        />

        <p class="text-dimmed font-medium">
          Krypterad anslutning enligt högsta säkerhetsstandard.
        </p>
      </div>
      <div class="flex items-center gap-2 mr-auto">
        <UButton
          icon="uiw:verification"
          class="mx-auto cursor-default! rounded-full p-2"
          variant="soft"
        />
        <p class="text-dimmed font-medium">
          Vi delar aldrig dina personuppgifter med obehöriga.
        </p>
      </div>
    </UPageCard>
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

const { applyTheme, resetTheme } = useTheme();
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

watchEffect(async () => {
  if (doorData.value) {
    await applyTheme(
      doorData.value.primaryColor, // t.ex. "violet"
      doorData.value.backgroundColor, // t.ex. "teal"
    );
  }
});

// Återställ när man lämnar sidan
onUnmounted(() => resetTheme());
</script>
<style scoped></style>
