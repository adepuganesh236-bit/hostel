-- =============================================================================
-- StayNest Premium Hostel - MySQL Schema
-- =============================================================================
-- MySQL 8.0+ required (uses recursive CTEs, window functions).
--
-- Apply in order:
--   mysql -u root -p < mysql/schema.sql
--   mysql -u root -p staynest < mysql/seed.sql
--
-- The column names mirror the app's shared data model (see src/lib/database.js)
-- so a small REST backend can map network rows straight into the UI.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS staynest
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE staynest;

SET NAMES utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- -----------------------------------------------------------------------------
-- profiles - students, owner and admin. Single table for all roles.
-- id is a friendly key (STU-1000 / OWN-0001 / ADM-0001).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id             VARCHAR(20)   NOT NULL PRIMARY KEY,
  full_name      VARCHAR(120)  NOT NULL,
  mobile         VARCHAR(20),
  email          VARCHAR(255),
  password_hash  VARCHAR(255),                                -- only used with a backend
  college        VARCHAR(150),
  course         VARCHAR(80),
  year           INT,
  gender         VARCHAR(10),
  budget         DECIMAL(10,2),
  preferred_room VARCHAR(30),
  room_number    VARCHAR(10),
  bed_number     VARCHAR(10),
  bed_id         VARCHAR(30),
  joining_date   DATE,
  payment_status ENUM('paid','pending') NOT NULL DEFAULT 'pending',
  role           ENUM('student','owner','admin') NOT NULL DEFAULT 'student',
  verified       TINYINT(1)    NOT NULL DEFAULT 0,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_profiles_email (email),
  KEY idx_profiles_role (role)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- hostel - single hostel settings row
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hostel (
  id         INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(120) NOT NULL DEFAULT 'StayNest Premium Hostel',
  tagline    VARCHAR(255) NOT NULL DEFAULT 'Your Safe & Comfortable Home Away From Home',
  address    TEXT,
  phone      VARCHAR(30),
  email      VARCHAR(255),
  map_url    TEXT,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- rooms - room catalogue (40 rooms: floors 1-4, 1/2/3/4 sharing)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rooms (
  id          VARCHAR(10)   NOT NULL PRIMARY KEY,             -- same as room_number
  room_number VARCHAR(10)   NOT NULL UNIQUE,
  floor       INT,
  sharing     INT           NOT NULL,
  type_label  VARCHAR(30),
  ac          TINYINT(1)    NOT NULL DEFAULT 0,
  rent        DECIMAL(10,2) NOT NULL,
  advance     DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_rooms_floor (floor),
  KEY idx_rooms_sharing (sharing)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- beds - one row per bed inside a room
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS beds (
  id         VARCHAR(30) NOT NULL PRIMARY KEY,                -- '101-b1'
  room_id    VARCHAR(10) NOT NULL,
  bed_number VARCHAR(10) NOT NULL,
  status     ENUM('available','occupied','reserved') NOT NULL DEFAULT 'available',
  student_id VARCHAR(20),
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_beds_room_bed (room_id, bed_number),
  KEY idx_beds_status (status),
  CONSTRAINT fk_beds_room    FOREIGN KEY (room_id)    REFERENCES rooms (id)    ON DELETE CASCADE,
  CONSTRAINT fk_beds_student FOREIGN KEY (student_id) REFERENCES profiles (id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- bookings
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
  id             INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
  booking_id     VARCHAR(20)  NOT NULL UNIQUE,
  student_id     VARCHAR(20)  NOT NULL,
  student_name   VARCHAR(120),
  student_mobile VARCHAR(20),
  student_email  VARCHAR(255),
  college        VARCHAR(150),
  room_number    VARCHAR(10),
  sharing        INT,
  bed_number     VARCHAR(10),
  bed_id         VARCHAR(30),
  date           DATE,
  rent           DECIMAL(10,2),
  advance        DECIMAL(10,2),
  food           DECIMAL(10,2),
  electricity    DECIMAL(10,2),
  amount         DECIMAL(10,2),
  transaction_id VARCHAR(40),
  payment_method VARCHAR(20),
  payment_status ENUM('paid','pending')           NOT NULL DEFAULT 'pending',
  status         ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_bookings_student (student_id),
  KEY idx_bookings_status (status),
  CONSTRAINT fk_bookings_student FOREIGN KEY (student_id) REFERENCES profiles (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- payments
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id             INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
  payment_id     VARCHAR(20)  NOT NULL UNIQUE,
  student_id     VARCHAR(20)  NOT NULL,
  student_name   VARCHAR(120),
  room_number    VARCHAR(10),
  bed            VARCHAR(10),
  amount         DECIMAL(10,2),
  method         VARCHAR(20),
  transaction_id VARCHAR(40),
  date           DATE,
  status         ENUM('paid','pending','failed') NOT NULL DEFAULT 'paid',
  type           VARCHAR(30)  NOT NULL DEFAULT 'Monthly Rent',
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_payments_student (student_id),
  KEY idx_payments_date (date),
  CONSTRAINT fk_payments_student FOREIGN KEY (student_id) REFERENCES profiles (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- food_menu - weekly mess menu (items stored as JSON)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS food_menu (
  id         INT         NOT NULL PRIMARY KEY AUTO_INCREMENT,
  day        VARCHAR(10) NOT NULL,
  meal       ENUM('Breakfast','Lunch','Dinner') NOT NULL,
  items      JSON,
  timings    VARCHAR(40),
  UNIQUE KEY uq_food_day_meal (day, meal)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- reviews
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id           INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
  student_id   VARCHAR(20),
  student_name VARCHAR(120),
  college      VARCHAR(150),
  rating       INT          NOT NULL,
  review_text  TEXT,
  date         DATE,
  verified     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_reviews_verified (verified),
  CONSTRAINT fk_reviews_student FOREIGN KEY (student_id) REFERENCES profiles (id) ON DELETE SET NULL,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- complaints
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaints (
  id           INT        NOT NULL PRIMARY KEY AUTO_INCREMENT,
  student_id   VARCHAR(20),
  student_name VARCHAR(120),
  room         VARCHAR(10),
  type         VARCHAR(40),
  message      TEXT,
  status       ENUM('open','in_progress','resolved') NOT NULL DEFAULT 'open',
  date         DATE,
  created_at   DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_complaints_status (status),
  CONSTRAINT fk_complaints_student FOREIGN KEY (student_id) REFERENCES profiles (id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- contacts - contact form submissions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacts (
  id         INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(120),
  email      VARCHAR(255),
  mobile     VARCHAR(20),
  message    TEXT,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;