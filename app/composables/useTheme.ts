// composables/useTheme.ts
export const useTheme = () => {
  const colorMode = useColorMode()

  const applyTheme = async (primaryHex: string, backgroundHex: string) => {
    const data = await $fetch('/api/theme', {
      query: { primary: primaryHex, background: backgroundHex },
    })

    // Bygg CSS-sträng
    const css = [
      ...Object.entries(data.primary).map(([shade, value]) =>
        `--ui-color-primary-${shade}: ${value};`
      ),
      ...Object.entries(data.neutral).map(([shade, value]) =>
        `--ui-color-neutral-${shade}: ${value};`
      ),
      `--ui-bg: ${data.bg.default};`,
      `--ui-bg-muted: ${data.bg.muted};`,
      `--ui-bg-elevated: ${data.bg.elevated};`,
      `--ui-bg-accented: ${data.bg.accented};`,
    ].join('')

    // Injicera i <head> — fungerar både SSR och client
    useHead({
      style: [{ innerHTML: `:root { ${css} }` }]
    })

    if (import.meta.client) {
      colorMode.preference = 'light'
    }
  }

  const resetTheme = () => {
    useHead({ style: [] })
  }

  return { applyTheme, resetTheme }
}