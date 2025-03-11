/**
 * Script to run database migrations
 * Usage:
 *   node src/migrations/run.js
 *   node src/migrations/run.js rollback
 */

import { runMigrations, rollbackLastMigration } from './index.js'
import { logger } from '../utils/logger.js'

async function main() {
  const args = process.argv.slice(2)
  const isRollback = args.includes('rollback')

  try {
    if (isRollback) {
      await rollbackLastMigration()
    } else {
      await runMigrations()
    }
    return 0
  } catch (error) {
    logger.error('Migration failed:', error)
    return 1
  }
}

// Handle the promise and process exit
main()
  .then((code) => {
    process.exitCode = code
    return code
  })
  .catch((error) => {
    logger.error('Unexpected error:', error)
    process.exitCode = 1
    return 1
  })
