import styled from 'styled-components'
import { useEffect, useState } from 'react'

import { POLL_DURATION } from '../constants'
import { stats } from '../utils'
import { Title, Body } from '../components/Type'

const StyledWallet = styled.span`
  padding: 0.5rem;
  border-radius: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: white;
`

const StatsTitle = styled.span`
  text-decoration: none;
  font-weight: 600;
  opacity: 1;
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: -4px;
  margin-bottom: 1rem;
`

const Stat = styled.span`
  padding: 1rem 0;
`

const Value = styled(Title)`
  font-size: 96px;
  font-weight: 900;
  font-style: italic;
  margin: 0;
  @media only screen and (max-width: 480px) {
    font-size: 72px;
  }
`

const Description = styled(Body)`
  font-size: 24px;
  margin: 0;
`

let cachedTransactionCount

export default function Stats() {
  const [transactionCount, setTransactionCount] = useState()
  useEffect(() => {
    cachedTransactionCount = transactionCount
  }, [transactionCount])

  const [transactionCountError, setTransactionCountError] = useState()
  useEffect(() => {
    function updateCount() {
      stats()
        .then(setTransactionCount)
        .catch(error => {
          console.error(error)
          setTransactionCountError(true)
        })
    }

    updateCount()
    const interval = setInterval(updateCount, POLL_DURATION)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const [showLoader, setShowLoader] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true)
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const currentTransactionCount = transactionCount || cachedTransactionCount

  return (
    <StyledWallet>
      <StatsTitle>
        <Description textStyle={'gradient'}>OVM Stats</Description>
      </StatsTitle>
      {!currentTransactionCount && !transactionCountError && showLoader ? (
        <Description textStyle={'gradient'}>Loading...</Description>
      ) : null}
      {transactionCountError && !currentTransactionCount ? (
        <Description textStyle={'gradient'}>There was an error, please try again.</Description>
      ) : null}
      {currentTransactionCount ? (
        <>
          <Stat>
            <Value textStyle={'gradient'}>{currentTransactionCount}</Value>
            <Description textStyle={'gradient'}>total transactions</Description>
          </Stat>
          <Stat>
            <Value textStyle={'gradient'}>{((currentTransactionCount * 80000 * 20) / 10 ** 9).toFixed(4)}</Value>
            <Description textStyle={'gradient'}>ether saved on gas</Description>
          </Stat>
          <Stat>
            <Value textStyle={'gradient'}>{Math.round(currentTransactionCount * 1.75)}</Value>
            <Description textStyle={'gradient'}>fewer minutes waiting</Description>
          </Stat>
        </>
      ) : null}
    </StyledWallet>
  )
}
