import { getCliClient } from 'sanity/cli'
import * as fs from 'fs'
import * as path from 'path'

const client = getCliClient()

const MIGRATED = path.resolve(__dirname, '../migrated.ndjson')
const LEGACY_TYPES = ['boardMembers', 'residents', 'ccrs', 'minutes', 'treasurersReport']
const BATCH_SIZE = 50

async function main() {
  console.log(`Deleting legacy-typed documents (${LEGACY_TYPES.join(', ')})...`)
  const deleted = await client.delete({
    query: `*[_type in $types]`,
    params: { types: LEGACY_TYPES },
  })
  const deletedCount = Array.isArray((deleted as any).results)
    ? (deleted as any).results.length
    : 'unknown'
  console.log(`  deleted: ${deletedCount}`)

  const lines = fs.readFileSync(MIGRATED, 'utf8').split('\n').filter(Boolean)
  console.log(`Creating ${lines.length} migrated documents...`)

  let created = 0
  for (let i = 0; i < lines.length; i += BATCH_SIZE) {
    const batch = lines.slice(i, i + BATCH_SIZE)
    const tx = client.transaction()
    for (const line of batch) {
      tx.createOrReplace(JSON.parse(line))
    }
    await tx.commit()
    created += batch.length
    console.log(`  ${created}/${lines.length}`)
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error('Replace failed:', err)
  process.exit(1)
})
