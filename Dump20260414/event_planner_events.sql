-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: event_planner
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `event_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` varchar(255) DEFAULT NULL,
  `budget` decimal(10,2) DEFAULT NULL,
  `status` enum('Confirmed','Tentative','Completed') DEFAULT 'Tentative',
  `is_archived` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,1,'Dinagyang Festival','Held in Iloilo City, the Dinagyang Festival is another significant cultural event that honors the Santo Niño. Known for its energetic street dancing and elaborate costumes, it is often considered a smaller-scale version of the Ati-Atihan Festival','2026-04-15 04:00:00','sanjose',3232.00,'Confirmed',0,'2026-04-14 04:00:41'),(4,1,'Jayson and Maria Wedding','Wedding','2026-10-07 04:22:00','Butuan',50000.00,'Confirmed',0,'2026-04-14 04:23:48'),(5,1,'School Anniversary','School Anniversary','2026-04-01 04:25:00','Sanjose',50000.00,'Tentative',0,'2026-04-14 04:25:23'),(6,1,'Daming Birthday','Happy birthday meng','2026-06-03 04:26:00','Sanjuan',200.00,'Confirmed',0,'2026-04-14 04:26:56'),(7,1,'Rosalita Birthday','Kaon napud','2026-04-16 04:27:00','Luna ',356.00,'Tentative',0,'2026-04-14 04:28:04'),(8,1,'Travel','laag2','2026-06-11 04:28:00','Cebu City',608.00,'Tentative',1,'2026-04-14 04:29:21'),(9,1,'Angeline Birthday','Invite tanan gegutom','2026-03-18 14:30:00','Cagdiano',2000000.00,'Completed',0,'2026-04-14 04:31:06'),(10,1,'Guanzon Birthday','lebri kaon','2026-05-05 06:58:00','Looc Surigao',323.00,'Tentative',0,'2026-04-14 04:58:39'),(12,1,'Ligo Dagat','Bring your own baon','2026-04-17 05:04:00','Camiguin',10.00,'Tentative',0,'2026-04-14 05:04:55'),(13,1,'Friends Adventure','Bring your own tent','2026-03-09 05:08:00','Boa',500.00,'Completed',0,'2026-04-14 05:09:20'),(14,1,'Keb Birthday','','2026-04-08 05:20:00','Tag-Abaca',31.00,'Completed',1,'2026-04-14 05:20:43'),(15,1,'Ligo suba','Pabugnaw sa init na adlaw','2026-06-09 05:21:00','Sunkoy',40.00,'Tentative',1,'2026-04-14 05:22:26'),(16,1,'Night Fishing','Use Fishing Rod only ','2026-04-16 05:25:00','Dinagat',0.00,'Tentative',0,'2026-04-14 05:26:43'),(17,1,'Fishing Tournament','Specified for Anglers in Dinagat Islands ','2026-04-16 19:28:00','Malinao Tubajo, Dinagat Islands',50000.00,'Tentative',0,'2026-04-14 05:28:04');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-14 13:35:33
