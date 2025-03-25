import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Hotel } from '../types';

function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const [newHotel, setNewHotel] = useState({
    name: '',
    description: '',
    location: '',
    image_url: '',
    price_per_night: 0,
    rating: 0,
    amenities: [] as string[],
  });

  useEffect(() => {
    if (!loading && isAdmin) {
      fetchHotels();
    }
  }, [loading, isAdmin]);

  const fetchHotels = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHotels(data || []);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error('Failed to load hotels');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('hotels')
        .insert([newHotel]);

      if (error) throw error;

      toast.success('Hotel added successfully');
      setIsAddingHotel(false);
      setNewHotel({
        name: '',
        description: '',
        location: '',
        image_url: '',
        price_per_night: 0,
        rating: 0,
        amenities: [],
      });
      fetchHotels();
    } catch (error) {
      console.error('Error adding hotel:', error);
      toast.error('Failed to add hotel');
    }
  };

  const handleDeleteHotel = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this hotel?')) return;

    try {
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Hotel deleted successfully');
      fetchHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast.error('Failed to delete hotel');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Hotel Management</h1>
        <button
          onClick={() => setIsAddingHotel(!isAddingHotel)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5" />
          Add New Hotel
        </button>
      </div>

      {isAddingHotel && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Hotel</h2>
          <form onSubmit={handleAddHotel} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotel Name
              </label>
              <input
                type="text"
                value={newHotel.name}
                onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newHotel.description}
                onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={newHotel.location}
                onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={newHotel.image_url}
                onChange={(e) => setNewHotel({ ...newHotel, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Night
              </label>
              <input
                type="number"
                value={newHotel.price_per_night}
                onChange={(e) => setNewHotel({ ...newHotel, price_per_night: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <input
                type="number"
                value={newHotel.rating}
                onChange={(e) => setNewHotel({ ...newHotel, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                max="5"
                step="0.1"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingHotel(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Hotel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div>Loading hotels...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{hotel.name}</h3>
                  <p className="text-gray-600 mt-1">{hotel.location}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteHotel(hotel.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-700">{hotel.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    ${hotel.price_per_night} per night
                  </span>
                  <span className="text-yellow-500">★ {hotel.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;