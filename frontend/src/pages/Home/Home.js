import './Home.css';
import { IoCarSportSharp } from 'react-icons/io5';
import { MdSportsTennis } from 'react-icons/md';
import { GiPorcelainVase } from 'react-icons/gi';
import { MdChair } from 'react-icons/md';
import { FaFacebookSquare } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa6';
import { FaPinterest } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="top-container">
        <div className="text">
          <h1>Discover Something New With</h1>
          <h2>Swappify!</h2>
          <Link to={`/item-listing`}>
            <div className="h-button">Explore</div>
          </Link>
        </div>
        <div className="image">
          <img src="/commerce.png" alt="" />
        </div>
      </div>
      <div className="boxes">
        <div className="box-left">
          <img src="/products.png" alt="" />
        </div>
        <div className="box-right">
          <div className="text">
            <h1>Trade What You Have!</h1>
            <h2>Browse a World of Option</h2>
            <Link to={`/item-listing`}>
              <div className="h-button">Explore</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="category">
        <div className="cat-items">
          <div className="cat">
            <Link>
              <IoCarSportSharp className="icon" />
            </Link>
          </div>
          <div className="cat">
            <Link>
              <MdSportsTennis className="icon" />
            </Link>
          </div>

          <div className="cat">
            <Link>
              <GiPorcelainVase className="icon" />
            </Link>
          </div>
          <div className="cat">
            <Link>
              <MdChair className="icon" />
            </Link>
          </div>
        </div>
      </div>
      <div className="h-cards">
        <div className="h-card">
          <div className="img-con">
            <img src="/c2.svg" alt="" />
          </div>
          <h3>Barter Exchange</h3>
          <p>
            Swappify is the largest barter trade marketplace on the market, with
            an enormous pool of products and services from electronics to books,
            cars to houses.
          </p>
        </div>
        <div className="h-card">
          <div className="img-con">
            <img src="/c1.svg" alt="" />
          </div>
          <h3>Flexible Trading</h3>
          <p>
            Make real-time bids using Add Offerto shape trades that fit your
            needs. Explore Swappify’s diverse listings and connect with users
            for personalized exchanges on your terms.
          </p>
        </div>
        <div className="h-card">
          <div className="img-con">
            <img src="/c3.svg" alt="" />
          </div>
          <h3>Secure</h3>
          <p>
            We take the safety of our user data seriously, and that’s why we use
            encryption to keep your information safe. You can also delete your
            account completely whenever you want.
          </p>
        </div>
      </div>
      <div className="para">
        <div className="para-text">
          <h1>How Barter Works</h1>
          <p>
            Swappify is the choicest application to bring barter features to
            online platform. Barter is an act of trading goods or services
            between two or more parties without the use of money or a monetary
            medium. In essence, bartering involves the provision of one good or
            service by one party in return for another good or service from
            another party.
          </p>
          <div className="columns">
            <div className="col">
              <ul>
                <li>You wish for products that they want to barter for.</li>
                <li>
                  It can also be used for accepting attractive deals that are
                  sent to you.
                </li>
              </ul>
            </div>
            <div className="col">
              <ul>
                <li>
                  Offers page which allows you to send offers to items that you
                  like.
                </li>
                <li>
                  There is unique search feature where you can search for items
                  you like and then send offers.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="other">
        <div className="text">
          <h1>Connect with us</h1>
        </div>
        <div className="icons">
          <FaFacebookSquare className="cust-i" />
          <FaInstagram className="cust-i" />
          <FaGoogle className="cust-i" />
          <FaTwitter className="cust-i" />
          <FaPinterest className="cust-i" />
        </div>
      </div>
    </div>
  );
};

export default Home;
