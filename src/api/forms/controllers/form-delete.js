import Joi from 'joi'
import { deleteForm } from '../helpers/index.js'
import { statusCodes } from '~/src/api/common/constants/status-codes.js'

/**
 * Controller for deleting a form
 * @satisfies {Partial<import('@hapi/hapi').ServerRoute>}
 */
const formDeleteController = {
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
          204: {
            description: 'Form deleted successfully'
          },
          400: {
            description: 'Form cannot be deleted',
            schema: Joi.object({
              statusCode: Joi.number().example(400),
              error: Joi.string().example('Bad Request'),
              message: Joi.string().example(
                'Form cannot be deleted as it has already been submitted'
              )
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
    await deleteForm(request.db, formId)
    return h.response().code(statusCodes.noContent)
  }
}

export { formDeleteController }
