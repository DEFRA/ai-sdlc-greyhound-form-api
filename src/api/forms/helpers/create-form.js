import { createDefaultFormSchema } from '../schemas/index.js'
import { generateReferenceNumber } from '../../../utils/index.js'

/**
 * Creates a new form in the database
 * @param {import('mongodb').Db} db - MongoDB database instance
 * @param {object} formData - Initial form data
 * @param {string} formData.formName - The name of the form
 * @returns {Promise<object>} - The created form
 */
async function createForm(db, formData) {
  const newForm = {
    ...createDefaultFormSchema(),
    ...formData,
    referenceNumber: generateReferenceNumber(),
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await db.collection('forms').insertOne(newForm)

  return {
    ...newForm,
    id: result.insertedId.toString()
  }
}

export { createForm }
