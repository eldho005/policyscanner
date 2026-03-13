import { defineType, defineField, defineArrayMember } from 'sanity'

// Hero Section Component
export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
  ],
  preview: { select: { title: 'title', subtitle: 'description' } },
})

// Content Block Component
export const contentBlock = defineType({
  name: 'contentBlock',
  title: 'Content Block',
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'Anchor ID (for TOC)', type: 'string', description: 'e.g. WhatIsTermLife — leave empty to skip TOC' }),
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'heading_level',
      title: 'Heading Level',
      type: 'number',
      options: { list: [{ title: 'H2 (default)', value: 2 }, { title: 'H3', value: 3 }] },
      initialValue: 2,
    }),
    defineField({
      name: 'image',
      title: 'Section Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required() })],
    }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
      description: 'Plain text paragraphs — one per item',
    }),
    defineField({
      name: 'bullets',
      title: 'Bullet Points',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'bold', title: 'Bold Prefix', type: 'string' }),
          defineField({ name: 'text', title: 'Text', type: 'text', validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'bold', subtitle: 'text' } },
      })],
    }),
    defineField({
      name: 'ordered',
      title: 'Ordered List',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'bold', title: 'Bold Prefix', type: 'string' }),
          defineField({ name: 'text', title: 'Text', type: 'text', validation: (Rule) => Rule.required() }),
        ],
        preview: { select: { title: 'bold', subtitle: 'text' } },
      })],
    }),
  ],
  preview: { select: { title: 'heading', subtitle: 'id' } },
})

// Definition Block
export const definitionBlock = defineType({
  name: 'definitionBlock',
  title: 'Definition Block',
  type: 'object',
  fields: [
    defineField({ name: 'term', title: 'Term', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'definition', title: 'Definition', type: 'text', validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: 'term' } },
})

// Callout Block
export const calloutBlock = defineType({
  name: 'calloutBlock',
  title: 'Callout / Highlight Box',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Callout Type',
      type: 'string',
      options: { list: ['insight', 'tip', 'warning', 'note'] },
      validation: (Rule) => Rule.required(),
      initialValue: 'insight',
    }),
    defineField({ name: 'title', title: 'Callout Title', type: 'string' }),
    defineField({ name: 'text', title: 'Callout Text', type: 'text', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'type' },
    prepare: ({ title, subtitle }: { title: string; subtitle: string }) => ({
      title: title || 'Callout',
      subtitle: subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : '',
    }),
  },
})

// Example Card
export const exampleCard = defineType({
  name: 'exampleCard',
  title: 'Example Card',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: 'title' } },
})

// Table Block
export const tableBlock = defineType({
  name: 'tableBlock',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Table Title (optional)', type: 'string' }),
    defineField({
      name: 'headers',
      title: 'Column Headers',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        name: 'tableRow',
        fields: [
          defineField({
            name: 'cells',
            title: 'Cells',
            type: 'array',
            of: [defineArrayMember({ type: 'string' })],
            description: 'One cell per column — must match the number of headers',
          }),
        ],
        preview: {
          select: { cells: 'cells' },
          prepare: ({ cells }: { cells: string[] }) => ({
            title: cells ? cells.join(' | ') : 'Row',
          }),
        },
      })],
    }),
    defineField({ name: 'footnote', title: 'Footnote', type: 'text' }),
  ],
  preview: { select: { title: 'title' } },
})

// FAQ Item
export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'answer', title: 'Answer', type: 'text', validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: 'question' } },
})

// FAQ Block
export const faqBlock = defineType({
  name: 'faqBlock',
  title: 'FAQ Block',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      of: [defineArrayMember({ type: 'faqItem' })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { items: 'items' },
    prepare: ({ items }: { items: unknown[] }) => ({
      title: `FAQ Block (${items?.length || 0} items)`,
    }),
  },
})

// CTA Block
export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'CTA Block',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Headline', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'body', title: 'Description', type: 'text' }),
    defineField({ name: 'button_text', title: 'Button Text', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'url', title: 'Button URL', type: 'string', validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: 'heading', subtitle: 'button_text' } },
})

// Calculator Block
export const calculatorBlock = defineType({
  name: 'calculatorBlock',
  title: 'Calculator',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Section Title', type: 'string' }),
  ],
  preview: { select: { title: 'title' } },
})

// Image Block
export const imageBlock = defineType({
  name: 'imageBlock',
  title: 'Image Block',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required() }),
      ],
    }),
    defineField({ name: 'caption', title: 'Caption (optional)', type: 'string' }),
    defineField({
      name: 'width',
      title: 'Display Width',
      type: 'string',
      options: { list: [
        { title: 'Full width', value: 'full' },
        { title: 'Wide (75%)', value: 'wide' },
        { title: 'Medium (50%)', value: 'medium' },
        { title: 'Small (33%)', value: 'small' },
      ]},
      initialValue: 'full',
    }),
  ],
  preview: {
    select: { title: 'caption', media: 'image' },
    prepare: ({ title, media }: { title: string; media: unknown }) => ({
      title: title || 'Image Block',
      media,
    }),
  },
})

// Trust Badges (no configurable fields)
export const trustBadges = defineType({
  name: 'trustBadges',
  title: 'Trust Badges Bar',
  type: 'object',
  fields: [
    defineField({
      name: 'placeholder',
      title: 'Trust badges are rendered automatically',
      type: 'string',
      readOnly: true,
    }),
  ],
  preview: { prepare: () => ({ title: 'Trust Badges Bar' }) },
})
