--Create and use the database if it doesn't exist.

CREATE DATABASE IF NOT EXISTS db_bits_and_bytes;

USE db_bits_and_bytes;


--This creates the table for the announcements.  The Author INT refers to the 'id' column for the users, to record which user created the announcement.

CREATE TABLE IF NOT EXISTS announcements(
	id INT AUTO_INCREMENT UNIQUE,
	author INT,
	title VARCHAR(100),
	announcement TEXT,
	cdate DATETIME DEFAULT CURRENT_TIMESTAMP,
	key(id)
);

--This creates the table for the users.  The username and id columns are unique.  The types can only be Admin, Parent, and Student.  For student accounts, fill in the 'parent' column with the 'id' for the parent, to create the recursive join and associate the children with the parents.

CREATE TABLE IF NOT EXISTS users(
	id INT AUTO_INCREMENT UNIQUE,
	username VARCHAR(30) UNIQUE,
	password VARCHAR(64),
	fname VARCHAR(20),
	lname VARCHAR(20),
	birthdate DATE,
	type ENUM ('Admin', 'Parent', 'Student'),
	parent INT DEFAULT 0,
	cdate DEFAULT CURRENT_TIMESTAMP,
	key(id)
);


--This creates the file table, collecting the author, filename derived from the upload and the file storage as a blob.

CREATE TABLE IF NOT EXISTS images(
	id INT AUTO_INCREMENT UNIQUE,
	author INT,
	filename VARCHAR(100),
	file BLOB,
	cdate DATETIME DEFAULT CURRENT_TIMESTAMP,
	key(id)
);


CREATE TABLE IF NOT EXISTS files_TEST(
	id INT AUTO_INCREMENT UNIQUE,
	author INT,
	filename VARCHAR(100),
	file_url VARCHAR(255),
  filetype VARCHAR(10),
  public BIT NOT NULL,
	cdate DATETIME DEFAULT CURRENT_TIMESTAMP,
	key(id)
);
