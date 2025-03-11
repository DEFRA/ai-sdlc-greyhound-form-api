import { ObjectId } from 'mongodb'
import Boom from '@hapi/boom'
import { findFormById } from './find-form-by-id.js'

/**
 * Submits a form in the database (changes status to 'submitted')
 * @param {import('mongodb').Db} db - MongoDB database instance
 * @param {string} formId - The ID of the form to submit
 * @returns {Promise<object>} - The submitted form
 * @throws {Boom.notFound} - If the form is not found
 * @throws {Boom.badRequest} - If the form is already submitted
 */
async function submitForm(db, formId) {
  // First check if the form exists
  const form = await findFormById(db, formId)

  if (form.status === 'submitted') {
    throw Boom.badRequest(`Form with ID ${formId} is already submitted`)
  }

  let objectId
  try {
    objectId = new ObjectId(formId)
  } catch (error) {
    throw Boom.notFound(`Form with ID ${formId} not found`)
  }

  const result = await db.collection('forms').findOneAndUpdate(
    { _id: objectId },
    {
      $set: {
        status: 'submitted',
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after', projection: { _id: 0, id: '$_id' } }
  )

  if (!result.value) {
    throw Boom.notFound(`Form with ID ${formId} not found`)
  }

  return result.value
}

export { submitForm }
