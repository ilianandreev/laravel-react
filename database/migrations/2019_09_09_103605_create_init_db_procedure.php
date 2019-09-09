<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class CreateInitDbProcedure extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared('
            DROP PROCEDURE IF EXISTS init_db;
            CREATE PROCEDURE init_db()
            BEGIN
                DECLARE records_count INT DEFAULT 0;
                DECLARE max_records_count INT DEFAULT 0;
                DECLARE no_more_records INT DEFAULT 0;
                DECLARE users_firstname VARCHAR(255);
                DECLARE users_lastname VARCHAR(255);
                DECLARE users_email VARCHAR(255);
                DECLARE user_id INT;
                DECLARE project_id INT;
                
                DECLARE timelogs_user_id INT;
                DECLARE timelogs_project_id INT;
                DECLARE timelogs_date TIMESTAMP;
                DECLARE timelogs_hours DOUBLE(4,2);
                DECLARE timelogs_max_hours DOUBLE(10,2) DEFAULT 0;	
            
                DEClARE users_cursor CURSOR FOR
                SELECT id FROM users;
            
                DECLARE CONTINUE HANDLER FOR 1062
                SET records_count = records_count - 1;
            
                DECLARE CONTINUE HANDLER FOR NOT FOUND
                SET no_more_records = 1;
            
                #truncate tables
                SET FOREIGN_KEY_CHECKS = 0;
                TRUNCATE TABLE timelogs;
                TRUNCATE TABLE projects;
                TRUNCATE TABLE users;
                SET FOREIGN_KEY_CHECKS = 1;
            
                START TRANSACTION;
                SET AUTOCOMMIT = 0;
                
                #generate users
                SET records_count = 0;
                SET max_records_count = 100;
            
                loop_gen_users:	LOOP
                    IF records_count = max_records_count THEN
                        LEAVE loop_gen_users;
                    END IF;
            
                    SET users_firstname = ELT(FLOOR(RAND()*11)+1, \'John\', \'Gringo\', \'Mark\', \'Lisa\', \'Maria\', \'Sonya\', \'Philip\', \'Jose\', \'Lorenzo\', \'George\', \'Justin\');
                    SET users_lastname = ELT(FLOOR(RAND()*10)+1, \'Johnson\', \'Lamas\', \'Jackson\', \'Brown\', \'Mason\', \'Rodriguez\', \'Roberts\', \'Thomas\', \'Rose\', \'McDonalds\');
                    SET users_email = CONCAT(LOWER(users_firstname), \'.\', LOWER(users_lastname), \'@\', ELT(FLOOR(RAND()*3)+1, \'hotmail.com\', \'gmail.com\', \'live.com\'));
            
                    INSERT INTO users(firstname, lastname, email) VALUES(users_firstname, users_lastname, users_email);
            
                    SET records_count = records_count + 1;
                END LOOP loop_gen_users;
            
                #generate projects
                INSERT INTO projects(name) VALUES(\'My own\'), (\'Outcons\'), (\'Free Time\');
            
                #generate timelogs
                OPEN users_cursor;
                loop_users: LOOP
            
                    FETCH users_cursor INTO timelogs_user_id;
            
                    IF no_more_records = 1 THEN
                        LEAVE loop_users;
                    END IF;
            
                    SET records_count = 0;
                    SET max_records_count = ROUND((RAND()*(20-1))+1);
                    SET timelogs_max_hours = 0;
                    SET timelogs_date = CURRENT_DATE();
                    
                    loop_gen_timelogs: LOOP
                        IF records_count = max_records_count THEN
                            LEAVE loop_gen_timelogs;
                        END IF;
            
                        SELECT id INTO timelogs_project_id FROM projects ORDER BY RAND() LIMIT 1;
                        SET timelogs_hours = 0.25*ROUND((RAND()*(32-1))+1);
                        
                        SET timelogs_max_hours = timelogs_max_hours + timelogs_hours;
                        
                        IF timelogs_max_hours < 8 THEN
                            INSERT INTO timelogs(user_id, project_id, date, hours) VALUES(timelogs_user_id, timelogs_project_id, timelogs_date, timelogs_hours);
                            SET records_count = records_count + 1;
                        ELSE
                            SET timelogs_max_hours = 0;
                            SET timelogs_date = timelogs_date - INTERVAL 1 DAY;
                        END IF;
                        
                    END LOOP loop_gen_timelogs;
            
                END LOOP loop_users;
                CLOSE users_cursor;
            
                COMMIT;
            END        
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared('DROP PROCEDURE IF EXISTS init_db');
    }
}
