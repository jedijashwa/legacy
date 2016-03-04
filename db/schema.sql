Create DATABASE learnItNowdb;

USE learnItNowdb;

CREATE TABLE users (
  userId INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(15) NOT NULL,
  email VARCHAR(24) NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE sessions (
  sessionId INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  topic VARCHAR(20) NOT NULL,
  description VARCHAR(100) NOT NULL,
  startTime DATETIME NOT NULL,
  link TEXT NOT NULL,
  status BOOLEAN NOT NULL,
  price INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId)
);

-- INSERT users (userId, username, email, password) VALUES ('12345', 'tinymonster', 'password123');
