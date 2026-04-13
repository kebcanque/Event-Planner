CREATE DATABASE IF NOT EXISTS event_planner;
USE event_planner;

CREATE TABLE IF NOT EXISTS USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS EVENTS (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    location VARCHAR(255),
    budget DECIMAL(10, 2),
    status ENUM('Confirmed', 'Tentative', 'Completed') DEFAULT 'Tentative',
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS GUESTS (
    guest_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    rsvp_status ENUM('Confirmed', 'Tentative', 'Declined') DEFAULT 'Tentative',
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS TASKS (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    task_description TEXT NOT NULL,
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id) ON DELETE CASCADE
);

-- Sample user
INSERT IGNORE INTO USERS (username, email, password_hash) VALUES ('admin', 'admin@example.com', 'hashed_password_here');
