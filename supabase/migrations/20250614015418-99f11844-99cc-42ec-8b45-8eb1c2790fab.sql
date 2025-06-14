-- Fix infinite recursion in RLS policies by creating security definer function
-- Drop existing problematic policies first
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create security definer function to get current user role without triggering RLS
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.user_role AS $$
SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Recreate policies using the security definer function
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() IN ('admin', 'hr'));

-- Fix other recursive policies in courses table
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
CREATE POLICY "Admins can manage courses" 
ON public.courses 
FOR ALL 
USING (public.get_current_user_role() IN ('admin', 'teacher'));

-- Fix other recursive policies in departments table  
DROP POLICY IF EXISTS "Admins can manage departments" ON public.departments;
CREATE POLICY "Admins can manage departments" 
ON public.departments 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Fix other recursive policies in programs table
DROP POLICY IF EXISTS "Admins can manage programs" ON public.programs;
CREATE POLICY "Admins can manage programs" 
ON public.programs 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Fix other recursive policies in students table
DROP POLICY IF EXISTS "Admins and HR can manage students" ON public.students;
DROP POLICY IF EXISTS "Admins and HR can view all students" ON public.students;

CREATE POLICY "Admins and HR can manage students" 
ON public.students 
FOR ALL 
USING (public.get_current_user_role() IN ('admin', 'hr'));

CREATE POLICY "Admins and HR can view all students" 
ON public.students 
FOR SELECT 
USING (public.get_current_user_role() IN ('admin', 'hr'));