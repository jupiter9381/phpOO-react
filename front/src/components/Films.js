import React from 'react';
import SelectLanguage from "./SelectLanguage";
import SelectRating from "./SelectRating";
import Search from "./Search";
import Film from "./Film";
import Config from '../config';

class Films extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page:1,
            pageSize:9,
            query:"",
            rating:"",
            language:"",
            data:[]
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleLanguageSelect = this.handleLanguageSelect.bind(this);
    }

    componentDidMount() {
        const url = Config.apiUrl + "/films";
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

    handleMoreClick = () => {
        this.setState({page:this.state.page+1})
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
        return ((this.searchString(details.title) || this.searchString(details.description)))
    }

    handleSelect = (e) => {
        this.setState({page:1,rating:e.target.value})
    }

    handleLanguageSelect = (e) => {
        this.setState({page:1, language:e.target.value})
    }

    selectDetails = (details) => {
        return ((this.state.rating === details.rating) || (this.state.rating === ""))
    }

    selectLanguageDetails = (details) => {
        return ((this.state.language === details.language) || (this.state.language === ""))
    }

    render() {

        let filteredData =  (
            this.state.data
                .filter(this.selectLanguageDetails)
                .filter(this.selectDetails)
                .filter(this.searchDetails)
        )

        let noOfPages = Math.ceil(filteredData.length/this.state.pageSize)
        if (noOfPages === 0) {noOfPages=1}
        let disabledPrevious = (this.state.page <= 1)
        let disabledNext = (this.state.page >= noOfPages)

        return (
            <div>
                <h1>Films</h1>
                <SelectRating rating={this.state.rating} handleSelect={this.handleSelect} />
                <SelectLanguage language={this.state.language} handleLanguageSelect={this.handleLanguageSelect} />
                <Search query={this.state.query} handleSearch={this.handleSearch}/>
                {
                    filteredData
                        .slice(((this.state.pageSize*this.state.page)-this.state.pageSize),(this.state.pageSize*this.state.page))
                        .map( (details, i) => (<Film key={i} details={details} />) )
                }
                <button onClick={this.handlePreviousClick} disabled={disabledPrevious}>Previous</button>
                Page {this.state.page} of {noOfPages}
                <button onClick={this.handleNextClick} disabled={disabledNext}>Next</button>
            </div>
        );
    }
}
export default Films;