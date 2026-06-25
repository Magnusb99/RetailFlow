export const useTheme = () => {
  const colorMode = useColorMode()

  const applyTheme = async (primaryHex: string, backgroundHex: string) => {
    if (!import.meta.client) return

    const data = await $fetch('/api/theme', {
      query: { primary: primaryHex, background: backgroundHex },
    })

    colorMode.preference = 'light'

    const root = document.documentElement
    Object.entries(data.primary).forEach(([shade, value]) => {
      root.style.setProperty(`--ui-color-primary-${shade}`, value as string)
    })
    Object.entries(data.neutral).forEach(([shade, value]) => {
      root.style.setProperty(`--ui-color-neutral-${shade}`, value as string)
    })

    root.style.setProperty('--ui-bg',          data.bg.default)
    root.style.setProperty('--ui-bg-muted',    data.bg.muted)
    root.style.setProperty('--ui-bg-elevated', data.bg.elevated)
    root.style.setProperty('--ui-bg-accented', data.bg.accented)
  }

  const resetTheme = () => {
    if (!import.meta.client) return
    const root = document.documentElement
    ;[50,100,200,300,400,500,600,700,800,900,950].forEach(shade => {
      root.style.removeProperty(`--ui-color-primary-${shade}`)
      root.style.removeProperty(`--ui-color-neutral-${shade}`)
    })
  }

  return { applyTheme, resetTheme }
}