import './ItemList.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import apiRequest from '../../config/apiRequest';
import { FaRegHeart } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { IoMdSearch } from 'react-icons/io';
import { RiSortAlphabetAsc } from 'react-icons/ri';
import { RiSortAlphabetDesc } from 'react-icons/ri';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const categories = [
  'electronics',
  'furniture',
  'clothing & accessories',
  'books & media',
  'home & garden',
  'sports & outdoors',
  'toys & games',
  'tools & hardware',
  'automotive',
  'office supplies',
  'collectibles & antiques',
  'other',
];

const locations = [
  'karachi',
  'lahore',
  'islamabad',
  'faisalabad',
  'rawalpindi',
  'multan',
  'peshawar',
  'quetta',
  'gujranwala',
  'sialkot',
  'hyderabad',
  'bahawalpur',
  'sargodha',
  'mardan',
  'swat',
];

const ItemList = () => {
  const { currentUser } = useContext(AuthContext);

  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category: [],
    location: [],
    condition: '',
    priceMin: '',
    priceMax: '',
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const query = new URLSearchParams();
        if (filters.name) query.append('name', filters.name);
        if (filters.category.length)
          query.append('category', filters.category.join(','));
        if (filters.location.length)
          query.append('location', filters.location.join(','));
        if (filters.condition) query.append('condition', filters.condition);
        if (filters.priceMin) query.append('priceMin', filters.priceMin);
        if (filters.priceMax) query.append('priceMax', filters.priceMax);

        const res = await apiRequest.get(
          `/api/items/search?${query.toString()}`
        );

        // setItems(res.data.items);
        // Assuming you have the current user's ID in a variable `currentUserId`
        const currentUserId = currentUser._id; // Replace with actual logic to get user ID
        const filteredItems = res.data.items.filter(
          (item) => item.owner !== currentUserId
        );

        setItems(filteredItems);
      } catch (error) {
        console.error(error);
      }
    };
    fetchItems();
  }, [currentUser, filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prevFilters) => {
      if (name === 'category' || name === 'location') {
        const newValues =
          type === 'checkbox'
            ? checked
              ? [...prevFilters[name], value]
              : prevFilters[name].filter((item) => item !== value)
            : [value];

        return { ...prevFilters, [name]: newValues };
      }
      return { ...prevFilters, [name]: value };
    });
  };

  const addToWishlist = async (itemId) => {
    try {
      await apiRequest.post('/api/wishlist', { itemId });
      alert('Item added to wishlist!');
    } catch (error) {
      alert('Item already in wishlist!');
    }
  };

  return (
    <div className="itemlist">
      <div className="filter">
        <div className="filter-section">
          <header>Show Results by:</header>
          <h3>Filter by Condition</h3>
          <div className="checkbox-group">
            <select name="condition" onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>
        </div>

        <div className="filter-section">
          <h3>Filter by City</h3>
          <div className="checkbox-group">
            {locations.map((city) => (
              <label key={city}>
                <input
                  type="checkbox"
                  value={city}
                  name="location"
                  onChange={handleFilterChange}
                />{' '}
                {city.charAt(0).toUpperCase() + city.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Filter by Category</h3>
          <div className="checkbox-group">
            {categories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  value={category}
                  name="category"
                  onChange={handleFilterChange}
                />{' '}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Filter by Price Range</h3>
          <div className="pricesearch">
            <input
              type="number"
              placeholder="From"
              name="priceMin"
              onChange={handleFilterChange}
            />
            <input
              type="number"
              placeholder="To"
              name="priceMax"
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className="cards">
        <div className="search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              name="name"
              onChange={handleFilterChange}
            />
            <button className="search-btn">
              <IoMdSearch />
            </button>
          </div>
          <div
            className="box"
            onClick={() =>
              setItems([...items].sort((a, b) => a.name.localeCompare(b.name)))
            }
          >
            <RiSortAlphabetAsc />
          </div>

          <div
            className="box"
            onClick={() =>
              setItems([...items].sort((b, a) => a.name.localeCompare(b.name)))
            }
          >
            <RiSortAlphabetDesc />
          </div>
        </div>

        <div className="card-container">
          {items.length === 0 ? (
            <p className="empty-text">No items yet!</p>
          ) : (
            items.map((item) => (
              <div className="itemlistcard" key={item._id}>
                <div className="image-container">
                  <div className="image">
                    <img
                      src={`http://localhost:5000${item.image}`}
                      alt="Item"
                    />
                  </div>
                </div>
                <div className="line-container">
                  <div className="line"></div>
                </div>
                <div className="details">
                  <div className="d1">
                    <div className="title">
                      <h1>
                        {item.name.length > 16
                          ? item.name.slice(0, 16) + '...'
                          : item.name}
                      </h1>
                    </div>
                    <div className="description">
                      <p>{item.description.slice(0, 55) + '...'}</p>
                    </div>
                  </div>

                  <div className="price">
                    <h2>{`Est. Value: ${item.price.min} - ${item.price.max}`}</h2>
                  </div>
                  <div className="location">
                    <FaLocationDot size={14} />
                    <h3>{item.location}</h3>&nbsp;|&nbsp;
                    <h3>{new Date(item.createdAt).toLocaleDateString()}</h3>
                  </div>
                </div>
                <div className="buttons">
                  <div className="button1">
                    <Link to={`/detail-page/${item._id}`}>
                      <div className="view">
                        View Details &nbsp;
                        <FaExternalLinkAlt style={{ fontSize: '10px' }} />
                      </div>
                    </Link>
                  </div>
                  {/* <Link to={`/detail-page/${item._id}`}>
                                        <div className="button1">
                                            <div className="view">View details</div>
                                        </div>
                                    </Link> */}
                  <div className="button2">
                    <Link to="#">
                      <div
                        className="wish-list"
                        onClick={() => addToWishlist(item._id)}
                      >
                        <FaRegHeart className="cust-i" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemList;
