use brainless_races;
create table sprites
(
	sprite_id INT NOT NULL AUTO_INCREMENT,
	sprite_path VARCHAR(255) NOT NULL,
    PRIMARY KEY (sprite_id)
) ENGINE InnoDB,
DEFAULT CHARACTER SET = utf8mb4,
COLLATE utf8mb4_unicode_ci;
