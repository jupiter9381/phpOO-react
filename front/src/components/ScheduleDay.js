import React from 'react';
import Config from '../config.js';
import ScheduleDetail from './ScheduleDetail';

class ScheduleDay extends React.Component {

    state = {display:false, data:[]}

    loadScheduleDetails = () => {
        const url = `${Config.apiUrl}/schedule?day=${this.props.details}`;
        fetch(url)
            .then( (response) => response.json() )
            .then( (data) => {
                this.setState({data:data.data})
            })
            .catch ((err) => {
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
            let startHour = this.state.data[0].startHour;
            let endHour = this.state.data[this.state.data.length - 1].endHour;
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