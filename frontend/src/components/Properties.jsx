import {useState, useEffect} from "react";
import PropertyCard from "./PropertyCard";
import GuideCard from "./GuideCard";
const API_URL = import.meta.env.VITE_API_URL;

function Properties({setView, setCurrentProperty}){

    const [properties, setProperties] = useState([]);

    async function loadProperties(){
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/my-properties`,{
                headers: {
                    Authorization: `Bearer ${token}`
                    },

                });
        const data = await response.json();
        setProperties(data);
        }

    useEffect(()=>{
        loadProperties();
    }, []);

    return(
        <div>
        <h1>Properties</h1>
        {properties.map((property) => (
            <PropertyCard
                key={property.id}
                property={property}
                setCurrentProperty={setCurrentProperty}
                setView={setView}
            />
            ))}
        <button
            className="primary-btn"
            onClick={() => {
                setView("add-property")
                }}
        >+ Add Property</button>
        </div>
    )

}

export default Properties;