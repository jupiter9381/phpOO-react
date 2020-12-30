import React from 'react';

class Film extends React.Component {

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

        if (this.state.displayFurther) {
            furtherInfo = <p>Language: {this.props.details.language} Rating: {this.props.details.rating}</p>
        }

        if (this.state.display) {
            info = <div>
                <p onClick={this.handleDetailClick}>{this.props.details.description}</p>
                {furtherInfo}
            </div>
        }

        return (
            <div>
                <h2 onClick={this.handleFilmClick}>{this.props.details.title}</h2>
                {info}
            </div>
        );
    }
}

export default Film;