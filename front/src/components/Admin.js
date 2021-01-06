import React from 'react';
import Login from './Login.js';
import Update from './Update.js';
import Config from '../config.js';
import history from '../history.js';
import { withRouter } from 'react-router-dom';
class Admin extends React.Component {

    state = {"authenticated":false, "email":"", "password":""}

    constructor(props) {
        super(props);
        this.state = {"authenticated":false, "email":"", "password":""}

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
    }

    postData = (url, myJSON, callback) => {
        fetch(url, {   method: 'POST',
            headers : new Headers(),
            body:JSON.stringify(myJSON)})
            .then( (response) => response.json() )
            .then( (data) => {
                callback(data)
            })
            .catch ((err) => {
                    console.log("something went wrong ", err)
                }
            );
    }

    handlePassword = (e) => {
        this.setState({password:e.target.value})
    }
    handleEmail = (e) => {
        this.setState({email:e.target.value})
    }

    loginCallback = (data) => {
        if (data.status === 200) {
            this.setState({"authenticated":true, "token":data.token})
            localStorage.setItem('myToken', data.token);
           history.push('/author');
        }
    }

    componentDidMount() {
        if(localStorage.getItem('myToken')) {
            this.setState({"authenticated":true});
            window.location.href= "/author";
        }
    }

    updateCallback = (data) => {
        if (data.status !== 200) {
            this.setState({"authenticated":false})
            localStorage.removeItem('myToken');
        }
    }

    handleLoginClick = () => {
        const url = Config.apiUrl + '/login';
        let myJSON = {"email":this.state.email, "password":this.state.password}
        this.postData(url, myJSON, this.loginCallback)
    }

    handleLogoutClick = () => {
        this.setState({"authenticated":false})
        localStorage.removeItem('myToken');
    }

    handleUpdateClick = (film_id, description) => {
        const url = "http://192.168.64.2/code/week6b/a/api/update"

        if (localStorage.getItem('myToken')) {
            let myToken = localStorage.getItem('myToken')
            let myJSON = {
                "token":myToken,
                "film_id": film_id,
                "description":description
            }
            this.postData(url, myJSON, this.updateCallback)
        } else {
            this.setState({"authenticated":false})
        }
    }

    render() {
        let page = <Login handleLoginClick={this.handleLoginClick} email={this.state.email} password={this.props.password} handleEmail={this.handleEmail} handlePassword={this.handlePassword}/>
        if (this.state.authenticated) {
            page = <div>
                <button onClick={this.handleLogoutClick}>Log out</button>
                <Update handleUpdateClick={this.handleUpdateClick} />
            </div>
        }

        return (
            <div>
                <h1>Admin</h1>
                {page}
            </div>
        );
    }

}

export default withRouter(Admin);