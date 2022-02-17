import { NextApiRequest, NextApiResponse } from 'next'
import { formatDate } from 'lib/helpers/date'
import { CargoClient } from 'poro'
import { Team } from '../../../interfaces/Team'
import { TeamPlayer } from '../../../interfaces/TeamPlayer'
import { Matches } from '../../../interfaces/Matches'
import { DateItem } from '../../../interfaces/DateItem'
import { MatchesArr } from '../../../interfaces/MatchesArray'
import { calculateTeamScore, calculatePlayerScore } from '../../lib/helpers/calculate'
import {
  uniqueFilter,
  uniqueObjFilter,
  uniqueDateObjFilter,
  uniqueDateFilter
} from 'lib/helpers/uniqueFilter'
import prisma from 'lib/PrismaHelpers/prisma'
import {
  checkTeams,
  checkPlayers,
  checkMatches,
  checkTeamStats,
  checkPlayerStats,
  checkDateItem
} from 'lib/PrismaHelpers/create'
import nc from 'next-connect'
import { dbDataParser } from 'lib/helpers/dbDataParser'

const matchLimit = 300,
  playerLimit = matchLimit * 10,
  playerRoles = {
    Top: 1,
    Jungle: 2,
    Mid: 3,
    Bot: 4,
    Support: 5
  }

interface TeamsArr extends Array<Team> {}
interface TeamPlayersArr extends Array<TeamPlayer> {}
interface DateItemsArr extends Array<DateItem> {}

