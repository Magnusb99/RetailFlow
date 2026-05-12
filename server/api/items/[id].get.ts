import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ogiltigt id'
    })
  }

  try {
    const filePath = join(process.cwd(), 'data', `${id}.json`)
    const file = await readFile(filePath, 'utf-8')

    return JSON.parse(file)
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'Hittade ingen data för detta id'
    })
  }
})