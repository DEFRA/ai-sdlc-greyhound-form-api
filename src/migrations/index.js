import { MongoClient } from 'mongodb'
import { config } from '~/src/config/index.js'
import * as createFormsCollection from './001-create-forms-collection.js'
import { logger } from '../utils/logger.js'

/**
 * List of all migrations to run in order
 */
const migrations = [createFormsCollection]

/**
 * Runs all migrations in order
 * @returns {Promise<void>}
 */
async function runMigrations() {
  logger.info('Running migrations...')

  const client = await MongoClient.connect(config.get('mongoUri'))
  const db = client.db(config.get('mongoDatabase'))

  try {
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
      await migration.up(db)

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
    await client.close()
  }
}

/**
 * Rolls back the last migration
 * @returns {Promise<void>}
 */
async function rollbackLastMigration() {
  logger.info('Rolling back last migration...')

  const client = await MongoClient.connect(config.get('mongoUri'))
  const db = client.db(config.get('mongoDatabase'))

  try {
    // Get the last migration that was run
    const lastMigration = await db
      .collection('migrations')
      .find({})
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray()

    if (lastMigration.length === 0) {
      logger.info('No migrations to roll back')
      return
    }

    const migrationName = lastMigration[0].name

    // Find the migration in our list
    const migration = migrations.find(
      (m) => (m.name || 'unknown') === migrationName
    )

    if (!migration) {
      logger.info(
        `Migration ${migrationName} not found in migrations list, cannot roll back`
      )
      return
    }

    logger.info(`Rolling back migration: ${migrationName}...`)
    await migration.down(db)

    // Remove the migration record
    await db.collection('migrations').deleteOne({ name: migrationName })

    logger.info(`Migration ${migrationName} rolled back successfully`)
  } catch (error) {
    logger.error('Error rolling back migration:', error)
    throw error
  } finally {
    await client.close()
  }
}

export { runMigrations, rollbackLastMigration }
