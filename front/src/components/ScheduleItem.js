import React from 'react';
import ScheduleContent from './ScheduleContent.js';
import Config from '../config.js';

class ScheduleItem extends React.Component {

    state = {
        display:false,
        displayFurther:false,
        data: []
    }

    handleFilmClick = () => {
        this.setState({display:!this.state.display})
    }

    handleTimeClick = () => {
        this.setState({display:!this.state.display})
        if(!this.state.display) {
            const url = `${Config.apiUrl}/schedule_detail?slotId=${this.props.time.slotId}`;
            fetch(url)
                .then( (response) => response.json() )
                .then( (data) => {
                    console.log("schedule_data", data.data)
                    this.setState({data:data.data})
                })
                .catch ((err) => {
                        console.log("something went wrong ", err)
                    }
                );
        } else {
            this.setState({data: []});
        }
    }
    render() {        
        return (
            <div >
                <span className="time-slot" onClick={this.handleTimeClick}> {"->"} {this.props.time.startHour} : {this.props.time.startMinute} - {this.props.time.endHour} : {this.props.time.endMinute}</span>
                
                {
                    this.state.data.map((content, key) => (<ScheduleContent content={content} key={key}/>))
                }
            </div>
        );
    }
}

export default ScheduleItem;