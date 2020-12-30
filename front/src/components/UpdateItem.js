import React from 'react';

class UpdateItem extends React.Component {

    state = {description: this.props.details.description}

    handleDescriptionChange = (e) => {
        this.setState({description:e.target.value})
    }

    handleDescriptionUpdate = () => {
        this.props.handleUpdateClick(this.props.details.film_id, this.state.description)
    }

    render() {
        return (
            <div>
                <h2>{this.props.details.title}</h2>
                <textarea
                    rows="4" cols="50"
                    value={this.state.description}
                    onChange={this.handleDescriptionChange}
                />
                <button onClick={this.handleDescriptionUpdate}>Update</button>
            </div>
        );
    }
}

export default UpdateItem;