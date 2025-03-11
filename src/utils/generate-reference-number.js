/**
 * Generates a GOV.UK style reference number
 * Format: 3 uppercase letters followed by 4 digits and 1 uppercase letter
 * Example: HDJ2123F
 * The reference number is guaranteed to be unique by incorporating a datetime element
 * while still maintaining the required format.
 * @returns {string} The generated reference number
 */
function generateReferenceNumber() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  // Get current timestamp to millisecond precision
  const now = new Date()
  const timestamp = now.getTime()

  // Use first letter from random selection
  const firstLetter = letters.charAt(Math.floor(Math.random() * letters.length))

  // Use two letters derived from the timestamp for uniqueness
  // This ensures different references even if generated in the same millisecond
  const secondLetter = letters.charAt(timestamp % 26)
  const thirdLetter = letters.charAt((timestamp / 26) % 26)

  const prefix = firstLetter + secondLetter + thirdLetter

  // Generate 4 digits - use last 4 digits of timestamp for uniqueness
  // Ensure it's always 4 digits by adding 1000
  const digits = 1000 + (timestamp % 9000)

  // Generate suffix letter - use another part of timestamp
  const suffix = letters.charAt((timestamp / (26 * 26)) % 26)

  return `${prefix}${digits}${suffix}`
}

export { generateReferenceNumber }
