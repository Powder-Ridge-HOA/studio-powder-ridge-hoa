import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'boardMinutes',
  title: 'Board Minutes',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Meeting Title', type: 'string' }),
    defineField({ name: 'meetingStart', title: 'Meeting Date', type: 'datetime' }),
    defineField({ name: 'endTime', title: 'Meeting End Time', type: 'datetime' }),
    defineField({ name: 'teleconference', title: 'Teleconference?', type: 'boolean' }),
    defineField({ name: 'oldBusiness', title: 'Old Business', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'newBusiness', title: 'New Business', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'treasurersReport',
      title: "Treasurer's Report",
      type: 'object',
      fields: [
        defineField({ name: 'treasurersName', title: "Treasurer's Name", type: 'string' }),
        defineField({ name: 'dateGenerated', title: 'Date Generated', type: 'datetime' }),
        defineField({ name: 'totalBalance', title: 'Total Balance (cents)', type: 'number' }),
        defineField({ name: 'approvedBudget', title: 'Budget Approved?', type: 'boolean' }),
        defineField({ name: 'notes', title: 'Notes', type: 'text' }),
        defineField({
          name: 'expenses',
          title: 'Expenses',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              defineField({ name: 'nameOfExpense', title: 'Expense', type: 'string' }),
              defineField({ name: 'amountOfExpense', title: 'Amount (cents)', type: 'number' }),
            ]
          }]
        }),
      ]
    }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'meetingStart' } }),
  ],
  orderings: [{
    title: 'Meeting Date, Newest First',
    name: 'meetingDateDesc',
    by: [{ field: 'meetingStart', direction: 'desc' }]
  }]
})
