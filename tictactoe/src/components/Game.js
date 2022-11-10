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
            ]
        }
    }

    Reset= () =>{
        const history=this.state.history
        const current=history[history.length-1]
        const squares=current.squares

        for(let i=0;i<9;i++){
            squares[i]=null
        }

        this.setState({
            history:history.concat({
                squares:squares
            }),
            xIsNext:true,
            stepNumber:0
        })
    }

    handleClick = (i) =>{
        const history= this.state.history
        const current=history[history.length-1]
        const squares=current.squares

        const winner = calculateWinner(squares)

        if(winner || squares[i]){ //Wont change if we have a winner already or the box clicked already has a value
            return
        }

        squares[i]=this.state.xIsNext ? 'X' :'O'
        this.setState({
            history:history.concat({
                squares:squares
            }),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        })
    }

    render(){
        const history= this.state.history
        const current= history[history.length-1]
        let status
        const winner = calculateWinner(current.squares)
        if(winner){
            status= 'Winner is '+winner
        }
        else{
            let empty=9
            for(let i=0;i<9;i++){
                if(current.squares[i]){
                    empty--;
                }
            }
            if(empty>1){
                status='Next Player is '+(this.state.xIsNext?'X':'O')
            }
            else{
                status='Its a Tie!'
            }
        }


        return(
            <div className="game">
                <div className="game-board">
                    <Board clickAction={(i)=>this.handleClick(i)} squares={current.squares}/>
                </div>

                <div className="game-info">
                    <div>{status}</div>
                    <div><button onClick={()=>this.Reset()}>Reset!!</button></div>
                </div>
            </div>
        )
    }
}

function calculateWinner(squares){
    const possibilities=[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]

    for(let i=0;i<possibilities.length;i++){
        const [a,b,c]=possibilities[i]
        if(squares[a] && squares[a]==squares[b] && squares[b]==squares[c]){
            return squares[a]
        }
    }

    return null //No Winner yet
}