import React from 'react';
import Search from './Search';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page:1,
            pageSize:9,
            query:"",
            data:[]
        }

        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch = (e) => {
        this.setState({page:1,query:e.target.value})
        this.searchDetails(e.target.value)
    }

    searchDetails = (query) => {
        const url = "http://192.168.64.2/code/week6b/a/api/films?search=" + query
        fetch(url)
            .then( (response) => response.json() )
            .then( (data) => {
                this.setState({data:data.data})
            })
            .catch ((err) => {
                console.log("something went wrong ", err)
            });
    }

    handlePreviousClick = () => {
        this.setState({page:this.state.page-1})
    }

    handleNextClick = () => {
        this.setState({page:this.state.page+1})
    }

    render() {

        let filteredData =  (
            this.state.data
        )

        let noOfPages = Math.ceil(filteredData.length/this.state.pageSize)
        if (noOfPages === 0) {noOfPages=1}
        let disabledPrevious = (this.state.page <= 1)
        let disabledNext = (this.state.page >= noOfPages)

        return (
            <div>
                <h2>Welcome</h2>
            </div>
        );
    }
}

export default Home;