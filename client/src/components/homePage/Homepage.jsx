import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Homepage.css";
import authent from "../../Auth";
import Footer from "../footer/footer";
import Navbar from "../navbar/nav";
import LoadingPage from "../loadingPage/loadingPage";
import authen from "../../Auth";

const backEndUrl = import.meta.env.VITE_BACK_END_URL;

const Homepage = () => {
  const navigate = useNavigate();
  // Bus Details
  const [pickupPoint, setPickupPoint] = useState("");
  const [arrivalPoint, setArrivalPoint] = useState("");
  const [date, setDate] = useState("");

  // const [selectedBus, setSelectedBus] = useState()
  // Contact form toggler
  const [showContactForm, setShowContactForm] = useState(false);
  // Available buses
  const [buses, setBuses] = useState([]);
  // Loading toggler
  const [isLoading, setIsLoading] = useState(true);
  // Filtered buses
  const [filteredBuses, setFilteredBuses] = useState(buses);
  // Contact form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  // overlay screen
  const [alertFlag, setAlertFlag] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  // Authentication handling function

  // Get available buses
  const fetchBuses = async () => {
    try {
      `${backEndUrl}/buses`;
      const res = await axios.get(`${backEndUrl}/buses`);
      setBuses(res.data);
      setFilteredBuses(res.data); // Ensure filteredBuses syncs with buses
    } catch (error) {
      console.error("Error fetching buses:", error);
      // setBuses([]);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  useEffect(() => {
    setIsLoading(true); // Show loading before fetching
    fetchBuses();
  }, []);

  // popular routes list
  const popularRoutes = [
    { id: 1, route: "Abaseya to E-JUST" },
    { id: 2, route: "Dandy to E-JUST" },
    { id: 3, route: "E-JUST to Ramses" },
    { id: 3, route: "E-JUST to Dandy" },
  ];

  // Handle selected bus
  const handleBusSelect = async (bus) => {
    const req_user = await axios.get(`${backEndUrl}/auth/${bus._id}`, {
      withCredentials: true,
    });

    navigate(`/seat-selection/${bus._id}`); //to get the bus id in the seat selection
  };

  // Show/Hide contact form
  const toggleContactForm = () => setShowContactForm(!showContactForm);

  // Buses Search hanlder
  const handleSearch = () => {
    if (!Array.isArray(buses)) {
      console.error("buses is not an array:", buses);
      return;
    }

    const filtered = buses.filter(
      (bus) =>
        (pickupPoint ? bus.location.pickupLocation === pickupPoint : true) &&
        (arrivalPoint ? bus.location.arrivalLocation === arrivalPoint : true) &&
        (date ? bus.schedule === date : true)
    );
    setFilteredBuses(filtered);
  };

  // selected routes
  const handleRouteSelect = (route) => {
    const [pickup, arrival] = route.split(" to ");
    setPickupPoint(pickup);
    setArrivalPoint(arrival);
    setTimeout(handleSearch, 0); // Ensures search runs after state update
  };

  // Show when loading or fetching data
  // if (isLoading) {
  //   return <LoadingPage />;
  // }

  // Send contact message
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    const contactData = {
      name,
      email,
      message,
    };

    try {
      const response = await axios.post(`${backEndUrl}/contact`, contactData);
      setResponseMessage("Message sent successfully");
    } catch (error) {
      setResponseMessage("Failed to send message");
      console.error("Error sending contact message:", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let period = "AM";
    let hour12 = parseInt(hour, 10);

    if (hour12 >= 12) {
      period = "PM";
      if (hour12 > 12) hour12 -= 12;
    }
    if (hour12 === 0) hour12 = 12;

    return `${hour12}:${minute} ${period}`;
  };

  return (
    <div className="home-page">
      {/* {location.pathname === "/home" && (
        <button className="add-bus-btn" onClick={() => navigate("/add-bus")}>
          Add a new Bus
        </button>
      )}
      {location.pathname === "/home" && (
        <button
          className="add-bus-btn"
          onClick={() => navigate("/notifications")}
        >
          Test
        </button>
      )} */}

      <div className="search-container">
        {/* Search Bar */}
        <div className="bus-search-bar">
          <select
            onChange={(e) => setPickupPoint(e.target.value)}
            value={pickupPoint}
          >
            <option value="">Pickup Point</option>
            <option value="E-JUST">E-JUST</option>
            <option value="Abaseya">Abaseya</option>
            <option value="Dandy">Dandy</option>
          </select>
          <select
            onChange={(e) => setArrivalPoint(e.target.value)}
            value={arrivalPoint}
          >
            <option value="">Arrival Point</option>
            <option value="E-JUST">E-JUST</option>
            <option value="Ramses">Ramses</option>
            <option value="Dandy">Dandy</option>
          </select>
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
          />
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Popular Routes */}
        <div className="popular-routes">
          <h3>Popular Routes</h3>
          <div className="popular-routes-list">
            {popularRoutes.map((route) => (
              <div
                key={route.id}
                className="route-card"
                onClick={() => handleRouteSelect(route.route)}
              >
                {route.route}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Buses */}
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="bus-list">
          <h2>Available Buses</h2>
          <br />
          {isLoading ? (
            <LoadingPage />
          ) : (
            filteredBuses.length ? (
              filteredBuses.map((bus) => (
                <div
                  className="bus-container"
                  key={bus.id}
                  onClick={() => handleBusSelect(bus)}
                  >
                  <div className="bus-card">  
                  <p className="bus-number">{bus.busNumber}</p>
                  </div>
                  <p>Schedule: {bus.schedule}</p>
                  <p>
                    {bus.location.pickupLocation} <span>To</span> {bus.location.arrivalLocation}
                  </p>
                  <p>Time: {convertTo12HourFormat(bus.time.departureTime)}</p>
                  <p>
                    <span>
                      {bus.seats.availableSeats === 0
                        ? "Full"
                        : `Available Seats: ${bus.seats.availableSeats}`}
                    </span>
                  </p>
                  <p>Price: {bus.price}</p>
                </div>
              ))
            ) : (
              <p>No buses found matching your criteria.</p>
            )
          )}
        </div>
      )}
      {/* contact form */}
      <div className="contact-us-bar" onClick={toggleContactForm}>
        <h3>Contact Us</h3>
      </div>

      {showContactForm && (
        <div className={`contact-us-form ${showContactForm ? "active" : ""}`}>
          <h3>Write Us a Message</h3>
          <form onSubmit={handleContactSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
          {responseMessage && <p>{responseMessage}</p>}
        </div>
      )}

      {alertFlag && (
        <Overlay
          alertFlag={alertFlag}
          alertMessage={alertMessage}
          setAlertFlag={setAlertFlag}
        />
      )}
    </div>
  );
};

export default Homepage;
