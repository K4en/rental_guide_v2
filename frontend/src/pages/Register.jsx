import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import {loginUser, registerUser} from "../services/api";

function Register({setAuthenticated}){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

return(
    <div>
        <h1>Register</h1>
        <input
            type="text"
            value={email}
            onChange={(e) =>
                setEmail(e.target.value)
                }
        />
        <input
            type="password"
            value={password}
            onChange={(e) =>
                setPassword(e.target.value)
                }
        />
        <button
            className="nav-btn"
            onClick={async () => {
                try {
                    console.log("Clicked!");

                    await registerUser(email, password);

                    const data = await loginUser(email, password);

                    localStorage.setItem("token", data.access_token);
                    setAuthenticated(true);

                    navigate("/dashboard");

                } catch (err) {
                    alert("Registration failed");
                }
            }}
        >
            Register
        </button>

        <button
            className="nav-btn secondary-btn"
            onClick={() => navigate("/")}
        >
            Login
        </button>
    </div>
    )
}

export default Register;