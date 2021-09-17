import { INIT_APP, SET_CONNECTION_STATE, SET_SOCKET } from "redux/actions/appActions";
import { Socket } from "socket.io-client";
import { ConnectionStates } from "types/enums/ConnectionStates.enum";

export interface AppState {
  connectionState: ConnectionStates
  socket: Socket | null
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



export type AppActionTypes = SetConnectionState | InitApp | SetSocket

export type AllActionTypes = AppActionTypes


export type AllAppState = AppState