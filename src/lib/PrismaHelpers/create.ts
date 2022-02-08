import { TeamPlayer } from '../../../interfaces/TeamPlayer'
import { MatchesArr } from '../../../interfaces/MatchesArray'
import prisma from '../PrismaHelpers/prisma'

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
      playerName: playerName,
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
  matchDate: string,
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
      matchDate: matchDate,
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
      playerName: playerName
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

export async function checkTeams(teamNames: string[]) {
  // Check if teamA exists in database
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
                console.log('creating team', cv)
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
              where: { playerName: playerName }
            })
            .then(async player => {
              if (player === null) {
                console.log('creating player', playerName)
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
                matchDay_matchWeek_teamA_teamB_matchLength: {
                  matchDay: String(cv.matchDay),
                  matchWeek: String(cv.matchWeek),
                  teamA: String(cv.teamA.teamName),
                  teamB: String(cv.teamB.teamName),
                  matchLength: String(cv.matchLength)
                }
              }
            })
            .then(async match => {
              if (match === null) {
                console.log('creating match', cv.matchDate)
                await createEsportsMatch(
                  String(cv.matchDate),
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
  matchDay: string, // Needed to find match
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
        matchDay_matchWeek_teamA_teamB_matchLength: {
          matchDay: String(matchDay),
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
                    console.log(
                      'creating team stats for',
                      teamName,
                      'for match id',
                      currMatch.matchID
                    )
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
  matchDay: string, // Needed to find match
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
              matchDay_matchWeek_teamA_teamB_matchLength: {
                matchDay: String(matchDay),
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
                  playerName: player.name
                }
              })
              .then(async currPlayer => {
                await prisma.esports_player_match_stats
                  .findFirst({
                    where: {
                      playerName: currPlayer.playerName,
                      matchID: currMatch.matchID
                    }
                  })
                  .then(async currPStats => {
                    // console.log(currPStats);
                    if (currPStats === null) {
                      await createEsportsPlayerMatchStats(
                        currMatch.matchID,
                        currPlayer.playerID,
                        currPlayer.playerName,
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
