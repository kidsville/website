DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (UserId INTEGER PRIMARY KEY, UserName TEXT, NotASecret TEXT);
INSERT INTO Users (UserId, UserName, NotASecret) VALUES (1, "Sean", "jf249bvn28ijioss");
