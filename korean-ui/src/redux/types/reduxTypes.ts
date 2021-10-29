import { INIT_APP, SET_CONNECTION_STATE, SET_GAME_STATE, SET_SOCKET } from "redux/actions/appActions";
import { Socket } from "socket.io-client";
import { ConnectionStates } from "types/enums/ConnectionStates.enum";
import { GameStates } from "types/enums/GameStates.enum";

export interface AppState {
  connectionState: ConnectionStates
  gameState: GameStates
  socket: Socket | null
}

interface SetGameState {
  type: typeof SET_GAME_STATE,
  payload: GameStates
}

interface SetConnectionState {
  type: typeof SET_CONNECTION_STATE,
  payload: ConnectionStates
}

interface SetSocket {
  type: typeof SET_SOCKET,
  payload: Socket
}

interface InitApp {
  type: typeof INIT_APP,
  payload: null
}

export type AppActionTypes = SetConnectionState | InitApp | SetSocket | SetGameState

export type AllActionTypes = AppActionTypes

export type AllAppState = AppState