export default nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).end('Something went wrong.')
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found')
  }
})
  .get(async (req, res) => {
    // Check if data exists in database
    if (req.query.type === 'initial') {
      await prisma.esports_date_items
        .findMany({
          include: {
            esports_match: {
              include: {
                esports_team_match_stats: {
                  include: {
                    esports_teams: true
                  }
                },
                esports_player_match_stats: {
                  include: {
                    esports_player: true
                  }
                }
              }
            }
          }
        })
        .then(dateItems => {
          if (dateItems.length !== 0) {
            let parsedDateItem = dbDataParser(dateItems)
            return res.status(200).send({ DateItems: parsedDateItem })
          }
        })
    }
    /**
     * *************** Fetch from lol.esports.com ***************
     */

    // Initialize cargo client to fetch with queries
    const cargo = new CargoClient()
    const matches = await cargo
      .query({
        tables: ['Tournaments', 'MatchSchedule', 'ScoreboardGames'],
        where:
          // LPL, LCS, LEC, LCK
          "MatchSchedule.DateTime_UTC >= '2022-01-01 00:00:00' AND (MatchSchedule.OverviewPage LIKE '%LPL%' OR MatchSchedule.OverviewPage LIKE '%LCS%' OR MatchSchedule.OverviewPage LIKE '%LEC%' OR MatchSchedule.OverviewPage LIKE '%LCK%') AND NOT MatchSchedule.OverviewPage LIKE '%Lock In%' AND NOT MatchSchedule.OverviewPage LIKE '%Proving Grounds%' AND MatchSchedule.DateTime_UTC <> '' AND NOT MatchSchedule.OverviewPage LIKE '%CL%'",
          // LCS, LEC
          // "MatchSchedule.DateTime_UTC >= '2022-01-01 00:00:00' AND (MatchSchedule.OverviewPage LIKE '%LCS%' OR MatchSchedule.OverviewPage LIKE '%LEC%') AND NOT MatchSchedule.OverviewPage LIKE '%Lock In%' AND NOT MatchSchedule.OverviewPage LIKE '%Proving Grounds%' AND MatchSchedule.DateTime_UTC <> ''",
          // LPL, LCK
          // "MatchSchedule.DateTime_UTC >= '2022-01-01 00:00:00' AND (MatchSchedule.OverviewPage LIKE '%LPL%' OR MatchSchedule.OverviewPage LIKE '%LCK%') AND NOT MatchSchedule.OverviewPage LIKE '%Lock In%' AND NOT MatchSchedule.OverviewPage LIKE '%Proving Grounds%' AND MatchSchedule.DateTime_UTC <> '' AND NOT MatchSchedule.OverviewPage LIKE '%CL%'",
        fields: [
          'MatchSchedule.DateTime_UTC',
          'MatchSchedule.Tab',
          'MatchSchedule.MatchDay',
          'ScoreboardGames.Gamelength',
          'MatchSchedule.OverviewPage',
          'MatchSchedule.MatchId',
          'MatchSchedule.Winner',
          'MatchSchedule.Team1',
          'ScoreboardGames.Team1Players',
          'ScoreboardGames.DateTime_UTC',
          'ScoreboardGames.Team1Kills',
          'ScoreboardGames.Team1Dragons',
          'ScoreboardGames.Team1Barons',
          'ScoreboardGames.Team1Towers',
          'ScoreboardGames.Team1RiftHeralds',
          'ScoreboardGames.Team1Inhibitors',
          'MatchSchedule.Team2',
          'ScoreboardGames.Team2Players',
          'ScoreboardGames.Team2Kills',
          'ScoreboardGames.Team2Dragons',
          'ScoreboardGames.Team2Barons',
          'ScoreboardGames.Team2Towers',
          'ScoreboardGames.Team2RiftHeralds',
          'ScoreboardGames.Team2Inhibitors'
        ],
        joinOn: [
          {
            left: 'Tournaments.OverviewPage',
            right: 'MatchSchedule.OverviewPage'
          },
          {
            left: 'ScoreboardGames.MatchId',
            right: 'MatchSchedule.MatchId'
          }
        ],
        limit: matchLimit,
        groupBy: ['ScoreboardGames.DateTime_UTC'],
        // groupBy: ['MatchSchedule.MatchId'],
        orderBy: [{ field: 'ScoreboardGames.DateTime_UTC' }]
      })
      .catch(err => console.log('err', err))

    const players = await cargo
      .query({
        tables: ['Tournaments', 'ScoreboardGames', 'ScoreboardPlayers'],
        where:
          // LPL, LCS, LEC, LCK
          "Tournaments.DateStart >= '2022-01-01 00:00:00' AND (Tournaments.Name LIKE '%LPL%' OR Tournaments.Name LIKE '%LCS%' OR Tournaments.Name LIKE '%LEC%' OR Tournaments.Name LIKE '%LCK%') AND NOT Tournaments.Name LIKE '%Lock In%' AND NOT Tournaments.Name LIKE '%Proving Grounds%' AND ScoreboardGames.DateTime_UTC <> '' AND NOT Tournaments.Name LIKE '%CL%'",
          // LCS, LEC
          // "Tournaments.DateStart >= '2022-01-01 00:00:00' AND (Tournaments.Name LIKE '%LCS%' OR Tournaments.Name LIKE '%LEC%') AND NOT Tournaments.Name LIKE '%Lock In%' AND NOT Tournaments.Name LIKE '%Proving Grounds%' AND ScoreboardGames.DateTime_UTC <> ''",
          // LPL, LCK
          // "Tournaments.DateStart >= '2022-01-01 00:00:00' AND (Tournaments.Name LIKE '%LPL%' OR Tournaments.Name LIKE '%LCK%') AND NOT Tournaments.Name LIKE '%Lock In%' AND NOT Tournaments.Name LIKE '%Proving Grounds%' AND ScoreboardGames.DateTime_UTC <> '' AND NOT Tournaments.Name LIKE '%CL%'",
        fields: [
          'ScoreboardGames.DateTime_UTC',
          'ScoreboardGames.OverviewPage',
          'ScoreboardGames.MatchId',
          'ScoreboardGames.Team1',
          'ScoreboardGames.Team2',
          'ScoreboardPlayers.Link',
          'ScoreboardPlayers.Team',
          'ScoreboardPlayers.Role',
          'ScoreboardPlayers.Champion',
          'ScoreboardPlayers.Kills',
          'ScoreboardPlayers.Deaths',
          'ScoreboardPlayers.Assists',
          'ScoreboardPlayers.CS'
        ],
        joinOn: [
          {
            left: 'ScoreboardGames.GameId',
            right: 'ScoreboardPlayers.GameId'
          },
          {
            left: 'Tournaments.Name',
            right: 'ScoreboardGames.Tournament'
          }
        ],
        limit: playerLimit,
        orderBy: [{ field: 'ScoreboardGames.DateTime_UTC' }]
      })
      .catch(err => console.log('err', err))

    /**
     * ******************** Set up variables ********************
     */

    // Assigns matches data and players data to variables
    let currMatches = matches ? matches.data : null,
      currPlayers = players ? players.data : null

    if (currMatches === null || currPlayers === null) {
      console.log('error occured here')
      return res.status(500).end('Something went wrong.')
    } else console.log('no error')

    // gets array of formatted dates to filter unique dates
    let uniqueFormattedDates = uniqueFilter(
      currMatches.map(match => {
        return formatDate(String(match.DateTime_UTC))
      })
    )

    // gets array of dates to filter unique dates
    let uniqueDates = uniqueDateFilter(
      currMatches.map(match => {
        return match.DateTime_UTC
      })
    )

    // gets array of unique organizations
    let uniqueOrganizations = uniqueFilter(
      currMatches.map(match => {
        return match.OverviewPage
      })
    )

    // Variables to hold all relevant data
    // for future use
    let totalTeams: TeamsArr = [],
      totalTeamNames: string[] = [],
      totalTeamPlayers: TeamPlayersArr = [],
      totalDateItems: DateItemsArr = []

    /**
     * ******************** Create DateItems ********************
     * Array of objects used by components to properly display
     * Contains information used by prisma to store in db
     */
    await Promise.all(
      uniqueOrganizations.map(async currOrg => {
        await Promise.all(
          uniqueFormattedDates.map(async uniqueFormattedDate => {
            // Initialize variables to hold data per date item
            let totalDIMatches: MatchesArr = [],
              totalDITeams = [],
              totalDITeamNames = [],
              currentDateItem: DateItem = <DateItem>{}
            await Promise.all(
              uniqueDates.map(async uniqueDate => {
                await Promise.all(
                  currMatches.map(async match => {
                    // if (
                    //   formatDate(String(currDate)) === formatDate(String(match.DateTime_UTC)) &&
                    //   match.OverviewPage === currOrg
                    // ) {
                    if (
                      uniqueDate.getTime() === new Date(match.DateTime_UTC).getTime() &&
                      match.OverviewPage === currOrg &&
                      uniqueFormattedDate === formatDate(String(uniqueDate))
                    ) {
                      // Initiliaze variables that will hold teams, teamplayers and match
                      let teamA: Team = <Team>{},
                        teamB: Team = <Team>{},
                        teamAPlayers: TeamPlayersArr = [],
                        teamBPlayers: TeamPlayersArr = [],
                        currentMatch: Matches = <Matches>{}

                      // set match properties
                      currentMatch.utcDate = match.DateTime_UTC
                      currentMatch.matchDate = formatDate(String(match.DateTime_UTC))
                      currentMatch.matchDay = match.MatchDay
                      currentMatch.matchWeek = match.Tab
                      currentMatch.matchLength = match.Gamelength

                      // Pulls player stats
                      await currPlayers
                        .reduce(async (a, player) => {
                          await a

                          /**
                           * Because the API is 'unstable' and sometimes,
                           * 'inaccurate' if statements are used to assert the correct
                           * data is put into the correct teamPlayer.
                           */
                          if (
                            player.Team === player.Team1 &&
                            player.MatchId === match.MatchId &&
                            player.Team === match.Team1 &&
                            new Date(match.DateTime_UTC).getTime() ===
                              new Date(player.DateTime_UTC).getTime()
                          ) {
                            // Set team A player stats
                            let teamAPlayer: TeamPlayer = {
                              // Assign role position
                              rolePosition: playerRoles[player.Role],
                              teamName: player.Team,
                              name: player.Link,
                              championName: player.Champion,
                              role: player.Role,
                              kills: player.Kills,
                              assists: player.Assists,
                              deaths: player.Deaths,
                              creepScore: player.CS
                            }
                            let totalAPlayerPoints = await calculatePlayerScore(
                              player.Link,
                              teamAPlayer.kills,
                              teamAPlayer.assists,
                              teamAPlayer.deaths,
                              teamAPlayer.creepScore,
                              match.Team1Kills
                            )
                            teamAPlayer.totalPoints = totalAPlayerPoints
                            // push to match players array
                            teamAPlayers.push(teamAPlayer)
                          } else if (
                            player.Team === player.Team2 &&
                            player.MatchId === match.MatchId &&
                            player.Team === match.Team2 &&
                            new Date(match.DateTime_UTC).getTime() ===
                              new Date(player.DateTime_UTC).getTime()
                          ) {
                            // Set team B player stats
                            let teamBPlayer: TeamPlayer = {
                              // Assign role position
                              rolePosition: playerRoles[player.Role],
                              teamName: player.Team,
                              name: player.Link,
                              championName: player.Champion,
                              role: player.Role,
                              kills: player.Kills,
                              assists: player.Assists,
                              deaths: player.Deaths,
                              creepScore: player.CS
                            }
                            let totalBPlayerPoints = await calculatePlayerScore(
                              player.Link,
                              teamBPlayer.kills,
                              teamBPlayer.assists,
                              teamBPlayer.deaths,
                              teamBPlayer.creepScore,
                              match.Team2Kills
                            )
                            teamBPlayer.totalPoints = totalBPlayerPoints
                            // push to match players array
                            teamBPlayers.push(teamBPlayer)
                          } else if (
                            player.Team === player.Team2 &&
                            player.MatchId === match.MatchId &&
                            player.Team === match.Team1 &&
                            new Date(match.DateTime_UTC).getTime() ===
                              new Date(player.DateTime_UTC).getTime()
                          ) {
                            let teamAPlayer: TeamPlayer = {
                              rolePosition: playerRoles[player.Role],
                              name: player.Link,
                              teamName: player.Team,
                              championName: player.Champion,
                              role: player.Role,
                              kills: player.Kills,
                              assists: player.Assists,
                              deaths: player.Deaths,
                              creepScore: player.CS
                            }
                            let totalAPlayerPoints = await calculatePlayerScore(
                              player.Link,
                              teamAPlayer.kills,
                              teamAPlayer.assists,
                              teamAPlayer.deaths,
                              teamAPlayer.creepScore,
                              match.Team2Kills
                            )
                            teamAPlayer.totalPoints = totalAPlayerPoints
                            // push to match players array
                            teamAPlayers.push(teamAPlayer)
                          } else if (
                            player.Team === player.Team1 &&
                            player.MatchId === match.MatchId &&
                            player.Team === match.Team2 &&
                            new Date(match.DateTime_UTC).getTime() ===
                              new Date(player.DateTime_UTC).getTime()
                          ) {
                            let teamBPlayer: TeamPlayer = {
                              // Assign role position
                              rolePosition: playerRoles[player.Role],
                              name: player.Link,
                              teamName: player.Team,
                              championName: player.Champion,
                              role: player.Role,
                              kills: player.Kills,
                              assists: player.Assists,
                              deaths: player.Deaths,
                              creepScore: player.CS
                            }
                            let totalBPlayerPoints = await calculatePlayerScore(
                              player.Link,
                              teamBPlayer.kills,
                              teamBPlayer.assists,
                              teamBPlayer.deaths,
                              teamBPlayer.creepScore,
                              match.Team1Kills
                            )
                            teamBPlayer.totalPoints = totalBPlayerPoints
                            // push to match players array
                            teamBPlayers.push(teamBPlayer)
                          }
                        }, Promise.resolve())
                        .then(() => {
                          // Push teamNames to array
                          totalDITeamNames.push(match.Team1)
                          totalDITeamNames.push(match.Team2)

                          // Sort by roles
                          teamAPlayers = teamAPlayers.sort(
                            (a, b) => a.rolePosition - b.rolePosition
                          )
                          teamBPlayers = teamBPlayers.sort(
                            (a, b) => a.rolePosition - b.rolePosition
                          )

                          // Add members to corresponding teams
                          teamA.teamPlayers = teamAPlayers
                          teamB.teamPlayers = teamBPlayers

                          currentDateItem.utcDate = match.DateTime_UTC
                          currentDateItem.organization = match.OverviewPage
                        })

                      if (teamAPlayers[0].name === match.Team2Players[0]) {
                        // Set basic team A stats
                        teamA.teamName = match.Team1 // SK
                        teamA.teamKills = match.Team2Kills
                        teamA.dragonKills = match.Team2Dragons
                        teamA.riftHeralds = match.Team2RiftHeralds
                        teamA.turretKills = match.Team2Towers
                        teamA.baronKills = match.Team2Barons
                        teamA.inhibitorKills = match.Team2Inhibitors
                        teamA.didWin = match.Winner === 1 ? true : false
                        let totalAPoints = await calculateTeamScore(
                          match.Team2Kills,
                          match.Team2Dragons,
                          match.Team2RiftHeralds,
                          match.Team2Towers,
                          match.Team2Inhibitors,
                          match.Team2Barons,
                          teamA.didWin
                        )

                        teamA.totalPoints = totalAPoints

                        // push to totalDateItemTeams
                        // console.log('total team points for', match.Team1, 'is', totalPoints)
                        // Set basic team B stats
                        teamB.teamName = match.Team2 //Rogue
                        teamB.teamKills = match.Team1Kills
                        teamB.dragonKills = match.Team1Dragons
                        teamB.riftHeralds = match.Team1RiftHeralds
                        teamB.turretKills = match.Team1Towers
                        teamB.baronKills = match.Team1Barons
                        teamB.inhibitorKills = match.Team1Inhibitors
                        teamB.didWin = match.Winner === 2 ? true : false
                        let totalBPoints = await calculateTeamScore(
                          match.Team1Kills,
                          match.Team1Dragons,
                          match.Team1RiftHeralds,
                          match.Team1Towers,
                          match.Team1Inhibitors,
                          match.Team1Barons,
                          teamB.didWin
                        )

                        teamB.totalPoints = totalBPoints
                      }
                      if (teamAPlayers[0].name === match.Team1Players[0]) {
                        // Set basic team A stats
                        teamA.teamName = match.Team1 //Rogue
                        teamA.teamKills = match.Team1Kills
                        teamA.dragonKills = match.Team1Dragons
                        teamA.riftHeralds = match.Team1RiftHeralds
                        teamA.turretKills = match.Team1Towers
                        teamA.baronKills = match.Team1Barons
                        teamA.inhibitorKills = match.Team1Inhibitors
                        teamA.didWin = match.Winner === 1 ? true : false
                        let totalAPoints = await calculateTeamScore(
                          match.Team1Kills,
                          match.Team1Dragons,
                          match.Team1RiftHeralds,
                          match.Team1Towers,
                          match.Team1Inhibitors,
                          match.Team1Barons,
                          teamA.didWin
                        )

                        teamA.totalPoints = totalAPoints

                        // Set basic team B stats
                        teamB.teamName = match.Team2 //Rogue
                        teamB.teamKills = match.Team2Kills
                        teamB.dragonKills = match.Team2Dragons
                        teamB.riftHeralds = match.Team2RiftHeralds
                        teamB.turretKills = match.Team2Towers
                        teamB.baronKills = match.Team2Barons
                        teamB.inhibitorKills = match.Team2Inhibitors
                        teamB.didWin = match.Winner === 2 ? true : false
                        let totalBPoints = await calculateTeamScore(
                          match.Team2Kills,
                          match.Team2Dragons,
                          match.Team2RiftHeralds,
                          match.Team2Towers,
                          match.Team2Inhibitors,
                          match.Team2Barons,
                          teamB.didWin
                        )

                        teamB.totalPoints = totalBPoints
                      }

                      // Add teams to match object
                      currentMatch.teamA = teamA
                      currentMatch.teamB = teamB

                      // Add what teams won to match object
                      currentMatch.teamAWin = teamA.didWin
                      currentMatch.teamBWin = teamB.didWin

                      // Add team players to match object
                      currentMatch.teamAPlayers = teamAPlayers
                      currentMatch.teamBPlayers = teamBPlayers

                      // Add current match to totalDateItemMatches
                      totalDIMatches.push(currentMatch)

                      // Push teams to array
                      totalDITeams.push(teamA)
                      totalDITeams.push(teamB)
                    }
                  })
                )
              })
            ).then(() => {
              // Create dateItem if organizations are matching
              // to separate matches from different orgs on same date
              if (currOrg === currentDateItem.organization) {
                currentDateItem.date = uniqueFormattedDate
                let finalTotalMatches = uniqueDateObjFilter(totalDIMatches, 'utcDate')
                currentDateItem.matches = finalTotalMatches
                currentDateItem.gamesPlayed = finalTotalMatches.length
                currentDateItem.teamsParticipated = uniqueFilter(totalDITeamNames).length
                totalDateItems.push(currentDateItem)
              }

              totalTeamNames = uniqueFilter(totalDITeamNames)
            })
          })
        )
      })
    )

    return res.status(200).send({ DateItems: totalDateItems })
  })
  .post(async (req, res) => {
    if (!req.body.dataItem) {
      return res.status(400).json({ error: 'data unable to be saved' })
    }
    /**
     * ****************** Save DateItems to DB ******************
     */

    /**
     * ******************** Set up variables ********************
     */

    // Store dataItemsArr in local variable
    const dateItems: DateItemsArr = req.body.dataItem

    // Create DateItem in database
    await checkDateItem(dateItems)

    // Create Teams & Players in database
    const totalTeams: string[] = []
    dateItems.forEach(dateItem => {
      dateItem.matches.forEach(match => {
        totalTeams.push(match.teamA.teamName)
        totalTeams.push(match.teamB.teamName)
      })
    })

    let uniqueTeams = uniqueFilter(totalTeams)

    await checkTeams(uniqueTeams)
      .then(async () => {
        // Create players in database
        let totalPlayers: TeamPlayersArr = []
        await Promise.all(
          dateItems.map(dateItem => {
            dateItem.matches.forEach(match => {
              match.teamAPlayers.forEach(cv => totalPlayers.push(cv))
              match.teamBPlayers.forEach(cv => totalPlayers.push(cv))
            })
          })
        )
        // Filter unique player names
        let uniquePlayers = uniqueFilter(totalPlayers.map(cv => cv.name))

        await Promise.all(uniquePlayers)
          .then(players => {
            // create unique objects with playername and teamname
            let playerObjArr = []
            dateItems.forEach(dateItem => {
              dateItem.matches.forEach(match => {
                match.teamAPlayers.forEach((player, playerIdx) => {
                  players.forEach(uniquePlayer => {
                    let playerObj = {}
                    if (player.name === uniquePlayer) {
                      playerObj['name'] = player.name
                      playerObj['teamName'] = player.teamName
                      playerObjArr.push(playerObj)
                    } else if (match.teamBPlayers[playerIdx].name === uniquePlayer) {
                      playerObj['name'] = uniquePlayer
                      playerObj['teamName'] = match.teamBPlayers[playerIdx].teamName
                      playerObjArr.push(playerObj)
                    }
                  })
                })
              })
            })
            return playerObjArr
          })
          .then(async playerObjArr => {
            // create unique object
            let uniquePlayerObjArr = uniqueObjFilter(playerObjArr, 'teamName', 'name')
            await Promise.all(
              uniquePlayerObjArr.map(async player => {
                await checkPlayers(player.name, player.teamName)
              })
            )
          })
      })
      .then(async () => {
        // Create Matches
        const totalMatches: MatchesArr = []
        await Promise.all(
          dateItems.map(async dateItem => {
            await Promise.all(
              dateItem.matches.map(async match => {
                await prisma.esports_date_items
                  .findUnique({
                    where: {
                      matchDate_organization: {
                        matchDate: String(match.matchDate),
                        organization: dateItem.organization
                      }
                    }
                  })
                  .then(dItem => {
                    if (dItem) {
                      match['dateItemID'] = dItem.id
                    }
                    totalMatches.push(match)
                  })
              })
            )
          })
        )
          .then(async () => {
            await checkMatches(totalMatches)
          })
          .then(async () => {
            // Create team match stats
            await Promise.all(
              totalMatches.map(async match => {
                // Match stats for TeamA
                await checkTeamStats(
                  new Date(match.utcDate).getTime(),
                  match.matchWeek,
                  match.teamA.teamName,
                  match.teamB.teamName,
                  match.matchLength,
                  match.teamA.teamName,
                  match.teamA.didWin === true ? 1 : 0,
                  match.teamA.teamKills,
                  match.teamA.dragonKills,
                  match.teamA.riftHeralds,
                  match.teamA.turretKills,
                  match.teamA.baronKills,
                  match.teamA.inhibitorKills,
                  match.teamA.totalPoints
                ).then(async () => {
                  // Match stats for TeamB
                  await checkTeamStats(
                    new Date(match.utcDate).getTime(),
                    match.matchWeek,
                    match.teamA.teamName,
                    match.teamB.teamName,
                    match.matchLength,
                    match.teamB.teamName,
                    match.teamB.didWin === true ? 1 : 0,
                    match.teamB.teamKills,
                    match.teamB.dragonKills,
                    match.teamB.riftHeralds,
                    match.teamB.turretKills,
                    match.teamB.baronKills,
                    match.teamB.inhibitorKills,
                    match.teamB.totalPoints
                  )
                })
              })
            )
          })

        // Create player match stats
        await Promise.all(
          totalMatches.map(async match => {
            // Team A player stats
            await checkPlayerStats(
              new Date(match.utcDate).getTime(),
              match.matchWeek,
              match.teamA.teamName,
              match.teamB.teamName,
              match.matchLength,
              match.teamAPlayers
            ).then(async () => {
              // Team B player stats
              await checkPlayerStats(
                new Date(match.utcDate).getTime(),
                match.matchWeek,
                match.teamA.teamName,
                match.teamB.teamName,
                match.matchLength,
                match.teamBPlayers
              )
            })
          })
        )
      })

    return res.status(200).json({ message: 'Details saved succesfully!' })
  })
