import "./profile.css";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {

    const { currentUser } = useContext(AuthContext);

    return (
        <div className="profilePage">
            <div className="info">
                <h1>User Information</h1>
                <span>
                    Full Name: <b>{currentUser.name}</b>
                </span>
                <span>
                    E-Mail: <b>{currentUser.email}</b>
                </span>
                <span>
                    Mobile: <b>{currentUser.mobile}</b>
                </span>
                <Link to="/update-profile">
                    <button>Update Profile</button>
                </Link>
            </div>
        </div>
    );
}

export default ProfilePage;