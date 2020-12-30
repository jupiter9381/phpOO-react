import React from 'react';
import UpdateItem from './UpdateItem.js';

class Update extends React.Component {

    state = {data:[]}

    componentDidMount() {
        const url = "http://192.168.64.2/code/week6b/a/api/films"
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

    render() {
        return (
            <div>
                {this.state.data.map((details,i) => (<UpdateItem key={i} details={details} handleUpdateClick={this.props.handleUpdateClick}/>))}
            </div>
        );
    }
}

export default Update;