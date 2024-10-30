import "./editItem.css";
import { useState, useContext, useEffect } from "react";
import apiRequest from "../../config/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";


const EditItem = () => {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [itemData, setItemData] = useState({
        name: "",
        description: "",
        image: undefined,
        condition: "",
        category: "",
        location: "",
        priceMin: 0,
        priceMax: 0,
        owner: currentUser._id,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await apiRequest.get(`/api/items/${id}`);

                setItemData({
                    name: res.data.item.name,
                    description: res.data.item.description,
                    image: res.data.item.image,
                    condition: res.data.item.condition,
                    category: res.data.item.category,
                    location: res.data.item.location,
                    priceMin: res.data.item.price.min,
                    priceMax: res.data.item.price.max,
                    owner: res.data.item.owner,
                });
                setImagePreview(`http://localhost:5000${res.data.item.image}`);
            } catch (error) {
                console.log(error);
            }
        }
        fetchItem();

    }, [id]);


    const handleChange = (e) => {
        if (e.target.name === "image") {
            const file = e.target.files[0];
            setItemData({ ...itemData, image: file });
            setImagePreview(URL.createObjectURL(file));
            setError(null);
        } else {
            setItemData({ ...itemData, [e.target.name]: e.target.value });
            setError(null);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", itemData.name);
        formData.append("description", itemData.description);
        formData.append("condition", itemData.condition);
        formData.append("category", itemData.category);
        formData.append("location", itemData.location);
        formData.append("priceMin", itemData.priceMin);
        formData.append("priceMax", itemData.priceMax);
        formData.append("owner", itemData.owner);
        formData.append("image", itemData.image);

        try {
            await apiRequest.put(`/api/items/update/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/profile");
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };


    return (
        <div className="editItemPage">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Edit Item</h1>

                    <input type="text" name="name" value={itemData.name} placeholder="Item Name" onChange={handleChange} required />

                    <textarea name="description" value={itemData.description} placeholder="Item Description" onChange={handleChange} required />


                    <select name="condition" value={itemData.condition} onChange={handleChange} required>
                        <option value="" disabled>Condition</option>
                        <option value="new">New</option>
                        <option value="used">Used</option>
                    </select>

                    <select name="category" value={itemData.category} onChange={handleChange} required>
                        <option value="" disabled>Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="furniture">Furniture</option>
                        <option value="clothing & accessories">Clothing & Accessories</option>
                        <option value="books & media">Books & Media</option>
                        <option value="home & garden">Home & Garden</option>
                        <option value="sports & outdoors">Sports & Outdoors</option>
                        <option value="toys & games">Toys & Games</option>
                        <option value="tools & hardware">Tools & Hardware</option>
                        <option value="automotive">Automotive</option>
                        <option value="office supplies">Office Supplies</option>
                        <option value="collectibles & antiques">Collectibles & Antiques</option>
                        <option value="other">Other</option>
                    </select>

                    <input type="text" name="location" value={itemData.location} placeholder="Location" onChange={handleChange} required />

                    <input type="number" name="priceMin" value={itemData.priceMin} placeholder="Minimum Price" onChange={handleChange} required />

                    <input type="number" name="priceMax" value={itemData.priceMax} placeholder="Maximum Price" onChange={handleChange} required />

                    <input type="file" name="image" onChange={handleChange} />

                    {error && <span className="error-message">{error}</span>}

                    <button type="submit">Edit Item</button>

                </form>

                <div className="imagePreview">
                    {imagePreview && (
                        <img src={imagePreview} alt="Item Preview" style={{ width: "300px", height: "auto" }} />
                    )}
                </div>

            </div>
        </div>
    );
};

export default EditItem;