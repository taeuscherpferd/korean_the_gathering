import React from 'react'
import { useSelector } from 'react-redux'
import { AllAppState } from 'redux/types/reduxTypes'
import styles from './GameOverPage.module.scss'

interface GameOverPageProps { }

export const GameOverPage: React.FC<GameOverPageProps> = (props) => {
  const gameOverMessage = useSelector((x: AllAppState) => x.gameOverMessage)
  return (
    <div className={styles.GameOverPage}>
      {gameOverMessage}
    </div>
  )
}