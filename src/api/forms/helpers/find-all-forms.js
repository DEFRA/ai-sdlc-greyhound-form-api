/**
 * Retrieves all forms from the database
 * @param {import('mongodb').Db} db - MongoDB database instance
 * @param {object} [options] - Query options
 * @param {string} [options.status] - Filter by form status (in-progress, submitted)
 * @returns {Promise<Array<object>>} - Array of forms
 */
async function findAllForms(db, options = {}) {
  const query = {}

  if (options.status) {
    query.status = options.status
  }

  const cursor = db
    .collection('forms')
    .find(query, { projection: { _id: 0, id: '$_id' } })
    .sort({ updatedAt: -1 }) // Sort by most recently updated

  return cursor.toArray()
}

export { findAllForms }
