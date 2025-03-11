import { logger } from '../utils/logger.js'

/**
 * Migration script to create the forms collection and indexes
 * Run this script manually using the MongoDB client
 */

/**
 * @param {import('mongodb').Db} db - MongoDB database instance
 * @returns {Promise<void>}
 */
export async function up(db) {
  logger.info('Creating forms collection and indexes...')

  // Create the forms collection if it doesn't exist
  try {
    await db.createCollection('forms')
    logger.info('Forms collection created successfully')
  } catch (error) {
    // Collection might already exist
    logger.info('Forms collection already exists or error:', error.message)
  }

  // Create indexes for the forms collection
  await db
    .collection('forms')
    .createIndex({ formName: 1 }, { background: true })
  await db.collection('forms').createIndex({ status: 1 }, { background: true })
  await db
    .collection('forms')
    .createIndex({ createdAt: 1 }, { background: true })
  await db
    .collection('forms')
    .createIndex({ updatedAt: 1 }, { background: true })

  logger.info('Forms collection indexes created successfully')
}

/**
 * @param {import('mongodb').Db} db - MongoDB database instance
 * @returns {Promise<void>}
 */
export async function down(db) {
  logger.info('Dropping forms collection...')

  try {
    await db.collection('forms').drop()
    logger.info('Forms collection dropped successfully')
  } catch (error) {
    logger.error('Error dropping forms collection:', error.message)
  }
}
