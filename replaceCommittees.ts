import { getCliClient } from 'sanity/cli'
import * as fs from 'fs'
import * as path from 'path'

const client = getCliClient()
const EXTRAS = path.resolve(__dirname, '../migrated-extras.ndjson')

async function main() {
  const legacy = await client.fetch<{ _id: string }[]>(`*[_type == "committees"]{_id}`)
  if (legacy.length) {
    await client.delete({ query: `*[_type == "committees"]` })
    console.log(`Deleted ${legacy.length} legacy "committees" docs`)
  }
  const lines = fs.readFileSync(EXTRAS, 'utf8').split('\n').filter(Boolean)
  const committeeDocs = lines.map((l) => JSON.parse(l)).filter((d) => d._type === 'committee')
  const tx = client.transaction()
  for (const d of committeeDocs) tx.createOrReplace(d)
  await tx.commit()
  console.log(`Created ${committeeDocs.length} committee docs`)
}

main().catch((e) => { console.error(e); process.exit(1) })
