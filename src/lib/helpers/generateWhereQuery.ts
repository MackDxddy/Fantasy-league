export const generateWhereQuery = (arr: string[], table: string): string => {
  // "MatchSchedule.DateTime_UTC >= '2022-01-01 00:00:00' AND (MatchSchedule.OverviewPage LIKE '%LCS%' OR MatchSchedule.OverviewPage LIKE '%LEC%' OR MatchSchedule.OverviewPage LIKE '%LCK%' OR MatchSchedule.OverviewPage LIKE '%LPL%') AND NOT MatchSchedule.OverviewPage LIKE '%Lock In%' AND NOT MatchSchedule.OverviewPage LIKE '%Proving Grounds%'"
	// const prepend: string = "MatchSchedule.DateTime_UTC >= '2022-01-01 00:00:00'",



  // let otherString = arr.reduce((pv, cv) => {
  //   return `AND LIKE `
  // })

  return ''
}
