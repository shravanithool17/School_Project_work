-- School Website Database Schema
-- New High School, Kolhapur

CREATE DATABASE IF NOT EXISTS school_website;
USE school_website;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    qualification VARCHAR(255),
    experience INT,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events and News Table
CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('event', 'news') DEFAULT 'event',
    event_date DATE,
    image VARCHAR(255),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admission Requests Table
CREATE TABLE IF NOT EXISTS admissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_name VARCHAR(100) NOT NULL,
    parent_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    class_applied VARCHAR(20) NOT NULL,
    address TEXT,
    status ENUM('pending', 'contacted', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcements and Notices Table
CREATE TABLE IF NOT EXISTS announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (for public user authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact Message Replies Table
CREATE TABLE IF NOT EXISTS contact_replies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contact_message_id INT NOT NULL,
    admin_id INT NOT NULL,
    reply_message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_message_id) REFERENCES contact_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(id)
);

-- Insert default admin user (password: admin123)
-- Password hash generated using bcrypt
INSERT INTO admins (username, password_hash, role) VALUES 
('admin', '$2a$10$rZ5YvJKvF8xqKqKqKqKqKOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', 'admin');

-- Sample Faculty Data
INSERT INTO faculty (name, designation, department, qualification, experience) VALUES
('Dr. Rajesh Kumar', 'Principal', 'Administration', 'Ph.D. in Education', 25),
('Prof. Sunita Patil', 'Head of Department', 'Science', 'M.Sc., B.Ed.', 15),
('Mr. Amit Deshmukh', 'Senior Teacher', 'Mathematics', 'M.A. Mathematics, B.Ed.', 12);

-- Sample Events
INSERT INTO events (title, description, type, event_date, is_published) VALUES
('Annual Sports Day 2026', 'Join us for our annual sports day celebration with various athletic competitions.', 'event', '2026-03-15', true),
('Science Exhibition', 'Students showcase their innovative science projects.', 'event', '2026-02-20', true),
('New Academic Session Begins', 'The new academic session for 2026-27 starts from June 1st.', 'news', '2026-06-01', true);

-- Sample Announcements
INSERT INTO announcements (title, description, start_date, end_date, is_active) VALUES
('Admission Open for 2026-27', 'Admissions are now open for all classes. Apply before March 31st.', '2026-02-01', '2026-03-31', true),
('Winter Break Notice', 'School will remain closed from Dec 24 to Jan 5 for winter break.', '2026-12-15', '2026-01-10', true);
