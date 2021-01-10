import React from 'react';
import ScheduleItem from './ScheduleItem.js';
class ScheduleDetail extends React.Component {

    state = {
        display:false,
        displayFurther:false
    }

    handleFilmClick = () => {
        this.setState({display:!this.state.display})
    }

    handleTimeClick = () => {
        this.setState({displayFurther:!this.state.displayFurther})
    }
    render() {
                
        return (
            <div className="bg-darkgrey">
                {this.props.timeSlots.map((time, key)=>{
                    return (
                        <ScheduleItem time={time} key={key}/>
                    )
                })}
            </div>
        );
    }
}

export default ScheduleDetail;