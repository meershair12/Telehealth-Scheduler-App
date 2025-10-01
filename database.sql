-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 01, 2025 at 06:59 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `telehealth`
--

-- --------------------------------------------------------

--
-- Table structure for table `availability`
--

DROP TABLE IF EXISTS `availability`;
CREATE TABLE IF NOT EXISTS `availability` (
  `id` int NOT NULL AUTO_INCREMENT,
  `providerId` int NOT NULL,
  `stateId` int DEFAULT NULL,
  `startTime` datetime NOT NULL,
  `createdBy` int DEFAULT NULL,
  `endTime` datetime NOT NULL,
  `timezone` enum('EST','CST','MST','PST','AKST','HST','') DEFAULT '',
  `status` enum('Available','Reserved','Confirmed','Missed','Done') DEFAULT 'Available',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `confirmedBy` int DEFAULT NULL,
  `reservedBy` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `availability_provider_id_state_id_start_time_end_time` (`providerId`,`stateId`,`startTime`,`endTime`),
  KEY `stateId` (`stateId`),
  KEY `confirmedBy` (`confirmedBy`),
  KEY `reservedBy` (`reservedBy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservationcomments`
--

DROP TABLE IF EXISTS `reservationcomments`;
CREATE TABLE IF NOT EXISTS `reservationcomments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservationId` int NOT NULL,
  `userId` int NOT NULL,
  `parentCommentId` int DEFAULT NULL,
  `type` enum('main','reply') NOT NULL DEFAULT 'main',
  `comment` text NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reservationId` (`reservationId`),
  KEY `userId` (`userId`),
  KEY `parentCommentId` (`parentCommentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stateId` int NOT NULL,
  `providerId` int NOT NULL,
  `availabilityId` int NOT NULL,
  `reservedBy` int NOT NULL,
  `confirmedId` int DEFAULT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `duration` int NOT NULL,
  `reasonOfCancellation` varchar(255) DEFAULT NULL,
  `timezone` enum('EST','CST','MST','PST','AKST','HST','') DEFAULT '',
  `isCancelled` varchar(10) NOT NULL DEFAULT 'no',
  `status` enum('reserved','confirmed','cancelled','missed','completed') NOT NULL DEFAULT 'reserved',
  `notes` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `stateId` (`stateId`),
  KEY `providerId` (`providerId`),
  KEY `availabilityId` (`availabilityId`),
  KEY `reservedBy` (`reservedBy`),
  KEY `confirmedId` (`confirmedId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
CREATE TABLE IF NOT EXISTS `states` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stateName` varchar(255) NOT NULL,
  `stateCode` varchar(255) NOT NULL,
  `details` text,
  `timezone` enum('EST','CST') NOT NULL DEFAULT 'EST',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_state_code` (`stateCode`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `stateName`, `stateCode`, `details`, `timezone`, `createdAt`, `updatedAt`) VALUES
(1, 'Alabama', 'AL', 'Capital: Montgomery', 'CST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(2, 'Florida', 'FL', 'Capital: Tallahassee', 'EST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(3, 'Illinois', 'IL', 'Capital: Springfield', 'CST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(4, 'Kentucky', 'KY', 'Capital: Frankfort', 'EST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(5, 'Maryland', 'MD', 'Capital: Annapolis', 'EST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(6, 'New York', 'NY', 'Capital: Albany', 'EST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(7, 'Pennsylvania', 'PA', 'Capital: Harrisburg', 'EST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(8, 'Tennessee', 'TN', 'Capital: Nashville', 'CST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(9, 'Texas', 'TX', 'Capital: Austin', 'CST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(10, 'Virginia', 'VA', 'Capital: Richmond', 'EST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(11, 'Ohio', 'OH', 'Capital: Columbus', 'EST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(12, 'Louisiana', 'LA', 'Capital: Baton Rouge', 'CST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(13, 'Connecticut', 'CT', 'Capital: Hartford', 'EST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(14, 'Wisconsin', 'WI', 'Capital: Madison', 'CST', '2025-10-01 18:54:26', '2025-10-01 18:54:26'),
(15, 'Mississippi', 'MS', 'Capital: Jackson', 'CST', '2025-10-01 18:54:26', '2025-10-01 18:54:26');

-- --------------------------------------------------------

--
-- Table structure for table `telehealth_providers`
--

DROP TABLE IF EXISTS `telehealth_providers`;
CREATE TABLE IF NOT EXISTS `telehealth_providers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `specialty` varchar(255) NOT NULL,
  `suffix` enum('Dr.','MD','CNRP','DO','NP','PA') NOT NULL DEFAULT 'Dr.',
  `stateLicenses` json NOT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `telehealth_providers`
--

INSERT INTO `telehealth_providers` (`id`, `firstName`, `lastName`, `specialty`, `suffix`, `stateLicenses`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Lesley', 'Kernisant', '', 'Dr.', '[\"AL\", \"NY\"]', 'Active', '2025-10-01 18:54:50', '2025-10-01 18:54:50'),
(2, 'Rahul', 'Karwal', '', 'Dr.', '[\"AL\", \"FL\", \"IL\", \"KY\", \"MD\", \"NY\", \"PA\", \"TN\", \"TX\", \"VA\", \"OH\", \"CT\", \"WI\"]', 'Active', '2025-10-01 18:54:50', '2025-10-01 18:54:50'),
(3, 'Alan', 'Johnson', '', 'Dr.', '[\"AL\", \"FL\", \"IL\", \"KY\", \"MD\", \"NY\", \"PA\", \"TN\", \"TX\", \"VA\", \"OH\", \"CT\", \"WI\"]', 'Active', '2025-10-01 18:54:50', '2025-10-01 18:54:50'),
(4, 'Galjour', 'Dr.', '', 'Dr.', '[\"AL\", \"FL\", \"NY\", \"PA\", \"TX\", \"VA\", \"OH\", \"LA\", \"MS\"]', 'Active', '2025-10-01 18:54:50', '2025-10-01 18:54:50'),
(5, 'Bermudez', 'Dr.', '', 'Dr.', '[\"FL\", \"MD\", \"PA\"]', 'Active', '2025-10-01 18:54:50', '2025-10-01 18:54:50'),
(6, 'Brewster', 'Dr.', '', 'Dr.', '[\"FL\", \"KY\", \"MD\", \"TN\", \"CT\", \"MS\"]', 'Active', '2025-10-01 18:54:50', '2025-10-01 18:54:50'),
(7, 'Isrow', 'Dr.', '', 'Dr.', '[\"FL\", \"KY\"]', 'Active', '2025-10-01 18:54:50', '2025-10-01 18:54:50'),
(8, 'Nunley', 'Dr.', '', 'Dr.', '[\"IL\", \"WI\"]', 'Active', '2025-10-01 18:54:50', '2025-10-01 18:54:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `privilege` varchar(255) NOT NULL,
  `lastLoginAt` datetime DEFAULT NULL,
  `lastLoginIP` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `profile` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `designation` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `email_2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `username`, `email`, `password`, `privilege`, `lastLoginAt`, `lastLoginIP`, `status`, `profile`, `createdAt`, `updatedAt`, `designation`) VALUES
(1, 'Admin', 'Admin', 'admin', 'admin@admin.com', '$2b$10$71mhcvlwXhRNWfjdxG5JxuSoQjLh1UzPMm9fr6JygI0BZty1c2J8i', 'superadmin', '2025-10-01 18:54:04', '::1', 'active', NULL, '2025-10-01 18:47:22', '2025-10-01 18:54:04', NULL),
(2, 'Shair', 'Meer', 'shairmeer', 'shair@email.com', '$2b$10$.aZE8w6FSCrqFrdWvXmXp.T7Go3L5yKEjGVkxKQsfCbQqm.fVzeJW', 'PCC', '2025-10-01 18:52:42', '::1', 'active', NULL, '2025-10-01 18:52:03', '2025-10-01 18:52:42', NULL),
(3, 'Omar', 'Elbulok', 'omar.elbulok', 'omar@admin.com', '$2b$10$0OGtphMonh0hKwl1WNtgJePAke.eDAwo4D3s92ECpjsUUXIN3pJAe', 'superadmin', '2025-10-01 18:58:37', '::1', 'active', NULL, '2025-10-01 18:58:06', '2025-10-01 18:58:37', NULL);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `availability`
--
ALTER TABLE `availability`
  ADD CONSTRAINT `availability_ibfk_5` FOREIGN KEY (`providerId`) REFERENCES `telehealth_providers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `availability_ibfk_6` FOREIGN KEY (`stateId`) REFERENCES `states` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `availability_ibfk_7` FOREIGN KEY (`confirmedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `availability_ibfk_8` FOREIGN KEY (`reservedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `reservationcomments`
--
ALTER TABLE `reservationcomments`
  ADD CONSTRAINT `reservationcomments_ibfk_1` FOREIGN KEY (`reservationId`) REFERENCES `reservations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservationcomments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservationcomments_ibfk_3` FOREIGN KEY (`parentCommentId`) REFERENCES `reservationcomments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservationcomments_ibfk_4` FOREIGN KEY (`reservationId`) REFERENCES `reservations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservationcomments_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservationcomments_ibfk_6` FOREIGN KEY (`parentCommentId`) REFERENCES `reservationcomments` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_10` FOREIGN KEY (`confirmedId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_6` FOREIGN KEY (`stateId`) REFERENCES `states` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_7` FOREIGN KEY (`providerId`) REFERENCES `telehealth_providers` (`id`),
  ADD CONSTRAINT `reservations_ibfk_8` FOREIGN KEY (`availabilityId`) REFERENCES `availability` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_9` FOREIGN KEY (`reservedBy`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
