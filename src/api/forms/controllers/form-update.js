import Joi from 'joi'
import { updateForm } from '../helpers/index.js'
import { statusCodes } from '~/src/api/common/constants/status-codes.js'

/**
 * Controller for updating a form
 * @satisfies {Partial<import('@hapi/hapi').ServerRoute>}
 */
const formUpdateController = {
  options: {
    tags: ['api', 'forms'],
    validate: {
      params: Joi.object({
        formId: Joi.string().required()
      }),
      payload: Joi.object({
        formName: Joi.string().min(1).max(100),
        page: Joi.string().valid('applicantDetails', 'licensingConditions'),
        data: Joi.object()
          .when('page', {
            is: 'applicantDetails',
            then: Joi.object({
              racetrackName: Joi.string().allow(''),
              applicantName: Joi.string().allow(''),
              applicantAddress: Joi.string().allow(''),
              applicantPostcode: Joi.string().allow(''),
              racetrackAddress: Joi.string().allow(''),
              racetrackPostcode: Joi.string().allow(''),
              telephone: Joi.string().allow(''),
              email: Joi.string().email().allow(''),
              disqualified: Joi.boolean(),
              disqualificationDetails: Joi.string().allow(''),
              applicationDate: Joi.date().allow(null)
            }),
            otherwise: Joi.object({
              condition1: Joi.object({
                hasVetAgreement: Joi.boolean(),
                anticipatedAgreementDate: Joi.date().allow(null),
                vetContact: Joi.string().allow(''),
                hasVetRegister: Joi.boolean(),
                anticipatedRegisterDate: Joi.date().allow(null)
              }),
              condition2: Joi.object({
                facilitiesReady: Joi.boolean(),
                anticipatedFacilitiesDate: Joi.date().allow(null)
              }),
              condition3: Joi.object({
                kennelsReady: Joi.boolean(),
                anticipatedKennelsDate: Joi.date().allow(null)
              }),
              condition4: Joi.object({
                greyhoundIdentified: Joi.boolean(),
                anticipatedIdentificationDate: Joi.date().allow(null)
              }),
              condition5: Joi.object({
                recordsKept: Joi.boolean(),
                anticipatedRecordsDate: Joi.date().allow(null)
              }),
              condition6: Joi.object({
                injuryRecordsKept: Joi.boolean(),
                anticipatedInjuryRecordsDate: Joi.date().allow(null)
              })
            })
          })
          .optional()
      }).or('formName', 'page')
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Form updated successfully'
          },
          404: {
            description: 'Form not found'
          },
          400: {
            description: 'Invalid request payload'
          }
        }
      }
    }
  },
  handler: async (request, h) => {
    const { formId } = request.params
    const updateData = request.payload

    const form = await updateForm(request.db, formId, updateData)

    return h
      .response({ message: 'Form updated successfully', form })
      .code(statusCodes.ok)
  }
}

export { formUpdateController }
