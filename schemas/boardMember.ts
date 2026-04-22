import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'boardMember',
  title: 'Board Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'position', title: 'Position', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'description', title: 'Bio', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
  ]
})
