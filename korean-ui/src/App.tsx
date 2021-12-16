import axios from 'axios';
import { GameOverPage } from 'Containers/GameOverPage/GameOverPage';
import { GamePage } from 'Containers/GamePage/GamePage';
import { LobbyPage } from 'Containers/LobbyPage/LobbyPage';
import { LoginPage } from 'Containers/LoginPage/LoginPage';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AllAppState } from 'redux/types/reduxTypes';
import { ConnectionStates } from 'types/enums/ConnectionStates.enum';
import { GameStates } from 'types/enums/GameStates.enum';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState("")
  const gameState = useSelector((state: AllAppState) => state.gameState);
  const connectionState = useSelector((state: AllAppState) => state.connectionState);

  useEffect(() => {
    const makeTheCall = async () => {
      console.log("Making call")
      try {
        const res = await axios.get("http://192.168.1.16:8081/test")
        console.log(res)
      }
      catch (ex) {
        console.log(ex)
      }
      console.log("Finished")
    }
    makeTheCall()
  }, [])

  const currentGamePage = (() => {
    if (connectionState === ConnectionStates.Disconnected || connectionState === ConnectionStates.Connected && gameState === GameStates.FindingMatch) {
      return <LoginPage playerName={playerName} setPlayerName={setPlayerName} />
      // return <GamePage />
    }

    if (gameState === GameStates.SetupGame) {
      return <LobbyPage name={playerName} />
    }

    if (gameState === GameStates.Playing) {
      return <GamePage />
    }
    if (gameState === GameStates.GameOver) {
      return <GameOverPage />
    }
  })()

  return (
    <div className="App">
      {currentGamePage}
    </div>
  );
}

export default App;
