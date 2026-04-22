import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const key = () => Math.random().toString(36).slice(2, 10)

type Addition = {
  pageId: string
  sectionType: string
  heading: string
  subheading?: string
}

const additions: Addition[] = [
  {
    pageId: 'page-board-members',
    sectionType: 'boardMemberGrid',
    heading: 'Board Members',
    subheading: 'Meet the volunteers serving our community.',
  },
  {
    pageId: 'page-ccrs',
    sectionType: 'ccrList',
    heading: 'Covenants, Conditions & Restrictions',
    subheading: 'Search and browse our CCR provisions.',
  },
  {
    pageId: 'page-board-minutes',
    sectionType: 'minutesArchive',
    heading: 'Board Meeting Minutes',
    subheading: 'Archive of past board meetings.',
  },
  {
    pageId: 'page-directory',
    sectionType: 'residentDirectory',
    heading: 'Resident Directory',
    subheading: 'Contact information for Powder Ridge residents.',
  },
]

async function main() {
  for (const add of additions) {
    const page = await client.getDocument(add.pageId)
    if (!page) {
      console.log(`  ${add.pageId}: not found, skipping`)
      continue
    }
    const existingSections = Array.isArray((page as any).sections) ? (page as any).sections : []
    const alreadyHas = existingSections.some((s: any) => s?._type === add.sectionType)
    if (alreadyHas) {
      console.log(`  ${add.pageId}: already has ${add.sectionType}, skipping`)
      continue
    }
    const newSection = {
      _type: add.sectionType,
      _key: key(),
      heading: add.heading,
      ...(add.subheading ? { subheading: add.subheading } : {}),
    }
    await client.patch(add.pageId).setIfMissing({ sections: [] }).append('sections', [newSection]).commit()
    console.log(`  ${add.pageId}: appended ${add.sectionType}`)
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
