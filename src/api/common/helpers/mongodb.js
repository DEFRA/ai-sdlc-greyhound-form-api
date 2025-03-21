import { MongoClient } from 'mongodb'
import { LockManager } from 'mongo-locks'
import { runMigrations } from '~/src/migrations/index.js'
import { config } from '~/src/config/index.js'

/**
 * @satisfies { import('@hapi/hapi').ServerRegisterPluginObject<*> }
 */
export const mongoDb = {
  plugin: {
    name: 'mongodb',
    version: '1.0.0',
    /**
     *
     * @param { import('@hapi/hapi').Server } server
     * @param {{mongoUrl: string, databaseName: string, retryWrites: boolean, readPreference: string}} options
     * @returns {Promise<void>}
     */
    register: async function (server, options) {
      server.logger.info('Setting up MongoDb')

      const client = await MongoClient.connect(options.mongoUrl, {
        retryWrites: options.retryWrites,
        readPreference: options.readPreference,
        ...(server.secureContext && { secureContext: server.secureContext })
      })

      const databaseName = options.databaseName
      const db = client.db(databaseName)
      const locker = new LockManager(db.collection('mongo-locks'))

      // Run migrations before creating indexes
      server.logger.info('Running database migrations...')
      await runMigrations(db)
      server.logger.info('Database migrations completed')

      await createIndexes(db)

      server.logger.info(`MongoDb connected to ${databaseName}`)

      server.decorate('server', 'mongoClient', client)
      server.decorate('server', 'db', db)
      server.decorate('server', 'locker', locker)
      server.decorate('request', 'db', () => db, { apply: true })
      server.decorate('request', 'locker', () => locker, { apply: true })

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      server.events.on('stop', async () => {
        server.logger.info('Closing Mongo client')
        await client.close(true)
      })
    }
  },
  options: {
    mongoUrl: config.get('mongoUri'),
    databaseName: config.get('mongoDatabase'),
    retryWrites: false,
    readPreference: 'secondary'
  }
}

/**
 * @param {import('mongodb').Db} db
 * @returns {Promise<void>}
 */
async function createIndexes(db) {
  await db.collection('mongo-locks').createIndex({ id: 1 })

  // Example of how to create a mongodb index. Remove as required
  await db.collection('example-data').createIndex({ id: 1 })

  // Indexes for the forms collection
  await db.collection('forms').createIndex({ formName: 1 })
  await db.collection('forms').createIndex({ status: 1 })
  await db.collection('forms').createIndex({ createdAt: 1 })
  await db.collection('forms').createIndex({ updatedAt: 1 })
}

/**
 * To be mixed in with Request|Server to provide the db decorator
 * @typedef {{db: import('mongodb').Db, locker: import('mongo-locks').LockManager }} MongoDBPlugin
 */
