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
            description: 'Form submitted successfully',
            schema: Joi.object({
              message: Joi.string().example('Form submitted successfully'),
              form: Joi.object().ref('definitions.Form')
            })
          },
          400: {
            description: 'Form cannot be submitted',
            schema: Joi.object({
              statusCode: Joi.number().example(400),
              error: Joi.string().example('Bad Request'),
              message: Joi.string().example(
                'Form cannot be submitted - required fields are missing'
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
    const form = await submitForm(request.db, formId)

    return h
      .response({ message: 'Form submitted successfully', form })
      .code(statusCodes.ok)
  }
}

export { formSubmitController }
