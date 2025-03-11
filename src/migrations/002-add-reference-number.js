import { generateReferenceNumber } from '../utils/index.js'

/**
 * Migration script to add referenceNumber field to existing forms
 * @param {import('mongodb').Db} db - MongoDB database instance
 * @param {object} logger - Logger instance
 * @returns {Promise<void>}
 */
export default async function addReferenceNumber(db, logger) {
  logger.info('Adding referenceNumber field to existing forms...')

  try {
    // Get all forms without a referenceNumber
    const forms = await db
      .collection('forms')
      .find({ referenceNumber: { $exists: false } })
      .toArray()

    logger.info(`Found ${forms.length} forms without a referenceNumber`)

    // Update each form with a new reference number
    for (const form of forms) {
      const referenceNumber = generateReferenceNumber()

      await db
        .collection('forms')
        .updateOne({ _id: form._id }, { $set: { referenceNumber } })

      logger.info(
        `Updated form ${form._id.toString()} with reference number ${referenceNumber}`
      )
    }

    // Create an index for the referenceNumber field
    await db
      .collection('forms')
      .createIndex({ referenceNumber: 1 }, { unique: true, background: true })

    logger.info('Reference number index created successfully')
    logger.info('Migration completed successfully')
  } catch (error) {
    logger.error('Migration failed', error)
    throw error
  }
}
