CREATE TABLE user (
  id INT AUTO_INCREMENT,
  username VARCHAR(25) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  email VARCHAR(50) NOT NULL,
  enabled TINYINT NOT NULL DEFAULT 0,
  verified TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE authority (
  username VARCHAR(25) NOT NULL,
  role VARCHAR(50) NOT NULL,
  PRIMARY KEY (username, role),
  FOREIGN KEY (username) REFERENCES user(username)
);