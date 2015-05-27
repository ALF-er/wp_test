import React from "react"
import Component from "components/component/Component"
import "./App.styl"

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app">
                <Component />
                <Component />
            </div>
        );
    }

}
