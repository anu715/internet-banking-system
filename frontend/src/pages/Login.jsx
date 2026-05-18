import { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { jwtDecode } from "jwt-decode";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {

            const response = await axios.post(
                "https://internet-banking-backend.onrender.com/api/login",
                {
                    email,
                    password,
                }
            );

            localStorage.setItem("token", response.data.token);

            const decoded = jwtDecode(response.data.token);

            localStorage.setItem("role", decoded.role);

            localStorage.setItem("email", email);

            navigate("/dashboard");

        } catch (error) {
            alert(error.response.data);
        }
    };

    return (
        <div className="login-page">

            <div className="login-header">
                <h2>TrustBank</h2>
                <span>Secure Banking</span>
            </div>

            <div className="login-card">

                <h1>Welcome back</h1>
                <p>Login to access your banking dashboard</p>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={handleLogin}>
                    Login
                </button>

                <p onClick={() => navigate("/register")}>
                    New user? Register
                </p>

            </div>

            <p className="security-text">
                Secure JWT authentication enabled
            </p>

        </div>
    );
}

export default Login;