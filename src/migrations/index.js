import { MongoClient } from 'mongodb'
import { config } from '~/src/config/index.js'
import createFormsCollection from './001-create-forms-collection.js'
import { logger } from '../utils/logger.js'

/**
 * List of all migrations to run in order
 */
const migrations = [createFormsCollection]

/**
 * Runs all migrations in order
 * @param {import('mongodb').Db} [providedDb] - Optional MongoDB database instance to use
 * @returns {Promise<void>}
 */
async function runMigrations(providedDb) {
  logger.info('Running migrations...')

  let client
  let db

  try {
    if (providedDb) {
      db = providedDb
    } else {
      client = await MongoClient.connect(config.get('mongoUri'))
      db = client.db(config.get('mongoDatabase'))
    }

    // Create migrations collection if it doesn't exist
    try {
      await db.createCollection('migrations')
    } catch (error) {
      // Collection might already exist
      logger.info(
        'Migrations collection already exists or error:',
        error.message
      )
    }

    // Run each migration
    for (const migration of migrations) {
      const migrationName = migration.name || 'unknown'

      // Check if migration has already been run
      const migrationRecord = await db
        .collection('migrations')
        .findOne({ name: migrationName })

      if (migrationRecord) {
        logger.info(`Migration ${migrationName} already run, skipping...`)
        continue
      }

      logger.info(`Running migration: ${migrationName}...`)
      await migration(db, logger)

      // Record that the migration has been run
      await db.collection('migrations').insertOne({
        name: migrationName,
        timestamp: new Date()
      })

      logger.info(`Migration ${migrationName} completed successfully`)
    }

    logger.info('All migrations completed successfully')
  } catch (error) {
    logger.error('Error running migrations:', error)
    throw error
  } finally {
    if (client) {
      await client.close()
    }
  }
}

/**
 * Rolls back the last migration
 * Note: This functionality is not supported with the new migration format
 * @deprecated
 */
async function rollbackLastMigration() {
  logger.warn(
    'Rollback functionality is not supported with the new migration format'
  )
  return Promise.resolve()
}

export { runMigrations, rollbackLastMigration }
