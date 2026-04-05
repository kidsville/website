DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (UserId INTEGER PRIMARY KEY, UserName TEXT, Password TEXT);
-- Password format: salt:sha256hex(salt + plaintext)
-- Example: for password "jf249bvn28ijioss" with salt "a1b2c3d4e5f6"
-- Generate with: echo -n "a1b2c3d4e5f6jf249bvn28ijioss" | shasum -a 256
INSERT INTO Users (UserId, UserName, Password) VALUES (1, "Sean", "a1b2c3d4e5f6:b5517e29b3a1f6584483433132bec711593682db7cd341381a58911de042b62f");
