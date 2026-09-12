-- =============================================================================
-- StayNest Premium Hostel - MySQL Seed Data
-- =============================================================================
-- Run after schema.sql:   mysql -u root -p staynest < mysql/seed.sql
-- Mirrors the deterministic demo dataset seen in the app (src/lib/demoData.js):
--   40 rooms, 82 occupied beds (~82 students), 14 bookings, 12 payments,
--   8 reviews, 3 complaints, the weekly food menu and owner/admin accounts.
-- =============================================================================

USE staynest;

-- -----------------------------------------------------------------------------
-- 1) Hostel settings
-- -----------------------------------------------------------------------------
INSERT INTO hostel (name, tagline) VALUES
  ('StayNest Premium Hostel', 'Your Safe & Comfortable Home Away From Home');

-- -----------------------------------------------------------------------------
-- 2) Owner / admin accounts
-- -----------------------------------------------------------------------------
INSERT INTO profiles (id, full_name, mobile, email, role, verified) VALUES
  ('OWN-0001', 'Hostel Owner', '6303693659', 'owner@staynest.in', 'owner', 1),
  ('ADM-0001', 'Hostel Admin', '6303693652', 'admin@staynest.in', 'admin', 1);

-- -----------------------------------------------------------------------------
-- 3) Rooms - 10 per sharing type.
--    Floor 1 = 4 Sharing, Floor 2 = 3 Sharing, Floor 3 = 2 Sharing, Floor 4 = Single.
--    Rooms in positions 4-6 on each floor are AC (roughly 30%, like the demo).
--    Rents/advances match the PRICING object in src/config.js.
-- -----------------------------------------------------------------------------
INSERT INTO rooms (id, room_number, floor, sharing, type_label, ac, rent, advance)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 10)
SELECT CONCAT(f.floor, LPAD(s.n, 2, '0')),
       CONCAT(f.floor, LPAD(s.n, 2, '0')),
       f.floor,
       f.sharing,
       f.type_label,
       IF(s.n BETWEEN 4 AND 6, 1, 0),
       IF(s.n BETWEEN 4 AND 6, f.ac_rent, f.rent),
       f.advance
FROM seq s
CROSS JOIN (
  SELECT 1 AS floor, 4 AS sharing, '4 Sharing'     AS type_label, 5000  AS rent, 6000  AS ac_rent, 5000  AS advance
  UNION ALL SELECT 2, 3, '3 Sharing', 6000, 7500, 6000
  UNION ALL SELECT 3, 2, '2 Sharing', 8000, 10000, 8000
  UNION ALL SELECT 4, 1, 'Single Sharing', 12000, 15000, 12000
) f
ORDER BY f.floor, s.n;

-- -----------------------------------------------------------------------------
-- 4) Beds - one row per bed in every room (160 beds in total)
-- -----------------------------------------------------------------------------
INSERT INTO beds (id, room_id, bed_number, status)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 4)
SELECT CONCAT(r.room_number, '-b', s.n), r.room_number, CONCAT('Bed ', s.n), 'available'
FROM seq s
CROSS JOIN rooms r
WHERE s.n <= r.sharing;

-- -----------------------------------------------------------------------------
-- 5) Students - generate 82 students (STU-1000 .. STU-1081) deterministically.
--    Names cycle through the demo name pool; colleges / courses / gender / year
--    are assigned by position so the data is stable on every re-seed.
-- -----------------------------------------------------------------------------
INSERT INTO profiles (id, full_name, mobile, email, college, course, gender, year,
                      payment_status, role, verified, joining_date)
