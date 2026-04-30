import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'resident',
  title: 'Resident',
  type: 'document',
  fields: [
    defineField({ name: 'firstname', title: 'First Name', type: 'string' }),
    defineField({ name: 'lastname', title: 'Last Name', type: 'string' }),
    defineField({ name: 'nickname', title: 'Nickname', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'organization', title: 'Organization / Trust', type: 'string' }),
    defineField({
      name: 'additionalContacts',
      title: 'Additional Contacts',
      description:
        'Other people associated with this address (e.g. spouse, co-owner) with their own email/phone. Optional.',
      type: 'array',
      of: [{
        type: 'object',
        name: 'additionalContact',
        fields: [
          defineField({ name: 'name', title: 'Name', type: 'string' }),
          defineField({ name: 'email', title: 'Email', type: 'string' }),
          defineField({ name: 'phone', title: 'Phone', type: 'string' }),
        ],
        preview: {
          select: { title: 'name', subtitle: 'email' },
          prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
            return { title: title || subtitle || 'Untitled contact', subtitle: title ? subtitle : '' }
          },
        },
      }],
    }),
    defineField({ name: 'notes', title: 'Notes (internal)', type: 'text' }),
    defineField({ name: 'groupmembership', title: 'Group Membership', type: 'string' }),
  ]
})
