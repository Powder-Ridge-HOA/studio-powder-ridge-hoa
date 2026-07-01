import { defineType, defineField } from 'sanity';
import { MdMenu } from 'react-icons/md';

// Human-readable label per navType, used in the document-list preview so the
// board sees "Main Navigation" instead of a raw dump of the items array.
const NAV_TYPE_TITLES: Record<string, string> = {
  main: 'Main Navigation',
  footer: 'Footer Navigation',
  legal: 'Legal Navigation',
};

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MdMenu,
  fields: [
    defineField({
      name: 'navType',
      title: 'Navigation type',
      description: 'Which menu on the site this list controls. The site matches menus by this value, so it must be set.',
      type: 'string',
      options: {
        list: [
          { title: 'Main Navigation', value: 'main' },
          { title: 'Footer Navigation', value: 'footer' },
          { title: 'Legal Navigation', value: 'legal' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Navigation menu items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'menuItem',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
            }),
            defineField({
              name: 'isExternal',
              title: 'External link',
              type: 'boolean',
            })
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        }
      ],
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: { navType: 'navType', items: 'items' },
    prepare({ navType, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: NAV_TYPE_TITLES[navType] ?? 'Navigation (no type set)',
        subtitle: `${count} item${count === 1 ? '' : 's'}`,
      };
    },
  },
});