WITH RECURSIVE seq AS (SELECT 0 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 81),
names AS (
  SELECT id, nm
  FROM JSON_TABLE(
    '["Rahul Sharma","Priya Patel","Aarav Mehta","Sneha Reddy","Vikram Singh","Ananya Gupta","Arjun Nair","Kavya Iyer","Rohan Deshmukh","Ishita Kulkarni","Manish Kumar","Divya Venkatesh","Aditya Rao","Pooja Mishra","Karthik Babu","Neha Agarwal","Siddharth Jain","Anjali Singhania","Ravi Teja","Meera Nandakumar","Deepak Chauhan","Sana Khan","Nikhil Bansal","Ritika Sharma","Varun Kapoor","Tanvi Malhotra","Abhishek Roy","Shreya Ghosh","Harsha Vardhan","Nandini Pillai","Gaurav Joshi","Aishwarya Menon","Farhan Ali","Lakshmi Suresh","Pranav Bhat","Swati Mirji","Yash Chopra","Bhuvan Shetty","Ritu Das","Amol Pawar"]',
    '$[*]' COLUMNS (id FOR ORDINALITY, nm VARCHAR(80) PATH '$')
  ) jt
),
colleges AS (
  SELECT 1 AS id, 'Anna University' AS name
  UNION ALL SELECT 2, 'SRM Institute of Science & Technology'
  UNION ALL SELECT 3, 'IIT Madras'
  UNION ALL SELECT 4, 'VIT Chennai'
  UNION ALL SELECT 5, 'Loyola College'
  UNION ALL SELECT 6, 'Madras Christian College'
  UNION ALL SELECT 7, 'Hindustan Institute of Technology'
  UNION ALL SELECT 8, 'St. Joseph College'
),
courses AS (
  SELECT 1 AS id, 'B.Tech CSE' AS name
  UNION ALL SELECT 2, 'B.Tech ECE'
  UNION ALL SELECT 3, 'B.Tech Mechanical'
  UNION ALL SELECT 4, 'MBA'
  UNION ALL SELECT 5, 'B.Sc Computer Science'
  UNION ALL SELECT 6, 'B.Com'
  UNION ALL SELECT 7, 'M.Sc Physics'
  UNION ALL SELECT 8, 'BCA'
  UNION ALL SELECT 9, 'MCA'
  UNION ALL SELECT 10, 'B.A English'
)
SELECT CONCAT('STU-', 1000 + s.n),
       n.nm,
       CONCAT('9', LPAD((6000000000 + s.n * 3129873) % 1000000000, 9, '0')),
       IF(s.n < 40,
          CONCAT(TRIM(BOTH '.' FROM LOWER(REGEXP_REPLACE(n.nm, '[^A-Za-z]+', '.'))), '@student.demo'),
          CONCAT(TRIM(BOTH '.' FROM LOWER(REGEXP_REPLACE(n.nm, '[^A-Za-z]+', '.'))), s.n, '@student.demo')
       ),
       c.name,
       co.name,
       IF(s.n % 3 = 0, 'Female', 'Male'),
       1 + MOD(s.n, 4),
       IF(s.n % 3 = 0, 'pending', 'paid'),
       'student',
       1,
       DATE_ADD('2025-01-01', INTERVAL (1 + MOD(s.n, 560)) DAY)
FROM seq s
JOIN names   n  ON n.id  = 1 + MOD(s.n, 40)
JOIN colleges c ON c.id  = 1 + MOD(s.n, 8)
JOIN courses  co ON co.id = 1 + MOD(s.n, 10);

-- -----------------------------------------------------------------------------
-- 6) Occupy the first 82 beds (rooms/beds ordered deterministically) and link
--    each occupied bed to the matching STU-xxxx profile.
-- -----------------------------------------------------------------------------
CREATE TEMPORARY TABLE bed_map AS
SELECT CONCAT('STU-', 1000 + ord.rn - 1) AS student_id,
       ord.id AS bed_id,
       ord.room_id, ord.bed_number
FROM (
  SELECT id, room_id, bed_number,
         ROW_NUMBER() OVER (ORDER BY room_id, CAST(REPLACE(bed_number, 'Bed ', '') AS UNSIGNED)) AS rn
  FROM beds
) ord
WHERE ord.rn <= 82;

UPDATE beds b
JOIN bed_map m ON m.bed_id = b.id
SET b.status = 'occupied', b.student_id = m.student_id;

UPDATE profiles p
JOIN bed_map m ON m.student_id = p.id
SET p.room_number = m.room_id,
    p.bed_number  = m.bed_number,
    p.bed_id      = m.bed_id;

DROP TEMPORARY TABLE bed_map;

-- -----------------------------------------------------------------------------
-- 7) Bookings for the first 14 students (BK-1001 .. BK-1014)
--    amount = rent + advance + food(2000) + electricity(500)
-- -----------------------------------------------------------------------------
INSERT INTO bookings (booking_id, student_id, student_name, student_mobile, student_email,
                      college, room_number, sharing, bed_number, bed_id, date,
                      rent, advance, food, electricity, amount,
                      transaction_id, payment_method, payment_status, status)
WITH RECURSIVE seq AS (SELECT 0 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 13)
SELECT CONCAT('BK-', 1001 + s.n),
       p.id, p.full_name, p.mobile, p.email, p.college,
       p.room_number, r.sharing, p.bed_number, p.bed_id, p.joining_date,
       r.rent, r.advance, 2000, 500, r.rent + r.advance + 2000 + 500,
       CONCAT('TXN-', 810000 + s.n * 137),
       ELT(1 + MOD(s.n, 4), 'UPI', 'Credit Card', 'Net Banking', 'Debit Card'),
       p.payment_status,
       IF(s.n % 5 = 0, 'pending', 'confirmed')
