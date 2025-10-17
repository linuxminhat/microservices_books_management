-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2025 at 07:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mylibrarydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` bigint(20) NOT NULL,
  `book_id` bigint(20) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `review_description` varchar(255) DEFAULT NULL,
  `user_email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id`, `book_id`, `date`, `rating`, `review_description`, `user_email`) VALUES
(1, 1, '2025-10-13 00:00:00.000000', 5, 'Excellent book! Very helpful for learning Spring Boot.', 'user1@example.com'),
(2, 1, '2025-10-12 00:00:00.000000', 4.5, 'Great content, easy to follow.', 'user2@example.com'),
(3, 2, '2025-10-11 00:00:00.000000', 4, 'Good introduction to Java programming.', 'user3@example.com'),
(4, 3, '2025-10-10 00:00:00.000000', 5, 'Perfect guide for microservices architecture.', 'user4@example.com'),
(5, 1, '2025-10-17 01:21:21.000000', 1, 'dấd', 'minhnhatdang2810@gmail.com'),
(6, 2, '2025-10-17 02:27:26.000000', 5, 'not good', 'minhnhatdang2810@gmail.com'),
(7, 1, '2025-10-17 02:34:15.000000', 2.5, 'good', 'anonymous@library.com'),
(8, 5, '2025-10-17 02:36:22.000000', 5, 'very good', 'anonymous@library.com'),
(9, 1, '2025-10-17 03:13:55.000000', 2, 'dsdasda', 'google-oauth2|113396505815626190487'),
(10, 1, '2025-10-17 03:15:05.000000', 3, 'tét', 'google-oauth2|106037772120076311776'),
(11, 6, '2025-10-17 03:20:32.000000', 4, 'testing', 'minhnhatdang2810@gmail.com'),
(12, 6, '2025-10-17 03:21:23.000000', 4.5, 'god', 'selfdevelopment3011@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
