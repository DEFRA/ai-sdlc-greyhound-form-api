import { ObjectId } from 'mongodb'
import Boom from '@hapi/boom'

/**
 * Retrieves a form by ID from the database
 * @param {import('mongodb').Db} db - MongoDB database instance
 * @param {string} formId - The ID of the form to retrieve
 * @returns {Promise<object>} - The retrieved form
 * @throws {Boom.notFound} - If the form is not found
 */
async function findFormById(db, formId) {
  let objectId

  try {
    objectId = new ObjectId(formId)
  } catch (error) {
    throw Boom.notFound(`Form with ID ${formId} not found`)
  }

  const form = await db.collection('forms').findOne(
    { _id: objectId },
    {
      projection: {
        _id: 0,
        id: '$_id',
        formName: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        pages: 1
      }
    }
  )

  if (!form) {
    throw Boom.notFound(`Form with ID ${formId} not found`)
  }

  return form
}

export { findFormById }
