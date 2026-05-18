import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await axios.post(
                "https://internet-banking-backend.onrender.com/api/register",
                {
                    name,
                    email,
                    password,
                }
            );

            alert(response.data);
            navigate("/login");

        } catch (error) {
            alert(error.response.data);
        }
    };

    return (
        <div className="login-page">

            <div className="login-header">
                <h2>TrustBank</h2>
                <span>Create Account</span>
            </div>

            <div className="login-card">

                <h1>Register</h1>
                <p>Create your banking account</p>

                <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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

                <button onClick={handleRegister}>
                    Register
                </button>

                <p onClick={() => navigate("/login")}>
                    Already have an account? Login
                </p>

            </div>
        </div>
    );
}

export default Register;