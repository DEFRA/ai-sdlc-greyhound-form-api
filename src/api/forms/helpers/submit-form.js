import { ObjectId } from 'mongodb'
import Boom from '@hapi/boom'
import { findFormById } from './find-form-by-id.js'

/**
 * Validates that all required fields are present in the form
 * @param {object} form - The form to validate
 * @throws {Boom.badRequest} - If any required fields are missing
 */
function validateRequiredFields(form) {
  const requiredFields = [
    'applicantName',
    'applicantAddress',
    'applicantPostcode',
    'racetrackAddress',
    'racetrackPostcode',
    'telephone',
    'email'
  ]

  const missingFields = requiredFields.filter(
    (field) => !form.pages.applicantDetails[field]
  )

  if (
    form.pages.applicantDetails.disqualified &&
    !form.pages.applicantDetails.disqualificationDetails
  ) {
    missingFields.push('disqualificationDetails')
  }

  if (missingFields.length > 0) {
    throw Boom.badRequest(
      `The following fields are required: ${missingFields.join(', ')}`
    )
  }
}

/**
 * Submits a form in the database (changes status to 'submitted')
 * @param {import('mongodb').Db} db - MongoDB database instance
 * @param {string} formId - The ID of the form to submit
 * @returns {Promise<object>} - The submitted form
 * @throws {Boom.notFound} - If the form is not found
 * @throws {Boom.badRequest} - If the form is already submitted or missing required fields
 */
async function submitForm(db, formId) {
  // First check if the form exists
  const form = await findFormById(db, formId)

  if (form.status === 'submitted') {
    throw Boom.badRequest(`Form with ID ${formId} is already submitted`)
  }

  // Validate required fields before submission
  validateRequiredFields(form)

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
