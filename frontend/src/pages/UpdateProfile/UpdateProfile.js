import { useContext, useEffect, useState } from "react";
import "./updateProfile.css";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../config/apiRequest";

function ProfileUpdatePage() {
    const { currentUser, updateUser } = useContext(AuthContext);

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name);
            setEmail(currentUser.email);
            setMobile(currentUser.mobile);
        }
    }, [currentUser]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const body = { name, email, mobile, password };
            const res = await apiRequest.put(`/api/users/${currentUser._id}`, body);

            updateUser(res.data.updatedData);

            setError(null);
            setSuccessMessage(res.data.message);

        } catch (error) {
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="profileUpdatePage">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Update Profile</h1>

                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="email" value={email} disabled />
                    <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Update</button>
                    {error && <span>{error}</span>}
                    {successMessage && <span>{successMessage}</span>}
                </form>
            </div>
            <div className="imgContainer">
                <img src="/bg.png" alt="" />
            </div>
        </div>
    );
}

export default ProfileUpdatePage;