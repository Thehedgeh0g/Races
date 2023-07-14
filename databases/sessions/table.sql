use brainless_races;
create table sessions
(
	session_id INT NOT NULL,
	host_id VARCHAR(255) NOT NULL,
    player2_id VARCHAR(255) NOT NULL,
    player3_id VARCHAR(255) NOT NULL,
    player4_id VARCHAR(255) NOT NULL,
    map_id VARCHAR(255) NOT NULL default '1',
	rounds VARCHAR(255) NOT NULL default '1',
    PRIMARY KEY (session_id)
) ENGINE InnoDB,
DEFAULT CHARACTER SET = utf8mb4,
COLLATE utf8mb4_unicode_ci;
