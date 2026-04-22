import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function main() {
  const doc = await client.getDocument('page-directory') as any
  if (!doc) { console.log('page-directory not found'); return }
  const sections = Array.isArray(doc.sections) ? doc.sections : []
  // Keep only the residentDirectory section; drop any empty placeholder
  // sections (hero, textContent, etc.) that slipped in from seeds.
  const pruned = sections.filter((s: any) => s._type === 'residentDirectory')
  if (pruned.length !== sections.length) {
    await client.patch('page-directory').set({ sections: pruned }).commit()
    console.log(`page-directory: removed ${sections.length - pruned.length} stray section(s); kept ${pruned.length}`)
  } else {
    console.log('page-directory: no changes needed')
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
