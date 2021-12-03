import React from 'react'
import styles from './HealthBar.module.scss'

interface HealthBarProps {
  totalHealth: number
  currentHealth: number
}

export const HealthBar: React.FC<HealthBarProps> = (props) => {
  const { totalHealth, currentHealth } = props
  const healthPercentage = (currentHealth / totalHealth) * 100
  return (
    <div className={styles.HealthBar}>
      <div className={styles.filler} style={{ width: `${healthPercentage}%` }} />
    </div>
  )
}
