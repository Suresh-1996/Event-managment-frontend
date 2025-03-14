import React from "react";
import { useLocation, Link } from "react-router-dom";

const Event = () => {
  const location = useLocation();
  const { event } = location.state;

  // Format date to YYYY-MM-DD
  const formattedDate = new Date(event.date).toISOString().split("T")[0];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="bg-orange-300 shadow-lg rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>
        <p className="text-gray-600 text-lg mb-2">{event.description}</p>
        <div className="mt-4">
          <p className="text-gray-700">
            <span className="font-semibold">Date:</span> {formattedDate}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Venue:</span> {event.venue}
          </p>
        </div>
        <Link className="w-full" to={"/dashboard"}>
          <button className="bg-green-600 text-white px-4 py-2 rounded mt-2 w-full">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Event;
