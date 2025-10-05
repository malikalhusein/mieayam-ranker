-- Add image_urls column to store multiple images (max 6)
ALTER TABLE public.reviews 
ADD COLUMN image_urls text[] DEFAULT ARRAY[]::text[];

-- Migrate existing single image_url to image_urls array
UPDATE public.reviews 
SET image_urls = ARRAY[image_url]::text[]
WHERE image_url IS NOT NULL AND image_url != '';

-- Add overall_score column as a computed/stored value
ALTER TABLE public.reviews 
ADD COLUMN overall_score numeric GENERATED ALWAYS AS (
  CASE 
    WHEN product_type = 'kuah' THEN
      ROUND((
        COALESCE(kuah_kekentalan, 0) + 
        COALESCE(kuah_kaldu, 0) + 
        COALESCE(kuah_keseimbangan, 0) + 
        COALESCE(kuah_aroma, 0) + 
        COALESCE(mie_tekstur, 0) + 
        COALESCE(ayam_bumbu, 0) + 
        COALESCE(ayam_potongan, 0) + 
        COALESCE(fasilitas_kebersihan, 0) + 
        COALESCE(fasilitas_alat_makan, 0) + 
        COALESCE(fasilitas_tempat, 0) + 
        COALESCE(service_durasi, 0)
      )::numeric / NULLIF((
        (CASE WHEN kuah_kekentalan IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN kuah_kaldu IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN kuah_keseimbangan IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN kuah_aroma IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN mie_tekstur IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ayam_bumbu IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ayam_potongan IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fasilitas_kebersihan IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fasilitas_alat_makan IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fasilitas_tempat IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN service_durasi IS NOT NULL THEN 1 ELSE 0 END)
      ), 0), 1)
    ELSE
      ROUND((
        COALESCE(ayam_bumbu, 0) + 
        COALESCE(ayam_potongan, 0) + 
        COALESCE(fasilitas_kebersihan, 0) + 
        COALESCE(fasilitas_alat_makan, 0) + 
        COALESCE(fasilitas_tempat, 0) + 
        COALESCE(service_durasi, 0)
      )::numeric / NULLIF((
        (CASE WHEN ayam_bumbu IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN ayam_potongan IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fasilitas_kebersihan IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fasilitas_alat_makan IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN fasilitas_tempat IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN service_durasi IS NOT NULL THEN 1 ELSE 0 END)
      ), 0), 1)
  END
) STORED;