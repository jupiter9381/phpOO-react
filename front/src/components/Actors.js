import React from 'react';
import Actor from './Actor.js';
import Search from './Search.js';

class Actors extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page:1,
            pageSize:9,
            query:"",
            data:[]
        }
    }

    componentDidMount() {
        const url = "http://192.168.64.2/code/week6b/a/api/actors"
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

    handlePreviousClick = () => {
        this.setState({page:this.state.page-1})
    }

    handleNextClick = () => {
        this.setState({page:this.state.page+1})
    }

    handleSearch = (e) => {
        this.setState({page:1,query:e.target.value})
    }

    searchString = (s) => {
        return s.toLowerCase().includes(this.state.query.toLowerCase())
    }

    searchDetails = (details) => {
        return ((this.searchString(details.first_name) || this.searchString(details.last_name)))
    }

    render() {

        let filteredData =  (
            this.state.data
                .filter(this.searchDetails)
        )

        let noOfPages = Math.ceil(filteredData.length/this.state.pageSize)
        if (noOfPages === 0) {noOfPages=1}
        let disabledPrevious = (this.state.page <= 1)
        let disabledNext = (this.state.page >= noOfPages)

        return (
            <div>
                <h1>Actors</h1>
                <Search query={this.state.query} handleSearch={this.handleSearch}/>
                {
                    filteredData
                        .slice(((this.state.pageSize*this.state.page)-this.state.pageSize),(this.state.pageSize*this.state.page))
                        .map( (details, i) => (<Actor key={i} details={details} />) )
                }
                <button onClick={this.handlePreviousClick} disabled={disabledPrevious}>Previous</button>
                Page {this.state.page} of {noOfPages}
                <button onClick={this.handleNextClick} disabled={disabledNext}>Next</button>
            </div>
        );
    }
}

export default Actors;