import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const key = () => Math.random().toString(36).slice(2, 10)

async function main() {
  // FAQs page
  const faqsPage = await client.getDocument('page-faqs') as any
  if (faqsPage) {
    const existing = Array.isArray(faqsPage.sections) ? faqsPage.sections : []
    if (!existing.some((s: any) => s._type === 'faqList')) {
      await client.patch('page-faqs').setIfMissing({ sections: [] }).append('sections', [{
        _type: 'faqList',
        _key: key(),
        heading: 'Frequently Asked Questions',
        subheading: 'Answers to common questions from Powder Ridge residents.',
      }]).commit()
      console.log('page-faqs: appended faqList')
    } else {
      console.log('page-faqs: already has faqList, skipping')
    }
  }

  // Board Members page: append committeePanel referencing ACC
  const acc = await client.fetch<{ _id: string }[]>(`*[_type == "committee" && name match "Architectural*"]{_id}[0]`)
  const accDoc: any = acc || null
  if (!accDoc?._id) {
    console.log('No Architectural Control Committee found, skipping committeePanel seed')
  } else {
    const bm = await client.getDocument('page-board-members') as any
    if (bm) {
      const existing = Array.isArray(bm.sections) ? bm.sections : []
      if (!existing.some((s: any) => s._type === 'committeePanel')) {
        await client.patch('page-board-members').setIfMissing({ sections: [] }).append('sections', [{
          _type: 'committeePanel',
          _key: key(),
          heading: 'Architectural Control Committee',
          subheading: 'Design review for Powder Ridge improvements.',
          committee: { _type: 'reference', _ref: accDoc._id },
        }]).commit()
        console.log('page-board-members: appended committeePanel')
      } else {
        console.log('page-board-members: already has committeePanel, skipping')
      }
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
