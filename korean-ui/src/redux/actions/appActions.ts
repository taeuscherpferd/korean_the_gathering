import { AppActionTypes } from "redux/types/reduxTypes";
import { Socket } from "socket.io-client";
import { ConnectionStates } from "types/enums/ConnectionStates.enum";
import { GameStates } from "types/enums/GameStates.enum";

export const SET_CONNECTION_STATE = "SET_CONNECTION_STATE";
export const SET_GAME_STATE = "SET_GAME_STATE";
export const INIT_APP = "INIT_APP";
export const SET_SOCKET = "SET_SOCKET";

export const setConnectionState = (newState: ConnectionStates): AppActionTypes => ({
  type: SET_CONNECTION_STATE,
  payload: newState
})

export const initApp = (): AppActionTypes => ({
  type: INIT_APP,
  payload: null
})

export const setSocket = (newSocket: Socket): AppActionTypes => ({
  type: SET_SOCKET,
  payload: newSocket
})

export const setGameState = (newState: GameStates): AppActionTypes => ({
  type: SET_GAME_STATE,
  payload: newState
})