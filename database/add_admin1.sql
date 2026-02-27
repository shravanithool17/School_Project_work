-- Add new admin user: admin1
-- Username: admin1
-- Password: AdminPassword@123

USE school_website;

INSERT INTO admins (username, password_hash, role) 
VALUES ('admin1', '$2b$10$ijNFuL8nUy99F.wNhDTYOOkkyzYifnssWWVvghbPjOMsxc/5U9J.W', 'admin');

-- Verify the insert
SELECT id, username, role, created_at FROM admins WHERE username = 'admin1';
