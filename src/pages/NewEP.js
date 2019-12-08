import React from 'react';
import { HashRouter, BrowserRouter, Route } from 'react-router-dom'
import Form from '../components/Form'

class NewEP extends React.Component{    
    render() {
        return (
            <HashRouter basename='/'>
                <div className="container">
                    <BrowserRouter >                
                        <Route path={"/gv"} component={(props) => <Form program ="gv" params={props}/>}/>
                        <Route path="/gt" component={(props) => <Form program ="gt" params={props}/>}/>
                        <Route path="/ge" component={(props) => <Form program ="ge" params={props}/>}/>
                    </BrowserRouter>
                </div>    
            </HashRouter>
        );
    }
}

export default NewEP;