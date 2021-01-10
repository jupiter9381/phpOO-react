import React from 'react';
import Search from "./Search";
import Session from "./Session";
import Config from '../config';
import { isAuthenticated, clearAndGoAdmin } from './utils.js'

class Sessions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page:1,
            pageSize:15,
            query:"",
            rating:"",
            language:"",
            data:[],
            selected_sessionname: "",
            selected_sessionId: "",
            user: {},
            token: ""
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleLanguageSelect = this.handleLanguageSelect.bind(this);
    }

    componentDidMount() {
        if(!isAuthenticated()) window.location.href="/admin";
        this.setState({user: JSON.parse(localStorage.getItem("user"))});
        this.setState({token:localStorage.getItem("myToken")});
        const url = Config.apiUrl + "/sessions";
        fetch(url, {
            method: 'post',
            body: JSON.stringify({token: localStorage.getItem("myToken")})
        })
            .then( (response) => response.json() )
            .then( (data) => {
                this.setState({data:data.data})
            })
            .catch ((err) => {
                    clearAndGoAdmin();
                    console.log("something went wrong ", err)
                }
            );
    }

    handleMoreClick = () => {
        this.setState({page:this.state.page+1})
    }

    handlePreviousClick = () => {
        this.setState({page:this.state.page-1})
    }

    handleNextClick = () => {
        this.setState({page:this.state.page+1})
    }

    handleSearch = (e) => {
        this.setState({page:1,query:e.target.value})
    }

    searchString = (s) => {
        return s.toLowerCase().includes(this.state.query.toLowerCase())
    }

    searchDetails = (details) => {
        return ((this.searchString(details.name) ))
    }

    handleSelect = (e) => {
        this.setState({page:1,rating:e.target.value})
    }

    handleLanguageSelect = (e) => {
        this.setState({page:1, language:e.target.value})
    }

    selectDetails = (details) => {
        return ((this.state.rating === details.rating) || (this.state.rating === ""))
    }

    selectLanguageDetails = (details) => {
        return ((this.state.language === details.language) || (this.state.language === ""))
    }

    handleSessionClick = (detail) => {
        this.setState({selected_sessionname: detail.name, selected_sessionId: detail.sessionId});
    }

    handleUpdateSession = () => {
        const url = Config.apiUrl + "/sessions?sessionId="+this.state.selected_sessionId+"&name="+this.state.selected_sessionname;
        fetch(url)
            .then( (response) => response.json() )
            .then( (data) => {
                this.setState({selected_sessionname: "", selected_sessionId: ""})
                this.setState({data:data.data});
            })
            .catch ((err) => {
                    console.log("something went wrong ", err)
                }
            );
    }

    handleSessionNameChange = (e) => {
        this.setState({selected_sessionname: e.target.value})
    }
    render() {

        let filteredData =  (
            this.state.data
                .filter(this.selectLanguageDetails)
                .filter(this.selectDetails)
                .filter(this.searchDetails)
        )

        let noOfPages = Math.ceil(filteredData.length/this.state.pageSize)
        if (noOfPages === 0) {noOfPages=1}
        let disabledPrevious = (this.state.page <= 1)
        let disabledNext = (this.state.page >= noOfPages)

        return (
            <div>
                <h1>Sessions</h1>
                <Search query={this.state.query} handleSearch={this.handleSearch}/>
                {
                this.state.user.admin === "1"?(
                    <div className="row mt-3">
                        <div className="col-md-12">
                            Session Title: &nbsp;
                            <input type="text" value={this.state.selected_sessionname} onChange={this.handleSessionNameChange}></input>
                            <button className="btn btn-primary ml-2" onClick={this.handleUpdateSession}>Update</button>
                        </div>
                    </div>)
                    :(<></>)
                }
                {
                    filteredData
                        .slice(((this.state.pageSize*this.state.page)-this.state.pageSize),(this.state.pageSize*this.state.page))
                        .map( (details, i) => (<Session key={i} details={details} onClick={this.handleSessionClick}/>) )
                }
                
                
                <button onClick={this.handlePreviousClick} disabled={disabledPrevious}>Previous</button>
                Page {this.state.page} of {noOfPages}
                <button onClick={this.handleNextClick} disabled={disabledNext}>Next</button>
            </div>
        );
    }
}
export default Sessions;