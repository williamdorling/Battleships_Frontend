import './App.css';
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingContainer from './containers/LandingContainer';
import GameContainer from './containers/GameContainer';
import { useState, useEffect } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

function App() {

  const [game, setGame] = useState({}); 
  const [gridPlayerOne, setGridPlayerOne] = useState([]);
  const [gridPlayerTwo, setGridPlayerTwo] = useState([]);
  const [cellsGridPlayerOne, setCellsGridPlayerOne] = useState([]);
  const [cellsGridPlayerTwo, setCellsGridPlayerTwo] = useState([]);
  const [shipsPlayerOne, setShipsPlayerOne] = useState([]);
  const [shipsPlayerTwo, setShipsPlayerTwo] = useState([]);
  const [connectToMultiplayer, setConnectToMultiplayer] = useState(false);

  // Stores client data
  let socketClient = null;

  useEffect(() => {
    const fetchGame = async () =>{
      const response = await fetch("http://localhost:8080/games");
      const data = await response.json();
      setGame(data);
      let gridOddNumber;
      let gridEvenNumber;
      data.grids[0].id %2 === 0 ? gridOddNumber = data.grids[1] : gridOddNumber = data.grids[0];
      data.grids[0].id %2 === 0 ? gridEvenNumber = data.grids[0] : gridEvenNumber = data.grids[1];
      setGridPlayerOne(gridOddNumber);
      setGridPlayerTwo(gridEvenNumber);
      setCellsGridPlayerOne(gridOddNumber.cells);
      setCellsGridPlayerTwo(gridEvenNumber.cells);
    }
    fetchGame()
  }, [])

  // function to detail what happens when connection happens
  const onConnected = () => {
    // set state to true (maybe not necessary unless we need it for something)
    setConnectToMultiplayer(true);
    // send connection request to server
    socketClient.subscribe('/topic/game');
  }

  // method is passed down to multiplayer button (so websocket only works when multiplayer is clicked)
  const multiplayerEnabled = () => {
    // websocket connection request to the endpoint in the server
    let Sock = new SockJS('http://localhost:8080/multiplayer');
    // creates a websocket client
    socketClient = over(Sock);
    // creates connection and executes call back function
    socketClient.connect({}, onConnected);
  }

  const router = createBrowserRouter([
    {
      path:"/",
      element: (
        <LandingContainer 
        multiplayerEnabled={multiplayerEnabled}
        />
      )
    }, 
    {
      path:"/game",
      element: (
        <GameContainer 
        gridPlayerOne={gridPlayerOne}
        gridPlayerTwo={gridPlayerTwo}
        cellsGridPlayerOne={cellsGridPlayerOne}
        cellsGridPlayerTwo={cellsGridPlayerTwo}
        shipsPlayerOne={shipsPlayerOne}
        shipsPlayerTwo={shipsPlayerTwo}
        />
      )
    }
  ])

  return (
    <>
    <h1><a href="/">BATTLESHIPS</a></h1>
    <RouterProvider router={router}/> 
    </>
  );
}

export default App;
