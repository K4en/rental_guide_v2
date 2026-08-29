

function PropertyCard({ property, setCurrentProperty, setView}){

    return(

        <div
            className="card property-card"
            onClick={()=>{
                console.log(property.id);
                setCurrentProperty(property.id);
                setView("property");
                }}
        >
            <h3>{property?.name}</h3>

            <p>{property?.address}</p>
        </div>
    );
}

export default PropertyCard;
