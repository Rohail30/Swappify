import "./Wishlist.css";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import apiRequest from "../../config/apiRequest";
import { useEffect, useState} from 'react';


const Wishlist = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {

        const fetchItems = async () => {
            try {
                const res = await apiRequest.get(`/api/wishlist`)
                setItems(res.data.items);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchItems();

    }, );

    return (
        <div className="wishlist">
            <div className="heading">
                <h1>Wishlist</h1>
            </div>
            <div className="card-container">
                {items.length === 0 ? (
                    <p className="empty-text">No items yet! Add one now.</p>
                ) : (
                    items.map((item) => (
                        <div className="wishlistcard">
                            <div className="image-container">
                                <div className="image">
                                    <img src={`http://localhost:5000${item.image}`} alt="Item" />
                                </div>
                            </div>
                            <div className="line-container">
                                <div className="line"></div>
                            </div>
                            <div className="details">
                                <div className="title"><h1>{item.name}</h1></div>
                                <div className="status"><h2>{item.status}</h2></div>
                                <div className="price">
                                    <h2>{`Est. Value: ${item.price.min} - ${item.price.max}`}</h2>
                                </div>
                                <div className="location">
                                    {/* <FaLocationDot size={14} /> */}
                                    <h3>{item.location}</h3>
                                    <h3>{item.category}</h3>
                                </div>
                            </div>
                            <div className="buttons">

                                <div className="button1">
                                    <Link to={`/detail-page/${item._id}`}><div className="view">View details</div></Link>
                                </div>

                                <div className="button2">
                                    <div className="delete"><MdDelete className="custom-icon" /></div>
                                </div>
                            </div>
                        </div>
                    ))
                )
                }
            </div>
        </div>

    );
}

export default Wishlist;