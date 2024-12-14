import './Sent.css';

const SentRequests = () => {
  return (
    <div className="Sent">
      <div className="tradepage-container">
        <div className="requested-item ">
          <div className="header">
            <h1>Item Wanted</h1>
          </div>
          <div className="image">
            <img src="/products.png" alt="" />
          </div>
          <div className="line-container">
            <div className="line"></div>
          </div>
          <div className="title">
            <h4>Title</h4>
          </div>
          <div className="pricerange">
            <h3>Price-Range</h3>
          </div>
          <div className="button">
            <div className="view">View Details</div>
          </div>
        </div>
        <div>
          <div className="mid-sec">
            <div className="status">
              <h1>Current Status</h1>
              <div className="cancel">Cancel request </div>
            </div>
          </div>
        </div>
        <div className="offered-item">
          <div className="header">
            <h1>Item Offered</h1>
          </div>
          <div className="image">
            <img src="/products.png" alt="" />
          </div>
          <div className="line-container">
            <div className="line"></div>
          </div>
          <div className="title">
            <h4>Title</h4>
          </div>
          <div className="pricerange">
            <h3>Price-Range</h3>
          </div>
          <div className="remove-button">View Details</div>
        </div>
      </div>
      {/* List 2 */}
      <div className="tradepage-container">
        <div className="requested-item ">
          <div className="header">
            <h1>Item Wanted</h1>
          </div>
          <div className="image">
            <img src="/products.png" alt="" />
          </div>
          <div className="line-container">
            <div className="line"></div>
          </div>
          <div className="title">
            <h4>Title</h4>
          </div>
          <div className="pricerange">
            <h3>Price-Range</h3>
          </div>
          <div className="button">
            <div className="view">View Details</div>
          </div>
        </div>
        <div>
          <div className="mid-sec">
            <div className="Status">
              <h1>Current Status</h1>
            </div>
          </div>
        </div>
        <div className="offered-item">
          <div className="header">
            <h1>Item Offered</h1>
          </div>
          <div className="image">
            <img src="/products.png" alt="" />
          </div>
          <div className="line-container">
            <div className="line"></div>
          </div>
          <div className="title">
            <h4>Title</h4>
          </div>
          <div className="pricerange">
            <h3>Price-Range</h3>
          </div>
          <div className="remove-button">View Details</div>
        </div>
      </div>
    </div>
  );
};

export default SentRequests;
