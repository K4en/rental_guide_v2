import {useState, useEffect} from "react";
import Profile from "../components/Profile";
import Sidebar from "../components/Sidebar";
import Properties from "../components/Properties";
import AddProperty from "../components/AddProperty";
import Property from "../components/Property";
import Guide from "../components/Guide";
import AddGuide from "../components/AddGuide";
import EditGuide from "../components/EditGuide";

import { useNavigate } from "react-router-dom";

function Dashboard(){
    const [view, setView] = useState("profile");
    const [currentProperty, setCurrentProperty] = useState(null);

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        navigate("/");
    }
    return(
        <div className="dashboard">
            <Sidebar view={view} setView={setView} logout={logout}/>

            <div className="content">

                {view === "profile" && <Profile />}
                {view === "properties" &&
                    <Properties
                        setView={setView}
                        setCurrentProperty={setCurrentProperty} />}
                {view === "add-property" && <AddProperty setView={setView} />}
                {view === "property" &&
                    <Property
                        setView={setView}
                        currentProperty={currentProperty} />}
                {view === "guide" &&
                    <Guide
                        setView={setView}
                        currentProperty={currentProperty} />}
                {view === "add-guide" &&
                    <AddGuide
                        setView={setView}
                        currentProperty={currentProperty} />}
                {view === "edit-guide" &&
                    <EditGuide
                        setView={setView}
                        currentProperty={currentProperty} />}
            </div>
        </div>
        );
}

export default Dashboard;