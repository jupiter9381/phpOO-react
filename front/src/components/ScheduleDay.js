import React from 'react';
import Config from '../config.js';
import ScheduleDetail from './ScheduleDetail';
import { clearAndGoAdmin } from './utils.js'
class ScheduleDay extends React.Component {

    state = {display:false, data:[]}

    loadScheduleDetails = () => {
        let token = localStorage.getItem('myToken');
        const url = `${Config.apiUrl}/schedule?day=${this.props.details}`;
        fetch(url, {
            method: "post",
            body: JSON.stringify({token: token})
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

    handleScheduleDayClick = (e) => {
        this.setState({display:!this.state.display})
        this.loadScheduleDetails()
    }

    render() {

        let scheduleDetail = ""
        if (this.state.display && this.state.data.length > 0) {
            let timeSlots = [];
            this.state.data.forEach((item, key) => {
                timeSlots.push(item);
            });
            scheduleDetail = <ScheduleDetail timeSlots={timeSlots} display={this.state.display}/>
        }

        return (
            <div className="col-md-6">
                <h2 onClick={this.handleScheduleDayClick} className="p-3 day_title">{this.props.details}</h2>
                {scheduleDetail}
            </div>
        );
    }
}

export default ScheduleDay;