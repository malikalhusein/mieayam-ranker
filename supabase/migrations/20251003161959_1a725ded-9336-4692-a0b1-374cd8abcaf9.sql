-- Create reviews table with comprehensive scoring system
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outlet_name TEXT NOT NULL,
  address TEXT NOT NULL,
  google_map_url TEXT,
  city TEXT NOT NULL,
  visit_date DATE NOT NULL,
  price INTEGER NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('kuah', 'goreng')),
  
  -- Kuah scores (1-10)
  kuah_kekentalan INTEGER CHECK (kuah_kekentalan >= 1 AND kuah_kekentalan <= 10),
  kuah_kaldu INTEGER CHECK (kuah_kaldu >= 1 AND kuah_kaldu <= 10),
  kuah_keseimbangan INTEGER CHECK (kuah_keseimbangan >= 1 AND kuah_keseimbangan <= 10),
  kuah_aroma INTEGER CHECK (kuah_aroma >= 1 AND kuah_aroma <= 10),
  
  -- Mie scores (1-10)
  mie_tipe TEXT,
  mie_tekstur INTEGER CHECK (mie_tekstur >= 1 AND mie_tekstur <= 10),
  
  -- Ayam scores (1-10)
  ayam_bumbu INTEGER CHECK (ayam_bumbu >= 1 AND ayam_bumbu <= 10),
  ayam_potongan INTEGER CHECK (ayam_potongan >= 1 AND ayam_potongan <= 10),
  
  -- Fasilitas scores (1-10)
  fasilitas_kebersihan INTEGER CHECK (fasilitas_kebersihan >= 1 AND fasilitas_kebersihan <= 10),
  fasilitas_alat_makan INTEGER CHECK (fasilitas_alat_makan >= 1 AND fasilitas_alat_makan <= 10),
  fasilitas_tempat INTEGER CHECK (fasilitas_tempat >= 1 AND fasilitas_tempat <= 10),
  
  -- Service & Perceptual mapping
  service_durasi INTEGER, -- in seconds
  complexity INTEGER CHECK (complexity >= 1 AND complexity <= 10),
  sweetness INTEGER CHECK (sweetness >= 1 AND sweetness <= 10),
  
  -- Notes & images
  notes TEXT,
  image_url TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can view all reviews
CREATE POLICY "Anyone can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

-- Create user roles enum and table for admin management
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Only admins can insert, update, delete reviews
CREATE POLICY "Admins can insert reviews" 
ON public.reviews 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update reviews" 
ON public.reviews 
FOR UPDATE 
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete reviews" 
ON public.reviews 
FOR DELETE 
TO authenticated
USING (public.is_admin(auth.uid()));

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('review-images', 'review-images', true);

-- Storage policies for review images
CREATE POLICY "Anyone can view review images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'review-images');

CREATE POLICY "Admins can upload review images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'review-images' AND 
  public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update review images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'review-images' AND 
  public.is_admin(auth.uid())
);