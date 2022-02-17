import { TeamPlayer } from '../../../interfaces/TeamPlayer'
import { MatchesArr } from '../../../interfaces/MatchesArray'
import prisma from '../PrismaHelpers/prisma'
import { DateItem } from '../../../interfaces/DateItem'

async function createEsportsTeamMatchStats(
  matchID: number,
  teamID: number,
  teamName: string,
  teamKills: number,
  dragonKills: number,
  riftHeralds: number,
  turretKills: number,
  baronKills: number,
  inhibitorKills: number,
  didWin: number,
  totalTeamPoints: number
) {
  await prisma.esports_team_match_stats.create({
    data: {
      matchID: matchID,
      teamID: teamID,
      teamName: teamName,
      teamKills: teamKills,
      dragonKills: dragonKills,
      riftHeralds: riftHeralds,
      turretKills: turretKills,
      baronKills: baronKills,
      inhibitorKills: inhibitorKills,
      didWin: didWin,
      totalPoints: totalTeamPoints
    }
  })
}

async function createEsportsPlayerMatchStats(
  matchID: number, // PlayerStats
  playerID: number,
  playerName: string,
  teamName: string,
  role: string,
  legend: string,
  kills: number,
  assists: number,
  deaths: number,
  creepScore: number,
  totalPlayerPoints: number
) {
  await prisma.esports_player_match_stats.create({
    data: {
      matchID: matchID,
      playerID: playerID,
      name: playerName,
      teamName: teamName,
      role: role,
      legend: legend,
      kills: kills,
      assists: assists,
      deaths: deaths,
      creepScore: creepScore,
      playerScore: totalPlayerPoints
    }
  })
}

async function createEsportsMatch(
  dateItemID: number,
  matchDate: string,
  matchUTCDate: number,
  matchDay: string,
  matchWeek: string,
  teamA: string,
  teamB: string,
  matchLength: string,
  teamAWin: number,
  teamBWin: number
) {
  await prisma.esports_match.create({
    data: {
      dateItemID: dateItemID,
      matchDate: matchDate,
      matchUTCDate: matchUTCDate,
      matchDay: matchDay,
      matchWeek: matchWeek,
      teamA: teamA,
      teamB: teamB,
      matchLength: matchLength,
      teamAWin: teamAWin,
      teamBWin: teamBWin
    }
  })
}

async function createEsportsTeam(teamName: string) {
  await prisma.esports_teams
    .create({
      data: {
        teamName: teamName
      }
    })
    .then(() => {
      return
    })
}

async function createEsportsUser(teamID: number, playerName: string) {
  await prisma.esports_player.create({
    data: {
      teamID: teamID,
      name: playerName
    }
  })
}

export async function createDateItem(
  matchDate: string,
  gamesPlayed: number,
  teamsParticipated: number,
  organization: string,
  updated: number
) {
  await prisma.esports_date_items.create({
    data: {
      matchDate: matchDate,
      gamesPlayed: gamesPlayed,
      teamsParticipated: teamsParticipated,
      organization: organization,
      updated: updated
    }
  })
}

export async function checkDateItem(dateItems: DateItem[]) {
  return new Promise<void>((resolve, reject) => {
    let count = 0
    let loop = new Promise<void>((resolve, reject) => {
      dateItems.forEach(async (cv, idx, arr) => {
        try {
          await prisma.esports_date_items
            .findUnique({
              where: {
                matchDate_organization: {
                  matchDate: cv.date,
                  organization: cv.organization
                }
              }
            })
            .then(async dateItem => {
              if (dateItem === null) {
                await createDateItem(
                  cv.date,
                  cv.gamesPlayed,
                  cv.teamsParticipated,
                  cv.organization,
                  Date.now()
                )
              } else {
                if (dateItem.gamesPlayed !== cv.gamesPlayed) {
                  await prisma.esports_date_items.update({
                    where: {
                      matchDate_organization: {
                        matchDate: cv.date,
                        organization: cv.organization
                      }
                    },
                    data: {
                      gamesPlayed: cv.gamesPlayed,
                      teamsParticipated: cv.teamsParticipated
                    }
                  })
                }
              }
            })
        } catch (e) {
          console.log(e)
        } finally {
          count += 1
          if (count === dateItems.length) {
            resolve()
          }
        }
      })
    })
    loop.then(() => {
      resolve()
    })
  })
}

export async function checkTeams(teamNames: string[]) {
  // Check if team exists in database
  return new Promise<void>((resolve, reject) => {
    let count = 0
    let loop = new Promise<void>((resolve, reject) => {
      teamNames.forEach(async (cv, idx, arr) => {
        try {
          await prisma.esports_teams
            .findFirst({
              where: { teamName: cv }
            })
            .then(async team => {
              if (team === null) {
                await createEsportsTeam(cv)
              }
            })
        } catch (e) {
          console.log(e)
        } finally {
          count += 1
          if (count === teamNames.length) {
            resolve()
          }
        }
      })
    })
    loop.then(() => {
      resolve()
    })
  })
}

