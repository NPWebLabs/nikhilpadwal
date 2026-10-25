// Shared SQL schema — used by the app (auto-setup on first query) and scripts/db-setup.mjs
export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS posts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    excerpt TEXT NULL,
    content LONGTEXT NOT NULL,
    cover_image VARCHAR(500) NULL,
    tags VARCHAR(300) NULL,
    meta_description VARCHAR(300) NULL,
    status ENUM('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    reading_minutes INT NOT NULL DEFAULT 1,
    published_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY posts_slug_unique (slug),
    KEY posts_status_published (status, published_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS media (
    id CHAR(24) NOT NULL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    mime VARCHAR(100) NOT NULL,
    size INT UNSIGNED NOT NULL,
    data LONGBLOB NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];
