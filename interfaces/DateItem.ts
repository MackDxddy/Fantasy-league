import { Matches } from './Matches'

export interface DateItem {
  date?: string
  utcDate?: Date
  gamesPlayed?: number
  teamsParticipated?: number
  organization?: string
  matches?: Matches[]
}
