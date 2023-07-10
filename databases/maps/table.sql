use brainless_races;
create table maps
(
	map_id INT NOT NULL AUTO_INCREMENT,
	map_data LONGTEXT,
    PRIMARY KEY (map_id)
) ENGINE InnoDB,
DEFAULT CHARACTER SET = utf8mb4,
COLLATE utf8mb4_unicode_ci;
