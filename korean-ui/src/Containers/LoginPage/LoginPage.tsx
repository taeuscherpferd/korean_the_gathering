import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AllAppState } from 'redux/types/reduxTypes'
import { GameStates } from 'types/enums/GameStates.enum'
import styles from './LoginPage.module.scss'

interface LoginPageProps {
}

export const LoginPage: React.FC<LoginPageProps> = (props) => {
  const [roomId, setRoomId] = useState("")
  const [name, setName] = useState("")
  const [showWaitingMessage, setShowWaitingMessage] = useState(false)
  const [creatingRoom, setCreatingRoom] = useState(false)
  const [joiningRoom, setJoiningRoom] = useState(false)
  const dispatch = useDispatch();
  const setGameState = () => dispatch({ type: 'SET_GAME_STATE', payload: GameStates.SetupGame });
  const socket = useSelector((x: AllAppState) => x.socket)

  useEffect(() => {
    const onRoomCreatedHandler = () => {
      socket?.emit("joinRoom", { roomId, name })
    }

    const onRoomJoinedWaiting = () => {
      setShowWaitingMessage(true)
    }

    const onRoomJoinedSetupGame = () => {
      console.log("game starting...")
      setShowWaitingMessage(false)
      setGameState()
    }

    const onErrorHandler = (error: string) => {
      alert(error)
      setJoiningRoom(false)
      setCreatingRoom(false)
    }

    socket?.on("roomCreated", onRoomCreatedHandler)
    socket?.on("errorMessage", onErrorHandler)
    socket?.on("waitingForPlayers", onRoomJoinedWaiting)
    socket?.on("setupGame", onRoomJoinedSetupGame)

    return () => {
      socket?.off("roomCreated", onRoomCreatedHandler)
      socket?.off("errorMessage", onErrorHandler)
      socket?.off("waitingForPlayers", onRoomJoinedWaiting)
      socket?.off("setupGame", onRoomJoinedSetupGame)
    }
  }, [name, roomId, socket])

  const onJoinRoomClick = () => {
    setJoiningRoom(true)
    socket?.emit("joinRoom", { roomId: roomId, name: name })
  }

  const onCreateRoomClick = () => {
    setCreatingRoom(true)
    socket?.emit("createRoom", { roomId: roomId, name: name })
  }

  const onCancelHostClick = () => {
    setCreatingRoom(false)
    socket?.emit("cancelHost", { roomId: roomId, name: name })
  }

  const feedback = (<div>{"Waiting for players....."}</div>)

  const CancelButton = (
    creatingRoom ? <button onClick={onCancelHostClick}>Cancel</button> : null
  )

  return (
    <div className={styles.LoginPage}>
      {showWaitingMessage ? feedback : null}
      <span>Name</span>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <span>Room Name</span>
      <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      <button disabled={roomId === "" || name === "" || creatingRoom || joiningRoom} onClick={onCreateRoomClick}>Create Room</button>
      <button disabled={roomId === "" || name === "" || creatingRoom || joiningRoom} onClick={onJoinRoomClick}>Join a Room</button>
      {CancelButton}
    </div>
  )
}
