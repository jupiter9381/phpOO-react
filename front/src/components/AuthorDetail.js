import React from 'react';

class AuthorDetail extends React.Component {

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
        if (this.state.display || this.props.display) {
            info = <div>
                <p onClick={this.handleDetailClick}>{this.props.details.authorInst}</p>
                {furtherInfo}
            </div>
        }

        return (
            <div>
                {info}
                <p onClick={this.handleFilmClick}>{this.props.details.title}</p>
                
            </div>
        );
    }
}

export default AuthorDetail;