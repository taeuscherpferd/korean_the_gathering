import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AllAppState } from 'redux/types/reduxTypes'
import { GameStates } from 'types/enums/GameStates.enum'
import styles from './LobbyPage.module.scss'

interface LobbyPageProps {
  name: string
}

export const LobbyPage: React.FC<LobbyPageProps> = (props) => {
  const { name } = props
  const [wordsToSubmit, setWordsToSubmit] = useState("")
  const [currentWordList, setCurrentWordList] = useState("")
  const [isWaitingForOtherPlayer, setIsWaitingForOtherPlayer] = useState(false)

  const socket = useSelector((x: AllAppState) => x.socket)
  const roomId = useSelector((x: AllAppState) => x.roomId)
  const dispatch = useDispatch();
  const setGameState = (state: GameStates) => dispatch({ type: 'SET_GAME_STATE', payload: state });


  useEffect(() => {
    const onNewWordsAddedHandler = (words: string) => {
      setCurrentWordList((x) => x ? x + "\n" + words : words)
    }

    const onGameStartedHandler = () => {
      setGameState(GameStates.Playing)
    }
    //TODO: Move this out
    const opponentDisconnectedHandler = () => {
      setGameState(GameStates.FindingMatch)
    }

    //TODO: Move this out
    const onErrorHandler = (error: string) => {
      alert(error)
    }

    const onWaitingForPlayersHandler = () => {
      setIsWaitingForOtherPlayer(true)
    }

    socket?.on("newWordsAdded", onNewWordsAddedHandler)
    socket?.on("opponentDisconnected", opponentDisconnectedHandler)
    socket?.on("gameStarted", onGameStartedHandler)
    socket?.on("waitingForPlayers", onWaitingForPlayersHandler)
    socket?.on("errorMessage", onErrorHandler)

    return () => {
      socket?.off("newWordsAdded", onNewWordsAddedHandler)
      socket?.off("gameStarted", onGameStartedHandler)
      socket?.off("opponentDisconnected", opponentDisconnectedHandler)
      socket?.off("errorMessage", onErrorHandler)
    }
  }, [])


  const onSubmitWords = () => {
    socket?.emit("addToList", { words: wordsToSubmit, roomId: roomId })
  }

  const onReadyClicked = () => {
    socket?.emit("startGame", { name, roomId })
  }

  return (
    <div className={styles.LobbyPage}>
      {isWaitingForOtherPlayer && <span>Waiting for other player</span>}
      <div className={styles.profile}>
        <div className={styles.vStack}>
          {name}
        </div>
      </div>
      <div className={styles.list}>
        <div className={styles.vStack}>
          {"list"}
          <textarea readOnly value={currentWordList} />
        </div>
      </div>
      <div className={styles.submitWords}>
        <div className={styles.vStack}>
          {"word submission"}
          <textarea value={wordsToSubmit} onChange={(e) => { setWordsToSubmit(e.target.value) }} />
          <button onClick={onSubmitWords}>{"Submit"}</button>
          <button onClick={onReadyClicked}>{"Ready"}</button>
        </div>
      </div>
    </div>
  )
}
