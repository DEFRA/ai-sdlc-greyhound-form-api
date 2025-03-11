import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import HapiSwagger from 'hapi-swagger'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get version from package.json without using import
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJsonPath = path.resolve(__dirname, '../../../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const { version } = packageJson

/**
 * Swagger documentation plugin
 * @satisfies { import('@hapi/hapi').ServerRegisterPluginObject<*> }
 */
const docs = {
  plugin: {
    name: 'docs',
    register: async (server) => {
      const swaggerOptions = {
        info: {
          title: 'Greyhound Form API Documentation',
          version,
          description:
            'API for managing greyhound racetrack welfare licence application forms'
        },
        documentationPath: '/docs',
        jsonPath: '/swagger.json',
        grouping: 'tags',
        sortTags: 'alpha',
        definitionPrefix: 'definitions',
        definitions: {
          Form: {
            type: 'object',
            properties: {
              _id: { type: 'string', description: 'Unique form identifier' },
              formName: { type: 'string', description: 'Name of the form' },
              status: {
                type: 'string',
                enum: ['in-progress', 'submitted'],
                description: 'Current status of the form'
              },
              data: {
                type: 'object',
                properties: {
                  licensingConditions: {
                    type: 'object',
                    properties: {
                      condition1: {
                        type: 'object',
                        description:
                          'Veterinary agreement and registration details',
                        properties: {
                          hasVetAgreement: {
                            type: 'boolean',
                            description:
                              'Whether there is a veterinary agreement in place'
                          },
                          anticipatedAgreementDate: {
                            type: 'string',
                            format: 'date',
                            description:
                              'Expected date for veterinary agreement'
                          },
                          vetContact: {
                            type: 'string',
                            description: 'Contact details for the veterinarian'
                          },
                          hasVetRegister: {
                            type: 'boolean',
                            description:
                              'Whether a veterinary register is maintained'
                          },
                          anticipatedRegisterDate: {
                            type: 'string',
                            format: 'date',
                            description:
                              'Expected date for veterinary register setup'
                          }
                        }
                      },
                      condition2: {
                        type: 'object',
                        description: 'Facilities readiness',
                        properties: {
                          facilitiesReady: {
                            type: 'boolean',
                            description: 'Whether facilities meet requirements'
                          },
                          anticipatedFacilitiesDate: {
                            type: 'string',
                            format: 'date',
                            description:
                              'Expected date for facilities completion'
                          }
                        }
                      },
                      condition3: {
                        type: 'object',
                        description: 'Kennels readiness',
                        properties: {
                          kennelsReady: {
                            type: 'boolean',
                            description: 'Whether kennels meet requirements'
                          },
                          anticipatedKennelsDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Expected date for kennels completion'
                          }
                        }
                      },
                      condition4: {
                        type: 'object',
                        description: 'Greyhound identification',
                        properties: {
                          greyhoundIdentified: {
                            type: 'boolean',
                            description:
                              'Whether greyhound identification is in place'
                          },
                          anticipatedIdentificationDate: {
                            type: 'string',
                            format: 'date',
                            description:
                              'Expected date for identification system'
                          }
                        }
                      },
                      condition5: {
                        type: 'object',
                        description: 'Record keeping',
                        properties: {
                          recordsKept: {
                            type: 'boolean',
                            description:
                              'Whether required records are maintained'
                          },
                          anticipatedRecordsDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Expected date for record system setup'
                          }
                        }
                      },
                      condition6: {
                        type: 'object',
                        description: 'Injury records',
                        properties: {
                          injuryRecordsKept: {
                            type: 'boolean',
                            description: 'Whether injury records are maintained'
                          },
                          anticipatedInjuryRecordsDate: {
                            type: 'string',
                            format: 'date',
                            description:
                              'Expected date for injury record system'
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            'x-examples': {
              'Complete Form': {
                _id: '65f9a2b3c4d5e6f7a8b9c0d1',
                formName: 'Greyhound Track License Application - Track A',
                status: 'in-progress',
                data: {
                  licensingConditions: {
                    condition1: {
                      hasVetAgreement: true,
                      anticipatedAgreementDate: '2024-03-20',
                      vetContact: 'Dr. Smith',
                      hasVetRegister: false,
                      anticipatedRegisterDate: '2024-04-01'
                    },
                    condition2: {
                      facilitiesReady: false,
                      anticipatedFacilitiesDate: '2024-05-01'
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          400: {
            description: 'Bad Request',
            schema: {
              type: 'object',
              properties: {
                statusCode: { type: 'number', example: 400 },
                error: { type: 'string', example: 'Bad Request' },
                message: { type: 'string', example: 'Invalid request payload' }
              }
            }
          },
          404: {
            description: 'Not Found',
            schema: {
              type: 'object',
              properties: {
                statusCode: { type: 'number', example: 404 },
                error: { type: 'string', example: 'Not Found' },
                message: { type: 'string', example: 'Form not found' }
              }
            }
          }
        }
      }

      await server.register([
        Inert,
        Vision,
        {
          plugin: HapiSwagger,
          options: swaggerOptions
        }
      ])
    }
  }
}

export { docs }
