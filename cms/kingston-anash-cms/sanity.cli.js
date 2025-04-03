import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'yvp1jx5r',
    dataset: 'production'
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
  cors: {
    credentials: true,
    allowedOrigins: ['http://localhost:3000', 'http://localhost:3001']
  }
})
