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
          ...formCreateController
        },
        {
          method: 'GET',
          path: '/api/forms',
          ...formFindAllController
        },
        {
          method: 'GET',
          path: '/api/forms/{formId}',
          ...formFindOneController
        },
        {
          method: 'PUT',
          path: '/api/forms/{formId}',
          ...formUpdateController
        },
        {
          method: 'POST',
          path: '/api/forms/{formId}/submit',
          ...formSubmitController
        }
      ])
    }
  }
}

export { forms }
