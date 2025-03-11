import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import HapiSwagger from 'hapi-swagger'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get version from package.json without using import
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJsonPath = path.resolve(__dirname, '../../../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const { version } = packageJson

/**
 * Swagger documentation plugin
 * @satisfies { import('@hapi/hapi').ServerRegisterPluginObject<*> }
 */
const docs = {
  plugin: {
    name: 'docs',
    register: async (server) => {
      const swaggerOptions = {
        info: {
          title: 'Greyhound Form API Documentation',
          version,
          description:
            'API for managing greyhound racetrack welfare licence application forms'
        },
        documentationPath: '/docs',
        jsonPath: '/swagger.json',
        grouping: 'tags',
        sortTags: 'alpha',
        sortEndpoints: 'method'
      }

      await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
      ])
    }
  }
}

export { docs }
