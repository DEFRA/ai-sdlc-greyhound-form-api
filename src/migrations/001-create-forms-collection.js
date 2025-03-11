/**
 * Migration script to create the forms collection and indexes
 * @param {import('mongodb').Db} db - MongoDB database instance
 * @param {object} logger - Logger instance
 * @returns {Promise<void>}
 */
export default async function (db, logger) {
  logger.info('Creating forms collection and indexes...')

  try {
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
    await db
      .collection('forms')
      .createIndex({ status: 1 }, { background: true })
    await db
      .collection('forms')
      .createIndex({ createdAt: 1 }, { background: true })
    await db
      .collection('forms')
      .createIndex({ updatedAt: 1 }, { background: true })

    logger.info('Forms collection indexes created successfully')
  } catch (error) {
    logger.error('Migration failed', error)
    throw error
  }
}
