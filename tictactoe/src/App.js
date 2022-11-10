import './App.css';
import Game from './components/Game';
import React from 'react';
import { render } from 'react-dom';

/*class App extends React.Component{
  render(){
    return(
      <div>I'm a class Component</div>
    )
  }
}*/

function App() {
  return (
    <Game/>
  );
}

export default App;
