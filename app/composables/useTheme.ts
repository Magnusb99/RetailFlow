// composables/useDoorTheme.ts
import { oklch, formatHex, interpolate, formatCss } from 'culori'

const generateShades = (hex: string): Record<number, string> => {
  const shadeKeys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  
  const light = oklch('#ffffff')
  const base  = oklch(hex)
  const dark  = oklch('#000000')

  // Interpolera vit→bas→svart och plocka ut 11 steg
  const scaleLight = interpolate([light, base], 'oklch')
  const scaleDark  = interpolate([base, dark],  'oklch')

  return {
    50:  formatHex(scaleLight(0.1)),
    100: formatHex(scaleLight(0.2)),
    200: formatHex(scaleLight(0.35)),
    300: formatHex(scaleLight(0.5)),
    400: formatHex(scaleLight(0.7)),
    500: hex,
    600: formatHex(scaleDark(0.2)),
    700: formatHex(scaleDark(0.4)),
    800: formatHex(scaleDark(0.6)),
    900: formatHex(scaleDark(0.75)),
    950: formatHex(scaleDark(0.88)),
  }
}

export const useTheme = () => {
  const applyTheme = (primaryHex: string, backgroundHex: string) => {
    if (!import.meta.client) return

    const colorMode = useColorMode()
    colorMode.preference = 'light'

    const root = document.documentElement
    const primaryShades = generateShades(primaryHex)
    Object.entries(primaryShades).forEach(([shade, value]) => {
      root.style.setProperty(`--ui-color-primary-${shade}`, value)
    })

    // Neutral - generera från primary så de matchar varandra i ton
    // men mörkare så den fungerar som text/border
    const neutralShades = generateShades(primaryHex) // samma bruna bas
    Object.entries(neutralShades).forEach(([shade, value]) => {
      root.style.setProperty(`--ui-color-neutral-${shade}`, value)
    })

     const bg = oklch(backgroundHex)!
    root.style.setProperty('--ui-bg',          formatCss(bg))
    root.style.setProperty('--ui-bg-muted',    formatCss({ ...bg, l: bg.l - 0.03 }))
    root.style.setProperty('--ui-bg-elevated', formatCss({ ...bg, l: bg.l + 0.02 }))
    root.style.setProperty('--ui-bg-accented', formatCss({ ...bg, l: bg.l - 0.06 }))
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