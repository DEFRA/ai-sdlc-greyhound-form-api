# Forms API

This module provides the API endpoints for managing greyhound racetrack welfare licence application forms.

## Endpoints

- `POST /api/forms` - Create a new form
- `GET /api/forms` - Get all forms (with optional status filter)
- `GET /api/forms/{formId}` - Get a specific form by ID
- `PUT /api/forms/{formId}` - Update a form
- `POST /api/forms/{formId}/submit` - Submit a form

## Form Structure

The form follows the structure defined in the PRD, with the following main sections:

- Applicant Details
- Licensing Conditions (6 conditions)

Each form has a status of either "in-progress" or "submitted".
