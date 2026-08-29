import {useState, useEffect} from "react";
import {createProperty} from "../services/api";

function AddProperty({setView}){

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    return(
        <div>
            <h1>Add Property</h1>

            <input
                type="text"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            ></input>

            <input
                type="text"
                value={address}
                onChange={(e) =>
                    setAddress(e.target.value)
                }
            ></input>

            <button
                onClick={async () => {
                    await createProperty(name, address);
                    setView("properties")
                    }}
            >Save</button>

        </div>
    )
}

export default AddProperty;