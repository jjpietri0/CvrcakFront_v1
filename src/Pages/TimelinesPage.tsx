import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import React from "react";
import TimelineComponent from "../Components/TimelineComponent";

const TimelinesPage = () => {
    return (
        <div className="d-flex" id="wrapper">
            <Sidebar />
            <div id="page-content-wrapper">
                <Header/>
                <div className="container-fluid text-center">
                    <TimelineComponent />
                </div>
            </div>
        </div>
    );
}

export default TimelinesPage;