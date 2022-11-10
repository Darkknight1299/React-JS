import React from "react";
import Square from "./Square";

export default function Board(props){
    return(
        <div>
            <div className="border-row">
                <Square inner={props.value}/>
                <Square/>
                <Square/>
            </div>
            <div className="border-row">
                <Square/>
                <Square/>
                <Square/>
            </div>
            <div className="border-row">
                <Square/>
                <Square/>
                <Square/>
            </div>
        </div>
    )
}