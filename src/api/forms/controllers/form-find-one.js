import Joi from 'joi'
import { findFormById } from '../helpers/index.js'
import { statusCodes } from '~/src/api/common/constants/status-codes.js'

/**
 * Controller for finding a form by ID
 * @satisfies {Partial<import('@hapi/hapi').ServerRoute>}
 */
const formFindOneController = {
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
            description: 'Form retrieved successfully'
          },
          404: {
            description: 'Form not found'
          }
        }
      }
    }
  },
  handler: async (request, h) => {
    const { formId } = request.params
    const form = await findFormById(request.db, formId)

    return h
      .response({ message: 'Form retrieved successfully', form })
      .code(statusCodes.ok)
  }
}

export { formFindOneController }
