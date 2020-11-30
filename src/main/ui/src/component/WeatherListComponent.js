import React, { Component } from 'react'
import WeatherService from '../service/WeatherService';

class WeatherListComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            weathers: [],
            message: null
        }
        // this.deleteWeatherClicked = this.deleteWeatherClicked.bind(this)
        // this.updateWeatherClicked = this.updateWeatherClicked.bind(this)
        // this.addWeatherClicked = this.addWeatherClicked.bind(this)
        // this.refreshWeathers = this.refreshWeathers.bind(this)
    }

    componentDidMount() {
        this.refreshCourses();
    }

    refreshCourses() {
        WeatherService.retrieveAllWeathers()//HARDCODED
            .then(
                response => {
                    //console.log(response);
                    this.setState({ weathers: response.data })
                }
            )
    }

    render() {
        console.log('render')
        return (
            <div className="container">
                <h3>All Weathers</h3>
                {this.state.message && <div class="alert alert-success">{this.state.message}</div>}
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>cityId</th>
                                <th>city Name</th>
                                {/* <th>Update</th> */}
                                {/* <th>Delete</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.weathers.map(
                                    weather =>
                                        <tr key={weather.id}>
                                            <td>{weather.id}</td>
                                            <td>{weather.name}</td>
                                            {/* <td><button className="btn btn-success" onClick={() => this.updateCourseClicked(course.id)}>Update</button></td> */}
                                            {/* <td><button className="btn btn-warning" onClick={() => this.deleteCourseClicked(course.id)}>Delete</button></td> */}
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {/* <div className="row"> */}
                        {/* <button className="btn btn-success" onClick={this.addCourseClicked}>Add</button> */}
                    {/* </div> */}
                </div>
            </div>
        )
    }
}
export default WeatherListComponent
