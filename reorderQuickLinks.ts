import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const DESIRED_ORDER = [
  'Covenants, Conditions & Restrictions',
  'Frequently Asked Questions',
  'Board Members',
  'Board Minutes',
]

async function main() {
  const home = await client.getDocument('page-home') as any
  if (!home) { console.log('page-home not found'); return }
  const sections = Array.isArray(home.sections) ? home.sections : []
  const idx = sections.findIndex((s: any) => s._type === 'featureGrid')
  if (idx < 0) { console.log('no featureGrid section'); return }

  const items = Array.isArray(sections[idx].items) ? sections[idx].items : []
  const byTitle = new Map(items.map((i: any) => [i.title, i]))
  const reordered = [
    ...DESIRED_ORDER.map((t) => byTitle.get(t)).filter(Boolean),
    ...items.filter((i: any) => !DESIRED_ORDER.includes(i.title)),
  ]

  const updated = [...sections]
  updated[idx] = { ...sections[idx], items: reordered }
  await client.patch('page-home').set({ sections: updated }).commit()
  console.log('Reordered quick-link cards:', reordered.map((i: any) => i.title))
}

main().catch((e) => { console.error(e); process.exit(1) })
