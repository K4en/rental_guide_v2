import {useState, useEffect} from "react";
const API_URL = import.meta.env.VITE_API_URL;

function Profile(){
    const [userData, setUserData] = useState(null);


    async function loadData(){
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/me`,{
                headers: {
                    Authorization: `Bearer ${token}`
                    }
                });
        const data = await response.json();
        setUserData(data);
    }

    useEffect(()=>{
        loadData();
    }, []);

    return (


            <div>
                <h1>Profile</h1>
                {userData && (
                <span>{userData.email}</span>
                )}
            </div>
    );
}

export default Profile;