import Joi from 'joi'
import { submitForm } from '../helpers/index.js'
import { statusCodes } from '~/src/api/common/constants/status-codes.js'

/**
 * Controller for submitting a form
 * @satisfies {Partial<import('@hapi/hapi').ServerRoute>}
 */
const formSubmitController = {
  options: {
    tags: ['api', 'forms'],
    validate: {
      params: Joi.object({
        formId: Joi.string().required()
      })
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Form submitted successfully'
          },
          404: {
            description: 'Form not found'
          },
          400: {
            description: 'Form cannot be submitted'
          }
        }
      }
    }
  },
  handler: async (request, h) => {
    const { formId } = request.params
    const form = await submitForm(request.db, formId)

    return h
      .response({ message: 'Form submitted successfully', form })
      .code(statusCodes.ok)
  }
}

export { formSubmitController }
