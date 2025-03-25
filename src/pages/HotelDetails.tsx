import React from 'react';
import { useParams } from 'react-router-dom';

function HotelDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Hotel Details</h1>
          <p className="text-gray-600">Loading hotel information...</p>
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;