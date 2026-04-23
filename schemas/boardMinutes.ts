import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'boardMinutes',
  title: 'Board Minutes',
  type: 'document',
  description: 'Meeting minutes for a single board meeting. Displayed publicly on the Board Minutes page.',

  // Field groups appear as tabs at the top of the editor so meeting info,
  // discussion content, and the treasurer's report are each focused views
  // instead of one long scroll.
  groups: [
    { name: 'info', title: 'Meeting Info', default: true },
    { name: 'business', title: 'Business Discussed' },
    { name: 'treasurer', title: "Treasurer's Report" },
    { name: 'meta', title: 'Tags & Slug' },
  ],

  fields: [
    defineField({
      name: 'title',
      title: 'Meeting Title',
      description: 'Shown as the list header. Example: "Board Meeting — March 8, 2024". Leave blank to auto-use the date.',
      type: 'string',
      group: 'info',
    }),
    defineField({
      name: 'meetingStart',
      title: 'Meeting Date & Start Time',
      description: 'When the meeting began. Also used for ordering and the auto-generated slug.',
      type: 'datetime',
      group: 'info',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endTime',
      title: 'Meeting End Time',
      description: 'Optional. When the meeting adjourned.',
      type: 'datetime',
      group: 'info',
    }),
    defineField({
      name: 'teleconference',
      title: 'Held as teleconference?',
      description: 'Check this if the meeting was held by phone or video. A "Teleconference" badge appears on the public page.',
      type: 'boolean',
      initialValue: false,
      group: 'info',
    }),

    defineField({
      name: 'oldBusiness',
      title: 'Old Business',
      description: 'Topics carried over from the last meeting. Each paragraph becomes a bullet on the live site.',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'business',
    }),
    defineField({
      name: 'newBusiness',
      title: 'New Business',
      description: 'Topics discussed for the first time at this meeting.',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'business',
    }),

    defineField({
      name: 'treasurersReport',
      title: "Treasurer's Report",
      description: "Financial summary presented at the meeting. Leave blank if no report was given.",
      type: 'object',
      group: 'treasurer',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'treasurersName',
          title: "Treasurer's Name",
          description: 'Who gave the report.',
          type: 'string',
          initialValue: 'Peg Wood',
        }),
        defineField({
          name: 'dateGenerated',
          title: 'Report Date',
          description: 'The "as of" date the balance and expenses reflect.',
          type: 'datetime',
        }),
        defineField({
          name: 'totalBalance',
          title: 'Total Balance',
          description: 'Current account balance in CENTS. Example: 4834839 = $48,348.39. The public site formats this as USD automatically.',
          type: 'number',
        }),
        defineField({
          name: 'approvedBudget',
          title: 'Budget approved this meeting?',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'notes',
          title: 'Summary Notes',
          description: 'Narrative paragraph from the treasurer. Plain text.',
          type: 'text',
          rows: 5,
        }),
        defineField({
          name: 'expenses',
          title: 'Expenses',
          description: 'List each line item. Amounts in CENTS (e.g. 408000 = $4,080.00).',
          type: 'array',
          of: [{
            type: 'object',
            name: 'expense',
            fields: [
              defineField({ name: 'nameOfExpense', title: 'Expense', type: 'string' }),
              defineField({
                name: 'amountOfExpense',
                title: 'Amount (cents)',
                description: 'In cents — e.g. 12500 = $125.00.',
                type: 'number',
              }),
            ],
            preview: {
              select: { title: 'nameOfExpense', amount: 'amountOfExpense' },
              prepare({ title, amount }: { title?: string; amount?: number }) {
                const formatted =
                  typeof amount === 'number'
                    ? (amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                    : '—'
                return { title: title || 'Unnamed expense', subtitle: formatted }
              },
            },
          }],
        }),
      ],
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      description: 'Optional keywords (e.g. "annual", "budget"). Not currently shown on the public site; useful for internal search.',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'meta',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Auto-generated from the meeting date. Only change if you need a custom URL.',
      type: 'slug',
      options: { source: 'meetingStart' },
      group: 'meta',
    }),
  ],

  orderings: [{
    title: 'Meeting Date, Newest First',
    name: 'meetingDateDesc',
    by: [{ field: 'meetingStart', direction: 'desc' }]
  }],

  preview: {
    select: { title: 'title', date: 'meetingStart', teleconference: 'teleconference' },
    prepare({ title, date, teleconference }: { title?: string; date?: string; teleconference?: boolean }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
        : 'No date'
      const suffix = teleconference ? ' · Teleconference' : ''
      return {
        title: title || `Board Meeting — ${formattedDate}`,
        subtitle: formattedDate + suffix,
      }
    },
  },
})
