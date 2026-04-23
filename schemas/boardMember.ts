import { defineType, defineField } from 'sanity'

const POSITIONS = [
  { title: 'President', value: 'President' },
  { title: 'Vice President', value: 'Vice President' },
  { title: 'Secretary', value: 'Secretary' },
  { title: 'Treasurer', value: 'Treasurer' },
  { title: 'Secretary and Treasurer', value: 'Secretary and Treasurer' },
  { title: 'Treasurer and Secretary', value: 'Treasurer and Secretary' },
  { title: 'Director', value: 'Director' },
  { title: 'Member at Large', value: 'Member at Large' },
]

const POSITION_ORDER: Record<string, number> = {
  President: 0,
  'Vice President': 1,
  Secretary: 2,
  'Secretary and Treasurer': 2,
  Treasurer: 3,
  'Treasurer and Secretary': 3,
  Director: 4,
  'Member at Large': 5,
}

export default defineType({
  name: 'boardMember',
  title: 'Board Member',
  type: 'document',
  description: 'A member of the Powder Ridge HOA board. Shown on the Board Members page and used by the Contact form routing.',

  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      description: 'Example: "Dr. Randy Roman" or "Margaret (Peg) Wood". Appears directly on the site.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Board Position',
      description: 'The board role this person holds. Determines sort order on the public page.',
      type: 'string',
      options: {
        list: POSITIONS,
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      description: 'Public email address for this board member. Shown on their card on the Board Members page.',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((val?: string) => {
          if (!val) return true
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? true : 'Not a valid email address'
        }),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      description: 'Optional phone number. Currently not shown on the public board members page by request, but kept for internal use.',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      description: 'A square-ish headshot works best. Click the image after upload to set the Hotspot — that point stays centered when the photo is cropped into a circle avatar on the public site. Recommended: at least 480×480 px.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Bio',
      description: 'A short paragraph or two about this board member. Paragraphs are separated automatically on the public page.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Auto-generated from the name. Used if we ever link to an individual board member page. Only change if you need a custom URL.',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
  ],

  orderings: [
    {
      title: 'Board Position (standard order)',
      name: 'positionOrder',
      by: [{ field: 'position', direction: 'asc' }, { field: 'name', direction: 'asc' }],
    },
    {
      title: 'Name (A–Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],

  preview: {
    select: { title: 'name', position: 'position', media: 'image' },
    prepare({ title, position, media }: { title?: string; position?: string; media?: any }) {
      return {
        title: title || 'Unnamed member',
        subtitle: position || 'Position not set',
        media,
      }
    },
  },
})

// Exported for reference by other schemas / admin tooling if needed
export { POSITION_ORDER }
