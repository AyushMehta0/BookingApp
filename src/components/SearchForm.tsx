import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Search, Users, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';
import "react-datepicker/dist/react-datepicker.css";
import type { SearchFilters } from '../types';

function SearchForm() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
  ]);
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000),
    guests: 1,
    rooms: 1
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('hotels')
          .select('location')
          .order('location');
        
        if (error) throw error;
        
        // Get unique locations
        const uniqueLocations = Array.from(new Set(data.map((hotel: { location: string }) => hotel.location))).concat(locations);
        setLocations(uniqueLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams({
      location: filters.location,
      checkIn: filters.checkIn.toISOString(),
      checkOut: filters.checkOut.toISOString(),
      guests: filters.guests.toString(),
      rooms: filters.rooms.toString()
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Home className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a destination</option>
              {locations.map((location: string) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Check-in</label>
          <DatePicker
            selected={filters.checkIn}
            onChange={(date: Date | null) => setFilters({ ...filters, checkIn: date || new Date() })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            minDate={new Date()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Check-out</label>
          <DatePicker
            selected={filters.checkOut}
            onChange={(date: Date | null) => setFilters({ ...filters, checkOut: date || new Date() })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            minDate={filters.checkIn}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Guests & Rooms</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filters.guests}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters({ ...filters, guests: parseInt(e.target.value) })}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-5">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Search className="inline-block h-5 w-5 mr-2" />
            Search Hotels
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchForm;
