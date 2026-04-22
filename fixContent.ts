import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const key = () => Math.random().toString(36).slice(2, 10)

// IDs of empty, collection-only pages that got placeholder textContent/pricingCtaSection
// blocks from the seed. Strip those so only the real collection section remains.
const COLLECTION_PAGES = [
  'page-ccrs',
  'page-faqs',
  'page-board-minutes',
  'page-directory',
]

const isEmptySection = (s: any): boolean => {
  if (s._type === 'textContent') {
    const hasHeading = !!s.heading
    const hasBody = Array.isArray(s.body) && s.body.length > 0
    return !hasHeading && !hasBody
  }
  if (s._type === 'pricingCtaSection') {
    return !s.heading && !s.ctaLabel && !(Array.isArray(s.body) && s.body.length)
  }
  return false
}

async function cleanupCollectionPages() {
  for (const pageId of COLLECTION_PAGES) {
    const doc = await client.getDocument(pageId) as any
    if (!doc) continue
    const sections = Array.isArray(doc.sections) ? doc.sections : []
    const pruned = sections.filter((s: any) => !isEmptySection(s))
    if (pruned.length !== sections.length) {
      await client.patch(pageId).set({ sections: pruned }).commit()
      console.log(`${pageId}: removed ${sections.length - pruned.length} empty section(s)`)
    }
  }
}

async function fixHomeFeatureGridLinks() {
  const home = await client.getDocument('page-home') as any
  if (!home) return
  const sections = Array.isArray(home.sections) ? home.sections : []
  const idx = sections.findIndex((s: any) => s._type === 'featureGrid')
  if (idx < 0) return

  const urlByTitle: Record<string, string> = {
    'Board Members': '/board-members',
    'Covenants, Conditions & Restrictions': '/ccrs',
    'Frequently Asked Questions': '/faqs',
    'Board Minutes': '/board-minutes',
  }
  const currentItems = Array.isArray(sections[idx].items) ? sections[idx].items : []
  const newItems = currentItems.map((it: any) => ({
    ...it,
    url: urlByTitle[it.title] || it.url || null,
  }))
  const updated = [...sections]
  updated[idx] = { ...sections[idx], items: newItems }
  await client.patch('page-home').set({ sections: updated }).commit()
  console.log('page-home: rewrote featureGrid.items with URLs')
}

async function migrateLegalPages() {
  const mappings: Array<{ legalId: string; legacyType: string }> = [
    { legalId: 'legal-privacy-policy', legacyType: 'privacypolicy' },
    { legalId: 'legal-terms-and-conditions', legacyType: 'termsconditions' },
  ]
  for (const m of mappings) {
    const legalDoc = await client.getDocument(m.legalId) as any
    if (!legalDoc) { console.log(`${m.legalId}: not found`); continue }
    if (Array.isArray(legalDoc.body) && legalDoc.body.length) {
      console.log(`${m.legalId}: already has body, skipping`)
      continue
    }
    const legacy = await client.fetch<{ content?: unknown[] }>(
      `*[_type == $t][0]{content}`,
      { t: m.legacyType },
    )
    if (!legacy || !Array.isArray(legacy.content) || legacy.content.length === 0) {
      console.log(`${m.legalId}: no legacy content found`)
      continue
    }
    await client.patch(m.legalId).set({ body: legacy.content }).commit()
    console.log(`${m.legalId}: set body from legacy ${m.legacyType} (${legacy.content.length} blocks)`)
  }
  // Accessibility — no source content; seed a minimal placeholder body so the page isn't blank.
  const accessibility = await client.getDocument('legal-accessibility') as any
  if (accessibility && !(Array.isArray(accessibility.body) && accessibility.body.length)) {
    const body = [
      { _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [
        { _type: 'span', _key: key(), marks: [], text: 'Powder Ridge HOA is committed to ensuring digital accessibility for all residents. We continually work to improve the user experience and apply accessibility standards on this site.' },
      ]},
      { _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [
        { _type: 'span', _key: key(), marks: [], text: 'If you encounter an accessibility barrier, please contact the board at powderridgesecretary@gmail.com so we can address it.' },
      ]},
    ]
    await client.patch('legal-accessibility').set({ body }).commit()
    console.log('legal-accessibility: seeded placeholder body')
  }
}

async function main() {
  await cleanupCollectionPages()
  await fixHomeFeatureGridLinks()
  await migrateLegalPages()
}

main().catch((e) => { console.error(e); process.exit(1) })
