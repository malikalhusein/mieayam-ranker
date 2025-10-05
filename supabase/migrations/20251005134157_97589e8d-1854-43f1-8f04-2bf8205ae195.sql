-- Add RLS policies for INSERT, UPDATE, and DELETE on user_roles table
-- Only admins can modify role assignments to prevent privilege escalation

-- Policy for INSERT: Only admins can assign roles
CREATE POLICY "Only admins can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Policy for UPDATE: Only admins can modify role assignments
CREATE POLICY "Only admins can modify roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Policy for DELETE: Only admins can remove role assignments
CREATE POLICY "Only admins can remove roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));