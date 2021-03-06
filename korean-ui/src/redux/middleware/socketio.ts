import { INIT_APP, SET_CONNECTION_STATE, SET_GAME_STATE, SET_SOCKET } from 'redux/actions/appActions';
import { AllActionTypes } from 'redux/types/reduxTypes';
import io, { Socket } from 'socket.io-client';
import { ConnectionStates } from 'types/enums/ConnectionStates.enum';
import { GameStates } from 'types/enums/GameStates.enum';

const EMIT_MESSAGE = 'socket-io/EMIT_MESSAGE';

let SocketInstance: Socket

export function emitMessage(eventName: string, message: string) {
  return {
    type: EMIT_MESSAGE,
    payload: { eventName, message }
  };
}

const createWebSocketMiddleware = (store: any) =>
  (next: (action: AllActionTypes) => AllActionTypes) =>
    async (action: AllActionTypes) => {
      const curState = store.getState()
      if (action.type === INIT_APP) {
        try {
          SocketInstance = io("http://192.168.1.16:8081")
          if (SocketInstance) {
            store.dispatch({ type: SET_CONNECTION_STATE, payload: ConnectionStates.Connected })
            console.log("middleware", SocketInstance)
            store.dispatch({ type: SET_SOCKET, payload: SocketInstance })

            SocketInstance.on('disconnect', () => {
              store.dispatch({ type: SET_CONNECTION_STATE, payload: ConnectionStates.Disconnected })
              store.dispatch({ type: SET_SOCKET, payload: null })
              store.dispatch({ type: SET_GAME_STATE, payload: GameStates.FindingMatch })
              alert("Server disconnected")
            })
            //TODO: Implement this
            // SocketInstance.on('opponentDisconnected', () => {

            // })
          }
        }
        catch (ex) {
          console.log(ex)
        }
      }
      return next(action)
    }


export default createWebSocketMiddleware;