import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function main() {
  const home = await client.getDocument('page-home') as any
  if (!home) { console.log('page-home not found'); return }
  const sections = Array.isArray(home.sections) ? home.sections : []

  const heroIdx = sections.findIndex((s: any) => s._type === 'heroSection')
  const featureIdx = sections.findIndex((s: any) => s._type === 'featureGrid')

  const patch = client.patch('page-home')

  if (heroIdx >= 0) {
    patch.set({
      [`sections[${heroIdx}].cta`]: { label: 'Meet the Board', url: '/board-members' },
    })
  }

  if (featureIdx >= 0 && Array.isArray(sections[featureIdx].items)) {
    const urlByTitle: Record<string, string> = {
      'Board Members': '/board-members',
      'Covenants, Conditions & Restrictions': '/ccrs',
      'Frequently Asked Questions': '/faqs',
      'Board Minutes': '/board-minutes',
    }
    sections[featureIdx].items.forEach((item: any, i: number) => {
      const url = urlByTitle[item.title]
      if (url) patch.set({ [`sections[${featureIdx}].items[${i}].url`]: url })
    })
  }

  await patch.commit()
  console.log('Updated hero CTA + feature-card URLs')
}

main().catch((e) => { console.error(e); process.exit(1) })
