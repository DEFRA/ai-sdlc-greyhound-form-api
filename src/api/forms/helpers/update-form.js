import { ObjectId } from 'mongodb'
import Boom from '@hapi/boom'
import { findFormById } from './find-form-by-id.js'

/**
 * Updates a form in the database
 * @param {import('mongodb').Db} db - MongoDB database instance
 * @param {string} formId - The ID of the form to update
 * @param {object} updateData - The data to update
 * @param {string} [updateData.page] - The page to update (e.g., 'applicantDetails', 'licensingConditions')
 * @param {object} [updateData.data] - The data for the specified page
 * @returns {Promise<object>} - The updated form
 * @throws {Boom.notFound} - If the form is not found
 */
async function updateForm(db, formId, updateData) {
  // First check if the form exists
  await findFormById(db, formId)

  let objectId
  try {
    objectId = new ObjectId(formId)
  } catch (error) {
    throw Boom.notFound(`Form with ID ${formId} not found`)
  }

  const updateFields = {}

  // If updating a specific page
  if (updateData.page && updateData.data) {
    Object.entries(updateData.data).forEach(([key, value]) => {
      updateFields[`pages.${updateData.page}.${key}`] = value
    })
  } else {
    // If updating the form directly (e.g., formName)
    Object.entries(updateData).forEach(([key, value]) => {
      // Skip page and data fields as they're handled separately
      if (key !== 'page' && key !== 'data') {
        updateFields[key] = value
      }
    })
  }

  // Always update the updatedAt timestamp
  updateFields.updatedAt = new Date()

  const result = await db
    .collection('forms')
    .findOneAndUpdate(
      { _id: objectId },
      { $set: updateFields },
      { returnDocument: 'after', projection: { _id: 0, id: '$_id' } }
    )

  if (!result.value) {
    throw Boom.notFound(`Form with ID ${formId} not found`)
  }

  return result.value
}

export { updateForm }
