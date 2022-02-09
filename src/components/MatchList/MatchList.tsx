import { Collapse, Box, TableCell, TableRow, Container } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { MatchDetails } from '../MatchDetails/MatchDetails'
import { DateItem } from '../../../interfaces/DateItem'

const columns: GridColDef[] = [
  { field: 'id', headerName: ' ', minWidth: 100, width: 100 },
  { field: 'date', headerName: 'Date', minWidth: 140, flex: 0.3 },
  { field: 'gamesPlayed', headerName: 'Games', minWidth: 140, flex: 0.3 },
  { field: 'teamsParticipated', headerName: 'Teams', minWidth: 140, flex: 0.3 },
  { field: 'organization', headerName: 'Organization', minWidth: 230, flex: 1 }
]

const Row = (props: { row: DateItem }) => {
  let { row } = props
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ minWidth: '100px' }}>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ minWidth: '140px', width: '260px' }}>{row.date}</TableCell>
        <TableCell sx={{ minWidth: '140px', width: '270px' }}>{row.gamesPlayed}</TableCell>
        <TableCell sx={{ minWidth: '140px', width: '260px' }}>{row.teamsParticipated}</TableCell>
        <TableCell sx={{ minWidth: '230px', width: '640px' }}>{row.organization}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {row.matches.map((matches, idx) => {
                return <MatchDetails key={idx} matches={matches} />
              })}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export interface MatchListProps {
  dateItems: DateItem[]
}
const CustomToolbar: React.FunctionComponent<{
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>
}> = ({ setFilterButtonEl }) => (
  <GridToolbarContainer>
    <GridToolbarFilterButton sx={{ color: 'white' }} ref={setFilterButtonEl} />
  </GridToolbarContainer>
)

export const MatchList: React.FC<MatchListProps> = ({ dateItems }) => {
  const formattedRows = dateItems.map((dateItem, idx) => {
    dateItem['id'] = idx + 1
    return dateItem
  })

  const [filterButtonEl, setFilterButtonEl] = React.useState<HTMLButtonElement | null>(null)

  if (dateItems) {
    return (
      <Container maxWidth='xl' style={{ height: '86vh' }} disableGutters>
        <DataGrid
          columns={columns}
          // rows={formattedRows}
          rows={dateItems.map(dt => dt)}
          pageSize={5}
          rowsPerPageOptions={[5]}
          components={{ Toolbar: CustomToolbar, Row: Row }}
          componentsProps={{
            panel: {
              anchorEl: filterButtonEl
            },
            toolbar: {
              setFilterButtonEl
            }
          }}
          sx={[
            {
              '& .MuiDataGrid-virtualScroller': {
                '&::-webkit-scrollbar': {
                  width: '0.4em'
                },
                '&::-webkit-scrollbar-track': {
                  boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                  webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,.1)',
                  outline: '1px solid #0895A0'
                }
              }
            }
          ]}
        />
      </Container>
    )
  } else {
    return <div></div>
  }
}
