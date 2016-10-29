create database atinder;
use atinder;
create table events (  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,  date_start date,  date_end date,  check_start date,  check_end date,  admin_code varchar(255),  even_name varchar(255),  event_description long,  event_code int );
create table check_ins (  id int not null auto_increment primary key,  phone_number varchar(255),  event_id int,  content long );
