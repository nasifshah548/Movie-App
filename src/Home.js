import React, {Component} from "react";
import axios from "axios";
import apiKey from "./config";

class Home extends Component{
    constructor() {
        super();
        this.state = {
            movieList: []
        }
    }

    componentDidMount() {
        const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`
        axios.get(nowPlayingUrl).then((response)=>{
           // console.log(response.data.results);
           const movieData = response.data.results
           this.setState({
            movieList: movieData
           })
        })
    }

    render() {
        console.log(this.state.movieList);
        const imageUrl = "http://image.tmdb.org/t/p/w300";
        const movieGrid = this.state.movieList.map((x, index) => {
            return (
                <div className="col s3" key={index}>
                    <img src={`${imageUrl}${x.poster_path}`} alt={x.title} />
                </div>
            )
        })
        return(
            <div className="row">
                {movieGrid}
            </div>
        )
    }
}

export default Home;