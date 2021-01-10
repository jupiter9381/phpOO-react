import React from 'react';

class ScheduleContent extends React.Component {

    state = {
        display:false,
        displayFurther:false
    }

    handleFilmClick = () => {
        this.setState({display:!this.state.display})
    }

    handleTimeClick = () => {
        console.log(this.props.time);
        this.setState({display:!this.state.display})
    }
    render() {
        
        return (
            <div className="text-left pl-3 pr-3 schedule_content">
                <h4>{this.props.content.room_name} | {this.props.content.session_type} | {this.props.content.name}</h4>
                <p><strong>Chair:</strong> {this.props.content.chairId}</p>
                <p><strong>Content Name:</strong> {this.props.content.title}</p>
                <p><strong>Abstract:</strong> {this.props.content.abstract}</p>
                <p><strong>Authors:</strong> {this.props.content.authors.toString()}</p>
                <p><strong>Award Given if applicable:</strong> {this.props.content.award}</p>
            </div>
        );
    }
}

export default ScheduleContent;