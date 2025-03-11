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
            description: 'Form created successfully',
            schema: Joi.object({
              message: Joi.string().example('Form created successfully'),
              form: Joi.object().ref('definitions.Form')
            })
          },
          400: {
            description: 'Invalid request payload',
            schema: Joi.object({
              statusCode: Joi.number().example(400),
              error: Joi.string().example('Bad Request'),
              message: Joi.string().example('Invalid request payload')
            })
          }
        },
        payloadType: 'form',
        validate: {
          payload: {
            formName: Joi.string()
              .required()
              .min(1)
              .max(100)
              .example('Greyhound Track License Application - Track A')
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
