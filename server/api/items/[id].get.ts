import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id'
    })
  }

  const filePath = join(
    process.cwd(),
    'server',
    'data',
    `${id}.json`
  )

  console.log(filePath)

  const file = await readFile(filePath, 'utf-8')

  return JSON.parse(file)
})