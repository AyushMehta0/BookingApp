/*
  # Initial Schema Setup for Hotel Booking Application

  1. Tables
    - hotels
      - Basic hotel information including name, description, location, etc.
    - rooms
      - Room details associated with hotels
    - bookings
      - Booking records linking users, hotels, and rooms
    - admins
      - Admin user management

  2. Security
    - Enable RLS on all tables
    - Set up appropriate access policies
*/

-- Create hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  image_url text NOT NULL,
  price_per_night decimal NOT NULL,
  rating decimal DEFAULT 0,
  amenities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE,
  room_number text NOT NULL,
  type text NOT NULL,
  price decimal NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id uuid REFERENCES hotels(id) ON DELETE CASCADE,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  check_in date NOT NULL,
  check_out date NOT NULL,
  total_price decimal NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policies for hotels
CREATE POLICY "Hotels are viewable by everyone"
  ON hotels FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Hotels are editable by admins"
  ON hotels FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM admins
    )
  );

-- Policies for rooms
CREATE POLICY "Rooms are viewable by everyone"
  ON rooms FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Rooms are editable by admins"
  ON rooms FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM admins
    )
  );

-- Policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for admins
CREATE POLICY "Admins table is viewable by authenticated users"
  ON admins FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only super admins can modify admin table"
  ON admins FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM admins
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON hotels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();