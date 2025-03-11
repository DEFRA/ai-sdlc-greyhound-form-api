import Joi from 'joi'
import { findAllForms } from '../helpers/index.js'
import { statusCodes } from '~/src/api/common/constants/status-codes.js'

/**
 * Controller for finding all forms
 * @satisfies {Partial<import('@hapi/hapi').ServerRoute>}
 */
const formFindAllController = {
  options: {
    validate: {
      query: Joi.object({
        status: Joi.string().valid('in-progress', 'submitted').optional()
      })
    }
  },
  handler: async (request, h) => {
    const options = {}

    if (request.query.status) {
      options.status = request.query.status
    }

    const forms = await findAllForms(request.db, options)

    return h
      .response({ message: 'Forms retrieved successfully', forms })
      .code(statusCodes.ok)
  }
}

export { formFindAllController }
