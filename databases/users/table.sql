 use brainless_races;
 CREATE TABLE users
 (
    user_id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
	avatar VARCHAR(255) NOT NULL,
    boss_count INT NOT NULL default '1',
    exp INT NOT NULL default '1', 
    money INT NOT NULL default '1',
    nickname VARCHAR(255) NOT NULL,
    friends text,
    cars VARCHAR(255) default 'JG/04/04/04/04/1/1 AG/04/04/04/04/0/0 BG/04/04/04/04/0/0 UG/04/04/04/04/0/0',
    host bool,
    currLobby_id VARCHAR(255),
    PRIMARY KEY (user_id)
) ENGINE InnoDB,
DEFAULT CHARACTER SET = utf8mb4,
COLLATE utf8mb4_unicode_ci;
