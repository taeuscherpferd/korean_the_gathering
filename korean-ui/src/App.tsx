import axios from 'axios';
import { LoginPage } from 'Containers/LoginPage/LoginPage';
import React, { useEffect } from 'react';
import './App.css';

function App() {
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

  return (
    <div className="App">
      <LoginPage />
    </div>
  );
}

export default App;
