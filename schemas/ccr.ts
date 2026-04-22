import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ccr',
  title: 'CCR',
  type: 'document',
  fields: [
    defineField({ name: 'ccr', title: 'Section Title', type: 'string' }),
    defineField({ name: 'refId', title: 'Reference ID', type: 'string' }),
    defineField({ name: 'refIdDisplay', title: 'Reference ID (Display)', type: 'string' }),
    defineField({ name: 'ccrContent', title: 'Content', type: 'text' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'ccr' } }),
  ]
})
