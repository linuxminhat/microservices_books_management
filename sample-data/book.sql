-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 17, 2025 at 06:20 AM
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
-- Table structure for table `book`
--

CREATE TABLE `book` (
  `id` bigint(20) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `copies` int(11) DEFAULT NULL,
  `copies_available` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `book`
--

INSERT INTO `book` (`id`, `author`, `category`, `copies`, `copies_available`, `description`, `img`, `title`) VALUES
(1, 'Tech Author', 'Programming', 5, 1, 'Complete guide to Spring Boot development', '/Images/BooksImages/book-luv2code-1000.png', 'Spring Boot Guide'),
(2, 'Java Expert', 'Programming', 8, 5, 'Learn Java programming from scratch', '/Images/BooksImages/new-book-1.png', 'Java Fundamentals'),
(3, 'System Architect', 'Architecture', 4, 2, 'Building scalable microservices', '/Images/BooksImages/new-book-2.png', 'Microservices Architecture'),
(4, 'Frontend Expert', 'Frontend', 6, 4, 'Master React.js development', '/Images/BooksImages/book-luv2code-1000.png', 'React Development'),
(5, 'Backend Developer', 'Backend', 7, 5, 'Complete Node.js tutorial', '/Images/BooksImages/new-book-1.png', 'Node.js Guide'),
(6, 'DBA Expert', 'Database', 3, 2, 'Database design principles', '/Images/BooksImages/new-book-2.png', 'Database Design'),
(7, 'DevOps Engineer', 'DevOps', 4, 3, 'Containerization with Docker', '/Images/BooksImages/book-luv2code-1000.png', 'Docker Essentials'),
(8, 'Cloud Architect', 'Cloud', 5, 4, 'Amazon Web Services guide', '/Images/BooksImages/new-book-1.png', 'AWS Cloud'),
(9, 'Python Expert', 'Programming', 9, 7, 'Learn Python programming', '/Images/BooksImages/new-book-2.png', 'Python Programming');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `book`
--
ALTER TABLE `book`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
