import React from "react";
import { ComponentMeta } from "@storybook/react";
import { MatchDetails } from "./MatchDetails";
import { action } from "@storybook/addon-actions";
import { Container } from "@mui/material";

export default {
  title: "Components/MatchDetails",
  component: MatchDetails,
  decorators: [
    (Story) => (
      <Container maxWidth="lg">
        <Story />
      </Container>
    ),
  ],
} as ComponentMeta<typeof MatchDetails>;

export const details = () => (
  <MatchDetails
    matchDetails={[
      {
        match_id: "1",
        matchDay: 2,
        matchWeek: "Week 1",
        gameLength: "29:23",
        teamA: {
          team_id: "1",
          name: "Team A",
          teamName: "Team A",
          totalPoints: 85,
          teamKills: 23,
          dragonKills: 15,
          riftHeralds: 11,
          turretKills: 10,
          baronKills: 19,
          didWin: false,
          inhibitorKills: 9,
        },
        teamB: {
          team_id: "2",
          name: "Team B",
          teamName: "Team B",
          totalPoints: 81,
          teamKills: 23,
          dragonKills: 15,
          riftHeralds: 11,
          turretKills: 10,
          baronKills: 19,
          didWin: false,
          inhibitorKills: 9,
        },
        teamAMembers: [
          {
            teamMember_id: 1,
            team: "Teamname",
            role: "cool role",
            name: "Blonk",
            totalPoints: 15,
            championName: "blink",
            kills: 4,
            assists: 95,
            deaths: 9,
            creepScore: 123,
          },
          {
            teamMember_id: 2,
            team: "Teamname",
            role: "A role",
            name: "Name 2",
            totalPoints: 19,
            championName: "Champ name",
            kills: 9,
            assists: 15,
            deaths: 2,
            creepScore: 123,
          },
        ],
        teamBMembers: [
          {
            teamMember_id: 2,
            name: "Manop",
            team: "Teamname",
            role: "cool role",
            totalPoints: 75,
            championName: "Champ Name 2",
            kills: 7,
            assists: 45,
            deaths: 2,
            creepScore: 723,
          },
          {
            teamMember_id: 3,
            name: "Name 3",
            team: "Teamname",
            role: "A role",
            totalPoints: 25,
            championName: "Champ Name 3",
            kills: 9,
            assists: 25,
            deaths: 2,
            creepScore: 223,
          },
        ],
      },
    ]}
  />
);
