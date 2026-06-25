export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const keys = await useStorage('data').getKeys()
  console.log('Storage keys:', keys)
  console.log('Looking for:', `${id}.json`)

  const item = await useStorage('data').getItem(`${id}.json`)
  console.log('Item found:', !!item)

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  return item
})