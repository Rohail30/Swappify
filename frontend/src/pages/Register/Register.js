import "./register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../config/apiRequest";

const Register = () => {

    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const body = { name, email, mobile, password };
            const res = await apiRequest.post("/api/auth/register", body);
            console.log(res);

            setSuccessMessage(res.data.message);
            setError(null);

            setTimeout(() => {
                navigate("/login");
            }, 3000);


        } catch (error) {
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="registerPage">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Create an Account</h1>

                    <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="Mobile Number" onChange={(e) => setMobile(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Register</button>

                    {error && <span className="error-message">{error}</span>}
                    {successMessage && <span className="success-message">{successMessage}</span>}
                    <Link to="/login">Already have an account? Login</Link>
                </form>
            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="" />
            </div>
        </div>
    );
};

export default Register;
