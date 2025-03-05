import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookedEvents, setBookedEvents] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken"); // Get token from localStorage

  useEffect(() => {
    fetchEvents();
    fetchBookedEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/events");
      setEvents(data);
      console.log("Events:", data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchBookedEvents = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Correct way to send JWT token
          },
        }
      );
      setBookedEvents(data);
      console.log("Booked Events:", data);
    } catch (error) {
      console.error("Error fetching booked events:", error);
    }
  };

  const handleBookEvent = async (eventId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/bookings/${eventId}`, // Correct API endpoint
        {}, // Empty body (since no request payload is needed)
        {
          headers: {
            Authorization: `Bearer ${token}`, // Correct way to send JWT token
          },
        }
      );
      fetchBookedEvents(); // Refresh booked events after successful booking
    } catch (error) {
      console.error(
        "Error booking event:",
        error.response?.data || error.message
      );
    }
  };

  const handleCancelBooking = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${eventId}`);
      fetchBookedEvents();
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Events</h2>

      <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
        Logout
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event._id} className="bg-white shadow-lg p-4 rounded-lg">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p>{event.date}</p>
            <p>{event.venue}</p>

            {bookedEvents.some((bevent) => bevent.event._id === event._id) ? (
              <button
                onClick={() => handleCancelBooking(event._id)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
              >
                Cancel Booking
              </button>
            ) : (
              <button
                onClick={() => handleBookEvent(event._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
              >
                Book Event
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
