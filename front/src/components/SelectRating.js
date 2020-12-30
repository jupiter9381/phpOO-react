import React from 'react';

class SelectRating extends React.Component {
    render() {
        return (
            <label>
                Rating:
                <select value={this.props.rating} onChange={this.props.handleSelect}>
                    <option value="">Any</option>
                    <option value="U">U</option>
                    <option value="PG">PG</option>
                    <option value="12">12</option>
                    <option value="15">15</option>
                    <option value="18">18</option>
                </select>
            </label>
        )
    }
}



export default SelectRating;