// server/api/items/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const item = await useStorage('data').getItem(`${id}.json`)

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  return item
})