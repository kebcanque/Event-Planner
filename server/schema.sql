CREATE DATABASE IF NOT EXISTS event_planner;
USE event_planner;

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS ARCHIVES;
DROP TABLE IF EXISTS TASKS;
DROP TABLE IF EXISTS GUESTS;
DROP TABLE IF EXISTS EVENTS;
DROP TABLE IF EXISTS USERS;

CREATE TABLE USERS (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE EVENTS (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(255),
    budget DECIMAL(10, 2),
    status ENUM('Confirmed', 'Tentative', 'Completed') DEFAULT 'Tentative',
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE
);

CREATE TABLE GUESTS (
    guest_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    name VARCHAR(255) NOT NULL,
    emails VARCHAR(255),
    rsvp_status VARCHAR(50) DEFAULT 'Tentative',
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id) ON DELETE CASCADE
);

CREATE TABLE TASKS (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    task_description TEXT NOT NULL,
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id) ON DELETE CASCADE
);

CREATE TABLE ARCHIVES (
    archive_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT,
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES EVENTS(event_id) ON DELETE CASCADE
);

-- Initial User
INSERT INTO USERS (username, password) VALUES ('kebcanque', 'kebcanque123');
