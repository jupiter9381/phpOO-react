import React from 'react';
import Film from './Film.js';


class Actor extends React.Component {

    state = {display:false, data:[]}

    loadFilmDetails = () => {
        const url = "http://192.168.64.2/code/week6b/a/api/films?actor_id=" + this.props.details.actor_id
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

    handleActorClick = (e) => {
        this.setState({display:!this.state.display})
        this.loadFilmDetails()
    }

    render() {

        let films = ""
        if (this.state.display) {
            films = this.state.data.map( (details, i) => (<Film key={i} details={details} />) )
        }

        return (
            <div>
                <h2 onClick={this.handleActorClick}>{this.props.details.first_name} {this.props.details.last_name}</h2>
                {films}
            </div>
        );
    }
}

export default Actor;