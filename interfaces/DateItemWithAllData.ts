import { Prisma } from '@prisma/client'

const dateItemWithData = Prisma.validator<Prisma.esports_date_itemsArgs>()({
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

export type DateItemWithData = Prisma.esports_date_itemsGetPayload<typeof dateItemWithData>