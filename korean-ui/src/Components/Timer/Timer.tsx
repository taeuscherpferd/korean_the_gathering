import React from 'react'
import styles from './Timer.module.scss'

interface TimerProps {
  timeInSeconds: number
}

export const Timer: React.FC<TimerProps> = (props) => {
  const { timeInSeconds } = props

  return (
    <div className={styles.Timer}>
      {`${timeInSeconds}s`}
    </div>
  )
}