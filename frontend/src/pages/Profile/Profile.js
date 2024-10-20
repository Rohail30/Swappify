import "./profile.css";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import MyList from "../MyList/MyList";

const ProfilePage = () => {

    const { currentUser } = useContext(AuthContext);

    return (
        <div className="profilePage">
            <div className="container">
                <div className="info">
                    <h1 id="user-info-heading">User Information</h1>
                    <span>
                        Full Name: <b>{currentUser.name}</b>
                    </span>
                    <span>
                        E-Mail: <b>{currentUser.email}</b>
                    </span>
                    <span>
                        Mobile: <b>{currentUser.mobile}</b>
                    </span>

                </div>
                <Link to="/update-profile">
                    <button>Update Profile</button>
                </Link>
            </div>
            <MyList />
        </div>
    );
}

export default ProfilePage;