// Shared SQL schema — used by the app (auto-setup on first query) and scripts/db-setup.mjs
const TABLE = "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

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
  ) ${TABLE}`,
  `CREATE TABLE IF NOT EXISTS media (
    id CHAR(24) NOT NULL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    mime VARCHAR(100) NOT NULL,
    size INT UNSIGNED NOT NULL,
    data LONGBLOB NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ${TABLE}`,
  `CREATE TABLE IF NOT EXISTS case_studies (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(220) NOT NULL,
    name VARCHAR(200) NOT NULL,
    url VARCHAR(500) NOT NULL DEFAULT '',
    platform VARCHAR(40) NOT NULL DEFAULT 'WordPress',
    sector VARCHAR(40) NOT NULL DEFAULT 'Corporate',
    category VARCHAR(120) NOT NULL DEFAULT '',
    summary TEXT NULL,
    highlights TEXT NULL,
    image VARCHAR(500) NULL,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    status ENUM('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    sort_order INT NOT NULL DEFAULT 0,
    overview TEXT NULL,
    challenge TEXT NULL,
    approach TEXT NULL,
    outcome TEXT NULL,
    body LONGTEXT NULL,
    seo_title VARCHAR(200) NULL,
    meta_description VARCHAR(300) NULL,
    og_image VARCHAR(500) NULL,
    noindex TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY case_studies_slug_unique (slug),
    KEY case_studies_status_order (status, sort_order)
  ) ${TABLE}`,
  `CREATE TABLE IF NOT EXISTS page_views (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(300) NOT NULL,
    kind ENUM('page','post','case') NOT NULL DEFAULT 'page',
    slug VARCHAR(220) NULL,
    referrer VARCHAR(200) NULL,
    device VARCHAR(10) NOT NULL DEFAULT 'desktop',
    visitor CHAR(16) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY page_views_created (created_at),
    KEY page_views_kind_slug (kind, slug),
    KEY page_views_path (path(191))
  ) ${TABLE}`,
  `CREATE TABLE IF NOT EXISTS seo_pages (
    path VARCHAR(200) NOT NULL PRIMARY KEY,
    title VARCHAR(200) NULL,
    description VARCHAR(300) NULL,
    og_image VARCHAR(500) NULL,
    noindex TINYINT(1) NOT NULL DEFAULT 0,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ${TABLE}`,
  `CREATE TABLE IF NOT EXISTS settings (
    k VARCHAR(80) NOT NULL PRIMARY KEY,
    v MEDIUMTEXT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ${TABLE}`,
  `CREATE TABLE IF NOT EXISTS site_files (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    mime VARCHAR(100) NOT NULL DEFAULT 'text/plain',
    content MEDIUMTEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY site_files_name_unique (name)
  ) ${TABLE}`,
];

// Columns added after the first release. CREATE TABLE IF NOT EXISTS skips existing tables, so these are
// added one by one when information_schema says they're missing (works on MySQL and MariaDB).
export const COLUMNS = [
  ["posts", "seo_title", "VARCHAR(200) NULL"],
  ["posts", "og_image", "VARCHAR(500) NULL"],
  ["posts", "canonical_url", "VARCHAR(500) NULL"],
  ["posts", "focus_keyword", "VARCHAR(120) NULL"],
  ["posts", "noindex", "TINYINT(1) NOT NULL DEFAULT 0"],
];
