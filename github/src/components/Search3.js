import React from 'react';

class Search3 extends React.Component{
    
    handleKeyDown = (e) =>{
        if(e.keyCode==13){ //13-return key or enter key code
            const value=e.target.value;
            alert('The Value of the inputfield is '+value);
        }
    };

    render(){
        return <input  onKeyDown={this.handleKeyDown} type="text" name="username" placeholder="Enter Username" />
    }

}

export default Search3;