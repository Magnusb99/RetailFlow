<script setup lang="ts">
const route = useRoute();
const doorId = route.params.id;

const uiStatus = ref<"idle" | "waiting" | "opened" | "failed" | "unauthorized">(
  "idle",
);
const hintCode = ref("");
const qrCode = ref(""); // visas om användaren inte är på mobil
let pollInterval: ReturnType<typeof setInterval>;

const isMobile = () => /iPhone|Android/i.test(navigator.userAgent);

async function startAuth() {
  uiStatus.value = "waiting";

  const { autoStartToken, qrCode: qr } = await $fetch(
    `/api/door-access/${doorId}/auth`,
    { method: "POST" },
  );

  if (isMobile()) {
    // Öppna BankID-appen direkt
    window.location.href = `https://app.bankid.com/?autostarttoken=${autoStartToken}&redirect=null`;
  } else {
    // Visa QR-kod för skanning med mobil
    qrCode.value = qr;
  }

  pollInterval = setInterval(poll, 2000);
}

async function poll() {
  const result = await $fetch(`/api/door-access/${doorId}/status`);

  if (result.status === "pending") {
    // Uppdatera QR (den roterar varje sekund per BankID-spec)
    if (result.qrCode) qrCode.value = result.qrCode;
    hintCode.value = result.hintCode;
    return;
  }

  clearInterval(pollInterval);
  uiStatus.value = result.status as any;
}

onUnmounted(() => clearInterval(pollInterval));
</script>

<template>
  <div>
    <button v-if="uiStatus === 'idle'" @click="startAuth">
      Öppna med BankID
    </button>

    <template v-if="uiStatus === 'waiting'">
      <img
        v-if="qrCode"
        :src="`data:image/png;base64,${qrCode}`"
        alt="BankID QR-kod"
      />
      <p v-else>Öppna BankID-appen på din telefon…</p>
      <p>{{ hintCode }}</p>
    </template>

    <p v-if="uiStatus === 'opened'">✅ Dörren är öppen!</p>
    <p v-if="uiStatus === 'unauthorized'">⛔ Du har inte behörighet.</p>
    <p v-if="uiStatus === 'failed'">❌ Något gick fel: {{ hintCode }}</p>
  </div>
</template>
