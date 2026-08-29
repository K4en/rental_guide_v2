import {useState, useEffect} from "react";
import {createGuide} from "../services/api";

function AddGuide({setView, currentProperty}){
    const [wifiNetwork, setWifiNetwork] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");

    return(
        <div>
        <h1>Add Guide</h1>

    <div>
        <label>Wi-Fi network</label>
        <input
                type="text"
                value={wifiNetwork}
                onChange={(e) =>
                    setWifiNetwork(e.target.value)
                }
            ></input>
    </div>
    <div>
        <label>Wi-Fi password</label>
        <input
                type="text"
                value={wifiPassword}
                onChange={(e) =>
                    setWifiPassword(e.target.value)
                }
            ></input>
    </div>
    <div>
        <label>Check-in time</label>
        <input
                type="text"
                value={checkin}
                onChange={(e) =>
                    setCheckin(e.target.value)
                }
            ></input>
    </div>
    <div>
        <label>Check-out time</label>
        <input
                type="text"
                value={checkout}
                onChange={(e) =>
                    setCheckout(e.target.value)
                }
            ></input>
    </div>

        <button
            onClick={ async ()=> {
                const data = [
                    {
                        title: "Wi-fi Network",
                        content: wifiNetwork,
                        sort_order: 1
                        },
                    {
                        title: "Wi-fi Password",
                        content: wifiPassword,
                        sort_order: 2
                        },
                    {
                        title: "Check-in",
                        content: checkin,
                        sort_order: 3
                        },
                    {
                        title: "Check-out",
                        content: checkout,
                        sort_order: 4
                        }
                    ];
                await createGuide(currentProperty, data);
                setView("property");
                }}
        >Save guide</button>
        </div>
    )
}

export default AddGuide;