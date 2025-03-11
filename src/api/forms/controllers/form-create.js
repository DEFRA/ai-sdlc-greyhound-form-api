import Joi from 'joi'
import { createForm } from '../helpers/index.js'
import { statusCodes } from '~/src/api/common/constants/status-codes.js'

/**
 * Controller for creating a new form
 * @satisfies {Partial<import('@hapi/hapi').ServerRoute>}
 */
const formCreateController = {
  options: {
    tags: ['api', 'forms'],
    validate: {
      payload: Joi.object({
        formName: Joi.string().required().min(1).max(100)
      })
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          201: {
            description: 'Form created successfully'
          },
          400: {
            description: 'Invalid request payload'
          }
        }
      }
    }
  },
  handler: async (request, h) => {
    const formData = request.payload
    const form = await createForm(request.db, formData)

    return h
      .response({ message: 'Form created successfully', form })
      .code(statusCodes.created)
  }
}

export { formCreateController }
