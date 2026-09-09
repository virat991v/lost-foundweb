-- ============================================================
-- Lost & Found Campus Platform — Storage Policies
-- storage-policies.sql
-- ============================================================
-- Run this in the Supabase SQL editor after creating storage buckets.
-- Required buckets: item-photos, proof-documents

-- ============================================================
-- BUCKET: item-photos
-- Public read, authenticated write (own folder only)
-- ============================================================

-- Allow public read access to item photos
CREATE POLICY "Public can view item photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'item-photos');

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Authenticated users can upload item photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'item-photos'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own item photos
CREATE POLICY "Users can update their own item photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'item-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own item photos
CREATE POLICY "Users can delete their own item photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'item-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- BUCKET: proof-documents
-- Private — only owner and admins can read
-- ============================================================

-- Allow users to view only their own proof documents
CREATE POLICY "Users can view their own proof documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'proof-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow admins to view all proof documents
CREATE POLICY "Admins can view all proof documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'proof-documents'
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow authenticated users to upload their own proof documents
CREATE POLICY "Authenticated users can upload proof documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'proof-documents'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- BUCKET: avatars
-- Public read, authenticated write (own folder only)
-- ============================================================

CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
