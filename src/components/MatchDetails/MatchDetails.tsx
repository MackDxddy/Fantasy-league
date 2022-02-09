import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import Box from '@mui/material/Box'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Container from '@mui/material/Container'
import { Matches } from '../../../interfaces/Matches'

interface MatchDetailsProps {
  matches: Matches
}

const statusColors = {
  winner: '#66ff74',
  winnerPlayer: '#ADFFB5',
  winnerGlow: '0 0 0.15rem #66ff74',
  loser: '#FF3131',
  loserPlayer: '#FB7F7F',
  loserGlow: '0 0 0.15rem #FF3131'
}

export const MatchDetails: React.FC<MatchDetailsProps> = ({ matches }) => {
  return (
    <Accordion defaultExpanded sx={{ marginBottom: '15px' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography variant='h6'>
          <Typography
            component='span'
            variant='h6'
            sx={{
              color: statusColors[matches.teamA.didWin ? 'winner' : 'loser'],
              fontWeight: 'bold',
              textShadow: statusColors[matches.teamA.didWin ? 'winnerGlow' : 'loserGlow']
            }}
          >
            {matches.teamA.teamName}
          </Typography>{' '}
          <Typography component='span' variant='h6' sx={{ fontWeight: 'bold', color: '#C7C7C7' }}>
            vs.{' '}
          </Typography>
          <Typography
            component='span'
            variant='h6'
            sx={{
              fontWeight: 'bold',
              color: statusColors[matches.teamB.didWin ? 'winner' : 'loser'],
              textShadow: statusColors[matches.teamB.didWin ? 'winnerGlow' : 'loserGlow']
            }}
          >
            {matches.teamB.teamName}
          </Typography>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Container
                maxWidth={false}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  marginTop: '15px',
                  marginBottom: '15px'
                }}
              >
                <Typography>
                  <Box component='span'>
                    <Typography
                      component='span'
                      variant='body1'
                      sx={{
                        fontWeight: 'bold',
                        color: statusColors[matches.teamA.didWin ? 'winner' : 'loser']
                      }}
                    >
                      {matches.teamA.teamName} Pts
                    </Typography>
                  </Box>
                  {matches.teamAPlayers.map((member, memberIdx) => (
                    <Box key={memberIdx} component='span' sx={{ paddingLeft: '14px' }}>
                      <Typography component='span'>-</Typography>
                      <Typography
                        component='span'
                        sx={{
                          paddingLeft: '14px',
                          color: statusColors[matches.teamA.didWin ? 'winnerPlayer' : 'loserPlayer']
                        }}
                      >
                        {member === null ? 'null' : member.name}:
                      </Typography>
                      <Typography component='span' sx={{ paddingLeft: '8px', color: '#E368FA' }}>
                        {member === null ? 'null' : member.totalPoints}
                      </Typography>
                    </Box>
                  ))}
                  <Typography
                    component='span'
                    sx={{
                      paddingLeft: '48px',
                      color: '#0895A0',
                      fontWeight: 'bold'
                    }}
                  >
                    Total: {matches.teamA.totalPoints}
                  </Typography>
                </Typography>
              </Container>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ paddingTop: '10px' }}>
                {matches.teamAPlayers.map((member, memberIdx) => (
                  <Box key={memberIdx}>
                    <Box>
                      <Container
                        maxWidth={false}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Typography
                          component='span'
                          variant='h6'
                          sx={{
                            fontWeight: 'semi-bold',
                            textAlign: 'center',
                            color: '#3397FF'
                          }}
                        >
                          {member === null ? 'null' : member.name}
                        </Typography>{' '}
                        <Typography component='span' sx={{ padding: '0 14px' }}>
                          _
                        </Typography>
                        <Typography
                          component='span'
                          variant='h6'
                          sx={{ fontWeight: 'bold', color: '#0895A0' }}
                        >
                          Total Points: {member === null ? 'null' : member.totalPoints}
                        </Typography>
                      </Container>
                    </Box>
                    <Container
                      maxWidth={false}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '18px 0'
                      }}
                    >
                      <Box>
                        <Typography
                          component='span'
                          variant='body1'
                          sx={{ paddingRight: '8px', color: '#AA7FFB ' }}
                        >
                          Champion:
                        </Typography>
                        <Typography component='span'>
                          {member === null ? 'null' : member.championName}
                        </Typography>
                        <Typography
                          component='span'
                          variant='body1'
                          sx={{
                            paddingRight: '8px',
                            color: '#FB7F7F ',
                            paddingLeft: '36px'
                          }}
                        >
                          Kills:
                        </Typography>
                        <Typography component='span'>
                          {member === null ? 'null' : member.kills}
                        </Typography>
                        <Typography
                          component='span'
                          variant='body1'
                          sx={{
                            paddingRight: '8px',
                            color: '#AA7FFB ',
                            paddingLeft: '36px'
                          }}
                        >
                          Assists:
                        </Typography>
                        <Typography component='span'>
                          {member === null ? 'null' : member.assists}
                        </Typography>
                        <Typography
                          component='span'
                          variant='body1'
                          sx={{
                            paddingRight: '8px',
                            color: '#FB7F7F ',
                            paddingLeft: '36px'
                          }}
                        >
                          Deaths:
                        </Typography>
                        <Typography component='span'>
                          {member === null ? 'null' : member.deaths}
                        </Typography>
                        <Typography
                          component='span'
                          variant='body1'
                          sx={{
                            paddingRight: '8px',
                            color: '#AA7FFB ',
                            paddingLeft: '36px'
                          }}
                        >
                          CreepScore:
                        </Typography>
                        <Typography component='span'>
                          {member === null ? 'null' : member.creepScore}
                        </Typography>
                      </Box>
                    </Container>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Container
                maxWidth={false}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-evenly',
                  marginTop: '15px',
                  marginBottom: '15px'
                }}
              >
                <Typography>
                  <Box component='span'>
                    <Typography
                      component='span'
                      variant='body1'
                      sx={{
                        fontWeight: 'bold',
                        color: statusColors[matches.teamB.didWin ? 'winner' : 'loser']
                      }}
                    >
                      {matches.teamB.teamName} Pts
                    </Typography>
                  </Box>
                  {matches.teamBPlayers.map((member, memberIdx) => (
                    <Box key={memberIdx} component='span' sx={{ paddingLeft: '14px' }}>
                      <Typography component='span'>-</Typography>
                      <Typography
                        component='span'
                        sx={{
                          paddingLeft: '14px',
                          color: statusColors[matches.teamB.didWin ? 'winnerPlayer' : 'loserPlayer']
                        }}
                      >
                        {member === null ? 'null' : member.name}:
                      </Typography>
                      <Typography component='span' sx={{ paddingLeft: '8px', color: '#E368FA' }}>
                        {member === null ? 'null' : member.totalPoints}
                      </Typography>
                    </Box>
                  ))}
                  <Typography
                    component='span'
                    sx={{
                      paddingLeft: '48px',
                      color: '#0895A0',
                      fontWeight: 'bold'
                    }}
                  >
                    Total: {matches.teamB.totalPoints}
                  </Typography>
                </Typography>
              </Container>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ paddingTop: '36px' }}>
                {matches.teamBPlayers.map((member, memberIdx) => (
                  <Box key={memberIdx}>
                    <Box>
                      <Container
                        maxWidth={false}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Typography
                          component='span'
                          variant='h6'
                          sx={{
                            fontWeight: 'semi-bold',
                            textAlign: 'center',
                            color: '#ff6f6f'
                          }}
                        >
                          {member === null ? 'null' : member.name}:
                        </Typography>{' '}
                        <Typography component='span' sx={{ padding: '0 14px' }}>
                          _
                        </Typography>
                        <Typography
                          component='span'
                          variant='h6'
                          sx={{ fontWeight: 'bold', color: '#0895A0' }}
                        >
                          Total Points: {member === null ? 'null' : member.totalPoints}
                        </Typography>
                      </Container>
                    </Box>
                    <Container
                      maxWidth={false}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '18px 0'
                      }}
                    >
                      <Box>
                        <Typography
                          component='span'
                          variant='body1'
                          sx={{ paddingRight: '8px', color: '#AA7FFB ' }}
                        >
                          Champion:
                        </Typography>
                        <Typography component='span'>
                          {member === null ? 'null' : member.championName}
                        </Typography>
                        <Typography
                          component='span'
                          variant='body1'
                          sx={{
                            paddingRight: '8px',
                            color: '#FB7F7F ',
                            paddingLeft: '36px'
                          }}
                        >
                          Kills:
                        </Typography>
                        <Typography component='span'>
                          {member === null ? 'null' : member.kills}
                        </Typography>
                        <Typography
                          component='span'
                          variant='body1'
                          sx={{
                            paddingRight: '8px',
                            color: '#AA7FFB ',
                            paddingLeft: '36px'
                          }}
                        >
                          Assists:
                        </Typography>
                        <Typography component='span'>
                          {member === null ? 'null' : member.assists}
                        </Typography>
                        <Typography
                          component='span'
                          variant='body1'
                          sx={{
                            paddingRight: '8px',
                            color: '#FB7F7F ',
                            paddingLeft: '36px'
                          }}
                        >
                          Deaths:
                        </Typography>
                        <Typography component='span'>
                          {member === null ? 'null' : member.deaths}
                        </Typography>
                        <Typography
                          component='span'
                          variant='body1'
                          sx={{
                            paddingRight: '8px',
                            color: '#AA7FFB ',
                            paddingLeft: '36px'
                          }}
                        >
                          CreepScore:
                        </Typography>
                        <Typography component='span'>
                          {member === null ? 'null' : member.creepScore}
                        </Typography>
                      </Box>
                    </Container>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}
