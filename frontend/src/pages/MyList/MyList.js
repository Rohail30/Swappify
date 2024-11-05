import "./MyList.css";
import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from 'react';
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../config/apiRequest";


const MyList = () => {

    const { currentUser } = useContext(AuthContext);
    const [items, setItems] = useState([]);

    useEffect(() => {

        const fetchItems = async () => {
            try {
                const res = await apiRequest.get(`api/items/user/${currentUser._id}`)
                setItems(res.data.items);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchItems();

    }, [currentUser._id]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Do you really want to delete this item?");

        if (confirmDelete) {
            try {
                await apiRequest.delete(`api/items/delete/${id}`);
                setItems(items.filter((item) => item._id !== id));
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="mylist">
            <div className="container">
                <div className="info">
                    <h1>My List</h1>
                </div>
                <div className="buttons">
                    <Link to="/wishlist">
                        <button>Wishlist</button>
                    </Link>
                    <Link to="/add-item">
                        <button>Create New Post</button>
                    </Link>
                </div>
            </div>

            <div className="cards">
                <div className="card-container">
                    {items.length === 0 ? (
                        <p className="empty-text">No items yet! Add one now.</p>
                    ) : (
                        items.map((item) => (
                            <div className="mylistcard" key={item._id}>
                                <div className="image-container">
                                    <div className="image">
                                        <img src={`http://localhost:5000${item.image}`} alt="Item" />
                                    </div>
                                </div>
                                <div className="line-container">
                                    <div className="line"></div>
                                </div>
                                <div className="title"><h1>{item.name}</h1></div>
                                <div className="status"><h2>{item.status}</h2></div>
                                <div className="buttons">
                                    <Link to={`/detail-page/${item._id}`}>
                                        <div className="button1">
                                            <div className="view">View details</div>
                                        </div>
                                    </Link>
                                    <div className="button2">
                                        <Link to={`/edit-item/${item._id}`}><div className="edit"><MdEdit /></div></Link>
                                        {/* <div className="delete"><MdDelete /></div> */}
                                        <div className="delete" onClick={() => handleDelete(item._id)}><MdDelete /></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )
                    }
                </div>
            </div>
        </div>
    );
}

export default MyList;