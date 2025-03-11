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
            description: 'Form retrieved successfully',
            schema: Joi.object({
              message: Joi.string().example('Form retrieved successfully'),
              form: Joi.object().ref('definitions.Form')
            })
          },
          404: {
            description: 'Form not found',
            schema: Joi.object({
              statusCode: Joi.number().example(404),
              error: Joi.string().example('Not Found'),
              message: Joi.string().example('Form not found')
            })
          }
        },
        validate: {
          params: {
            formId: Joi.string().required().example('65f9a2b3c4d5e6f7a8b9c0d1')
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
