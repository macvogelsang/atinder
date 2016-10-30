create database atinder;
use atinder;
create table events ( eventId varchar(255) PRIMARY KEY, dateStart varchar(255),  dateEnd varchar(255),  checkStart varchar(255),  checkEnd varchar(255),  adminId varchar(255),  name varchar(255),  description long,  number varchar(255), timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP )
create table check_ins (  id int not null auto_increment primary key,  number varchar(255),  eventId varchar(255),  content long )
