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
      <div class="mx-auto">
        <img
          :src="`/logos/${doorData.bankID}`"
          alt=""
          class="h-30 w-auto object-contain"
        />
      </div>
      <h2 class="font-semibold text-2xl text-center">Säker autentisering</h2>
      <UButton
        v-if="uiStatus === 'idle'"
        class="justify-center"
        label="Lås upp med BankID"
        trailing-icon="mdi:arrow-right"
        size="xl"
        @click="startAuth"
      />
      <template v-if="uiStatus === 'waiting'">
        <div class="flex flex-col items-center justify-center gap-4">
          <Icon name="svg-spinners:3-dots-bounce" size="30" />
          <p>Väntar på bankId...</p>
        </div>
      </template>
      <p v-if="uiStatus === 'opened'">✅ Dörren är öppen!</p>
      <div
        v-if="uiStatus === 'failed'"
        class="flex flex-col items-center justify-center gap-4"
      >
        <p
          v-if="hintCode"
          class="font-medium bg-error/10 text-error py-2 px-4 rounded-sm ring ring-inset ring-error/25"
        >
          {{ friendlyError(hintCode) }}
        </p>
        <p
          class="font-medium bg-error/10 text-error py-2 px-4 rounded-sm ring ring-inset ring-error/25"
        >
          {{ errorMsg }}
        </p>
      </div>
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

const hintMessages: Record<string, string> = {
  userCancel: "Du avbröt inloggningen.",
  expiredTransaction: "Sessionen gick ut. Försök igen.",
  certificateErr: "Det uppstod ett problem med ditt BankID.",
  startFailed:
    "BankID kunde inte startas. Kontrollera att appen är installerad.",
};

function friendlyError(code?: string): string {
  if (!code) return "Ett okänt fel uppstod.";
  return hintMessages[code] ?? "Något gick fel. Försök igen.";
}

const route = useRoute();
const doorData = useState("doorData") as any;
const doorId = route.params.id;
const errorMsg = ref("");
const { resetTheme } = useTheme();
const uiStatus = ref<UiStatus>("idle");
const hintCode = ref("");
let pollInterval: ReturnType<typeof setInterval>;

const isMobile = () => /iPhone|Android/i.test(navigator.userAgent);

async function startAuth() {
  uiStatus.value = "waiting";

  if (!isMobile()) {
    errorMsg.value =
      "BankID-autentisering fungerar endast på mobila enheter. Vänligen använd en mobiltelefon eller surfplatta.";
    uiStatus.value = "failed";
    return;
  }

  try {
    const result = (await $fetch(`/api/door-access/${doorId}/login`, {
      method: "POST",
    })) as FederatedLoginResponse;

    if (!result.autoStartToken) {
      errorMsg.value = "Ingen session kunde startas. Försök igen.";
      uiStatus.value = "failed";
      return;
    }

    window.location.href = `https://app.bankid.com/?autostarttoken=${result.autoStartToken}`;
  } catch (err) {
    errorMsg.value =
      err instanceof Error
        ? err.message
        : "Ett fel uppstod vid start av autentisering.";
    uiStatus.value = "failed";
  }
}

async function poll() {
  try {
    const result = (await $fetch(`/api/door-access/${doorId}/session`, {
      method: "POST",
    })) as DoorAccessResponse;

    if (result.status === "pending") {
      if (result.hintCode) hintCode.value = result.hintCode;
      return;
    }

    clearInterval(pollInterval);
    uiStatus.value = result.status as UiStatus;
    if (result.hintCode) hintCode.value = result.hintCode;
  } catch (err) {
    clearInterval(pollInterval);
    errorMsg.value = "Kunde inte kontrollera status. Försök igen.";
    uiStatus.value = "failed";
  }
}
onMounted(() => {
  const cameFromBankId = route.query.bankid === "1";

  if (cameFromBankId) {
    clearInterval(pollInterval);
    uiStatus.value = "waiting";
    pollInterval = setInterval(poll, 2500);
  } else {
    uiStatus.value = "idle";
  }
});
onUnmounted(() => {
  clearInterval(pollInterval);
  resetTheme();
});
</script>
<style scoped></style>
