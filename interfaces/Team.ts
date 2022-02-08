import { TeamPlayer } from './TeamPlayer'

export interface Team {
  teamName?: string // VALUE USED FOR DB FETCHING
  teamKills?: number
  dragonKills?: number
  riftHeralds?: number
  turretKills?: number
  baronKills?: number
  totalPoints?: number
  inhibitorKills?: number
  didWin?: boolean
  teamPlayers?: TeamPlayer[]
}
