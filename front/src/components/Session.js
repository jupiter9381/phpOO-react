import React from 'react';

class Session extends React.Component {

    state = {
        display:false,
        displayFurther:false
    }

    handleSessionClick = (detail) => {
        this.props.onClick(detail)
        this.setState({display:!this.state.display})
    }

    handleDetailClick = () => {
        this.setState({displayFurther:!this.state.displayFurther})
    }

    render() {


        if (this.state.display) {
        }

        return (
            <div>
                <h4 onClick={()=>this.handleSessionClick(this.props.details)}>{this.props.details.name}</h4>
            </div>
        );
    }
}

export default Session;