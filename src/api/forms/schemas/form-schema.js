/**
 * MongoDB schema definition for the form data.
 * This is used to define the structure of the form data in the database.
 */

/**
 * Form schema definition based on the PRD requirements.
 * @typedef {object} FormSchema
 * @property {string} formName - The name of the form instance
 * @property {string} status - The status of the form (in-progress or submitted)
 * @property {Date} createdAt - The date the form was created
 * @property {Date} updatedAt - The date the form was last updated
 * @property {object} pages - The form pages containing all form data
 * @property {object} pages.applicantDetails - Applicant details section
 * @property {string} [pages.applicantDetails.racetrackName] - Name of the racetrack
 * @property {string} [pages.applicantDetails.applicantName] - Name of the applicant
 * @property {string} [pages.applicantDetails.applicantAddress] - Address of the applicant
 * @property {string} [pages.applicantDetails.applicantPostcode] - Postcode of the applicant
 * @property {string} [pages.applicantDetails.racetrackAddress] - Address of the racetrack
 * @property {string} [pages.applicantDetails.racetrackPostcode] - Postcode of the racetrack
 * @property {string} [pages.applicantDetails.telephone] - Telephone number
 * @property {string} [pages.applicantDetails.email] - Email address
 * @property {boolean} [pages.applicantDetails.disqualified] - Whether the applicant is disqualified
 * @property {string} [pages.applicantDetails.disqualificationDetails] - Details of disqualification
 * @property {Date} [pages.applicantDetails.applicationDate] - Date of application
 * @property {object} pages.licensingConditions - Licensing conditions section
 * @property {object} pages.licensingConditions.condition1 - Condition 1: Veterinary surgeon agreement
 * @property {boolean} [pages.licensingConditions.condition1.hasVetAgreement] - Whether there is a vet agreement
 * @property {Date} [pages.licensingConditions.condition1.anticipatedAgreementDate] - Anticipated date for vet agreement
 * @property {string} [pages.licensingConditions.condition1.vetContact] - Vet contact details
 * @property {boolean} [pages.licensingConditions.condition1.hasVetRegister] - Whether there is a vet register
 * @property {Date} [pages.licensingConditions.condition1.anticipatedRegisterDate] - Anticipated date for vet register
 * @property {object} pages.licensingConditions.condition2 - Condition 2: Facilities for the attending veterinary surgeon
 * @property {boolean} [pages.licensingConditions.condition2.facilitiesReady] - Whether facilities are ready
 * @property {Date} [pages.licensingConditions.condition2.anticipatedFacilitiesDate] - Anticipated date for facilities
 * @property {object} pages.licensingConditions.condition3 - Condition 3: Kennel availability
 * @property {boolean} [pages.licensingConditions.condition3.kennelsReady] - Whether kennels are ready
 * @property {Date} [pages.licensingConditions.condition3.anticipatedKennelsDate] - Anticipated date for kennels
 * @property {object} pages.licensingConditions.condition4 - Condition 4: Greyhound identification
 * @property {boolean} [pages.licensingConditions.condition4.greyhoundIdentified] - Whether greyhounds are identified
 * @property {Date} [pages.licensingConditions.condition4.anticipatedIdentificationDate] - Anticipated date for identification
 * @property {object} pages.licensingConditions.condition5 - Condition 5: Record keeping
 * @property {boolean} [pages.licensingConditions.condition5.recordsKept] - Whether records are kept
 * @property {Date} [pages.licensingConditions.condition5.anticipatedRecordsDate] - Anticipated date for records
 * @property {object} pages.licensingConditions.condition6 - Condition 6: Injury records
 * @property {boolean} [pages.licensingConditions.condition6.injuryRecordsKept] - Whether injury records are kept
 * @property {Date} [pages.licensingConditions.condition6.anticipatedInjuryRecordsDate] - Anticipated date for injury records
 */

/**
 * Default form schema with initial values
 * @returns {FormSchema}
 */
function createDefaultFormSchema() {
  return {
    formName: '',
    status: 'in-progress',
    createdAt: new Date(),
    updatedAt: new Date(),
    pages: {
      applicantDetails: {
        racetrackName: '',
        applicantName: '',
        applicantAddress: '',
        applicantPostcode: '',
        racetrackAddress: '',
        racetrackPostcode: '',
        telephone: '',
        email: '',
        disqualified: false,
        disqualificationDetails: '',
        applicationDate: null
      },
      licensingConditions: {
        condition1: {
          hasVetAgreement: false,
          anticipatedAgreementDate: null,
          vetContact: '',
          hasVetRegister: false,
          anticipatedRegisterDate: null
        },
        condition2: {
          facilitiesReady: false,
          anticipatedFacilitiesDate: null
        },
        condition3: {
          kennelsReady: false,
          anticipatedKennelsDate: null
        },
        condition4: {
          greyhoundIdentified: false,
          anticipatedIdentificationDate: null
        },
        condition5: {
          recordsKept: false,
          anticipatedRecordsDate: null
        },
        condition6: {
          injuryRecordsKept: false,
          anticipatedInjuryRecordsDate: null
        }
      }
    }
  }
}

export { createDefaultFormSchema }
