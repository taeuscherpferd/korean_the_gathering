import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AllAppState } from 'redux/types/reduxTypes'
import styles from './LoginPage.module.scss'

interface LoginPageProps {
}

export const LoginPage: React.FC<LoginPageProps> = (props) => {
  let userID = "bleh"
  const [roomId, setRoomId] = useState("")
  const [name, setName] = useState("")
  const [creatingRoom, setCreatingRoom] = useState(false)
  const [joiningRoom, setJoiningRoom] = useState(false)
  const socket = useSelector((x: AllAppState) => x.socket)

  useEffect(() => {

  }, [])

  const onJoinRoomClick = () => {

  }

  const onCreateRoomClick = () => {

  }

  const onCancelHostClick = () => {

  }


  const feedback = (<div></div>)

  const CancelButton = (
    creatingRoom ? <button onClick={onCancelHostClick}>Cancel</button> : null
  )

  return (
    <div className={styles.LoginPage}>
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
