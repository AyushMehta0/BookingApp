import React, { useEffect, useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Booking, Hotel, Room } from '../types';

function BookingConfirmation() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  const bookingId = searchParams.get('id');

  useEffect(() => {
    if (!user || !bookingId) return;
    
    const fetchBookingDetails = async () => {
      try {
        // Fetch booking details
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (bookingError) throw bookingError;
        if (!bookingData) throw new Error('Booking not found');

        setBooking(bookingData);

        // Fetch hotel details
        const { data: hotelData, error: hotelError } = await supabase
          .from('hotels')
          .select('*')
          .eq('id', bookingData.hotel_id)
          .single();

        if (hotelError) throw hotelError;
        setHotel(hotelData);

        // Fetch room details
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', bookingData.room_id)
          .single();

        if (roomError) throw roomError;
        setRoom(roomData);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [user, bookingId]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking || !hotel || !room) {
    return (
      <div className="max-w-3xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Booking Not Found</h2>
          <p className="text-gray-600">
            We couldn't find the booking details you're looking for. Please check your booking reference and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-50 p-6 border-b border-green-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-green-800">Booking Confirmed!</h2>
              <p className="text-sm text-green-600">Booking reference: {booking.id}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
            <p className="text-gray-600">{hotel.location}</p>
          </div>

          <div className="border-t border-gray-200 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Check-in</h4>
                <p className="mt-1">{new Date(booking.check_in).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Check-out</h4>
                <p className="mt-1">{new Date(booking.check_out).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 py-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Room Details</h4>
            <p className="text-gray-800">{room.type}</p>
            <p className="text-gray-600">Room {room.room_number}</p>
          </div>

          <div className="border-t border-gray-200 py-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Price Details</h4>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-xl font-semibold">${booking.total_price}</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Important Information</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check-in time starts at 3 PM</li>
                <li>• Check-out time is 12 PM</li>
                <li>• Please present your ID at check-in</li>
                <li>• Free cancellation until 24 hours before check-in</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;