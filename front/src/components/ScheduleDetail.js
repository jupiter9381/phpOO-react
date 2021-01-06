import React from 'react';

class ScheduleDetail extends React.Component {

    state = {
        display:false,
        displayFurther:false
    }

    handleFilmClick = () => {
        this.setState({display:!this.state.display})
    }

    handleDetailClick = () => {
        this.setState({displayFurther:!this.state.displayFurther})
    }

    render() {

        let info = "";
        let furtherInfo = "";
        
        // if (this.state.displayFurther) {
        //     furtherInfo = <p>Language: {this.props.details.language} Rating: {this.props.details.rating}</p>
        // }
        // if (this.state.display || this.props.display) {
        //     info = <div>
        //         <p onClick={this.handleDetailClick}>{this.props.details.authorInst}</p>
        //         {furtherInfo}
        //     </div>
        // }
        let timeSlots = [];
        for(let i = parseInt(this.props.startHour); i <= parseInt(this.props.endHour); i++) {
            timeSlots.push(i);
        }
        return (
            <div className="bg-darkgrey">
                {this.props.timeSlots.map(time=>{return <span className="time-slot"> {"->"} {time.startHour} : {time.startMinute} - {time.endHour} : {time.endMinute}</span>})}
            </div>
        );
    }
}

export default ScheduleDetail;