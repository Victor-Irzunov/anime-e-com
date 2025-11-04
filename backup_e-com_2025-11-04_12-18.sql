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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('08bee097-8ef1-497e-b5f1-e0bb0f816d7d','76b805999f25aff3de63514c4838b4cda4d1e3246a83e5a2046545fdf4995762','2025-10-09 10:14:15.587','20240406191136_npx_prisma_migrate_dev_create_only',NULL,NULL,'2025-10-09 10:14:15.563',1),('101817ec-a771-46dd-96e2-0f367a189e03','27f2689a247fd3c85af0e72e46a9c6d2fb57e482a6f8a6eeffa67e0c6681f379','2025-10-09 10:14:15.562','20240405191920_new',NULL,NULL,'2025-10-09 10:14:15.556',1),('1aa15ce3-949c-4def-8be8-05d20235e2c1','0b90b51f04b3fa9004b5f772e55665d8bebaee99f1be315ec604b9a17a7e6fda','2025-10-19 20:06:10.361','20251019200610_add_category_subcategory_brand',NULL,NULL,'2025-10-19 20:06:10.308',1),('32a64342-69a0-4483-b2e5-d46d3979dd2e','b64d7862ad82f6cf053d28b1e4f04edf54d09ff0e1e071c7d742488bbc60b3dd','2025-10-09 10:14:15.549','20240405091608_add_user_data_user_order',NULL,NULL,'2025-10-09 10:14:15.530',1),('3e7bf5e9-3c90-4b01-8eb4-f3b456fd5e51','178e25fad1e8e351ad6a0f17b3381d7f00c4cd01395745fe5cedddfff9892c28','2025-10-20 13:12:54.540','20251020131254_drop_meta_fields_from_taxonomies_add_h1',NULL,NULL,'2025-10-20 13:12:54.521',1),('401f69d5-f22f-49a8-abb7-5afb8d7c1ba4','e241ab47ef735c062efb0a3e68421aa61ab574b6e948c4dbe1424611cfec26e5','2025-10-09 10:14:15.529','20240305155828_new_main_page',NULL,NULL,'2025-10-09 10:14:15.519',1),('44eb0843-7717-4404-bdf0-f3e88b4630ea','89ef22d8d091d92d528ad3e72fd5440963ca642afa167180baa0332b151bd787','2025-10-20 11:30:42.744','20251020113042_add_seo_fields_to_taxonomies_and_product',NULL,NULL,'2025-10-20 11:30:42.635',1),('5b64b89a-468d-4788-8af8-13ff1a91ed50','60a2591b205c8ecb1d568ddc3b58a3e215fca7765e8c92014f7f97c07692dd3f','2025-10-20 19:33:11.266','20251020193311_product_description_text',NULL,NULL,'2025-10-20 19:33:11.237',1),('625dbfb4-bc3f-4b51-9538-f38f2f895ea4','790799a32389c9fa35faf3f8b110416d607533a2280f84a523cc7c0e6788bb4b','2025-10-23 20:32:35.020','20251023203235_add_order_status_and_email',NULL,NULL,'2025-10-23 20:32:35.014',1),('6318127f-7656-4655-be69-76023f024bb7','6c3b4a8b19c384646dd9c2852bfd832dfbab4a56e0694cdf0449825a3b33ad13','2025-10-09 10:14:15.519','20240301125557_title_link',NULL,NULL,'2025-10-09 10:14:15.506',1),('7d2d24ac-cd54-483e-a57b-97b702651078','8308b58b2fc0dd2a1a87c6e7f9f2878111504ed5cbdc2db9eba90ac05b4c69e8','2025-10-20 10:23:22.323','20251020102322_add_seo_fields_for_category_and_subcategory',NULL,NULL,'2025-10-20 10:23:22.308',1),('8334ee60-245d-44b3-9ea8-fb78b1211dd3','5069a9c31ac021cd2ec5acb9f5c17662b27177df911f97f08d1e109b1416502b','2025-10-21 17:50:20.632','20251021175020_add_search_indexes',NULL,NULL,'2025-10-21 17:50:20.550',1),('918c879c-b14c-4c7d-b96f-02bf4a9228f1','4cbb86478381070dd43a95d6bdd86819b5f860d8e77bf36e70f07fa6afdf68c1','2025-10-21 13:06:23.362','20251021130623_add_product_article',NULL,NULL,'2025-10-21 13:06:23.335',1),('9baaf749-c176-4586-aa0f-1a34edb67788','dc6be8171bf6fd77fc99f97310f0327f09157e2acd90f60dc9e156a9b6567d59','2025-10-09 10:14:15.465','20231213123418_first',NULL,NULL,'2025-10-09 10:14:15.456',1),('a3f3b804-e885-40ca-933e-87aa74ceb7b2','032fad2cc2774e9b8d4d6e05695f985f397637d756e0ba9f4398e25f5d698184','2025-10-23 19:45:24.523','20251023194524_add_guest_and_reset_token',NULL,NULL,'2025-10-23 19:45:24.269',1),('be84a220-cee1-45ed-8274-de2f188cf33e','9318382e58d5c99cfa0ed1d4305fde73ec6ebf5f0adb4020eaaa354deabfd60a','2025-10-23 20:15:36.739','20251023201536_add_guest_and_reset_token',NULL,NULL,'2025-10-23 20:15:36.707',1),('e2f1dbfb-ea91-4dd2-ae2c-2aac4ed25da1','7b30cfd6562cb02f638cc794a6ccea09246e3f3edbddee11bfbb7e42319ce9b8','2025-10-09 10:14:15.556','20240405094246_add_message',NULL,NULL,'2025-10-09 10:14:15.549',1),('ea8242f1-3485-46a4-ac02-78925e711f36','63cb32c644c8336e15b573b5b1a84b7dd3881c8656b612f0ba5904abfb60c8f0','2025-10-20 14:17:58.073','20251020141758_add_image_fields_to_category_subcategory',NULL,NULL,'2025-10-20 14:17:58.053',1),('f314b1d1-2da6-42d1-b7c2-13ba44ea5919','25a1dd29af81038864b67fc28f5ccb20c33db2835c422f688cbe4a3e7747043a','2025-10-09 10:14:15.485','20240227131104_2024',NULL,NULL,'2025-10-09 10:14:15.466',1),('f377fc6c-951b-41dc-be1a-0d14e5943b92','9133bcde838e11b3b4dc39d619e747f2b5d19a6dcbaab3301de7d6486e9f0c9e','2025-10-09 10:14:15.505','20240227180133_new',NULL,NULL,'2025-10-09 10:14:15.486',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Brand`
--

DROP TABLE IF EXISTS `Brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Brand` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Brand_value_key` (`value`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Brand`
--

LOCK TABLES `Brand` WRITE;
/*!40000 ALTER TABLE `Brand` DISABLE KEYS */;
INSERT INTO `Brand` VALUES (1,'Учиха Саске','uchikha-saske','2025-10-20 14:43:55.113'),(2,'Фрирен11','friren11','2025-10-21 17:17:15.291');
/*!40000 ALTER TABLE `Brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `contentHtml` text COLLATE utf8mb4_unicode_ci,
  `h1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_name_key` (`name`),
  UNIQUE KEY `Category_value_key` (`value`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (3,'Фигурки','figurki','2025-10-20 14:22:56.211','<h2><strong>Великолепный выбор аниме фигурок в NekoMics</strong></h2><p>&nbsp;</p><p>Добро пожаловать в интернет-магазин NekoMics, где вы можете купить фигурки аниме персонажей с доставкой по Беларуси и России. Наш ассортимент включает в себя разнообразные модели, отражающие любимых героев из популярных аниме. Каждая фигурка выполнена с высокой детализацией и качеством, что делает их ценным дополнением к коллекции любого аниме-фаната.</p><p>&nbsp;</p><h2><strong>Преимущества покупки в NekoMics</strong></h2><p>&nbsp;</p><ol><li>Доставка по Беларуси и России, обеспечивающая удобство получения заказа.</li><li>Конкурентоспособные цены, позволяющие приобрести фигурки по доступной стоимости.</li><li>Постоянные обновления ассортимента, чтобы вы всегда находили что-то новое.</li></ol>','Аниме фигурки в Минске','22c57089-cb0a-4f3b-81e6-ee2c8450cfcb.webp'),(4,'Атрибутика','atributika','2025-10-21 17:13:01.291','<h2><strong>Атрибутика для фанатов аниме и манги в магазине NekoMics -1111</strong></h2><p><br>Добро пожаловать в мир японской культуры, где каждый поклонник аниме и манги найдет для себя что-то особенное. В интернет-магазине NekoMics мы предлагаем широкий ассортимент атрибутики для фанатов, включая аксессуары, сувениры и многое другое. Наши товары порадуют как новичков, так и заядлых коллекционеров. Мы гордимся качеством и разнообразием продукции, представленной в нашем каталоге.</p>','Атрибутика для фанатов аниме 111','56c168b2-3f81-40ba-a0aa-cb90867f7f60.webp'),(5,'Виктор','viktor','2025-11-04 08:58:35.235','<p>afsdavvdfsvrv</p><p>&nbsp;</p>','Аниме фигурки в Минске','5c929364-208d-4beb-b0c2-df22a99445fc.webp');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderData`
--

DROP TABLE IF EXISTS `OrderData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderItems` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('NEW','PROCESSING','SHIPPED','DELIVERED','COMPLETED','CANCELED','RETURNED','NOT_DELIVERED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NEW',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderData`
--

LOCK TABLES `OrderData` WRITE;
/*!40000 ALTER TABLE `OrderData` DISABLE KEYS */;
INSERT INTO `OrderData` VALUES (1,2,'','+375 33 351-15-97','','[{\"price\": 99, \"title\": \"Сувенирный Магнит Конан\", \"quantity\": 2, \"productId\": 7, \"totalAmount\": 198, \"discountPercentage\": 15}]','2025-10-23 20:19:06.336',NULL,'PROCESSING');
/*!40000 ALTER TABLE `OrderData` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `discountPercentage` double NOT NULL,
  `rating` double NOT NULL,
  `stock` int NOT NULL,
  `brand` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` json NOT NULL,
  `info` json NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `subcategory` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titleLink` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `banner` tinyint(1) NOT NULL,
  `discounts` tinyint(1) NOT NULL,
  `povsednevnaya` tinyint(1) NOT NULL,
  `recommended` tinyint(1) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `brandId` int DEFAULT NULL,
  `categoryId` int DEFAULT NULL,
  `subCategoryId` int DEFAULT NULL,
  `h1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDesc` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaTitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `article` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Product_titleLink_key` (`titleLink`),
  KEY `Product_categoryId_idx` (`categoryId`),
  KEY `Product_subCategoryId_idx` (`subCategoryId`),
  KEY `Product_brandId_idx` (`brandId`),
  KEY `Product_title_idx` (`title`),
  KEY `Product_article_idx` (`article`),
  KEY `Product_brand_idx` (`brand`),
  KEY `Product_category_idx` (`category`),
  KEY `Product_subcategory_idx` (`subcategory`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
INSERT INTO `Product` VALUES (5,'Фигурка Наруто - Учиха Саске','Хладнокровный гений в боевой стойке с активированным Шаринганом. Фигура передает его сосредоточенную ярость и фирменный стиль. Детализированный костюм и кунаи в руке. Поза перед использованием техники «Чидори». Для фанатов сложных антигероев. «Я добьюсь своей цели… любой ценой»',99,10,4.5,10,'Учиха Саске','/uploads/products/69440cca-c14d-4339-8a05-6b37997ee6bf.webp','[{\"url\": \"/uploads/products/69440cca-c14d-4339-8a05-6b37997ee6bf.webp\", \"sort\": 0}, {\"url\": \"/uploads/products/2b32b529-24db-4bf8-8dbf-223f1b1db964.webp\", \"sort\": 1}]','[{\"value\": \"Пластик\", \"property\": \"Материал\"}]','Фигурки','<p>Хладнокровный гений в боевой стойке с активированным Шаринганом. Фигура передает его сосредоточенную ярость и фирменный стиль. Детализированный костюм и кунаи в руке. Поза перед использованием техники «Чидори». Для фанатов сложных антигероев. «Я добьюсь своей цели… любой ценой»</p>','Статичные игрушки','figurka-naruto---uchikha-saske',0,0,0,1,'2025-10-20 19:34:48.248',1,3,1,NULL,NULL,NULL,''),(6,'Мягкая игрушка Годжо Сатору','Мягкая игрушка Годжо Сатору (Jujutsu Kaisen / Магическая Битва) – это плюшевая версия самого сильного мага вселенной. Игрушка передаёт его культовый образ: белоснежные волосы, фирменная повязка на глазах и стильный костюм. Мягкая, приятная на ощупь, с детализированными элементами, она станет идеальным подарком для фанатов аниме или украшением любой коллекции.',54.5,0,4.3,10,'Учиха Саске','/uploads/products/23756da0-7f9c-4193-af1e-9dbf5160816e.webp','[{\"url\": \"/uploads/products/23756da0-7f9c-4193-af1e-9dbf5160816e.webp\", \"sort\": 0}, {\"url\": \"/uploads/products/6f1bfe03-690d-4b5b-b769-6cb13d643a2b.webp\", \"sort\": 1}]','[{\"value\": \"32 (см)\", \"property\": \"Высота\"}, {\"value\": \"Акрил\", \"property\": \"Материал\"}]','Фигурки','<h4><strong>Описание</strong></h4><p>&nbsp;</p><p>&nbsp;</p><p><i>Благородный капитан отряда Готей 6 в безупречной боевой стойке. Фигура передает его ледяное спокойствие и аристократичную мощь. Детализированный белый плащ и клинок Сэндзинмару. Поза перед использованием «Банкай». Для ценителей безупречной техники меча. «Холодный клинок — горячая честь»</i></p>','Статичные игрушки','myagkaya-igrushka-godzho-satoru',0,0,0,1,'2025-10-21 14:50:33.048',1,3,1,NULL,NULL,NULL,'12-23-fff'),(7,'Сувенирный Магнит Конан','Магнит «Конан» - Стильный магнит с изображением Конана — культового ниндзя из вселенной Naruto. Яркий дизайн, стойкое покрытие и удобное крепление. Идеально для поклонников Конохи и коллекционеров аниме-сувениров!',99,15,3,15,'Фрирен','/uploads/products/7f6720ef-8d60-4b83-b4ba-d0c3f2a1df8d.webp','[{\"url\": \"/uploads/products/7f6720ef-8d60-4b83-b4ba-d0c3f2a1df8d.webp\", \"sort\": 0}]','[{\"value\": \"Наруто\", \"property\": \"Серия\"}, {\"value\": \"Акрил\", \"property\": \"Материал\"}]','Атрибутика','<h2><strong>Магниты в интернет-магазине NekoMics</strong></h2><p>&nbsp;</p><p>&nbsp;</p><p>Сувенирные и коллекционные <strong>магниты</strong> — это стильный и практичный аксессуар, который можно использовать для украшения интерьера, хранения заметок на холодильнике или пополнения коллекции. В магазине NekoMics вы можете <strong>купить магниты в Минске</strong> и с доставкой по всей Беларуси. В нашем каталоге представлены уникальные изделия с аниме-персонажами, мангой и яркими иллюстрациями, которые подойдут как для подарка, так и для личной коллекции.</p>','Магниты','suvenirnii-magnit-konan',0,0,1,0,'2025-10-21 17:24:01.673',2,4,2,NULL,NULL,NULL,'BTT-PMISX-HC');
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `isGuest` tinyint(1) NOT NULL DEFAULT '1',
  `passwordResetToken` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwordResetTokenExp` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_passwordResetToken_key` (`passwordResetToken`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'q@tut.by','$2b$10$./9WLEblSq5YWCKoWAPouuGDjrJhgemgVhvfeOgGbsgVjxDagiAaO',1,'2025-10-09 10:17:43.950',1,NULL,NULL),(2,'q1@tut.by','$2b$10$3hpvCFp9COgASaavbocYTeZfHUFhY86qwz0Xa58Pk9s8/UTqWNQ1S',0,'2025-10-23 20:19:06.278',0,NULL,NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserData`
--

DROP TABLE IF EXISTS `UserData`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserData` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `orderId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserData_userId_key` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserData`
--

LOCK TABLES `UserData` WRITE;
/*!40000 ALTER TABLE `UserData` DISABLE KEYS */;
INSERT INTO `UserData` VALUES (1,2,1,'Victor','директор','','+375 33 351-15-97','2025-10-23 20:19:06.398');
/*!40000 ALTER TABLE `UserData` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-04 12:18:16
