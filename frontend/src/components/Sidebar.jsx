import {useState, useEffect} from "react";

function Sidebar({view, setView, logout}){
    const [collapsed, setCollapsed] = useState(false);
   return(
        <div className={collapsed ? "sidebar collapsed" : "sidebar"}>

            <button
                className="nav-btn"
                onClick={()=> setCollapsed(!collapsed)}>
                ☰
            </button>

            <button
                className={view === "profile" ? "nav-btn active" : "nav-btn"}
                onClick={() => setView("profile")}>
                👤
                {!collapsed && " Profile"}
            </button>
            <button
                 className={view === "properties" ? "nav-btn active" : "nav-btn"}
                onClick={() => setView("properties")}>
                🏠
                {!collapsed && " Properties"}
            </button>
               <div className="sidebar-spacer"></div>
            <button
                className="nav-btn logout-btn"
                onClick={logout}
            >
                🚪 {!collapsed && " Logout"}
            </button>

        </div>
    );
}
export default Sidebar;