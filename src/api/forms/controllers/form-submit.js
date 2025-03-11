import Joi from 'joi'
import { submitForm } from '../helpers/index.js'
import { statusCodes } from '~/src/api/common/constants/status-codes.js'

/**
 * Controller for submitting a form
 * @satisfies {Partial<import('@hapi/hapi').ServerRoute>}
 */
const formSubmitController = {
  options: {
    validate: {
      params: Joi.object({
        formId: Joi.string().required()
      })
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
