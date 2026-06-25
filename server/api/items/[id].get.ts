import { readFile, readdir  } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
 const taskDir = await readdir('/var/task', { recursive: true })
  console.log('Files in /var/task:', JSON.stringify(taskDir, null, 2))
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

  console.log("FILEPAT: ", filePath);

  const file = await readFile(filePath, 'utf-8')

  return JSON.parse(file)
})