-- Drop the existing policy that doesn't explicitly check for authentication
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Add an explicit policy that only allows authenticated users to view their own roles
CREATE POLICY "Authenticated users can view only their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());