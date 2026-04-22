import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const key = () => Math.random().toString(36).slice(2, 10)

async function main() {
  // Hero — add welcome subtitle + CTA if missing
  const home = await client.getDocument('page-home') as any
  if (!home) { console.log('page-home not found'); return }

  const sections = Array.isArray(home.sections) ? home.sections : []
  const heroIdx = sections.findIndex((s: any) => s._type === 'heroSection')
  const featureIdx = sections.findIndex((s: any) => s._type === 'featureGrid')

  if (heroIdx >= 0 && !sections[heroIdx].subtitle) {
    await client.patch('page-home').set({
      [`sections[${heroIdx}].subtitle`]: 'Welcome to Powder Ridge',
      [`sections[${heroIdx}].cta`]: { label: 'About the Community', url: '/about' },
    }).commit()
    console.log('hero: set subtitle + CTA')
  }

  if (featureIdx >= 0) {
    const grid = sections[featureIdx]
    const hasItems = Array.isArray(grid.items) && grid.items.length
    if (!hasItems) {
      const items = [
        {
          _key: key(),
          title: 'Board Members',
          description: 'Get to know our board members or contact them if you have questions.',
        },
        {
          _key: key(),
          title: 'Covenants, Conditions & Restrictions',
          description: 'Want to know what our CCRs are? We have them all neatly listed for you.',
        },
        {
          _key: key(),
          title: 'Frequently Asked Questions',
          description: "Have questions? Before you contact us, see if we've already answered them here.",
        },
        {
          _key: key(),
          title: 'Board Minutes',
          description: 'Want to know about our finances or meetings? We keep track of them all here.',
        },
      ]
      await client.patch('page-home').set({
        [`sections[${featureIdx}].heading`]: 'Quick Links',
        [`sections[${featureIdx}].items`]: items,
      }).commit()
      console.log('featureGrid: populated 4 items')
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
