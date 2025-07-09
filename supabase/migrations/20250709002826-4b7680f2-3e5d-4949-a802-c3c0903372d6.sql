-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all presence data" ON public.user_presence;
DROP POLICY IF EXISTS "Users can update their own presence" ON public.user_presence;
DROP POLICY IF EXISTS "Users can insert their own presence" ON public.user_presence;
DROP POLICY IF EXISTS "Users can delete their own presence" ON public.user_presence;

-- Create new correct policies
CREATE POLICY "Users can view all presence data" 
ON public.user_presence 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own presence" 
ON public.user_presence 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own presence" 
ON public.user_presence 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presence" 
ON public.user_presence 
FOR DELETE 
USING (auth.uid() = user_id);