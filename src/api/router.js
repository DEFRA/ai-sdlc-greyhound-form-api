import { health } from '~/src/api/health/index.js'
import { forms } from '~/src/api/forms/index.js'
import { docs } from '~/src/api/docs/index.js'

/**
 * @satisfies { import('@hapi/hapi').ServerRegisterPluginObject<*> }
 */
const router = {
  plugin: {
    name: 'Router',
    register: async (server) => {
      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Documentation route
      await server.register([docs])

      // Application specific routes, add your own routes here.
      await server.register([forms])
    }
  }
}

export { router }
