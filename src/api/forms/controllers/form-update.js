import Joi from 'joi'
import { updateForm } from '../helpers/index.js'
import { statusCodes } from '~/src/api/common/constants/status-codes.js'

/**
 * Controller for updating a form
 * @satisfies {Partial<import('@hapi/hapi').ServerRoute>}
 */
const formUpdateController = {
  options: {
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
              racetrackName: Joi.string().optional(),
              applicantName: Joi.string().optional(),
              applicantAddress: Joi.string().optional(),
              applicantPostcode: Joi.string().optional(),
              racetrackAddress: Joi.string().optional(),
              racetrackPostcode: Joi.string().optional(),
              telephone: Joi.string().optional(),
              email: Joi.string().email().optional(),
              disqualified: Joi.boolean().optional(),
              disqualificationDetails: Joi.string().optional(),
              applicationDate: Joi.date().optional().allow(null)
            }),
            otherwise: Joi.object({
              condition1: Joi.object({
                hasVetAgreement: Joi.boolean().optional(),
                anticipatedAgreementDate: Joi.date().optional().allow(null),
                vetContact: Joi.string().optional(),
                hasVetRegister: Joi.boolean().optional(),
                anticipatedRegisterDate: Joi.date().optional().allow(null)
              }).optional(),
              condition2: Joi.object({
                facilitiesReady: Joi.boolean().optional(),
                anticipatedFacilitiesDate: Joi.date().optional().allow(null)
              }).optional(),
              condition3: Joi.object({
                kennelsReady: Joi.boolean().optional(),
                anticipatedKennelsDate: Joi.date().optional().allow(null)
              }).optional(),
              condition4: Joi.object({
                greyhoundIdentified: Joi.boolean().optional(),
                anticipatedIdentificationDate: Joi.date().optional().allow(null)
              }).optional(),
              condition5: Joi.object({
                recordsKept: Joi.boolean().optional(),
                anticipatedRecordsDate: Joi.date().optional().allow(null)
              }).optional(),
              condition6: Joi.object({
                injuryRecordsKept: Joi.boolean().optional(),
                anticipatedInjuryRecordsDate: Joi.date().optional().allow(null)
              }).optional()
            })
          })
          .optional()
      }).or('formName', 'page')
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
