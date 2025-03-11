import { ObjectId } from 'mongodb'
import Boom from '@hapi/boom'
import { findFormById } from './find-form-by-id.js'

/**
 * Deletes a form from the database if it's in progress
 * @param {import('mongodb').Db} db - MongoDB database instance
 * @param {string} formId - The ID of the form to delete
 * @returns {Promise<void>}
 * @throws {Boom.notFound} - If the form is not found
 * @throws {Boom.badRequest} - If the form is already submitted
 */
async function deleteForm(db, formId) {
  // First check if the form exists and get its status
  const form = await findFormById(db, formId)

  if (form.status === 'submitted') {
    throw Boom.badRequest(
      `Form with ID ${formId} cannot be deleted as it has already been submitted`
    )
  }

  let objectId
  try {
    objectId = new ObjectId(formId)
  } catch (error) {
    throw Boom.notFound(`Form with ID ${formId} not found`)
  }

  const result = await db.collection('forms').deleteOne({ _id: objectId })

  if (result.deletedCount === 0) {
    throw Boom.notFound(`Form with ID ${formId} not found`)
  }
}

export { deleteForm }
