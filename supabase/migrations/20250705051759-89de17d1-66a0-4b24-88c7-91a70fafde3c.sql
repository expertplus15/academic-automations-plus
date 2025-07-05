-- Phase 1: Population des données de base pour le module Resources (corrigée avec bons types)

-- Création des catégories d'actifs de base
INSERT INTO public.asset_categories (name, code, description) VALUES
('Audiovisuel', 'AV', 'Équipements de projection et sonorisation'),
('Informatique', 'IT', 'Ordinateurs, serveurs et équipements réseau'),
('Mobilier', 'MOB', 'Tables, chaises et mobilier de bureau'),
('Laboratoire', 'LAB', 'Équipements scientifiques et techniques'),
('Bureau', 'BUR', 'Imprimantes, téléphones et fournitures de bureau'),
('Sécurité', 'SEC', 'Caméras, alarmes et équipements de sécurité')
ON CONFLICT (code) DO NOTHING;

-- Création de quelques salles d'exemple si elles n'existent pas
INSERT INTO public.rooms (name, code, room_type, capacity, status, building) VALUES
('Amphi A1', 'AA1', 'amphitheater', 200, 'available', 'Bâtiment A'),
('Salle B2', 'SB2', 'classroom', 30, 'available', 'Bâtiment B'),
('Lab Info C3', 'LC3', 'lab', 25, 'available', 'Bâtiment C'),
('Administration', 'ADM', 'conference', 10, 'available', 'Bâtiment Admin'),
('Bibliothèque', 'BIB', 'conference', 50, 'available', 'Bâtiment Central')
ON CONFLICT (code) DO NOTHING;

-- Insertion d'équipements d'exemple avec QR codes
INSERT INTO public.assets (
  name, description, category_id, brand, model, serial_number,
  purchase_date, purchase_price, current_value, location, 
  qr_code, warranty_end_date, status, condition_status, asset_number
) VALUES
-- Équipements audiovisuels
('Projecteur Epson EB-2250U', 'Projecteur laser WUXGA 5000 lumens', 
 (SELECT id FROM asset_categories WHERE code = 'AV'), 
 'Epson', 'EB-2250U', 'EPS2024001', 
 '2024-01-15', 1200.00, 1080.00, 'Amphi A1',
 'QR_AST250001', '2027-01-15', 'active', 'excellent', 'AST250001'),

('Enceintes JBL EON615', 'Paire d''enceintes actives 1000W', 
 (SELECT id FROM asset_categories WHERE code = 'AV'), 
 'JBL', 'EON615', 'JBL2024002', 
 '2024-02-10', 800.00, 720.00, 'Amphi A1',
 'QR_AST250002', '2027-02-10', 'active', 'good', 'AST250002'),

-- Équipements informatiques
('Ordinateur portable Dell Latitude 5540', 'PC portable professionnel i7 16GB RAM', 
 (SELECT id FROM asset_categories WHERE code = 'IT'), 
 'Dell', 'Latitude 5540', 'DL2023001', 
 '2023-09-20', 1200.00, 900.00, 'Lab Info C3',
 'QR_AST250003', '2026-09-20', 'maintenance', 'good', 'AST250003'),

('Serveur HP ProLiant ML350', 'Serveur tour Xeon 32GB RAM 2TB', 
 (SELECT id FROM asset_categories WHERE code = 'IT'), 
 'HP', 'ProLiant ML350', 'HP2023002', 
 '2023-11-15', 2500.00, 2000.00, 'Salle serveur',
 'QR_AST250004', '2026-11-15', 'active', 'excellent', 'AST250004'),

-- Équipements de bureau
('Imprimante laser HP LaserJet Pro M404n', 'Imprimante monochrome réseau', 
 (SELECT id FROM asset_categories WHERE code = 'BUR'), 
 'HP', 'LaserJet Pro M404n', 'HP2023003', 
 '2023-11-10', 350.00, 280.00, 'Administration',
 'QR_AST250005', '2026-11-10', 'active', 'good', 'AST250005'),

('Téléphone IP Cisco 7841', 'Téléphone VoIP 4 lignes écran couleur', 
 (SELECT id FROM asset_categories WHERE code = 'BUR'), 
 'Cisco', '7841', 'CSC2024001', 
 '2024-01-20', 180.00, 162.00, 'Administration',
 'QR_AST250006', '2027-01-20', 'active', 'excellent', 'AST250006'),

-- Mobilier
('Table de réunion rectangulaire', 'Table 8 personnes chêne massif', 
 (SELECT id FROM asset_categories WHERE code = 'MOB'), 
 'Steelcase', 'Series 1', 'SC2023001', 
 '2023-08-15', 1200.00, 1000.00, 'Salle réunion A2',
 'QR_AST250007', NULL, 'active', 'excellent', 'AST250007'),

('Chaises de bureau ergonomiques', 'Lot de 12 chaises ajustables', 
 (SELECT id FROM asset_categories WHERE code = 'MOB'), 
 'Herman Miller', 'Aeron', 'HM2023001', 
 '2023-08-15', 4800.00, 4200.00, 'Salle B2',
 'QR_AST250008', NULL, 'active', 'good', 'AST250008'),

-- Équipements de laboratoire
('Microscope optique Leica DM2700', 'Microscope binoculaire LED 1000x', 
 (SELECT id FROM asset_categories WHERE code = 'LAB'), 
 'Leica', 'DM2700', 'LCA2024001', 
 '2024-03-10', 3500.00, 3200.00, 'Lab Sciences D1',
 'QR_AST250009', '2027-03-10', 'active', 'excellent', 'AST250009'),

('Balance de précision Mettler Toledo', 'Balance analytique ±0.1mg', 
 (SELECT id FROM asset_categories WHERE code = 'LAB'), 
 'Mettler Toledo', 'XS205', 'MT2024001', 
 '2024-04-05', 2200.00, 2000.00, 'Lab Chimie D2',
 'QR_AST250010', '2027-04-05', 'active', 'good', 'AST250010'),

-- Équipements de sécurité
('Caméra IP Hikvision 4K', 'Caméra dôme extérieure vision nocturne', 
 (SELECT id FROM asset_categories WHERE code = 'SEC'), 
 'Hikvision', 'DS-2CD2186G2', 'HIK2024001', 
 '2024-02-20', 400.00, 360.00, 'Entrée principale',
 'QR_AST250011', '2027-02-20', 'active', 'excellent', 'AST250011'),

('Système d''alarme Ajax Hub 2', 'Centrale d''alarme sans fil IoT', 
 (SELECT id FROM asset_categories WHERE code = 'SEC'), 
 'Ajax', 'Hub 2', 'AJX2024001', 
 '2024-03-01', 280.00, 250.00, 'Local technique',
 'QR_AST250012', '2027-03-01', 'active', 'good', 'AST250012');