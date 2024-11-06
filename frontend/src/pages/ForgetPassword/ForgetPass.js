import "./ForgetPassword.css";
import { useState, useContext } from "react";
import apiRequest from "../../config/apiRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ForgetPassword = () => {

    const { updateUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const body = { email, mobile };
            const res = await apiRequest.post("/api/auth/forgotpassword", body);

            setError(null);

            updateUser(res.data.user);

            navigate("/login");

        } catch (error) {
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="forgetPassword">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Reset Password</h1>

                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="Mobile Number" onChange={(e) => setMobile(e.target.value)} />

                    <button type="submit">Reset Password</button>
                    {error && <span>{error}</span>}
                </form>
            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="" />
            </div>
        </div>
    );
}

export default ForgetPassword;