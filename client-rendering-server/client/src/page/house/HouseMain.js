import React, { Component } from "react";
import HouseDetailCard from "./HouseDetailCard";
import "./styles.css";

export default class HouseMain extends Component {
    constructor(props) {
        super(props);

        this.state = {
            house: null,
            users: null,
        };
    }

    componentDidMount() {
        this.fetchHouseData("Gryffindor");
    }

    handleHouseBadgeClick = (houseTitle) => {
        // Fetch data for the clicked house
        this.fetchHouseData(houseTitle);
    };

    fetchHouseData = (houseTitle) => {
        // Construct the URL based on the house abbreviation
        const apiUrl = `http://localhost:4000/api/v1/house/${houseTitle}`;

        // Fetch house data from the API
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    house: data,
                });
                // // Fetch house users data from the API
                fetch(apiUrl + "/users")
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data.students)
                        this.setState({
                            users: data.students,
                        })
                    })
                    .catch((error) => {
                        console.error("Error fetching house users data:", error);
                    })
            })
            .catch((error) => {
                console.error("Error fetching house data:", error);
            })
    };

    render() {
        const { house, users } = this.state;

        return (
            <div className="container">
                <div className="row my-2">
                    <div className="col-lg-4 py-3">
                        <div className="sticky-container">
                            <div className="bg-body-tertiary rounded-4 shadow-sm p-3 m-3">
                                <div className="d-flex justify-content-center">
                                    <span
                                        id="GRY"
                                        type="button"
                                        className="badge bg-danger-subtle text-danger-emphasis rounded-pill fw-light mx-1"
                                        onClick={() => this.handleHouseBadgeClick("Gryffindor")}>
                                        🦁 GRY
                                    </span>
                                    <span
                                        id="SLY"
                                        type="button"
                                        className="badge bg-success-subtle text-success-emphasis rounded-pill fw-light mx-1"
                                        onClick={() => this.handleHouseBadgeClick("Slytherin")}>
                                        🐍 SLY
                                    </span>
                                    <span
                                        id="RAV"
                                        type="button"
                                        className="badge bg-primary-subtle text-primary-emphasis rounded-pill fw-light mx-1"
                                        onClick={() => this.handleHouseBadgeClick("Ravenclaw")}>
                                        🦅 RAV
                                    </span>
                                    <span
                                        id="HUF"
                                        type="button"
                                        className="badge bg-warning-subtle text-warning-emphasis rounded-pill fw-light mx-1"
                                        onClick={() => this.handleHouseBadgeClick("Hufflepuff")}>
                                        🦡 HUF
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 py-3">
                        <div className="">
                            <HouseDetailCard house={house} users={users}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}