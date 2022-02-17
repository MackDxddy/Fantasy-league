import { esports_date_items } from '@prisma/client'
import { DateItem } from '../../../interfaces/DateItem'
import { DateItemWithData } from '../../../interfaces/DateItemWithAllData'
import { Matches } from '../../../interfaces/Matches'
import { Team } from '../../../interfaces/Team'
import { TeamPlayer } from '../../../interfaces/TeamPlayer'

export const dbDataParser = (dateItems: DateItemWithData[]) => {
  return dateItems.map(dateItem => {
    let parsedDateItem: DateItem = {
      date: dateItem.matchDate,
      gamesPlayed: dateItem.gamesPlayed,
      teamsParticipated: dateItem.teamsParticipated,
      organization: dateItem.organization
    }
    let matches = dateItem.esports_match.map(match => {
      // Create match object
      let parsedMatch: Matches = {
        utcDate: new Date(match.matchUTCDate),
        matchDate: match.matchDate,
        matchDay: Number(match.matchDay),
        matchWeek: match.matchWeek,
        matchLength: match.matchLength,
        teamAWin: match.teamAWin === 1 ? true : false,
        teamBWin: match.teamBWin === 1 ? true : false
      }

      // Create team objects
      let teamA: Team = {
          teamName: match.teamA,
          didWin: parsedMatch.teamAWin
        },
        teamB: Team = {
          teamName: match.teamB,
          didWin: parsedMatch.teamBWin
        }

      // Assign team stats
      match.esports_team_match_stats.forEach(team => {
        if (team.teamName === teamA.teamName) {
          teamA.teamKills = team.teamKills
          teamA.dragonKills = team.dragonKills
          teamA.riftHeralds = team.riftHeralds
          teamA.turretKills = team.turretKills
          teamA.baronKills = team.baronKills
          teamA.totalPoints = Number(team.totalPoints)
          teamA.inhibitorKills = team.inhibitorKills
        } else if (team.teamName === teamB.teamName) {
          teamB.teamKills = team.teamKills
          teamB.teamKills = team.teamKills
          teamB.teamKills = team.teamKills
          teamB.teamKills = team.teamKills
          teamB.teamKills = team.teamKills
          teamB.teamKills = team.teamKills
          teamB.dragonKills = team.dragonKills
          teamB.riftHeralds = team.riftHeralds
          teamB.turretKills = team.turretKills
          teamB.baronKills = team.baronKills
          teamB.totalPoints = Number(team.totalPoints)
          teamB.inhibitorKills = team.inhibitorKills
        }
      })

      const playerRoles = {
        Top: 1,
        Jungle: 2,
        Mid: 3,
        Bot: 4,
        Support: 5
      }
      // Assign team A players
      let teamAPlayers = match.esports_player_match_stats
        .map(player => {
          if (player.teamName === teamA.teamName) {
            let currPlayer: TeamPlayer = {
              teamName: player.teamName,
              name: player.name,
              totalPoints: Number(player.playerScore),
              championName: player.legend,
              role: player.role,
              rolePosition: playerRoles[player.role],
              kills: player.kills,
              assists: player.assists,
              deaths: player.deaths,
              creepScore: player.creepScore
            }
            return currPlayer
          }
        })
        .filter(player => player !== undefined)
      teamA.teamPlayers = teamAPlayers

      // Assign team B players
      let teamBPlayers = match.esports_player_match_stats
        .map(player => {
          if (player.teamName === teamB.teamName) {
            let currPlayer: TeamPlayer = {
              teamName: player.teamName,
              name: player.name,
              totalPoints: Number(player.playerScore),
              championName: player.legend,
              role: player.role,
              rolePosition: playerRoles[player.role],
              kills: player.kills,
              assists: player.assists,
              deaths: player.deaths,
              creepScore: player.creepScore
            }
            return currPlayer
          }
        })
        .filter(player => player !== undefined)
      teamB.teamPlayers = teamBPlayers

      parsedMatch.teamA = teamA
      parsedMatch.teamB = teamB
      parsedMatch.teamAPlayers = teamAPlayers
      parsedMatch.teamBPlayers = teamBPlayers

      return parsedMatch
    })

    parsedDateItem.matches = matches
    return parsedDateItem
  })
}
