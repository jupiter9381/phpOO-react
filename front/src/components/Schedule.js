import React from 'react';
import Search from './Search.js';
import Config from '../config.js';
import ScheduleDay from './ScheduleDay.js';
import { isAuthenticated } from './utils.js'

class Schedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page:1,
            pageSize:12,
            query:"",
            data:[]
        }
    }

    componentDidMount() {
        let token = localStorage.getItem('myToken');
        const url = `${Config.apiUrl}/authors`;
        fetch(url, {
            method: "post",
            body: JSON.stringify({token: token})
        })
            .then( (response) => response.json() )
            .then( (data) => {
                this.setState({data:data.data})
            })
            .catch ((err) => {
                    console.log("something went wrong ", err)
                }
            );
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

    render() {
        let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return (
            <div className="wrapper">
                <h1>Schedule</h1>
                <div className="row">
                {
                    days.map((day, key) => (<ScheduleDay details={day} key={key}></ScheduleDay>))
                }
                </div>
                
            </div>
        );
    }
}

export default Schedule;