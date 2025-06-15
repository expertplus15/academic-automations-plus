
-- Create campuses table
CREATE TABLE public.campuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL UNIQUE,
  address TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sites table
CREATE TABLE public.sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL,
  address TEXT,
  description TEXT,
  campus_id UUID NOT NULL REFERENCES public.campuses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campus_id, code)
);

-- Add site_id to rooms table and make building optional
ALTER TABLE public.rooms 
ADD COLUMN site_id UUID REFERENCES public.sites(id) ON DELETE SET NULL;

-- Add updated_at trigger for campuses
CREATE TRIGGER update_campuses_updated_at 
BEFORE UPDATE ON public.campuses 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for sites
CREATE TRIGGER update_sites_updated_at 
BEFORE UPDATE ON public.sites 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a default campus and site for existing rooms
INSERT INTO public.campuses (name, code, description) 
VALUES ('Campus Principal', 'MAIN', 'Campus principal de l''établissement');

INSERT INTO public.sites (name, code, campus_id, description)
VALUES ('Site Principal', 'MAIN', 
  (SELECT id FROM public.campuses WHERE code = 'MAIN'), 
  'Site principal du campus');

-- Update existing rooms to use the default site
UPDATE public.rooms 
SET site_id = (SELECT id FROM public.sites WHERE code = 'MAIN')
WHERE site_id IS NULL;
