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
    defineField({ name: 'notes', title: 'Notes (internal)', type: 'text' }),
    defineField({ name: 'groupmembership', title: 'Group Membership', type: 'string' }),
  ]
})
