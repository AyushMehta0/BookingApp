import React from 'react';
import SearchForm from '../components/SearchForm';

function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find your perfect stay
        </h1>
        <p className="text-xl text-gray-600">
          Search hotels and book your next adventure
        </p>
      </div>
      <SearchForm />
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
            alt="London"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">London</h3>
            <p className="text-gray-600">32 properties</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80"
            alt="Paris"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Paris</h3>
            <p className="text-gray-600">28 properties</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542704792-e30dac463c90?auto=format&fit=crop&w=800&q=80"
            alt="New York"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">New York</h3>
            <p className="text-gray-600">45 properties</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;