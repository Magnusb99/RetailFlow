import { oklch, formatHex, interpolate, formatCss } from 'culori'

const generateShades = (hex: string): Record<number, string> => {
  const light = oklch('#ffffff')!
  const base  = oklch(hex)!
  const dark  = oklch('#000000')!

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

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const primaryHex    = String(query.primary    ?? '#8B5E3C')
  const backgroundHex = String(query.background ?? '#FAF7F4')

  const primaryShades = generateShades(primaryHex)
  const neutralShades = generateShades(primaryHex)

  const bg = oklch(backgroundHex)!

  return {
    primary: primaryShades,
    neutral: neutralShades,
    bg: {
      default:  formatCss(bg),
      muted:    formatCss({ ...bg, l: bg.l - 0.03 }),
      elevated: formatCss({ ...bg, l: bg.l + 0.02 }),
      accented: formatCss({ ...bg, l: bg.l - 0.06 }),
    },
  }
})