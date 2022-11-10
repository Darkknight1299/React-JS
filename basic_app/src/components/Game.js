import React from "react";
import Board from "./Board";


export default class Game extends React.Component{
    constructor(){
        super()
        this.state={
            xIsNext: true, //first turn is of x(intitially)
            stepNumber: 0, //which turn is this
            history:[ //keeps track of states of boxes
                {squares: Array(9).fill(null)} //initially all zeroes but will get updates as to which index box is 'X' or '0',squares is the key used to access the array
            ],
            value:5
        }
    }

    changeState = () => {
        this.setState({
            value:6
        })
    }

    someFunction = () => {
        return 5
    }
    

    render(){
        console.log(this.state)
        const result=this.someFunction();
        return(
            <div className="game">
                <div className="game-board">
                    <Board value={result}/>
                    <button onClick={()=> this.changeState()}>Click Me!</button>
                </div>
            </div>
        )
    }
}