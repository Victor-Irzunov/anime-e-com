-- MySQL dump 10.13  Distrib 8.0.42, for macos15.2 (arm64)
--
-- Host: localhost    Database: e-com
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `SubCategory`
--

DROP TABLE IF EXISTS `SubCategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SubCategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryId` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `contentHtml` text COLLATE utf8mb4_unicode_ci,
  `h1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SubCategory_categoryId_value_key` (`categoryId`,`value`),
  KEY `SubCategory_categoryId_idx` (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SubCategory`
--

LOCK TABLES `SubCategory` WRITE;
/*!40000 ALTER TABLE `SubCategory` DISABLE KEYS */;
INSERT INTO `SubCategory` VALUES (1,'Статичные игрушки','statichnie-igrushki',3,'2025-10-20 14:29:33.666','<h3><strong>Фигурки аниме: пополнение коллекции в NekoMics</strong></h3><p>&nbsp;</p><p>&nbsp;</p><p>Фигурки аниме персонажей — это не просто украшение для полки, а целый мир, который оживает в вашем доме. В интернет-магазине NekoMics вы найдете широкий ассортимент фигурок, которые помогут вам создать уникальную коллекцию. Мы предлагаем фигурки из популярных аниме сериалов и манги, которые порадуют как начинающих, так и опытных коллекционеров.</p><p>&nbsp;11111</p><p>&nbsp;</p><p>&nbsp;</p>','Фигурки аниме персонажей -111','9c00f58d-689a-4599-bed4-0fedcc10ee51.webp'),(2,'Магниты','magniti',4,'2025-10-21 17:20:46.747','<h2><strong>Магниты в интернет-магазине NekoMics</strong></h2><p>&nbsp;</p><p>Сувенирные и коллекционные <strong>магниты</strong> — это стильный и практичный аксессуар, который можно использовать для украшения интерьера, хранения заметок на холодильнике или пополнения коллекции. В магазине NekoMics вы можете <strong>купить магниты в Минске</strong> и с доставкой по всей Беларуси. В нашем каталоге представлены уникальные изделия с аниме-персонажами, мангой и яркими иллюстрациями, которые подойдут как для подарка, так и для личной коллекции.</p>','Магниты с аниме персонажами','8ade9022-32e4-4db8-91e4-1594a9971d3b.webp');
/*!40000 ALTER TABLE `SubCategory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-04 12:20:20
