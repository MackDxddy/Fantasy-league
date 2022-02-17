import * as React from 'react'
import { NextPage } from 'next'
import { MatchList } from '../components/MatchList/MatchList'
import { Grid, Box, Container, Snackbar, Button } from '@mui/material'
import { secureLoader, useAPIPost } from 'lib/api'
import { DateItem } from '../../interfaces/DateItem'
import axios from 'axios'
import useSWR, { useSWRConfig } from 'swr'
import useSWRImmutable from 'swr/immutable'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const URL = '/api/esports'

export interface SubscribeHeroProps {
  isFetching?: boolean
  hasError?: boolean
}

interface FetchedData {
  DateItems: DateItem[]
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const IndexPage: NextPage<SubscribeHeroProps> = ({ isFetching, hasError }) => {
  const [shouldFetch, setShouldFetch] = React.useState(false)
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(false)

  // For snackbars
  const [openSuccess, setOpenSuccess] = React.useState(false)
  const [openFailure, setOpenFailure] = React.useState(false)
  const [openFetch, setOpenFetch] = React.useState(false)
  const [openPost, setOpenPost] = React.useState(false)

  // For fetching
  const saveData = useAPIPost<void, { dataItem: DateItem[] }>(URL)
  const { mutate } = useSWRConfig()

  React.useEffect(() => {
    if (!data) {
      handleFetch()
    }
    if (saveData.posted) {
      setOpenSuccess(true)
      if (openPost) {
        setOpenPost(false)
      }
      saveData.reset()
    }
    if (saveData.posting) {
      if (openSuccess) {
        setOpenPost(false)
      } else {
        setOpenPost(true)
      }
    }
    if (saveData.error) {
      console.error('error occurred', saveData.error)
      saveData.reset()
      setOpenFailure(true)
    }
    if (shouldFetch) {
      setOpenFetch(true)
      setShouldFetch(false)
    }
    mutate(URL)
  }, [saveData.posted, shouldFetch, saveData.posting])

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSuccess(false)
    setOpenFailure(false)
    setOpenFetch(false)
    setOpenPost(false)
  }

  const handleFetch = () => {
    setOpenFetch(true)
    if (!data) {
      axios
        .get(URL, {
          params: { type: 'initial' },
          timeout: 35000
        })
        .then(resp => {
          setData(resp.data)
        })
        .catch(err => {
          console.error(err)
          setError(true)
        })
        .finally(() => setOpenFetch(false))
    } else {
      axios
        .get(URL, {
          timeout: 35000
        })
        .then(resp => {
          setData(resp.data)
        })
        .catch(err => {
          console.error(err)
          setError(true)
        })
        .finally(() => setOpenFetch(false))
    }
  }

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <Container
      sx={{
        maxWidth: '95%',
        height: '100%'
      }}
      disableGutters
      maxWidth={false}
    >
      <Grid
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <MatchList dateItems={data.DateItems || []} />
        <Box display='flex' flexDirection='row' justifyContent='center'>
          <Button
            onClick={handleFetch}
            variant='contained'
            sx={[
              {
                marginTop: '25px',
                maxWidth: '15%',
                marginRigth: '15px',
                border: '0.05px solid #66ff74'
              },
              {
                '&:hover': {
                  backgroundColor: '#151D15'
                }
              }
            ]}
            color='primary'
            disabled={shouldFetch ? true : false}
          >
            Fetch New Data
          </Button>
          <Button
            onClick={async () => {
              saveData.post({ dataItem: data.DateItems })
            }}
            variant='contained'
            sx={[
              {
                marginTop: '25px',
                maxWidth: '15%',
                marginLeft: '15px',
                border: '0.05px solid #0895A0'
              },
              {
                '&:hover': {
                  backgroundColor: '#0A1929'
                }
              }
            ]}
            color='primary'
          >
            Update Database
          </Button>
        </Box>
      </Grid>
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          Data saved successfully! 👍
        </Alert>
      </Snackbar>
      <Snackbar open={openFailure} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          Could not save data!
        </Alert>
      </Snackbar>
      <Snackbar open={openFetch} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity='info'
          sx={{ width: '100%', backgroundColor: '#000', border: '0.05px solid #66ff74' }}
        >
          Fetching new data...
        </Alert>
      </Snackbar>
      <Snackbar open={openPost} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity='info'
          sx={{ width: '100%', backgroundColor: '#000', border: '0.05px solid #0895A0' }}
        >
          Updating database...
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default IndexPage
