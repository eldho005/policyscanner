import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'bwsh2ue3',
    dataset: 'production',
  },
  /**
   * Enable auto-updates for studios.
   * https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
