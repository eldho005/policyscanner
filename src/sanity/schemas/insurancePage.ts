import { defineType, defineField, defineArrayMember } from 'sanity'

export const insurancePage = defineType({
  name: 'insurancePage',
  title: 'Insurance Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: 'e.g. life-insurance, what-is-term-life-insurance',
    }),
    defineField({
      name: 'tag',
      title: 'Tag / Category Label',
      type: 'string',
      description: 'e.g. "Life Insurance Guide"',
    }),
    defineField({
      name: 'read_time',
      title: 'Read Time',
      type: 'string',
      description: 'e.g. "12 min read"',
    }),
    defineField({
      name: 'prepared_by',
      title: 'Prepared By',
      type: 'string',
      description: 'e.g. "Baljit Kaur LLQP"',
    }),
    defineField({
      name: 'reviewed_by',
      title: 'Reviewed By',
      type: 'string',
      description: 'e.g. "Eldho George LLQP"',
    }),
    defineField({
      name: 'seo_description',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'page_data',
      title: 'Page Components',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroSection', title: 'Hero Section' }),
        defineArrayMember({ type: 'trustBadges', title: 'Trust Badges' }),
        defineArrayMember({ type: 'contentBlock', title: 'Content Block' }),
        defineArrayMember({ type: 'definitionBlock', title: 'Definition Box' }),
        defineArrayMember({ type: 'calloutBlock', title: 'Callout / Highlight' }),
        defineArrayMember({ type: 'exampleCard', title: 'Example Card' }),
        defineArrayMember({ type: 'tableBlock', title: 'Table' }),
        defineArrayMember({ type: 'faqBlock', title: 'FAQ Block' }),
        defineArrayMember({ type: 'ctaBlock', title: 'CTA Block' }),
        defineArrayMember({ type: 'calculatorBlock', title: 'Calculator' }),
        defineArrayMember({ type: 'imageBlock', title: 'Image Block' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }: { title: string; subtitle: string }) => ({
      title,
      subtitle: `/life-insurance/${subtitle}`,
    }),
  },
})
