import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SearchForm from '../components/SearchForm';
import type { Hotel } from '../types';

function Search() {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const location = searchParams.get('location');
        let query = supabase.from('hotels').select('*');
        
        if (location) {
          query = query.ilike('location', `%${location}%`);
        }

        const { data, error } = await query.order('rating', { ascending: false });
        
        if (error) throw error;
        setHotels(data || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <SearchForm />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Search Results</h2>
        
        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">No hotels found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {hotels.map((hotel) => (
              <Link
                key={hotel.id}
                to={`/hotel/${hotel.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={hotel.image_url}
                      alt={hotel.name}
                      className="h-48 w-full object-cover md:h-full"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{hotel.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 mr-1" />
                        <span className="font-semibold">{hotel.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{hotel.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Starting from</p>
                        <p className="text-xl font-semibold text-blue-600">
                          ${hotel.price_per_night}
                          <span className="text-sm text-gray-600">/night</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;