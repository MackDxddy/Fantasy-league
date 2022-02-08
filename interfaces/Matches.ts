import { Team } from './Team'
import { TeamPlayer } from './TeamPlayer'

export interface Matches {
  utcDate?: Date
  matchDate?: string
  matchDay?: number
  matchWeek?: string
  teamA?: Team
  teamB?: Team
  matchLength?: string
  teamAWin?: boolean
  teamBWin?: boolean
  teamAPlayers?: TeamPlayer[]
  teamBPlayers?: TeamPlayer[]
}