FROM seq s
JOIN profiles p ON p.id = CONCAT('STU-', 1000 + s.n)
JOIN rooms r    ON r.room_number = p.room_number;

-- -----------------------------------------------------------------------------
-- 8) Payments for the first 12 students (PAY-0001 .. PAY-0012)
-- -----------------------------------------------------------------------------
INSERT INTO payments (payment_id, student_id, student_name, room_number, bed,
                      amount, method, transaction_id, date, status, type)
WITH RECURSIVE seq AS (SELECT 0 AS n UNION ALL SELECT n + 1 FROM seq WHERE n < 11)
SELECT CONCAT('PAY-', LPAD(s.n + 1, 4, '0')),
       p.id, p.full_name, p.room_number, p.bed_number,
       r.rent + 2000 + 500,
       ELT(1 + MOD(s.n, 4), 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'),
       CONCAT('TXN-', 810000 + s.n * 137),
       p.joining_date,
       p.payment_status,
       IF(s.n % 2 = 0, 'Monthly Rent', 'Advance')
FROM seq s
JOIN profiles p ON p.id = CONCAT('STU-', 1000 + s.n)
JOIN rooms r    ON r.room_number = p.room_number;

-- -----------------------------------------------------------------------------
-- 9) Reviews
-- -----------------------------------------------------------------------------
INSERT INTO reviews (student_name, college, rating, review_text, date, verified) VALUES
  ('Rahul Sharma',       'IIT Madras', 5, 'Very clean rooms and good facilities. The food is amazing and the warden is super friendly. Truly feels like home.', '2026-07-18', 1),
  ('Sneha Reddy',        'Anna University', 5, 'Safe and secure environment with 24/7 CCTV. My parents are very happy with the stay.', '2026-07-05', 1),
  ('Arjun Nair',         'VIT Chennai', 4, 'Great study area and high speed Wi-Fi. Room service and cleaning is regular. Highly recommended.', '2026-06-28', 1),
  ('Ananya Gupta',       'Loyola College', 5, 'Best decision I made for my hostel. Warm food, hot water, power backup - everything is well maintained.', '2026-06-15', 1),
  ('Vikram Singh',       'SRM Institute of Science & Technology', 4, 'Comfortable beds and spacious rooms. Laundry and housekeeping are super convenient.', '2026-06-02', 1),
  ('Kavya Iyer',         'Madras Christian College', 5, 'The common area is perfect for hanging out and the parking is very safe. Value for money stay.', '2026-05-20', 1),
  ('Rohan Deshmukh',     'Hindustan Institute of Technology', 3, 'Nice hostel overall. Wi-Fi could be faster during peak hours but everything else is great.', '2026-05-08', 1),
  ('Ishita Kulkarni',    'St. Joseph College', 5, 'Home away from home! The management is always available and resolves issues quickly.', '2026-04-25', 1);

-- -----------------------------------------------------------------------------
-- 10) Complaints
-- -----------------------------------------------------------------------------
INSERT INTO complaints (student_name, room, type, message, status, date) VALUES
  ('Manish Kumar',   '301', 'Electrical', 'The tubelight in room 301 is flickering.',            'resolved',    '2026-08-20'),
  ('Divya Venkatesh', '201', 'Cleaning',  'Need extra cleaning near the washroom area.',           'in_progress', '2026-09-01'),
  ('Aditya Rao',     '402', 'Wi-Fi',     'Wi-Fi connectivity is weak in room 402.',               'open',        '2026-09-06');

