import React, { Component } from "react";

class C extends Component {
    constructor(props) {
        console.log('Child1-->constructor:', props);
        super(props);
        this.state = {
            a: props
        };
    }

    componentDidMount() {
        console.log('Child1-->componentDidMount挂载完毕', this.state);
    }

    render() {
        return <>
            子组件呀
        </>
    }
}

export default C;