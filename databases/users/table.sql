 CREATE TABLE users
 (
    user_id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NOT NULL,
    boss_count INT NOT NULL,
    exp INT NOT NULL,
    money INT NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    friends text,
    cars text,
    host boolean not null,
    currLobby_id INT NOT NULL,
    PRIMARY KEY (user_id)
) ENGINE InnoDB,
DEFAULT CHARACTER SET = utf8mb4,
COLLATE utf8mb4_unicode_ci;
