import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'kingston-anash-cms',

  projectId: 'yvp1jx5r',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
  cors: {
    allowOrigins: ['http://localhost:3000', 'http://localhost:3001'],
    allowCredentials: true,
  },
  api: {
    cors: {
      allowOrigins: ['http://localhost:3000', 'http://localhost:3001'],
      allowCredentials: true,
    },
  },
})
