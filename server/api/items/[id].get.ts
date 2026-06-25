const items = import.meta.glob('../../server/data/*.json', { eager: true, import: 'default' })

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const item = items[`../../server/data/${id}.json`]

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  return item
})