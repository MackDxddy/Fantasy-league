// Prepends zero to date if single digit
/**
 * 
 * @param num 
 * @returns 
 */
const addZero = (num: number): string => `${num}`.padStart(2, '0')

// Formats date to MM-DD-YYYY
/**
 *
 * @param date
 * @returns
 */
export const formatDate = (date: string): string => {
  const matchDate = new Date(date)
  const matchMDY = `${addZero(matchDate.getMonth() + 1)}-${addZero(matchDate.getDate())}-${addZero(
    matchDate.getFullYear()
  )}`
  return matchMDY
}
