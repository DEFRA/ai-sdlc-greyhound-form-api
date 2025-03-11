import {
  formCreateController,
  formFindAllController,
  formFindOneController,
  formUpdateController,
  formSubmitController
} from './controllers/index.js'

/**
 * Forms plugin for handling greyhound racetrack welfare licence application forms
 * @satisfies {import('@hapi/hapi').ServerRegisterPluginObject<void>}
 */
const forms = {
  plugin: {
    name: 'forms',
    register: (server) => {
      server.route([
        {
          method: 'POST',
          path: '/api/forms',
          options: {
            description: 'Create a new form',
            notes:
              'Creates a new greyhound racetrack welfare licence application form',
            tags: ['api', 'forms']
          },
          ...formCreateController
        },
        {
          method: 'GET',
          path: '/api/forms',
          options: {
            description: 'Get all forms',
            notes:
              'Returns a list of all greyhound racetrack welfare licence application forms',
            tags: ['api', 'forms']
          },
          ...formFindAllController
        },
        {
          method: 'GET',
          path: '/api/forms/{formId}',
          options: {
            description: 'Get form by ID',
            notes:
              'Returns a single greyhound racetrack welfare licence application form by ID',
            tags: ['api', 'forms']
          },
          ...formFindOneController
        },
        {
          method: 'PUT',
          path: '/api/forms/{formId}',
          options: {
            description: 'Update form by ID',
            notes:
              'Updates a greyhound racetrack welfare licence application form by ID',
            tags: ['api', 'forms']
          },
          ...formUpdateController
        },
        {
          method: 'POST',
          path: '/api/forms/{formId}/submit',
          options: {
            description: 'Submit form by ID',
            notes:
              'Submits a greyhound racetrack welfare licence application form by ID',
            tags: ['api', 'forms']
          },
          ...formSubmitController
        }
      ])
    }
  }
}

export { forms }
