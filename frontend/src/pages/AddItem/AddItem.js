import "./additem.css";
import { useState, useContext } from "react";
import apiRequest from "../../config/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const categories = [
    'electronics', 'furniture', 'clothing & accessories', 'books & media', 'home & garden', 'sports & outdoors', 'toys & games', 'tools & hardware', 'automotive', 'office supplies', 'collectibles & antiques', 'other'
];

const locations = [
    "Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "Multan", "Peshawar", "Quetta", "Gujranwala", "Sialkot", "Hyderabad", "Bahawalpur", "Sargodha", "Mardan", "Swat"];

const AddItem = () => {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null)
    const [itemData, setItemData] = useState({
        name: "",
        description: "",
        image: null,
        condition: "",
        category: "",
        location: "",
        priceMin: 0,
        priceMax: 0,
        owner: currentUser._id,
    });


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
            const res = await apiRequest.post("/api/items/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(res);
            navigate("/profile");
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };


    return (
        <div className="newItemPage">
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <h1>Add New Item</h1>

                    <input type="text" name="name" placeholder="Item Name" onChange={handleChange} required />

                    <textarea name="description" placeholder="Item Description" onChange={handleChange} required />


                    <select name="condition" onChange={handleChange} required>
                        <option value="" disabled selected> Condition </option>
                        <option value="new">New</option>
                        <option value="used">Used</option>
                    </select>

                    {/* <select name="category" onChange={handleChange} required>
                        <option value="" disabled selected>Category</option>
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
                    </select> */}

                    <select name="category" onChange={handleChange} required>
                        <option value="" disabled selected>Category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <select name="location" onChange={handleChange} required>
                        <option value="" disabled selected>Location</option>
                        {locations.map((location) => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>

                    <input type="number" name="priceMin" placeholder="Minimum Price" onChange={handleChange} required />

                    <input type="number" name="priceMax" placeholder="Maximum Price" onChange={handleChange} required />

                    <input type="file" name="image" onChange={handleChange} required />

                    {error && <span className="error-message">{error}</span>}

                    <button type="submit">Add Item</button>

                </form>
                <div className="imagePreview">
                    {imagePreview && (
                        <img src={imagePreview} alt="Selected Preview" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddItem;
