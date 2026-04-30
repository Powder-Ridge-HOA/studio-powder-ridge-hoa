import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const key = () => Math.random().toString(36).slice(2, 10)

// One-shot: replace page-home's featureGrid (the old "Quick Links" cards)
// with a single populated communityInfo section per the spec.
async function main() {
  const home = (await client.getDocument('page-home')) as any
  if (!home) {
    console.log('page-home not found')
    return
  }
  const sections = Array.isArray(home.sections) ? home.sections : []

  const communityInfoSection = {
    _type: 'communityInfo',
    _key: key(),
    heading: 'Community at a Glance',
    items: [
      {
        _key: key(),
        label: 'HOA Dues',
        value: '$150 per year, collected in March. Make checks payable to Powder Ridge HOA.',
      },
      {
        _key: key(),
        label: 'Mailing Address',
        value: 'P.O. Box 4574, Grand Junction, CO 81502',
      },
      {
        _key: key(),
        label: 'Noise Ordinance',
        value: '10pm–6am daily (Mesa County)',
      },
      {
        _key: key(),
        label: 'DRC Review Period',
        value: '60 days from plan submission.',
        linkLabel: 'Learn more',
        linkUrl: '/board-members',
      },
      {
        _key: key(),
        label: 'Water & Sewer',
        value: 'Managed by Grand Mesa Metro District',
      },
      {
        _key: key(),
        label: 'Road Plowing',
        value: 'Mesa County maintains subdivision roads. Contact Mesa County road department for issues.',
      },
    ],
  }

  // Replace any featureGrid section with the new communityInfo block. If
  // there is no featureGrid present (already migrated), just ensure
  // communityInfo exists where featureGrid would have gone.
  const featureIdx = sections.findIndex((s: any) => s._type === 'featureGrid')
  const alreadyHas = sections.some((s: any) => s._type === 'communityInfo')

  let next: any[]
  if (featureIdx >= 0) {
    next = [...sections]
    next.splice(featureIdx, 1, communityInfoSection)
    console.log(`Replacing featureGrid at index ${featureIdx} with communityInfo`)
  } else if (!alreadyHas) {
    // Insert right after the hero, before any later sections
    const heroIdx = sections.findIndex((s: any) => s._type === 'heroSection')
    const insertAt = heroIdx >= 0 ? heroIdx + 1 : 0
    next = [...sections]
    next.splice(insertAt, 0, communityInfoSection)
    console.log(`No featureGrid found; inserting communityInfo at index ${insertAt}`)
  } else {
    console.log('communityInfo already present; updating its content in place')
    next = sections.map((s: any) =>
      s._type === 'communityInfo' ? { ...communityInfoSection, _key: s._key } : s,
    )
  }

  await client.patch('page-home').set({ sections: next }).commit()
  console.log('page-home updated. Final section types:', next.map((s) => s._type))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
