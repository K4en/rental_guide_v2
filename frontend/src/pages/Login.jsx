import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import {loginUser} from "../services/api";

function Login({setAuthenticated}){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

return(
    <div className="auth-card">
        <h1>Rental Guide</h1>
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
                    const data = await loginUser(email, password);
                    console.log(data);

                    localStorage.setItem("token", data.access_token);
                    setAuthenticated(true);
                    navigate("/dashboard");
                } catch (err) {
                    alert("Invalid email or password");
                }
            }}
        >
            Login
        </button>

        <button
            className="nav-btn"
            onClick={() => navigate("/register")}
        >
            Register
        </button>
            </div>
    )
}

export default Login;