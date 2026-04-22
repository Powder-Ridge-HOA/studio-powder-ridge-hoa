import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'committee',
  title: 'Committee',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Committee Name', type: 'string' }),
    defineField({ name: 'chairman', title: 'Chairman', type: 'string' }),
    defineField({ name: 'members', title: 'Members', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } }),
  ]
})