export async function checkPlayers(playerName: string, playerTeamName: string) {
  return new Promise<void>(async (resolve, reject) => {
    await prisma.esports_teams
      .findFirst({
        where: { teamName: playerTeamName }
      })
      .then(async team => {
        if (team !== null) {
          await prisma.esports_player
            .findFirst({
              where: { name: playerName }
            })
            .then(async player => {
              if (player === null) {
                await createEsportsUser(team.teamID, playerName)
              }
            })
        }
      })
      .then(() => resolve())
  })
}

export async function checkMatches(matches: MatchesArr) {
  // Check if teamA exists in database
  return new Promise<void>((resolve, reject) => {
    let count = 0
    let loop = new Promise<void>((resolve, reject) => {
      matches.forEach(async (cv, idx, arr) => {
        try {
          await prisma.esports_match
            .findUnique({
              where: {
                matchUTCDate_matchWeek_teamA_teamB_matchLength: {
                  matchUTCDate: new Date(cv.utcDate).getTime(),
                  matchWeek: String(cv.matchWeek),
                  teamA: String(cv.teamA.teamName),
                  teamB: String(cv.teamB.teamName),
                  matchLength: String(cv.matchLength)
                }
              }
            })
            .then(async match => {
              if (match === null) {
                await createEsportsMatch(
                  cv.dateItemID,
                  cv.matchDate,
                  new Date(cv.utcDate).getTime(),
                  String(cv.matchDay),
                  cv.matchWeek,
                  cv.teamA.teamName,
                  cv.teamB.teamName,
                  cv.matchLength,
                  cv.teamAWin === true ? 1 : 0,
                  cv.teamBWin === true ? 1 : 0
                )
              }
            })
        } catch (e) {
          console.log(e)
        } finally {
          count += 1
          if (count === matches.length) {
            resolve()
          }
        }
      })
    })
    loop.then(() => {
      resolve()
    })
  })
}

export async function checkTeamStats(
  matchDate: number, // Needed to find match
  matchWeek: string,
  teamAName: string,
  teamBName: string,
  matchLength: string,
  teamName: string, // Other variables
  teamDidWin: number,
  teamKills: number,
  dragonKills: number,
  riftHeralds: number,
  turretKills: number,
  baronKills: number,
  inhibitorKills: number,
  totalTeamPoints: number
) {
  return await prisma.esports_match
    .findUnique({
      // Finds match
      where: {
        matchUTCDate_matchWeek_teamA_teamB_matchLength: {
          matchUTCDate: matchDate,
          matchWeek: String(matchWeek),
          teamA: String(teamAName),
          teamB: String(teamBName),
          matchLength: String(matchLength)
        }
      }
    })
    .then(async currMatch => {
      if (currMatch !== null) {
        await prisma.esports_teams
          .findFirst({
            // Finds team
            where: {
              teamName: teamName
            }
          })
          .then(async team => {
            if (team !== null) {
              await prisma.esports_team_match_stats
                .findFirst({
                  where: {
                    matchID: currMatch.matchID,
                    teamID: team.teamID
                  }
                })
                .then(async matchStats => {
                  if (matchStats === null) {
                    await createEsportsTeamMatchStats(
                      currMatch.matchID,
                      team.teamID,
                      teamName,
                      teamKills,
                      dragonKills,
                      riftHeralds,
                      turretKills,
                      baronKills,
                      inhibitorKills,
                      teamDidWin,
                      totalTeamPoints
                    )
                  }
                })
            }
          })
      }
    })
}

export async function checkPlayerStats(
  matchDate: number, // Needed to find match
  matchWeek: string,
  teamAName: string,
  teamBName: string,
  matchLength: string,
  teamPlayers: TeamPlayer[] // Members array to iterate thru
) {
  let count = 0
  await new Promise<void>(async (resolve, reject) => {
    teamPlayers.forEach(async player => {
      try {
        // Find current match in db
        await prisma.esports_match
          .findUnique({
            // Finds match
            where: {
              matchUTCDate_matchWeek_teamA_teamB_matchLength: {
                matchUTCDate: matchDate,
                matchWeek: String(matchWeek),
                teamA: String(teamAName),
                teamB: String(teamBName),
                matchLength: String(matchLength)
              }
            }
          })
          .then(async currMatch => {
            await prisma.esports_player
              .findFirst({
                where: {
                  name: player.name
                }
              })
              .then(async currPlayer => {
                console.log(currPlayer)
                if (currPlayer !== null) {
                  await prisma.esports_player_match_stats
                    .findFirst({
                      where: {
                        name: currPlayer.name,
                        matchID: currMatch.matchID
                      }
                    })
                    .then(async currPStats => {
                      if (currPStats === null) {
                        await createEsportsPlayerMatchStats(
                          currMatch.matchID,
                          currPlayer.playerID,
                          currPlayer.name,
                          player.teamName,
                          player.role,
                          player.championName,
                          player.kills,
                          player.assists,
                          player.deaths,
                          player.creepScore,
                          player.totalPoints
                        )
                      }
                    })
                }
              })
          })
      } catch (err) {
        console.log(err)
      } finally {
        count += 1
        if (count === teamPlayers.length) {
          resolve()
        }
      }
    })
  }).then(() => console.log('finished creating player stats'))
}
