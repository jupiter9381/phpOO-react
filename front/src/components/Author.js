import React from 'react';
import Config from '../config.js';
import AuthorDetail from './AuthorDetail';
class Author extends React.Component {

    state = {display:false, data:[]}

    loadAuthorDetails = () => {
        const url = `${Config.apiUrl}/content_authors?authorId=${this.props.details.authorId}`;
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

    handleAuthorClick = (e) => {
        this.setState({display:!this.state.display})
        this.loadAuthorDetails()
    }

    render() {

        let films = ""
        if (this.state.display) {
            films = this.state.data.map( (details, i) => (<AuthorDetail key={i} details={details} display={this.state.display}/>) )
        }

        return (
            <div>
                <h2 onClick={this.handleAuthorClick}>{this.props.details.name}</h2>
                {films}
            </div>
        );
    }
}

export default Author;