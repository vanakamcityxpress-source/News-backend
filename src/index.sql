-- Create ads table
CREATE TABLE IF NOT EXISTS ads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    link VARCHAR(500),
    image VARCHAR(500),
    startTime TIMESTAMP NULL,
    endTime TIMESTAMP NULL,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    author VARCHAR(100),
    categoryColor VARCHAR(20),
    contentQuote TEXT,
    mainImage VARCHAR(500),
    slug VARCHAR(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create breaking_news table
CREATE TABLE IF NOT EXISTS breaking_news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    video VARCHAR(500),
    heading VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    articleId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_comment_article FOREIGN KEY (articleId) 
        REFERENCES articles(id) ON DELETE CASCADE
);

-- Create separate tables for array columns (since MySQL doesn't support arrays)
CREATE TABLE IF NOT EXISTS article_content_paragraphs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    articleId INT NOT NULL,
    paragraph TEXT NOT NULL,
    paragraph_order INT DEFAULT 0,
    FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS article_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    articleId INT NOT NULL,
    tag VARCHAR(100) NOT NULL,
    FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS article_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    articleId INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_order INT DEFAULT 0,
    FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_comments_articleId ON comment(articleId);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_ads_active ON ads(isActive);
CREATE INDEX idx_articles_createdAt ON articles(createdAt DESC);

-- For MariaDB/MySQL, arrays need to be stored differently
-- Content paragraphs, tags, and images are in separate tables with foreign keys