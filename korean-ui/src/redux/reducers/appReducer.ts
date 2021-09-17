import { SET_CONNECTION_STATE, SET_SOCKET } from "redux/actions/appActions"
import { AppActionTypes, AppState } from "redux/types/reduxTypes"
import { ConnectionStates } from "types/enums/ConnectionStates.enum"

const initialState: AppState = {
  connectionState: ConnectionStates.Disconnected,
  socket: null
}

export const AppReducer = (state = initialState, action: AppActionTypes) => {
  switch (action.type) {
    case SET_CONNECTION_STATE: {
      return {
        ...state,
        connectionState: action.payload
      }
    }
    case SET_SOCKET: {
      return {
        ...state,
        socket: action.payload
      }
    }
  }
  return state
}