import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate, Link } from "react-router-dom";

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
      const formattedEvents = data.map((event) => ({
        ...event,
        date: new Date(event.date).toISOString().split("T")[0], // Converts to YYYY-MM-DD
      }));
      setEvents(formattedEvents);
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
    console.log(token);
    try {
      await axios.delete(
        `http://localhost:5000/api/bookings/cancel/${eventId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`, // Correct way to send JWT token
          },
        }
      );
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
    <div className="p-6 bg-[url(event.jpg)] w-full h-screen   ">
      <div className="flex justify-items-start gap-2 mb-10">
        <h2 className="text-3xl font-bold  text-white ">Available Events</h2>

        <button
          onClick={handleLogout}
          className="bg-red-500   text-white  px-6  text-[10px] rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  p-10 border-0 rounded-md">
        {events.map((event) => (
          <div
            key={event._id}
            className="flex flex-col bg-white items-center justify-center shadow-amber-300 shadow-lg p-4 rounded-b-3xl"
          >
            <h3 className="text-xl fomt- font-semibold">{event.title}</h3>
            <p className="font-light text-blue-950">{event.date}</p>
            <p className="font-mono">{event.venue}</p>
            <div className="flex justify-between ">
              {bookedEvents.some((bevent) => bevent.event._id === event._id) ? (
                <button
                  onClick={() => handleCancelBooking(event._id)}
                  className="bg-red-500 mr-2  text-white px-4 py-2 rounded-full mt-2"
                >
                  Cancel Booking
                </button>
              ) : (
                <button
                  onClick={() => handleBookEvent(event._id)}
                  className="bg-blue-600 mr-2 text-white px-4 py-2 rounded-t-xl mt-2"
                >
                  Book Event
                </button>
              )}
              <Link to={`event/${event._id}`} state={{ event }}>
                <button className="bg-green-600 text-white px-4 py-2 rounded-t-xl mt-2">
                  View Event
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
