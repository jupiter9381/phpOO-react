import React from 'react';
import Film from './Film.js';
import Config from '../config.js';

class Author extends React.Component {

    state = {display:false, data:[]}

    loadFilmDetails = () => {
        const url = `${Config.apiUrl}/authors?authorId=${this.props.details.authorId}`;
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
            console.log(films)
        }

        return (
            <div>
                <h2 onClick={this.handleActorClick}>{this.props.details.name}</h2>
                {films}
            </div>
        );
    }
}

export default Author;