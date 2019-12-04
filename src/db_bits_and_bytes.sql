/*
-- Database: `db_bits_and_bytes`
*/
CREATE DATABASE IF NOT EXISTS `db_bits_and_bytes` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `db_bits_and_bytes`;


/* All of the table structures */
CREATE TABLE `announcement` (
  `id` int(11) NOT NULL,
  `author` int(11) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `announcement` text,
  `cdate` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `attendancelog` (
  `id` int(11) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0',
  `time` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `file` (
  `id` int(11) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `uuid` varchar(64) DEFAULT NULL,
  `public` tinyint(1) DEFAULT '0',
  `requiredfile` int(11) DEFAULT '0' COMMENT 'Identifier from Required File List',
  `mimetype` varchar(100) DEFAULT NULL,
  `cdate` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `requiredfile` (
  `id` int(11) NOT NULL,
  `uuid` varchar(64) DEFAULT NULL,
  `description` varchar(256) DEFAULT NULL,
  `title` varchar(256) DEFAULT NULL,
  `mimetype` varchar(100) DEFAULT NULL,
  `cdate` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `survey` (
  `id` int(11) NOT NULL,
  `user` int(11) DEFAULT NULL,
  `name` varchar(256) DEFAULT NULL,
  `results` text,
  `time` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(30) DEFAULT NULL COMMENT 'email address',
  `password` varchar(64) DEFAULT NULL,
  `fname` varchar(20) DEFAULT NULL,
  `lname` varchar(20) DEFAULT NULL,
  `addr_line1` varchar(256) DEFAULT NULL,
  `addr_line2` varchar(256) DEFAULT NULL,
  `addr_city` varchar(256) DEFAULT NULL,
  `addr_state` varchar(2) DEFAULT NULL,
  `addr_zip` varchar(10) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `type` enum('Admin','Parent','Student') DEFAULT NULL,
  `parent` int(11) DEFAULT '0',
  `school` varchar(256) DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `registered` int(4) DEFAULT NULL,
  `cdate` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/* Add all of the indexes */
ALTER TABLE `announcement`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `announcement_author_fk` (`author`);
ALTER TABLE `attendancelog`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `attendance_user_fk` (`user`);
ALTER TABLE `file`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `author_fk` (`user`),
  ADD KEY `requiredfile_fk` (`requiredfile`);
ALTER TABLE `requiredfile`
  ADD UNIQUE KEY `id` (`id`);
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);
ALTER TABLE `survey`
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `user_fk` (`user`);
ALTER TABLE `user`
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `username` (`username`);

/* Set all of the auto increments */
ALTER TABLE `announcement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `attendancelog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `file`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `requiredfile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `survey`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


/* Add all of the foreign keys */
ALTER TABLE `announcement`
  ADD CONSTRAINT `announcement_author_fk` FOREIGN KEY (`author`) REFERENCES `user` (`id`);
ALTER TABLE `attendancelog`
  ADD CONSTRAINT `attendance_user_fk` FOREIGN KEY (`user`) REFERENCES `user` (`id`);
ALTER TABLE `file`
  ADD CONSTRAINT `author_fk` FOREIGN KEY (`user`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `requiredfile_fk` FOREIGN KEY (`requiredfile`) REFERENCES `requiredfile` (`id`);
ALTER TABLE `survey`
  ADD CONSTRAINT `user_fk` FOREIGN KEY (`user`) REFERENCES `user` (`id`);
COMMIT;
