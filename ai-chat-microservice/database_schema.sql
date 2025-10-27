-- Users table for Telegram OAuth
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    telegram_id BIGINT UNIQUE NOT NULL COMMENT 'Unique Telegram user ID',
    username VARCHAR(255) UNIQUE COMMENT 'Telegram username',
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    avatar_url VARCHAR(500) COMMENT 'URL to user avatar',
    is_premium BOOLEAN DEFAULT FALSE,
    language_code VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_telegram_id (telegram_id),
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User profiles with learning data
CREATE TABLE user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    bio TEXT COMMENT 'User biography',
    skill_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    total_learning_hours INT DEFAULT 0,
    total_courses_completed INT DEFAULT 0,
    current_course_id INT NULL,
    current_course_progress INT DEFAULT 0 COMMENT 'Progress in percentage 0-100',
    total_points INT DEFAULT 0 COMMENT 'Achievement points',
    streak_days INT DEFAULT 0 COMMENT 'Current learning streak',
    preferred_language VARCHAR(50) DEFAULT 'Python',
    motivational_quote VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_skill_level (skill_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Learning statistics
CREATE TABLE learning_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    hours_learned DECIMAL(5, 2) DEFAULT 0,
    lessons_completed INT DEFAULT 0,
    exercises_solved INT DEFAULT 0,
    points_earned INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_date (user_id, date),
    INDEX idx_user_id (user_id),
    INDEX idx_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Achievements/badges
CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User achievements (many-to-many)
CREATE TABLE user_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id),
    INDEX idx_user_id (user_id),
    INDEX idx_achievement_id (achievement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions for authentication
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    token_expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_expires_at (token_expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample achievements (optional - add these after creating the table)
INSERT INTO achievements (name, description, icon_url) VALUES
('First Steps', 'Complete your first lesson', '🎯'),
('Week Warrior', 'Maintain a 7-day learning streak', '🔥'),
('Hundred Hours', 'Complete 100 hours of learning', '⏰'),
('Code Master', 'Complete 50 exercises', '💻'),
('Social Butterfly', 'Invite 5 friends', '🦋'),
('Night Owl', 'Learn after 8 PM', '🌙'),
('Early Bird', 'Complete a lesson before 8 AM', '🌅'),
('Perfect Score', 'Get 100% on a lesson', '⭐');
