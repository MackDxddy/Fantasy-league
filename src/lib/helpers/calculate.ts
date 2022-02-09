/**
 *
 * ******************** HELPER FUNCTION ********************
 */

const roundToTwo = (num: number): number => {
  return Number(Math.round(Number(num + 'e+3')) + 'e-3')
}

/**
 * *************** PLAYER POINTS CALCULATION ***************
 */

// Calculates kill points
/**
 *
 * @param kills
 * @returns
 */
const calcKillPts = async (kills: number): Promise<number> => {
  return roundToTwo(kills * 3)
}

// Calculates assist points
/**
 *
 * @param assists
 * @returns
 */
const calcAssistPts = async (assists: number): Promise<number> => {
  return roundToTwo(assists * 2)
}

// Calculates death points
/**
 *
 * @param deaths
 * @returns
 */
const calcDeathPts = async (deaths: number): Promise<number> => {
  return roundToTwo(deaths * 0.5)
}

// Calculates creepscore points
/**
 *
 * @param creepScore
 * @returns
 */
const calcCreepScorePts = async (creepScore: number): Promise<number> => {
  return roundToTwo(creepScore * 0.02)
}

// Calculates kill-assist bonus
/**
 *
 * @param kills
 * @param assists
 * @param deaths
 * @returns
 */
const calcKillAssistBns = async (
  kills: number,
  assists: number,
  deaths: number
): Promise<number> => {
  if (roundToTwo((kills + assists) / deaths) >= 10) {
    return 2
  } else return 0
}

// Calculates participation points
/**
 *
 * @param kills
 * @param assists
 * @param teamTotalKills
 * @returns
 */
const calcParticipationPts = async (
  kills: number,
  assists: number,
  teamTotalKills: number
): Promise<number> => {
  // return ((kills + assists) / Math.max(1, teamTotalKills)) * 100 * 0.25;
  if (roundToTwo(((kills + assists) / teamTotalKills) * 100 * 0.25) <= 25) {
    return roundToTwo(((kills + assists) / teamTotalKills) * 100 * 0.25)
  } else return 0
}

const calcFlawleess = async (deaths: number, playerScore: number): Promise<number> => {
  if (deaths === 0) {
    return (playerScore *= 1.2)
  } else return playerScore
}

// Calculates player score
/**
 *
 * @param killPoints
 * @param assistPoints
 * @param creepScorePoints
 * @param killAssistBonus
 * @param participationPoints
 * @param deathsPoints
 * @returns
 */
const addPlayerScore = async (
  killPoints: number,
  assistPoints: number,
  creepScorePoints: number,
  killAssistBonus: number,
  participationPoints: number,
  deathsPoints: number
): Promise<number> => {
  return (
    killPoints +
    assistPoints +
    creepScorePoints +
    killAssistBonus +
    participationPoints -
    deathsPoints
  )
}

// TODO: Implement 0.35x wardPlaced points,
// and 5x firstBloodKill killPoints
// Could not implement above TODO because data was not available
// in API
/**
 *
 * @param playerName
 * @param kills
 * @param assists
 * @param deaths
 * @param creepScore
 * @param teamTotalKills
 * @returns
 */
export async function calculatePlayerScore(
  playerName: string,
  kills: number,
  assists: number,
  deaths: number,
  creepScore: number,
  teamTotalKills: number
): Promise<number> {
  let killPoints = await calcKillPts(kills)
  let assistPoints = await calcAssistPts(assists)
  let deathsPoints = await calcDeathPts(deaths)
  let creepScorePoints = await calcCreepScorePts(creepScore)
  let killAssistBonus = await calcKillAssistBns(kills, assists, deaths)
  let participationPoints = await calcParticipationPts(kills, assists, teamTotalKills)
  let playerScore = await addPlayerScore(
    killPoints,
    assistPoints,
    creepScorePoints,
    killAssistBonus,
    participationPoints,
    deathsPoints
  )

  playerScore = await calcFlawleess(deaths, playerScore)

  // if (deaths === 0) {
  //   playerScore *= 1.2
  // }

  return roundToTwo(playerScore)
}

/**
 * *************** TEAM POINTS CALCULATION ***************
 */

/**
 *
 * @param calcDragonKills
 * @returns
 */
// Calculates dragonKill points
const calcDragonKills = async (dragonKills: number): Promise<number> => {
  return dragonKills * 2
}

/**
 *
 * @param riftHeraldKills
 * @returns
 */
// Calculates riftHeraldKill points
const calcRiftHeraldKills = async (riftHeraldKills: number): Promise<number> => {
  return riftHeraldKills * 4
}

/**
 *
 * @param turretKills
 * @returns
 */
// Calculates turretKills points
const calcTurretKills = async (turretKills: number): Promise<number> => {
  return turretKills * 2
}

/**
 *
 * @param inhibitorKills
 * @returns
 */
// Calculates inhibitorKills points
const calcInhibitorKills = async (inhibitorKills: number): Promise<number> => {
  return inhibitorKills * 4
}

/**
 *
 * @param baronKills
 * @returns
 */
// Calculates baronKills points
const calcBaronKills = async (baronKills: number): Promise<number> => {
  return baronKills * 10
}

/**
 *
 * @param dragonKills
 * @param riftHeraldKills
 * @param turretKills
 * @param inhibitorKills
 * @param baronKills
 * @param didWin
 * @returns
 */
// Calculates team points
export const calculateTeamScore = async (
  teamKills: number,
  dragonKills: number,
  riftHeraldKills: number,
  turretKills: number,
  inhibitorKills: number,
  baronKills: number,
  didWin: boolean
): Promise<number> => {
  let dragonKillPts = await calcDragonKills(dragonKills)
  let riftHeraldKillPts = await calcRiftHeraldKills(riftHeraldKills)
  let turretKillPts = await calcTurretKills(turretKills)
  let inhibitorKillPts = await calcInhibitorKills(inhibitorKills)
  let baronKillPts = await calcBaronKills(baronKills)

  let teamPts: number =
    teamKills + dragonKillPts + riftHeraldKillPts + turretKillPts + inhibitorKillPts + baronKillPts

  if (didWin) {
    teamPts += 15
  } else {
    teamPts -= 15
  }

  return teamPts
}
