import { HealthBar } from 'Components/HealthBar/HealthBar'
import { Timer } from 'Components/Timer/Timer'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AllAppState } from 'redux/types/reduxTypes'
import { GameStates } from 'types/enums/GameStates.enum'
import styles from './GamePage.module.scss'

interface GamePageProps { }

export const GamePage: React.FC<GamePageProps> = (props) => {
  const [currentHealth, setCurrentHealth] = useState(10)
  const [cardToDefendFrom, setCardToDefendFrom] = useState("")
  const [defenseResponse, setDefenseResponse] = useState("")
  const [cardsToPickFrom, setCardsToPickFrom] = useState<string[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)

  const socket = useSelector((x: AllAppState) => x.socket)
  const roomId = useSelector((x: AllAppState) => x.roomId)
  const dispatch = useDispatch();
  const setGameOverMessage = (message: string) => dispatch({ type: 'SET_GAME_OVER_MESSAGE', payload: message });
  const setGameState = (state: GameStates) => dispatch({ type: 'SET_GAME_STATE', payload: state });

  useEffect(() => {
    const onPickACardHandler = (cards: string[]) => {
      console.log("onPickACardHandler", cards)
      setCardsToPickFrom(cards)
    }
    const onDefendCardHandler = (defendFrom: string) => {
      setCardToDefendFrom(defendFrom)
    }
    const onGameOverHandler = (results: string) => {
      setGameOverMessage(results)
      setGameState(GameStates.GameOver)
    }

    const onUpdateTimeRemainingHandler = (time: number) => {
      setTimeRemaining(time)
    }

    const onHealthUpdateHandler = (health: number) => {
      setCurrentHealth(health);
    }

    socket?.on("pickACard", onPickACardHandler)
    socket?.on("defendCard", onDefendCardHandler)
    socket?.on("gameOver", onGameOverHandler)
    socket?.on("updateTimeRemaining", onUpdateTimeRemainingHandler)
    socket?.on("healthUpdate", onHealthUpdateHandler)

    return () => {
      socket?.off("onPickACard", onPickACardHandler)
      socket?.off("onDefendCard", onDefendCardHandler)
      socket?.off("gameOver", onGameOverHandler)
      socket?.off("updateTimeRemaining", onUpdateTimeRemainingHandler)
      socket?.off("healthUpdate", onHealthUpdateHandler)
    }
  }, [])

  const sendPickedCard = (card: string) => {
    console.log("wat")
    socket?.emit("pickedCard", { roomId: roomId, cardTerm: card })
    setCardsToPickFrom([])
  }

  const sendDefenseResponse = () => {
    //TODO: Find out what the actual event is
    socket?.emit("submitAnswer", { roomId: roomId, answer: defenseResponse })
    setDefenseResponse("")
    setCardToDefendFrom("")
  }

  const content = (() => {
    if (cardsToPickFrom.length > 0) {
      return (
        <>
          <span>Pick a card to attack with!</span>
          <div>
            {cardsToPickFrom.map((card, index) => {
              return <button key={index} onClick={() => sendPickedCard(card)} >
                {card}
              </button>
            })}
          </div>
        </>
      )
    }
    else if (cardToDefendFrom !== "") {
      return (
        <>
          <span>Defend by entering the correct definition before the timer runs out!</span>
          <Timer timeInSeconds={timeRemaining} />
          {cardToDefendFrom}
          <input type="text" value={defenseResponse} onChange={(e) => setDefenseResponse(e.target.value)} onSubmit={sendDefenseResponse}></input>
          <button onClick={sendDefenseResponse}>{"Submit"}</button>
        </>
      )
    }
    return <span>Waiting for other players to pick a card...</span>
  })()

  return (
    <div className={styles.gamePage}>
      <span>{"Health Bar"}</span>
      <HealthBar currentHealth={currentHealth} totalHealth={10} />
      {content}
    </div>
  )
}