-- -----------------------------------------------------------------------------
-- 11) Weekly food menu
-- -----------------------------------------------------------------------------
INSERT INTO food_menu (day, meal, items, timings) VALUES
  ('Monday',    'Breakfast', JSON_ARRAY('Idli Sambar','Vada + Chutney','Masala Chai'), '7:30 AM - 9:30 AM'),
  ('Tuesday',   'Breakfast', JSON_ARRAY('Poori Bhaji','Banana','Coffee'),              '7:30 AM - 9:30 AM'),
  ('Wednesday', 'Breakfast', JSON_ARRAY('Dosa + Chutney','Milk','Coconut Chutney'),    '7:30 AM - 9:30 AM'),
  ('Thursday',  'Breakfast', JSON_ARRAY('Pongal','Sambar','Chai'),                     '7:30 AM - 9:30 AM'),
  ('Friday',    'Breakfast', JSON_ARRAY('Uttapam','Mint Chutney','Coffee'),            '7:30 AM - 9:30 AM'),
  ('Saturday',  'Breakfast', JSON_ARRAY('Rava Idli','Chutney','Milk'),                 '7:30 AM - 9:30 AM'),
  ('Sunday',    'Breakfast', JSON_ARRAY('Special Masala Dosa','Vada','Chai'),          '7:30 AM - 9:30 AM'),

  ('Monday',    'Lunch', JSON_ARRAY('Rice + Sambar','Curd Rice','Chicken Curry','Rasam'),    '12:30 PM - 2:00 PM'),
  ('Tuesday',   'Lunch', JSON_ARRAY('Rice + Dal','Ghee Roast','Veg Curry','Buttermilk'),     '12:30 PM - 2:00 PM'),
  ('Wednesday', 'Lunch', JSON_ARRAY('Veg Fried Rice','Noodles','Manchurian','Salad'),        '12:30 PM - 2:00 PM'),
  ('Thursday',  'Lunch', JSON_ARRAY('Rice + Rasam','Paneer Butter Masala','Roti','Curd'),    '12:30 PM - 2:00 PM'),
  ('Friday',    'Lunch', JSON_ARRAY('Biryani (Veg/Chicken)','Raita','Salad','Sweet'),        '12:30 PM - 2:00 PM'),
  ('Saturday',  'Lunch', JSON_ARRAY('Curd Rice','Tomato Rice','Fry (Veg/Egg)','Chutney'),    '12:30 PM - 2:00 PM'),
  ('Sunday',    'Lunch', JSON_ARRAY('Special Chicken Biryani','Raita','Curd','Ice Cream'),   '12:30 PM - 2:00 PM'),

  ('Monday',    'Dinner', JSON_ARRAY('Chapati + Paneer Masala','Rice + Dal','Salad'),        '7:30 PM - 9:00 PM'),
  ('Tuesday',   'Dinner', JSON_ARRAY('Chapati + Chole','Rice + Sambar','Curd'),              '7:30 PM - 9:00 PM'),
  ('Wednesday', 'Dinner', JSON_ARRAY('Pulao','Raita','Papad','Sweet'),                       '7:30 PM - 9:00 PM'),
  ('Thursday',  'Dinner', JSON_ARRAY('Chapati + Mix Veg','Rice + Rasam','Curd'),             '7:30 PM - 9:00 PM'),
  ('Friday',    'Dinner', JSON_ARRAY('Idli Sambar','Lemon Rice','Cucumber Salad'),           '7:30 PM - 9:00 PM'),
  ('Saturday',  'Dinner', JSON_ARRAY('Chapati + Egg Masala','Jeera Rice','Curd'),            '7:30 PM - 9:00 PM'),
  ('Sunday',    'Dinner', JSON_ARRAY('Dosa / Pongal','Chutney','Milk','Fried Rice'),         '7:30 PM - 9:00 PM');

-- -----------------------------------------------------------------------------
-- 12) Sample contact form messages
-- -----------------------------------------------------------------------------
INSERT INTO contacts (name, email, mobile, message) VALUES
  ('Ramesh Kumar', 'ramesh.k@example.com', '9876500001', 'Looking for a 2 sharing AC room near Anna University for my son.'),
  ('Lakshmi S',    'lakshmi.s@example.com', '9876500002', 'Please share the food menu and monthly charges for girls hostel.');

-- -----------------------------------------------------------------------------
-- Sanity checks
-- -----------------------------------------------------------------------------
SELECT CONCAT('rooms = ', COUNT(*)) AS summary FROM rooms
UNION ALL SELECT CONCAT('beds = ', COUNT(*)) FROM beds
UNION ALL SELECT CONCAT('students = ', COUNT(*)) FROM profiles WHERE role = 'student'
UNION ALL SELECT CONCAT('occupied beds = ', COUNT(*)) FROM beds WHERE status = 'occupied'
UNION ALL SELECT CONCAT('bookings = ', COUNT(*)) FROM bookings
UNION ALL SELECT CONCAT('payments = ', COUNT(*)) FROM payments
UNION ALL SELECT CONCAT('reviews = ', COUNT(*)) FROM reviews
UNION ALL SELECT CONCAT('complaints = ', COUNT(*)) FROM complaints
UNION ALL SELECT CONCAT('food menu rows = ', COUNT(*)) FROM food_menu;