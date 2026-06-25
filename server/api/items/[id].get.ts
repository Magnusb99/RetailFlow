
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const asset = await useStorage('assets:data').getItem(`${id}.json`)

  if (!asset) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  return asset
})