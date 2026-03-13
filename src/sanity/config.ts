import { defineConfig, type SchemaTypeDefinition } from 'sanity'
import { structureTool } from 'sanity/structure'
import { Iframe } from 'sanity-plugin-iframe-pane'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { apiVersion, dataset, projectId } from './env'

const BASE_URL =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

const PREVIEW_SECRET =
  process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET ?? 'policyscanner-preview-2026'

function getPreviewUrl(doc: { _type?: string; slug?: { current?: string } }) {
  const slug = doc?.slug?.current
  if (!slug) return null
  const secret = PREVIEW_SECRET
  if (doc._type === 'insurancePage')
    return `${BASE_URL}/api/draft/enable?secret=${secret}&redirect=/life-insurance/${slug}`
  if (doc._type === 'staticPage')
    return `${BASE_URL}/api/draft/enable?secret=${secret}&redirect=/${slug}`
  return null
}

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('PolicyScanner CMS')
          .items([
            S.listItem()
              .title('Insurance Pages')
              .child(S.documentTypeList('insurancePage').title('Insurance Pages')),
            S.divider(),
            S.listItem()
              .title('Static Pages')
              .child(S.documentTypeList('staticPage').title('Static Pages')),
          ]),
      defaultDocumentNode: (S, { schemaType }) => {
        if (schemaType === 'insurancePage' || schemaType === 'staticPage') {
          return S.document().views([
            S.view.form().title('Edit'),
            S.view
              .component(Iframe)
              .title('Preview')
              .options({
                url: (doc: { _type?: string; slug?: { current?: string } }) =>
                  getPreviewUrl(doc) ?? `${BASE_URL}`,
                reload: { button: true },
                defaultSize: 'desktop',
              }),
          ])
        }
        return S.document()
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes as SchemaTypeDefinition[] },
})
