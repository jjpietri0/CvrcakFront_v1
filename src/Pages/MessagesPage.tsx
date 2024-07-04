import MessagesComponent from "../Components/MessagesComponent";
import Header from "../Components/Header";
import React from "react";
import Sidebar from "../Components/Sidebar";

const MessagesPage = () => {
  return (
        <div className="d-flex" id="wrapper">
            <Sidebar/>
            <div id="page-content-wrapper">
                <Header/>
                <div className="container-fluid d-flex justify-content-center">
                    <MessagesComponent/>
                </div>
            </div>
        </div>


  );
}

export default MessagesPage;