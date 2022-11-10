import React from "react";

class TestComponent extends React.PureComponent{
    constructor(props){
        super(props);
        console.log('I am a constructor');
    }

    static getDerivedStateFromProps(props,state){
        console.log('I am in DerivedStateFromProps');

        return {pageSize: props.pageSize};
    }

    componentDidMount(){
        console.log('I am in componentDidMount');
    }

    /*shouldComponentUpdate(){
        console.log('I am in shouldUpdateComponent')
        return true;
    }*/

    static getSnapshotBeforeUpdate(prevProps,prevState){
        console.log('I am in getSnapshotBeforeUpdate', prevProps, prevState);
    }

    componentDidUpdate(){
        console.log('I am in componentDidUpdate');
    }

    componentWillUnmount(){
        console.log('Going to be removed');
    }

    render(){
        console.log('I am render function');
        return 'I am render function'; 
    }
}

export default TestComponent;