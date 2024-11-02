SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES = 0;

ALTER TABLE attribute_instance
    MODIFY value VARCHAR(2500);

ALTER TABLE category_policy
    MODIFY policy_description VARCHAR(5000);

ALTER TABLE shop_policy
    MODIFY policy_description VARCHAR(5000);

ALTER TABLE product
    MODIFY description VARCHAR(2000);

ALTER TABLE review_content
    MODIFY content VARCHAR(5000);

ALTER TABLE review_content
    MODIFY reply_content VARCHAR(5000);

ALTER TABLE review_content
    MODIFY seller_reply_content VARCHAR(5000);

INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('modgaard39449', '2024-08-29 06:40:49', '2024-08-29 06:40:49', 'mendie.odgaard@libero.it', 'Mendie', 'Odgaard', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(281) 601-8764');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('bbrolan64520', '2024-06-03 21:04:49', '2024-06-03 21:04:49', 'bartholemy.brolan@mail.com', 'Bartholemy', 'Brolan', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(716) 540-9844');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('flemmon60152', '2023-12-21 00:04:24', '2023-12-21 00:04:24', 'field.lemmon@gmail.com', 'Field', 'Lemmon', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(203) 240-4462');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('hsaleway23664', '2024-06-19 03:53:30', '2024-06-19 03:53:30', 'hermy.saleway@gmail.com', 'Hermy', 'Saleway', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(330) 370-6904');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('glaux43012', '2024-08-30 00:38:52', '2024-08-30 00:38:52', 'garrik.laux@hotmail.com', 'Garrik', 'Laux', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(832) 387-4363');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('ggorries36253', '2024-05-21 13:09:10', '2024-05-21 13:09:10', 'genna.gorries@terra.com.br', 'Genna', 'Gorries', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(609) 552-9315');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('jwalentynowicz32118', '2024-07-23 03:50:11', '2024-07-23 03:50:11', 'jake.walentynowicz@gmail.com', 'Jake', 'Walentynowicz', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(864) 034-9550');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('apisculli19130', '2023-11-15 01:08:23', '2023-11-15 01:08:23', 'arabele.pisculli@hotmail.com', 'Arabele', 'Pisculli', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(916) 669-0696');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('afrowen13316', '2023-11-27 05:06:33', '2023-11-27 05:06:33', 'adrian.frowen@yahoo.com', 'Adrian', 'Frowen', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(608) 456-0111');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('jbannester19614', '2024-10-07 20:30:59', '2024-10-07 20:30:59', 'jacques.bannester@orange.fr', 'Jacques', 'Bannester', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(314) 489-8516');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('jvan daalen4926', '2024-10-08 13:29:06', '2024-10-08 13:29:06', 'jess.van daalen@free.fr', 'Jess', 'Van Daalen', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(706) 075-8440');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('mselwyn39960', '2024-04-29 09:47:36', '2024-04-29 09:47:36', 'maggie.selwyn@hotmail.com', 'Maggie', 'Selwyn', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(417) 821-9041');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('rellerbeck14523', '2024-02-13 13:22:43', '2024-02-13 13:22:43', 'rolph.ellerbeck@hotmail.co.uk', 'Rolph', 'Ellerbeck', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(719) 713-2935');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('ppowland34378', '2024-05-01 16:35:39', '2024-05-01 16:35:39', 'preston.powland@orange.fr', 'Preston', 'Powland', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(801) 565-7576');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('blorincz32984', '2023-12-15 16:26:28', '2023-12-15 16:26:28', 'bart.lorincz@gmail.com', 'Bart', 'Lorincz', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(804) 610-8242');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('rmcatamney60369', '2024-09-14 04:01:29', '2024-09-14 04:01:29', 'rhody.mcatamney@earthlink.net', 'Rhody', 'McAtamney', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(504) 351-9702');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('klogsdale63588', '2024-09-24 01:25:32', '2024-09-24 01:25:32', 'ker.logsdale@gmail.com', 'Ker', 'Logsdale', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(727) 259-0254');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('nteanby25634', '2024-03-25 13:18:47', '2024-03-25 13:18:47', 'natala.teanby@hotmail.com', 'Natala', 'Teanby', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(615) 029-4921');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('dphilbrick34048', '2024-01-10 10:20:50', '2024-01-10 10:20:50', 'debby.philbrick@yahoo.com', 'Debby', 'Philbrick', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(480) 986-7656');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('adarby50179', '2024-08-02 07:19:38', '2024-08-02 07:19:38', 'alison.darby@gmail.com', 'Alison', 'Darby', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(208) 778-4756');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('dmickelwright31174', '2023-10-26 15:14:01', '2023-10-26 15:14:01', 'dew.mickelwright@gmail.com', 'Dew', 'Mickelwright', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(312) 519-4372');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('dlewsley41328', '2024-02-23 09:22:09', '2024-02-23 09:22:09', 'dru.lewsley@hotmail.com', 'Dru', 'Lewsley', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(816) 196-5508');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('kleverett5376', '2024-06-22 22:34:44', '2024-06-22 22:34:44', 'kasey.leverett@gmail.com', 'Kasey', 'Leverett', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(973) 153-1394');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('dcalcutt38043', '2024-02-26 22:17:11', '2024-02-26 22:17:11', 'dallon.calcutt@gmail.com', 'Dallon', 'Calcutt', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(502) 440-3567');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('nweekley1318', '2023-12-21 09:10:26', '2023-12-21 09:10:26', 'nataniel.weekley@yahoo.ca', 'Nataniel', 'Weekley', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(217) 794-5370');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('asnozzwell6350', '2024-04-27 23:48:38', '2024-04-27 23:48:38', 'amil.snozzwell@hotmail.fr', 'Amil', 'Snozzwell', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(309) 504-7991');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('rmcsporrin48179', '2024-05-19 07:22:16', '2024-05-19 07:22:16', 'rodolph.mcsporrin@msn.com', 'Rodolph', 'McSporrin', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(571) 643-3401');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('gsaenz50369', '2024-06-10 10:43:20', '2024-06-10 10:43:20', 'garret.saenz@hotmail.com', 'Garret', 'Saenz', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(601) 053-7155');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('cfreschini36450', '2024-03-21 22:23:58', '2024-03-21 22:23:58', 'correy.freschini@hotmail.com', 'Correy', 'Freschini', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(503) 049-1752');
INSERT INTO user (username, created_date, dob, email, first_name, last_name, password, phone) VALUES ('asimioli58443', '2024-03-04 05:24:39', '2024-03-04 05:24:39', 'angel.simioli@hotmail.com', 'Angel', 'Simioli', '$2a$12$w7n0Uc3QW86d7.Y.9JBV0u01wF6mtHgwT19PE/Uc1CeYRbozphQDK', '(313) 349-4122');


INSERT INTO admin (username) VALUES ('modgaard39449');
INSERT INTO admin (username) VALUES ('bbrolan64520');
INSERT INTO admin (username) VALUES ('flemmon60152');
INSERT INTO admin (username) VALUES ('hsaleway23664');
INSERT INTO admin (username) VALUES ('glaux43012');
INSERT INTO admin (username) VALUES ('ggorries36253');
INSERT INTO admin (username) VALUES ('jwalentynowicz32118');
INSERT INTO admin (username) VALUES ('apisculli19130');
INSERT INTO admin (username) VALUES ('afrowen13316');
INSERT INTO admin (username) VALUES ('jbannester19614');


INSERT INTO activity (activity_id, activity_date, activity_description, activity_name, admin_id) VALUES ('1', '2024-06-03 11:10:28', 'sale activites on e-commerce', 'Black Friday Blowout', 'modgaard39449');
INSERT INTO activity (activity_id, activity_date, activity_description, activity_name, admin_id) VALUES ('2', '2023-12-12 00:05:23', 'sale activites on e-commerce', 'Anniversary Sale', 'bbrolan64520');
INSERT INTO activity (activity_id, activity_date, activity_description, activity_name, admin_id) VALUES ('3', '2024-08-03 21:05:16', 'sale activites on e-commerce', 'Buy One Get One Free', 'flemmon60152');
INSERT INTO activity (activity_id, activity_date, activity_description, activity_name, admin_id) VALUES ('4', '2024-09-07 19:05:34', 'sale activites on e-commerce', 'Winter Sale', 'hsaleway23664');
INSERT INTO activity (activity_id, activity_date, activity_description, activity_name, admin_id) VALUES ('5', '2024-03-09 13:49:58', 'sale activites on e-commerce', 'Limited Time Offer', 'glaux43012');
INSERT INTO activity (activity_id, activity_date, activity_description, activity_name, admin_id) VALUES ('6', '2024-09-24 01:21:48', 'sale activites on e-commerce', 'Anniversary Sale', 'ggorries36253');
INSERT INTO activity (activity_id, activity_date, activity_description, activity_name, admin_id) VALUES ('7', '2024-03-23 11:48:50', 'sale activites on e-commerce', 'Holiday Special', 'jwalentynowicz32118');
INSERT INTO activity (activity_id, activity_date, activity_description, activity_name, admin_id) VALUES ('8', '2024-08-13 08:33:25', 'sale activites on e-commerce', 'Black Friday Blowout', 'apisculli19130');
INSERT INTO activity (activity_id, activity_date, activity_description, activity_name, admin_id) VALUES ('9', '2024-09-21 06:55:24', 'sale activites on e-commerce', 'Grand Opening Sale', 'afrowen13316');
INSERT INTO activity (activity_id, activity_date, activity_description, activity_name, admin_id) VALUES ('10', '2024-02-08 14:11:16', 'sale activites on e-commerce', 'Winter Sale', 'jbannester19614');



INSERT INTO business (username) VALUES ('jvan daalen4926');
INSERT INTO business (username) VALUES ('mselwyn39960');
INSERT INTO business (username) VALUES ('rellerbeck14523');
INSERT INTO business (username) VALUES ('ppowland34378');
INSERT INTO business (username) VALUES ('blorincz32984');
INSERT INTO business (username) VALUES ('rmcatamney60369');
INSERT INTO business (username) VALUES ('klogsdale63588');
INSERT INTO business (username) VALUES ('nteanby25634');
INSERT INTO business (username) VALUES ('dphilbrick34048');
INSERT INTO business (username) VALUES ('adarby50179');
INSERT INTO business (username) VALUES ('dmickelwright31174');
INSERT INTO business (username) VALUES ('dlewsley41328');
INSERT INTO business (username) VALUES ('kleverett5376');
INSERT INTO business (username) VALUES ('dcalcutt38043');
INSERT INTO business (username) VALUES ('nweekley1318');
INSERT INTO business (username) VALUES ('asnozzwell6350');
INSERT INTO business (username) VALUES ('rmcsporrin48179');
INSERT INTO business (username) VALUES ('gsaenz50369');
INSERT INTO business (username) VALUES ('cfreschini36450');
INSERT INTO business (username) VALUES ('asimioli58443');


INSERT INTO buyer (username) VALUES ('jvan daalen4926');
INSERT INTO buyer (username) VALUES ('mselwyn39960');
INSERT INTO buyer (username) VALUES ('rellerbeck14523');
INSERT INTO buyer (username) VALUES ('ppowland34378');
INSERT INTO buyer (username) VALUES ('blorincz32984');
INSERT INTO buyer (username) VALUES ('rmcatamney60369');
INSERT INTO buyer (username) VALUES ('klogsdale63588');
INSERT INTO buyer (username) VALUES ('nteanby25634');
INSERT INTO buyer (username) VALUES ('dphilbrick34048');
INSERT INTO buyer (username) VALUES ('adarby50179');

INSERT INTO seller (followers, shop_name, username, address_id) VALUES ('4682', 'Arts & Crafts Haven', 'dmickelwright31174', '1');
INSERT INTO seller (followers, shop_name, username, address_id) VALUES ('2335', 'Fashion Fiesta', 'dlewsley41328', '2');
INSERT INTO seller (followers, shop_name, username, address_id) VALUES ('391', 'The Coffee Corner', 'kleverett5376', '3');
INSERT INTO seller (followers, shop_name, username, address_id) VALUES ('9241', 'Fitness Fanatics', 'dcalcutt38043', '4');
INSERT INTO seller (followers, shop_name, username, address_id) VALUES ('2333', 'Fashion Fiesta', 'nweekley1318', '5');
INSERT INTO seller (followers, shop_name, username, address_id) VALUES ('3897', 'Home Essentials', 'asnozzwell6350', '6');
INSERT INTO seller (followers, shop_name, username, address_id) VALUES ('2240', 'Fashion Fiesta', 'rmcsporrin48179', '7');
INSERT INTO seller (followers, shop_name, username, address_id) VALUES ('1988', 'Vintage Vault', 'gsaenz50369', '8');
INSERT INTO seller (followers, shop_name, username, address_id) VALUES ('6208', 'Home Essentials', 'cfreschini36450', '9');
INSERT INTO seller (followers, shop_name, username, address_id) VALUES ('3862', 'Fashion Fiesta', 'asimioli58443', '10');


INSERT INTO admin_buyer (buyer_id, admin_id) VALUES ('jvan daalen4926', 'modgaard39449');
INSERT INTO admin_buyer (buyer_id, admin_id) VALUES ('mselwyn39960', 'bbrolan64520');
INSERT INTO admin_buyer (buyer_id, admin_id) VALUES ('rellerbeck14523', 'flemmon60152');
INSERT INTO admin_buyer (buyer_id, admin_id) VALUES ('ppowland34378', 'hsaleway23664');
INSERT INTO admin_buyer (buyer_id, admin_id) VALUES ('blorincz32984', 'glaux43012');
INSERT INTO admin_buyer (buyer_id, admin_id) VALUES ('rmcatamney60369', 'ggorries36253');
INSERT INTO admin_buyer (buyer_id, admin_id) VALUES ('klogsdale63588', 'jwalentynowicz32118');
INSERT INTO admin_buyer (buyer_id, admin_id) VALUES ('nteanby25634', 'apisculli19130');
INSERT INTO admin_buyer (buyer_id, admin_id) VALUES ('dphilbrick34048', 'afrowen13316');
INSERT INTO admin_buyer (buyer_id, admin_id) VALUES ('adarby50179', 'jbannester19614');


INSERT INTO address (address_id, commune, district, province, specific_address) VALUES ('1', '10980 Pleasant View Place', 'OR', 'Oregon', '10980 Pleasant View Place');
INSERT INTO address (address_id, commune, district, province, specific_address) VALUES ('2', '3098 Quarter Terrace', 'MD', 'Maryland', '3098 Quarter Terrace');
INSERT INTO address (address_id, commune, district, province, specific_address) VALUES ('3', '7248 Bissell Trail', 'OK', 'Oklahoma', '7248 Bissell Trail');
INSERT INTO address (address_id, commune, district, province, specific_address) VALUES ('4', '10767 Mott Street', 'CA', 'California', '10767 Mott Street');
INSERT INTO address (address_id, commune, district, province, specific_address) VALUES ('5', '2302 Hatfield Terrace', 'PA', 'Pennsylvania', '2302 Hatfield Terrace');
INSERT INTO address (address_id, commune, district, province, specific_address) VALUES ('6', '11166 Grassy Point Avenue', 'VA', 'Virginia', '11166 Grassy Point Avenue');
INSERT INTO address (address_id, commune, district, province, specific_address) VALUES ('7', '14198 Darren Drive', 'TX', 'Texas', '14198 Darren Drive');
INSERT INTO address (address_id, commune, district, province, specific_address) VALUES ('8', '12274 Regal Manor Lane', 'FL', 'Florida', '12274 Regal Manor Lane');
INSERT INTO address (address_id, commune, district, province, specific_address) VALUES ('9', '14655 Martinez Drive', 'CA', 'California', '14655 Martinez Drive');
INSERT INTO address (address_id, commune, district, province, specific_address) VALUES ('10', '3905 Maddie Terrace', 'TX', 'Texas', '3905 Maddie Terrace');


INSERT INTO delivery_infor (id, phone_number, recipient_name, address_id, buyer_id) VALUES ('1', '(706) 075-8440', 'Jess Van Daalen', '1', 'jvan daalen4926');
INSERT INTO delivery_infor (id, phone_number, recipient_name, address_id, buyer_id) VALUES ('2', '(417) 821-9041', 'Maggie Selwyn', '2', 'mselwyn39960');
INSERT INTO delivery_infor (id, phone_number, recipient_name, address_id, buyer_id) VALUES ('3', '(719) 713-2935', 'Rolph Ellerbeck', '3', 'rellerbeck14523');
INSERT INTO delivery_infor (id, phone_number, recipient_name, address_id, buyer_id) VALUES ('4', '(801) 565-7576', 'Preston Powland', '4', 'ppowland34378');
INSERT INTO delivery_infor (id, phone_number, recipient_name, address_id, buyer_id) VALUES ('5', '(804) 610-8242', 'Bart Lorincz', '5', 'blorincz32984');
INSERT INTO delivery_infor (id, phone_number, recipient_name, address_id, buyer_id) VALUES ('6', '(504) 351-9702', 'Rhody McAtamney', '6', 'rmcatamney60369');
INSERT INTO delivery_infor (id, phone_number, recipient_name, address_id, buyer_id) VALUES ('7', '(727) 259-0254', 'Ker Logsdale', '7', 'klogsdale63588');
INSERT INTO delivery_infor (id, phone_number, recipient_name, address_id, buyer_id) VALUES ('8', '(615) 029-4921', 'Natala Teanby', '8', 'nteanby25634');
INSERT INTO delivery_infor (id, phone_number, recipient_name, address_id, buyer_id) VALUES ('9', '(480) 986-7656', 'Debby Philbrick', '9', 'dphilbrick34048');
INSERT INTO delivery_infor (id, phone_number, recipient_name, address_id, buyer_id) VALUES ('10', '(208) 778-4756', 'Alison Darby', '10', 'adarby50179');


INSERT INTO delivery (delivery_name) VALUES ('David Lee');
INSERT INTO delivery (delivery_name) VALUES ('Michael Johnson');
INSERT INTO delivery (delivery_name) VALUES ('Laura Miller');
INSERT INTO delivery (delivery_name) VALUES ('Emily Davis');
INSERT INTO delivery (delivery_name) VALUES ('Chris Martinez');
INSERT INTO delivery (delivery_name) VALUES ('James Brown');
INSERT INTO delivery (delivery_name) VALUES ('Olivia Thomas');
INSERT INTO delivery (delivery_name) VALUES ('Matthew Anderson');
INSERT INTO delivery (delivery_name) VALUES ('Ashley Garcia');
INSERT INTO delivery (delivery_name) VALUES ('Jane Doe');


INSERT INTO invalidated_token (id, expiry_time) VALUES ('85edce67-137e-ece1-2681-a5b44c1f8f93', '2024-09-01 05:29:56');
INSERT INTO invalidated_token (id, expiry_time) VALUES ('26362378-49e8-b74d-a300-bda2934116c3', '2024-05-12 04:36:33');
INSERT INTO invalidated_token (id, expiry_time) VALUES ('d0d005da-ec3b-444b-5688-7db09c2a7dd0', '2024-02-02 08:12:02');
INSERT INTO invalidated_token (id, expiry_time) VALUES ('76527edc-6b44-134d-a907-80789ca6d569', '2024-07-19 03:24:33');
INSERT INTO invalidated_token (id, expiry_time) VALUES ('0458270e-e4b2-dbdf-df0f-92ccaf05facb', '2024-01-29 20:04:18');
INSERT INTO invalidated_token (id, expiry_time) VALUES ('1bdf54fc-2fd1-4a80-05d6-01c2e1345e02', '2024-08-07 07:15:54');
INSERT INTO invalidated_token (id, expiry_time) VALUES ('c64a227b-c427-961c-7065-b21f2d61d279', '2024-02-01 10:08:00');
INSERT INTO invalidated_token (id, expiry_time) VALUES ('0bf4e9d1-b589-e56f-1388-bd4c10814823', '2024-03-13 12:56:14');
INSERT INTO invalidated_token (id, expiry_time) VALUES ('bfdb8770-beb8-3f4e-7147-9251192d7b97', '2024-07-31 20:26:14');
INSERT INTO invalidated_token (id, expiry_time) VALUES ('f2324e9c-e180-7380-f2c7-0ca50802c892', '2024-04-14 15:30:59');


INSERT INTO invalidated_token_seq (next_val) VALUES ('489016752');
INSERT INTO invalidated_token_seq (next_val) VALUES ('580816827');
INSERT INTO invalidated_token_seq (next_val) VALUES ('206341082');
INSERT INTO invalidated_token_seq (next_val) VALUES ('675243156');
INSERT INTO invalidated_token_seq (next_val) VALUES ('929599186');
INSERT INTO invalidated_token_seq (next_val) VALUES ('522959834');
INSERT INTO invalidated_token_seq (next_val) VALUES ('515451698');
INSERT INTO invalidated_token_seq (next_val) VALUES ('983082392');
INSERT INTO invalidated_token_seq (next_val) VALUES ('87872008');
INSERT INTO invalidated_token_seq (next_val) VALUES ('915156276');


INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('780eaa2a-957d-00bb-845f-03b977148763', '5576.19', '730');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('99e2b2e9-27cf-7a47-f008-bb1f58b6cac4', '4721.95', '388');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('1c109a3f-996b-7af7-6808-d3a80af58486', '4448.04', '279');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('15c41dfd-0938-37a1-090f-05c5ce16663a', '5671.80', '768');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('9834ba86-71b7-6921-8ff7-91af5573290f', '6166.78', '966');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('de5cd764-5a27-8c11-e4ea-14c4663bce08', '5063.67', '525');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('b49608fb-2f9f-af5c-4855-57b7567be9e6', '5324.37', '629');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('29415cf8-9bbd-4e2a-0d71-0caa31152633', '4320.30', '228');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('78c08bf7-01fa-7c2c-6cbd-0622ac246986', '4076.30', '130');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('ffca2b00-0df7-62d0-2b6a-6961ec643469', '3898.07', '59');


INSERT INTO category (name, parent_category_name) VALUES ('Mobile Accessories', 'Books');
INSERT INTO category (name, parent_category_name) VALUES ('Automotive', 'Mobile Accessories');
INSERT INTO category (name, parent_category_name) VALUES ('Books', 'Pet Supplies');
INSERT INTO category (name, parent_category_name) VALUES ('Jewelry', 'Tools');
INSERT INTO category (name, parent_category_name) VALUES ('Sports', 'Photography Equipment');
INSERT INTO category (name, parent_category_name) VALUES ('Clothing', 'Automotive');
INSERT INTO category (name, parent_category_name) VALUES ('Electronics', 'Wine & Spirits');
INSERT INTO category (name, parent_category_name) VALUES ('Beauty', 'Health Products');
INSERT INTO category (name, parent_category_name) VALUES ('Furniture', 'Toys');
INSERT INTO category (name, parent_category_name) VALUES ('Groceries', 'Furniture');
INSERT INTO category (name, parent_category_name) VALUES ('Toys', 'Electronics');


INSERT INTO follow (followee_id, follower_id) VALUES ('dmickelwright31174', 'jvan daalen4926');
INSERT INTO follow (followee_id, follower_id) VALUES ('dlewsley41328', 'mselwyn39960');
INSERT INTO follow (followee_id, follower_id) VALUES ('kleverett5376', 'rellerbeck14523');
INSERT INTO follow (followee_id, follower_id) VALUES ('dcalcutt38043', 'ppowland34378');
INSERT INTO follow (followee_id, follower_id) VALUES ('nweekley1318', 'blorincz32984');
INSERT INTO follow (followee_id, follower_id) VALUES ('asnozzwell6350', 'rmcatamney60369');
INSERT INTO follow (followee_id, follower_id) VALUES ('rmcsporrin48179', 'klogsdale63588');
INSERT INTO follow (followee_id, follower_id) VALUES ('gsaenz50369', 'nteanby25634');
INSERT INTO follow (followee_id, follower_id) VALUES ('cfreschini36450', 'dphilbrick34048');
INSERT INTO follow (followee_id, follower_id) VALUES ('asimioli58443', 'adarby50179');


INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('jvan daalen4926', '31e5740f-375f-0ec2-6cfc-d417008fcd19', '03a9f249-3f35-4bf4-2a17-1601546e90ed', '254f0b51-8662-9e59-b773-77e01b40af21');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('hnorton33569', '8b5dc727-26cb-f3d6-5de3-ec54d5a41fcb', '0be88ef4-cf2e-a2d8-1c04-6abb83455543', 'd1cbbd86-4844-ba88-b48b-152e776d897b');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('nmathiassen39022', 'cc365ff1-c37c-2042-90d9-e655c6cb4494', 'eb88f378-6235-5068-7022-14b46feb38d1', '9aa31061-e375-5d13-925d-f57c377d2257');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('blorincz32984', '5015a5cc-511d-e746-97ff-0be9ffc6abe6', '562f25ce-9543-0b26-7b53-92d0e0fabbc6', '84729bf8-82cf-d5cb-1b9e-2c5b6ccccc23');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('lwoolen63613', 'dc1245d1-cfd9-46cf-4e26-c0cd7fa7e38e', 'bbaddb89-0617-4305-09e4-c4129d950ae0', '001f5106-7e88-01ee-6781-fd1fb1e76962');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('jwalentynowicz32118', '37e34c3f-0274-6735-be85-f1ecf375f960', 'e4ee5878-17f4-aefd-3f60-38402f33c90b', '0d82d274-ac63-5b50-cbbd-f13321632ce4');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('ggorries36253', '7a33eae5-b3e9-b04b-dacb-0e079b0c1d39', 'c56d5e60-f16a-463a-d141-eb17d543d8db', '291e2c79-b9a7-80fe-f928-d56020606969');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('rgainseford65193', '8609280d-db4c-766b-0b16-80a9cabb12b4', '031e6e7e-fc08-2251-c0e1-6c97c7167109', '1bf73a21-a0fb-ff26-c21e-6b033387bfba');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('flemmon60152', 'b31d990f-9a98-da5b-1fa4-d6c8669646a0', '0112792e-5523-9e5e-5801-a36d2f2dc72b', '4c521789-70f2-18d1-904b-e43bb208b78e');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('jvan daalen4926', '7477da52-bff0-54ce-502e-374e38eee1c5', 'bc9a963c-b905-63d9-fc48-8e90de97a3d9', '6ca9e6f2-ba50-01b2-4af9-11eda1a2d90c');


INSERT INTO shop_policy_admin (policy_id, admin_id) VALUES ('1', 'modgaard39449');
INSERT INTO shop_policy_admin (policy_id, admin_id) VALUES ('2', 'bbrolan64520');
INSERT INTO shop_policy_admin (policy_id, admin_id) VALUES ('3', 'flemmon60152');
INSERT INTO shop_policy_admin (policy_id, admin_id) VALUES ('4', 'hsaleway23664');
INSERT INTO shop_policy_admin (policy_id, admin_id) VALUES ('5', 'glaux43012');
INSERT INTO shop_policy_admin (policy_id, admin_id) VALUES ('6', 'ggorries36253');
INSERT INTO shop_policy_admin (policy_id, admin_id) VALUES ('7', 'jwalentynowicz32118');
INSERT INTO shop_policy_admin (policy_id, admin_id) VALUES ('8', 'apisculli19130');
INSERT INTO shop_policy_admin (policy_id, admin_id) VALUES ('9', 'afrowen13316');
INSERT INTO shop_policy_admin (policy_id, admin_id) VALUES ('10', 'jbannester19614');


INSERT INTO shop_policy_seller (policy_id, seller_id, admin_id) VALUES ('1', 'dmickelwright31174', 'modgaard39449');
INSERT INTO shop_policy_seller (policy_id, seller_id, admin_id) VALUES ('2', 'dlewsley41328', 'bbrolan64520');
INSERT INTO shop_policy_seller (policy_id, seller_id, admin_id) VALUES ('3', 'kleverett5376', 'flemmon60152');
INSERT INTO shop_policy_seller (policy_id, seller_id, admin_id) VALUES ('4', 'dcalcutt38043', 'hsaleway23664');
INSERT INTO shop_policy_seller (policy_id, seller_id, admin_id) VALUES ('5', 'nweekley1318', 'glaux43012');
INSERT INTO shop_policy_seller (policy_id, seller_id, admin_id) VALUES ('6', 'asnozzwell6350', 'ggorries36253');
INSERT INTO shop_policy_seller (policy_id, seller_id, admin_id) VALUES ('7', 'rmcsporrin48179', 'jwalentynowicz32118');
INSERT INTO shop_policy_seller (policy_id, seller_id, admin_id) VALUES ('8', 'gsaenz50369', 'apisculli19130');
INSERT INTO shop_policy_seller (policy_id, seller_id, admin_id) VALUES ('9', 'cfreschini36450', 'afrowen13316');
INSERT INTO shop_policy_seller (policy_id, seller_id, admin_id) VALUES ('10', 'asimioli58443', 'jbannester19614');


INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('343845589024837', 'Wells Fargo', 'Jess Van Daalen', 'jvan daalen4926');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('5583688290168521', 'Chase Bank', 'Maggie Selwyn', 'mselwyn39960');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('4598572308399896', 'Regions Bank', 'Rolph Ellerbeck', 'rellerbeck14523');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('4185316840977', 'PNC Bank', 'Preston Powland', 'ppowland34378');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('5341591821883217', 'Santander Bank', 'Bart Lorincz', 'blorincz32984');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('4948758296539', 'Santander Bank', 'Rhody McAtamney', 'rmcatamney60369');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('342753249056341', 'Bank of America', 'Ker Logsdale', 'klogsdale63588');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('612160325664449369', 'Wells Fargo', 'Natala Teanby', 'nteanby25634');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('5240559814206771', 'US Bank', 'Debby Philbrick', 'dphilbrick340480');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('374276946020603', 'Chase Bank', 'Alison Darby', 'adarby50179');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('349693814806806', 'Goldman Sachs', 'Dew Mickelwright', 'dmickelwright31174');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('4907285571947459', 'Barclays', 'Dru Lewsley', 'dlewsley41328');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('4259653730334', 'Capital One', 'Kasey Leverett', 'kleverett5376');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('344149719564203', 'TD Bank', 'Dallon Calcutt', 'dcalcutt38043');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('619407272078462786', 'Chase Bank', 'Nataniel Weekley', 'nweekley1318');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('4407488784260', 'US Bank', 'Amil Snozzwell', 'asnozzwell6350');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('371113733105296', 'TD Bank', 'Rodolph McSporrin', 'rmcsporrin48179');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('340184694929202', 'Barclays', 'Garret Saenz', 'gsaenz50369');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('5427285199286320', 'Regions Bank', 'Correy Freschini', 'cfreschini36450');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('348897828895449', 'Goldman Sachs', 'Angel Simioli', 'asimioli58443');


INSERT INTO payment_order (payment_order_id, buyer_id) VALUES ('31e5740f-375f-0ec2-6cfc-d417008fcd19', 'jvan daalen4926');
INSERT INTO payment_order (payment_order_id, buyer_id) VALUES ('8b5dc727-26cb-f3d6-5de3-ec54d5a41fcb', 'mselwyn39960');
INSERT INTO payment_order (payment_order_id, buyer_id) VALUES ('cc365ff1-c37c-2042-90d9-e655c6cb4494', 'rellerbeck14523');
INSERT INTO payment_order (payment_order_id, buyer_id) VALUES ('5015a5cc-511d-e746-97ff-0be9ffc6abe6', 'ppowland34378');
INSERT INTO payment_order (payment_order_id, buyer_id) VALUES ('dc1245d1-cfd9-46cf-4e26-c0cd7fa7e38e', 'blorincz32984');
INSERT INTO payment_order (payment_order_id, buyer_id) VALUES ('37e34c3f-0274-6735-be85-f1ecf375f960', 'rmcatamney60369');
INSERT INTO payment_order (payment_order_id, buyer_id) VALUES ('7a33eae5-b3e9-b04b-dacb-0e079b0c1d39', 'klogsdale63588');
INSERT INTO payment_order (payment_order_id, buyer_id) VALUES ('8609280d-db4c-766b-0b16-80a9cabb12b4', 'nteanby25634');
INSERT INTO payment_order (payment_order_id, buyer_id) VALUES ('b31d990f-9a98-da5b-1fa4-d6c8669646a0', 'dphilbrick34048');
INSERT INTO payment_order (payment_order_id, buyer_id) VALUES ('7477da52-bff0-54ce-502e-374e38eee1c5', 'adarby50179');


INSERT INTO orders (root_order_id, delivery_code, delivery_date, delivery_join_date, delivery_status, expected_delivery_date, status, total_price, delivery_id, payment_odrder_id, seller_id) VALUES ('b40fe935-8519-e6f2-3282-491e31acea24', 'DZE-4897-TL', '2024-09-25 11:57:24', '2024-09-25 11:57:24', 'in transit', '2024-09-25 11:57:25', 'Refunded', '3061.03', 'David Lee', '31e5740f-375f-0ec2-6cfc-d417008fcd19', 'dmickelwright31174');
INSERT INTO orders (root_order_id, delivery_code, delivery_date, delivery_join_date, delivery_status, expected_delivery_date, status, total_price, delivery_id, payment_odrder_id, seller_id) VALUES ('bde0dd1f-11b6-e6f9-765b-dfbdfce0c62b', 'AGM-2924-QZ', '2023-12-06 00:11:41', '2023-12-06 00:11:41', 'shipped', '2023-12-06 00:11:42', 'Completed', '2055.26', 'Michael Johnson', '8b5dc727-26cb-f3d6-5de3-ec54d5a41fcb', 'dlewsley41328');
INSERT INTO orders (root_order_id, delivery_code, delivery_date, delivery_join_date, delivery_status, expected_delivery_date, status, total_price, delivery_id, payment_odrder_id, seller_id) VALUES ('605fe035-5b94-8481-0840-bcb89d9eb566', 'KLW-1826-IL', '2024-10-05 12:13:34', '2024-10-05 12:13:34', 'canceled', '2024-10-05 12:13:35', 'Refunded', '3095.22', 'Laura Miller', 'cc365ff1-c37c-2042-90d9-e655c6cb4494', 'kleverett5376');
INSERT INTO orders (root_order_id, delivery_code, delivery_date, delivery_join_date, delivery_status, expected_delivery_date, status, total_price, delivery_id, payment_odrder_id, seller_id) VALUES ('8a1fe0db-a3c4-9bd2-0691-dc017d73fee6', 'FFT-0950-DR', '2023-12-15 19:35:04', '2023-12-15 19:35:04', 'delivered', '2023-12-15 19:35:05', 'Completed', '2088.75', 'Emily Davis', '5015a5cc-511d-e746-97ff-0be9ffc6abe6', 'dcalcutt38043');
INSERT INTO orders (root_order_id, delivery_code, delivery_date, delivery_join_date, delivery_status, expected_delivery_date, status, total_price, delivery_id, payment_odrder_id, seller_id) VALUES ('a062765a-3295-7ac1-f4c9-a3897e31fb8c', 'UTO-1996-XM', '2024-04-16 09:34:24', '2024-04-16 09:34:24', 'in transit', '2024-04-16 09:34:25', 'Shipped', '2507.41', 'Chris Martinez', 'dc1245d1-cfd9-46cf-4e26-c0cd7fa7e38e', 'nweekley1318');
INSERT INTO orders (root_order_id, delivery_code, delivery_date, delivery_join_date, delivery_status, expected_delivery_date, status, total_price, delivery_id, payment_odrder_id, seller_id) VALUES ('a9b4e28d-fef7-b3bc-ed69-7e981046e770', 'RLG-6576-KM', '2024-03-09 01:42:32', '2024-03-09 01:42:32', 'returned', '2024-03-09 01:42:33', 'Cancelled', '2376.51', 'James Brown', '37e34c3f-0274-6735-be85-f1ecf375f960', 'asnozzwell6350');
INSERT INTO orders (root_order_id, delivery_code, delivery_date, delivery_join_date, delivery_status, expected_delivery_date, status, total_price, delivery_id, payment_odrder_id, seller_id) VALUES ('6bcc1f12-1bd9-21cc-a865-27becfabd8ba', 'DAK-1136-JD', '2024-08-10 07:59:38', '2024-08-10 07:59:38', 'canceled', '2024-08-10 07:59:39', 'On Hold', '2903.36', 'Olivia Thomas', '7a33eae5-b3e9-b04b-dacb-0e079b0c1d39', 'rmcsporrin48179');
INSERT INTO orders (root_order_id, delivery_code, delivery_date, delivery_join_date, delivery_status, expected_delivery_date, status, total_price, delivery_id, payment_odrder_id, seller_id) VALUES ('e0129331-7ade-5503-e4d7-033c67cd1340', 'KII-2811-OJ', '2024-09-08 11:28:14', '2024-09-08 11:28:14', 'returned', '2024-09-08 11:28:15', 'Refunded', '3002.90', 'Matthew Anderson', '8609280d-db4c-766b-0b16-80a9cabb12b4', 'gsaenz50369');
INSERT INTO orders (root_order_id, delivery_code, delivery_date, delivery_join_date, delivery_status, expected_delivery_date, status, total_price, delivery_id, payment_odrder_id, seller_id) VALUES ('3df3dc0a-54d7-597d-ee4c-b0aee8c67b79', 'LHY-3439-SA', '2024-07-16 20:14:00', '2024-07-16 20:14:00', 'delivered', '2024-07-16 20:14:01', 'On Hold', '2819.72', 'Ashley Garcia', 'b31d990f-9a98-da5b-1fa4-d6c8669646a0', 'cfreschini36450');
INSERT INTO orders (root_order_id, delivery_code, delivery_date, delivery_join_date, delivery_status, expected_delivery_date, status, total_price, delivery_id, payment_odrder_id, seller_id) VALUES ('29d5e553-c2dc-c13a-a2c5-50d313f465ef', 'NBN-4053-SE', '2024-05-02 18:54:32', '2024-05-02 18:54:32', 'returned', '2024-05-02 18:54:33', 'Shipped', '2563.38', 'Jane Doe', '7477da52-bff0-54ce-502e-374e38eee1c5', 'asimioli58443');


INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('66f71fe0-ce8a-eeed-f2e8-71ca27908662', '780eaa2a-957d-00bb-845f-03b977148763', '25');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('e44e26fe-d622-c668-e1ac-d805e7c22a36', '99e2b2e9-27cf-7a47-f008-bb1f58b6cac4', '34');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('19efbcff-7505-2bd7-4898-007ad53c954f', '1c109a3f-996b-7af7-6808-d3a80af58486', '86');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('7d0fe010-9011-743f-ee2d-47340f545be6', '15c41dfd-0938-37a1-090f-05c5ce16663a', '52');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('585451a4-af4c-7e23-ff8e-b4c5b2d8116e', '9834ba86-71b7-6921-8ff7-91af5573290f', '18');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('af9ecc08-d0e3-9434-4812-2282e7adfd66', 'de5cd764-5a27-8c11-e4ea-14c4663bce08', '35');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('7d0fe010-9011-743f-ee2d-47340f545be6', 'b49608fb-2f9f-af5c-4855-57b7567be9e6', '90');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('b9cc18ec-26f0-8545-c8bb-3b9267a098a3', '29415cf8-9bbd-4e2a-0d71-0caa31152633', '11');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('634b29bb-4a21-5206-6252-dcaafe840bb2', '78c08bf7-01fa-7c2c-6cbd-0622ac246986', '38');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('8275e58c-2800-bcf7-4c73-34033fab3e57', 'ffca2b00-0df7-62d0-2b6a-6961ec643469', '17');


INSERT INTO category_policy_admin (policy_id, admin_id) VALUES ('1', 'modgaard39449');
INSERT INTO category_policy_admin (policy_id, admin_id) VALUES ('2', 'bbrolan64520');
INSERT INTO category_policy_admin (policy_id, admin_id) VALUES ('3', 'flemmon60152');
INSERT INTO category_policy_admin (policy_id, admin_id) VALUES ('4', 'hsaleway23664');
INSERT INTO category_policy_admin (policy_id, admin_id) VALUES ('5', 'glaux43012');
INSERT INTO category_policy_admin (policy_id, admin_id) VALUES ('6', 'ggorries36253');
INSERT INTO category_policy_admin (policy_id, admin_id) VALUES ('7', 'jwalentynowicz32118');
INSERT INTO category_policy_admin (policy_id, admin_id) VALUES ('8', 'apisculli19130');
INSERT INTO category_policy_admin (policy_id, admin_id) VALUES ('9', 'afrowen13316');
INSERT INTO category_policy_admin (policy_id, admin_id) VALUES ('10', 'jbannester19614');


INSERT INTO category_policy_category (policy_id, category_id) VALUES ('1', 'Automotive');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('2', 'Books');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('3', 'Jewelry');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('4', 'Sports');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('5', 'Clothing');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('6', 'Electronics');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('7', 'Beauty');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('8', 'Furniture');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('9', 'Groceries');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('10', 'Toys');



INSERT INTO cart_product_instance (product_instance_id, quantity, buyer_cart_id, buyer_id) VALUES ('780eaa2a-957d-00bb-845f-03b977148763', '57', '6656356f-5933-a442-8b22-21a94a24d363', 'jvan daalen4926');
INSERT INTO cart_product_instance (product_instance_id, quantity, buyer_cart_id, buyer_id) VALUES ('99e2b2e9-27cf-7a47-f008-bb1f58b6cac4', '83', '8ce408e3-be11-5950-bdc4-3149e37a6800', 'mselwyn39960');
INSERT INTO cart_product_instance (product_instance_id, quantity, buyer_cart_id, buyer_id) VALUES ('1c109a3f-996b-7af7-6808-d3a80af58486', '65', '0291b502-ca3d-29ac-3782-2bbed57d626e', 'rellerbeck14523');
INSERT INTO cart_product_instance (product_instance_id, quantity, buyer_cart_id, buyer_id) VALUES ('15c41dfd-0938-37a1-090f-05c5ce16663a', '53', '80b73a89-d809-b45a-7964-e1d6cf2c24d9', 'ppowland34378');
INSERT INTO cart_product_instance (product_instance_id, quantity, buyer_cart_id, buyer_id) VALUES ('9834ba86-71b7-6921-8ff7-91af5573290f', '21', 'fcb424a1-eda9-d345-8569-ffe4d0115a98', 'blorincz32984');
INSERT INTO cart_product_instance (product_instance_id, quantity, buyer_cart_id, buyer_id) VALUES ('de5cd764-5a27-8c11-e4ea-14c4663bce08', '41', '63df9826-1906-2512-e13c-c3a8564d7009', 'rmcatamney60369');
INSERT INTO cart_product_instance (product_instance_id, quantity, buyer_cart_id, buyer_id) VALUES ('b49608fb-2f9f-af5c-4855-57b7567be9e6', '54', '12aa6eaa-e710-dbe6-20b2-6ab61e85456b', 'klogsdale63588');
INSERT INTO cart_product_instance (product_instance_id, quantity, buyer_cart_id, buyer_id) VALUES ('29415cf8-9bbd-4e2a-0d71-0caa31152633', '90', '5094d051-5811-e4f2-2082-ad2d29362f7a', 'nteanby25634');
INSERT INTO cart_product_instance (product_instance_id, quantity, buyer_cart_id, buyer_id) VALUES ('78c08bf7-01fa-7c2c-6cbd-0622ac246986', '94', '90d717e0-ae7d-d8a1-cd1c-f39adfef3cfb', 'dphilbrick34048');
INSERT INTO cart_product_instance (product_instance_id, quantity, buyer_cart_id, buyer_id) VALUES ('ffca2b00-0df7-62d0-2b6a-6961ec643469', '36', '590a5f35-0502-2743-45b9-ea8d68a50c4e', 'adarby50179');


INSERT INTO cart (composite_cart_id, username, total_price, total_quantity, cart_buyer_id) VALUES ('6656356f-5933-a442-8b22-21a94a24d363', 'jvan daalen4926', '4400.80', '26', 'jvan daalen4926');
INSERT INTO cart (composite_cart_id, username, total_price, total_quantity, cart_buyer_id) VALUES ('8ce408e3-be11-5950-bdc4-3149e37a6800', 'mselwyn39960', '4724.85', '39', 'mselwyn39960');
INSERT INTO cart (composite_cart_id, username, total_price, total_quantity, cart_buyer_id) VALUES ('0291b502-ca3d-29ac-3782-2bbed57d626e', 'rellerbeck14523', '4534.65', '32', 'rellerbeck14523');
INSERT INTO cart (composite_cart_id, username, total_price, total_quantity, cart_buyer_id) VALUES ('80b73a89-d809-b45a-7964-e1d6cf2c24d9', 'ppowland34378', '3753.99', '1', 'ppowland34378');
INSERT INTO cart (composite_cart_id, username, total_price, total_quantity, cart_buyer_id) VALUES ('fcb424a1-eda9-d345-8569-ffe4d0115a98', 'blorincz32984', '5431.26', '67', 'blorincz32984');
INSERT INTO cart (composite_cart_id, username, total_price, total_quantity, cart_buyer_id) VALUES ('63df9826-1906-2512-e13c-c3a8564d7009', 'rmcatamney60369', '4827.98', '43', 'rmcatamney60369');
INSERT INTO cart (composite_cart_id, username, total_price, total_quantity, cart_buyer_id) VALUES ('12aa6eaa-e710-dbe6-20b2-6ab61e85456b', 'klogsdale63588', '4635.77', '36', 'klogsdale63588');
INSERT INTO cart (composite_cart_id, username, total_price, total_quantity, cart_buyer_id) VALUES ('5094d051-5811-e4f2-2082-ad2d29362f7a', 'nteanby25634', '5870.52', '84', 'nteanby25634');
INSERT INTO cart (composite_cart_id, username, total_price, total_quantity, cart_buyer_id) VALUES ('90d717e0-ae7d-d8a1-cd1c-f39adfef3cfb', 'dphilbrick34048', '4431.90', '28', 'dphilbrick34048');
INSERT INTO cart (composite_cart_id, username, total_price, total_quantity, cart_buyer_id) VALUES ('590a5f35-0502-2743-45b9-ea8d68a50c4e', 'adarby50179', '5237.81', '59', 'adarby50179');


INSERT INTO admin_product (product_id, admin_id) VALUES ('b4fb95ec-0555-3236-b96e-c8750a83adbe', 'modgaard39449');
INSERT INTO admin_product (product_id, admin_id) VALUES ('a726bd9a-f195-0d6c-30a9-6220ca580250', 'bbrolan64520');
INSERT INTO admin_product (product_id, admin_id) VALUES ('8907bc34-08cb-f0a7-f1fe-4c0b4ad6d5bc', 'flemmon60152');
INSERT INTO admin_product (product_id, admin_id) VALUES ('80f36cc5-6613-6a4e-84d3-5cb4c84aedf7', 'hsaleway23664');
INSERT INTO admin_product (product_id, admin_id) VALUES ('15c9e862-b50f-0820-bdc4-216171e88ab5', 'glaux43012');
INSERT INTO admin_product (product_id, admin_id) VALUES ('678bb1e4-130e-9c40-4843-be0fc498a3f6', 'ggorries36253');
INSERT INTO admin_product (product_id, admin_id) VALUES ('c54d6f0d-4f7e-d70d-a3c5-c1505b163497', 'jwalentynowicz32118');
INSERT INTO admin_product (product_id, admin_id) VALUES ('544d47d1-8e43-20bc-8cb3-84de33f2fd65', 'apisculli19130');
INSERT INTO admin_product (product_id, admin_id) VALUES ('15aa6023-df37-a3e1-e067-5a9626c2ff24', 'afrowen13316');
INSERT INTO admin_product (product_id, admin_id) VALUES ('69d60f96-16df-edcc-bd1d-633e78233df4', 'jbannester19614');


INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('1', 'texture', 'b4fb95ec-0555-3236-b96e-c8750a83adbe');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('2', 'volume', 'a726bd9a-f195-0d6c-30a9-6220ca580250');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('3', 'material', '8907bc34-08cb-f0a7-f1fe-4c0b4ad6d5bc');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('4', 'style', '80f36cc5-6613-6a4e-84d3-5cb4c84aedf7');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('5', 'capacity', '15c9e862-b50f-0820-bdc4-216171e88ab5');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('6', 'material', '678bb1e4-130e-9c40-4843-be0fc498a3f6');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('7', 'season', 'c54d6f0d-4f7e-d70d-a3c5-c1505b163497');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('8', 'rating', '544d47d1-8e43-20bc-8cb3-84de33f2fd65');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('9', 'texture', '15aa6023-df37-a3e1-e067-5a9626c2ff24');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('10', 'accessories', '69d60f96-16df-edcc-bd1d-633e78233df4');


INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id ) VALUES ('b4fb95ec-0555-3236-b96e-c8750a83adbe', '780eaa2a-957d-00bb-845f-03b977148763', '1', 'ad9d265c-3fad-8d5f-d337-2c2c55368038');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('a726bd9a-f195-0d6c-30a9-6220ca580250', '99e2b2e9-27cf-7a47-f008-bb1f58b6cac4', '2', 'a8cca1e3-4e50-7d71-087c-4de1e1574916');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('8907bc34-08cb-f0a7-f1fe-4c0b4ad6d5bc', '1c109a3f-996b-7af7-6808-d3a80af58486', '3', '97fc90a5-c1de-b559-7cd4-b2628e1831b4');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('80f36cc5-6613-6a4e-84d3-5cb4c84aedf7', '15c41dfd-0938-37a1-090f-05c5ce16663a', '4', '06fe4492-1a03-92c8-bb59-88943224d4a3');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('15c9e862-b50f-0820-bdc4-216171e88ab5', '9834ba86-71b7-6921-8ff7-91af5573290f', '5', '4d5e9051-1a14-12fc-42f5-3b4223611d51');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('678bb1e4-130e-9c40-4843-be0fc498a3f6', 'de5cd764-5a27-8c11-e4ea-14c4663bce08', '6', '6985c448-b40e-53ae-3294-e8f39d70b5e7');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('c54d6f0d-4f7e-d70d-a3c5-c1505b163497', 'b49608fb-2f9f-af5c-4855-57b7567be9e6', '7', 'e4692363-43a3-e5c8-be4f-499f159504eb');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('544d47d1-8e43-20bc-8cb3-84de33f2fd65', '29415cf8-9bbd-4e2a-0d71-0caa31152633', '8', 'df3cdd53-9b44-3aa3-e8d6-50444d360681');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('15aa6023-df37-a3e1-e067-5a9626c2ff24', '78c08bf7-01fa-7c2c-6cbd-0622ac246986', '9', '02439c0f-b11d-a136-4ff8-76aa2e1e6d05');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('69d60f96-16df-edcc-bd1d-633e78233df4', 'ffca2b00-0df7-62d0-2b6a-6961ec643469', '10', 'bb0b7541-1985-9b07-65d3-7a662abbbb1c');


INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('1', 'ad9d265c-3fad-8d5f-d337-2c2c55368038', 'In liberos atque in sanguinem suum tam crudelis fuisse, nihil ut de omni virtute.');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('2', 'a8cca1e3-4e50-7d71-087c-4de1e1574916', 'Paulo contra vestra convicia, sed tamen satis acuti, qui.');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('3', '97fc90a5-c1de-b559-7cd4-b2628e1831b4', 'Non offendit; nam et laetamur amicorum laetitia aeque atque nostra et pariter dolemus angoribus. Quocirca eodem modo sapiens erit affectus erga amicum, quo in se ipsum.');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('4', '06fe4492-1a03-92c8-bb59-88943224d4a3', 'Ad arbitrium suum scribere? Quodsi Graeci leguntur a Graecis isdem de rebus alia ratione.');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('5', '4d5e9051-1a14-12fc-42f5-3b4223611d51', 'E nostris, qui haec subtilius velint tradere et negent satis esse, quid bonum sit aut quid iudicat, quo aut petat aut fugiat aliquid, praeter voluptatem et dolorem? Sunt.');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('6', '6985c448-b40e-53ae-3294-e8f39d70b5e7', 'Malorum? Qua de re cum sit inter doctissimos summa dissensio, quis alienum putet eius esse dignitatis, quam mihi quisque tribuat, quid.');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('7', 'e4692363-43a3-e5c8-be4f-499f159504eb', 'Quibus ex omnibus iudicari potest non modo voluptatem esse, verum etiam summam voluptatem. Quisquis enim sentit, quem ad modum affecta nunc est, desiderat?'' -- Nihil sane. -- ''At, si voluptas esset bonum, desideraret.'' -- Ita credo. -- ''Non est igitur voluptas bonum.'' Hoc ne statuam quidem dicturam pater.');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('8', 'df3cdd53-9b44-3aa3-e8d6-50444d360681', 'Audiebam facete et urbane Stoicos irridente, statua est in eo, quod sit iudicatum. Plerique autem, quod tenere atque servare id, quod propositum est, summum bonum diceret, primum in eo filio adhibuit, quem in.');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('9', '02439c0f-b11d-a136-4ff8-76aa2e1e6d05', 'Sunt. Praeclare enim Epicurus his paene verbis: ''Eadem'', inquit, ''scientia confirmavit animum, ne quod aut sempiternum aut diuturnum timeret malum, quae perspexit in hoc ipso vitae spatio amicitiae praesidium esse firmissimum.'' Sunt autem quidam e nostris, qui haec subtilius velint tradere et negent satis.');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('10', 'bb0b7541-1985-9b07-65d3-7a662abbbb1c', 'Aliquando, nulla praeterea neque praesenti nec expectata voluptate, quid eo miserius dici aut fingi potest? Quodsi vita doloribus referta maxime fugienda est, summum bonum.');


INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('1', '2024-06-23 13:33:12', 'Simul atque natum sit, voluptatem appetere eaque gaudere ut summo bono, dolorem aspernari ut summum malum et, quantum possit, a se repellere, idque facere nondum depravatum ipsa natura incorrupte atque integre iudicante. Itaque.', 'Pet Insurance', '2024-06-23 13:33:15');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('2', '2024-04-03 09:55:51', 'Mandaremus, fore ut atomus altera alteram posset attingere itaque ** attulit rem commenticiam: declinare dixit atomum perpaulum, quo nihil turpius.', 'Disability Insurance', '2024-04-03 09:55:54');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('3', '2024-07-31 22:11:13', 'Qua intellegebat contineri suam. Atque haec ratio late patet. In quo enim maxime consuevit iactare vestra se oratio, tua praesertim, qui studiose antiqua persequeris, claris et fortibus viris commemorandis eorumque factis non emolumento aliquo, sed ipsius honestatis decore laudandis, id totum evertitur eo delectu.', 'Liability Insurance', '2024-07-31 22:11:16');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('4', '2024-05-31 11:45:43', 'Enim illum ab industria, sed ab inliberali labore deterret --, sic isti curiosi, quos offendit noster minime nobis iniucundus labor. Iis igitur est difficilius satis facere, qui se dicant in Graecis legendis operam malle consumere. Postremo aliquos futuros suspicor, qui me ad.', 'Liability Insurance', '2024-05-31 11:45:46');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('5', '2024-08-24 09:09:40', 'Scribentur fortasse plura, si vita suppetet; et tamen, qui diligenter haec, quae vitam omnem continent, neglegentur? Nam, ut sint illa vendibiliora, haec uberiora certe sunt. Quamquam id quidem facio provocatus gratissimo mihi.', 'Life Insurance', '2024-08-24 09:09:43');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('6', '2024-07-05 21:44:14', 'Esse ratione neque disputatione, quam ob rem tandem, inquit, non satisfacit? Te enim iudicem aequum puto, modo quae dicat ille bene.', 'Health Insurance', '2024-07-05 21:44:17');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('7', '2024-07-02 21:56:33', 'Recusabo, quo minus id, quod quaeritur, sit pulcherrimum. Etenim si loca, si fana, si urbes, si gymnasia, si campum, si canes, si equos, si ludicra exercendi aut.', 'Homeowners Insurance', '2024-07-02 21:56:36');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('8', '2024-04-02 21:00:19', 'Quem vos nimis voluptatibus esse deditum dicitis; non posse iucunde vivi, nisi sapienter, honeste iusteque vivatur, nec sapienter.', 'Renters Insurance', '2024-04-02 21:00:22');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('9', '2024-10-01 09:00:40', 'Quod disserunt. Praeterea sublata cognitione et scientia tollitur omnis ratio et vitae degendae et rerum gerendarum. Sic e physicis et fortitudo sumitur contra mortis timorem et constantia contra metum religionis et sedatio animi omnium rerum occultarum ignoratione sublata et moderatio natura cupiditatum generibusque earum explicatis, et, ut dixi, ad lineam, numquam fore ut hic noster labor.', 'Liability Insurance', '2024-10-01 09:00:43');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('10', '2024-02-07 17:33:47', 'Si loqui posset. Conclusum est enim contra Cyrenaicos satis acute, nihil ad Epicurum. Nam si concederetur, etiamsi ad corpus referri, nec ob eam causam.', 'Liability Insurance', '2024-02-07 17:33:50');


INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('1', '2024-03-20 04:44:21', 'Invidus, qui ab eo ortum, tam inportuno tamque crudeli; sin, ut dolore suo sanciret militaris imperii disciplinam exercitumque.', 'Cancellation Policy', '2024-03-20 04:44:22');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('2', '2024-05-12 03:42:11', 'Homine omni doctrina erudito, defensa est Epicuri sententia de voluptate, a meque ei responsum, cum C. Triarius, in primis gravis et.', 'Terms of Service', '2024-05-12 03:42:12');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('3', '2024-04-04 13:29:00', 'Quod, cum in rerum natura cognita levamur superstitione, liberamur mortis metu, non conturbamur ignoratione rerum, e qua ipsa horribiles existunt saepe formidines. Denique etiam morati melius.', 'Discount Policy', '2024-04-04 13:29:01');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('4', '2024-02-22 11:55:57', 'Militaris imperii disciplinam exercitumque in gravissimo bello animadversionis metu contineret, saluti prospexit civium, qua intellegebat contineri suam. Atque haec ratio late patet.', 'Return Policy', '2024-02-22 11:55:58');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('5', '2023-10-29 21:50:42', 'Fieri poterit et iustius? Sunt autem, qui dicant foedus esse quoddam sapientium, ut ne minus amicos quam se ipsos penitus perdiderunt, sic robustus animus et excelsus omni est.', 'Payment Policy', '2023-10-29 21:50:43');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('6', '2024-06-04 17:28:47', 'Tamen ego a philosopho, si afferat eloquentiam, non asperner, si non habeat.', 'Shipping Policy', '2024-06-04 17:28:48');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('7', '2024-09-01 04:19:16', 'Vel elegantis ornatus defuit? Ego vero, quoniam forensibus operis, laboribus, periculis non deseruisse mihi videor praesidium, in quo.', 'Membership Terms', '2024-09-01 04:19:17');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('8', '2024-08-28 00:27:20', 'Terentii quam utramque Menandri legam? A quibus tantum dissentio, ut, cum Sophocles vel optime scripserit Electram, tamen male conversam Atilii mihi legendam putem, de.', 'Shipping Policy', '2024-08-28 00:27:21');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('9', '2024-03-31 20:24:19', 'Quem ego arbitror unum vidisse verum maximisque erroribus animos hominum liberavisse et omnia tradidisse, quae pertinerent ad bene vivendum aptior partitio quam illa, qua est usus Epicurus? Qui unum genus posuit earum cupiditatum, quae essent et naturales et necessariae, alterum, quae naturales essent nec tamen necessariae, tertium, quae.', 'Customer Service Policy', '2024-03-31 20:24:20');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('10', '2023-11-24 17:48:41', 'Ex ea commodo consequat. Duis aute irure dolor in longinquitate levis, in gravitate brevis.', 'Discount Policy', '2023-11-24 17:48:42');


INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('b4fb95ec-0555-3236-b96e-c8750a83adbe', 'Constituant in reque eo meliore, quo maior sit, si nihil efficeret; nunc expetitur, quod est tamquam artifex conquirendae et comparandae voluptatis -- Quam autem ego dicam.', 'Quince', 'Sports', 'dmickelwright31174');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('a726bd9a-f195-0d6c-30a9-6220ca580250', 'Voluptatem efficerent, quis eas aut laudabilis aut expetendas arbitraretur? Ut enim sapientiam, temperantiam.', 'Apple', 'Jewelry', 'dlewsley41328');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('8907bc34-08cb-f0a7-f1fe-4c0b4ad6d5bc', 'Homines, sed universas familias evertunt, totam etiam labefactant saepe rem.', 'Kiwi', 'Clothing', 'kleverett5376');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('80f36cc5-6613-6a4e-84d3-5cb4c84aedf7', 'Ornamenta neglexerit. Nam illud quidem perspicuum est, maximam animi aut voluptatem aut molestiam plus aut ad miseram vitam afferre momenti quam eorum utrumvis, si.', 'Grape', 'Electronics', 'dcalcutt38043');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('15c9e862-b50f-0820-bdc4-216171e88ab5', 'Fecit. Disserendi artem nullam habuit. Voluptatem cum summum bonum in voluptate est. Extremum autem esse bonorum eum voluptate vivere. Nec enim habet nostra mens quicquam, ubi consistat tamquam in extremo, omnesque et metus et aegritudines ad.', 'Peach', 'Toys', 'nweekley1318');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('678bb1e4-130e-9c40-4843-be0fc498a3f6', 'Nec epularum nec reliquarum cupiditatum, quas nulla praeda umquam.', 'Elderberry', 'Beauty', 'asnozzwell6350');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('c54d6f0d-4f7e-d70d-a3c5-c1505b163497', 'Aut Andriam Terentii quam utramque Menandri legam? A quibus tantum dissentio, ut, cum Sophocles vel optime scripserit Electram, tamen male conversam Atilii mihi legendam putem, de quo Lucilius.', 'Watermelon', 'Furniture', 'rmcsporrin48179');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('544d47d1-8e43-20bc-8cb3-84de33f2fd65', 'In voluptatis locum dolor forte successerit, at contra gaudere nosmet omittendis doloribus, etiamsi voluptas ea, quae corrigere vult, mihi quidem videtur, inermis ac nudus est. Tollit definitiones.', 'Ugli fruit', 'Automotive', 'gsaenz50369');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('15aa6023-df37-a3e1-e067-5a9626c2ff24', 'Non intellegunt, errore maximo, si Epicurum audire voluerint, liberabuntur: istae enim vestrae eximiae pulchraeque virtutes nisi voluptatem efficerent, quis eas aut laudabilis aut expetendas arbitraretur? Ut enim ad sapientiam perveniri potest, non paranda nobis solum ea, sed fruenda etiam sapientia est; sive hoc difficile est, tamen nec modus est ullus investigandi veri, nisi inveneris, et quaerendi.', 'Fig', 'Books', 'cfreschini36450');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('69d60f96-16df-edcc-bd1d-633e78233df4', 'Timiditatem ignaviamque vituperari nec fortitudinem patientiamque laudari suo nomine, sed illas reici, quia dolorem pariant, has optari, quia voluptatem. Iustitia restat.', 'Nectarine', 'Groceries', 'asimioli58443');


INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('fa67c9ad-4d98-dad3-87f0-5b00f6643eef', 'Ut Epicuri ratio docet, tum denique poterit aliquid cognosci et percipi. Quos qui tollunt et nihil posse percipi dicunt, ii remotis sensibus ne id ipsum quidem expedire possunt, quod disserunt. Praeterea sublata cognitione et scientia tollitur omnis ratio et vitae degendae et rerum gerendarum. Sic e physicis et fortitudo sumitur contra mortis.', '4', 'Ut Epicuri ratio docet, tum denique poterit aliquid cognosci et percipi. Quos qui tollunt et nihil posse percipi dicunt, ii remotis sensibus ne id ipsum quidem expedire possunt, quod disserunt. Praeterea sublata cognitione et scientia tollitur omnis ratio et vitae degendae et rerum gerendarum. Sic e physicis et fortitudo sumitur contra mortis.', 'Ut Epicuri ratio docet, tum denique poterit aliquid cognosci et percipi. Quos qui tollunt et nihil posse percipi dicunt, ii remotis sensibus ne id ipsum quidem expedire possunt, quod disserunt. Praeterea sublata cognitione et scientia tollitur omnis ratio et vitae degendae et rerum gerendarum. Sic e physicis et fortitudo sumitur contra mortis.', 'dmickelwright31174');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('1dce09f1-1ad4-3dcd-24e1-21351c191cae', 'Philosophia mihi videri solent. Tum Torquatus: Prorsus, inquit, assentior; neque enim disputari sine reprehensione nec cum iracundia aut pertinacia recte disputari potest. Sed ad rem redeamus; de hominibus dici non necesse est. Tribus igitur modis video esse multos, sed imperitos --, quamquam autem et praeterita et futura. Ut enim aeque doleamus animo.', '4', 'Philosophia mihi videri solent. Tum Torquatus: Prorsus, inquit, assentior; neque enim disputari sine reprehensione nec cum iracundia aut pertinacia recte disputari potest. Sed ad rem redeamus; de hominibus dici non necesse est. Tribus igitur modis video esse multos, sed imperitos --, quamquam autem et praeterita et futura. Ut enim aeque doleamus animo.', 'Philosophia mihi videri solent. Tum Torquatus: Prorsus, inquit, assentior; neque enim disputari sine reprehensione nec cum iracundia aut pertinacia recte disputari potest. Sed ad rem redeamus; de hominibus dici non necesse est. Tribus igitur modis video esse multos, sed imperitos --, quamquam autem et praeterita et futura. Ut enim aeque doleamus animo.', 'dlewsley41328');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('2b9f33ef-2b0e-50ae-1918-fb7aa47e95fb', 'Te, cum ad te ne Graecis quidem cedentem in philosophia audeam scribere? Quamquam a te ipso id quidem licebit iis existimare, qui legerint. Nos autem hanc omnem quaestionem de finibus bonorum et.', '4', 'Te, cum ad te ne Graecis quidem cedentem in philosophia audeam scribere? Quamquam a te ipso id quidem licebit iis existimare, qui legerint. Nos autem hanc omnem quaestionem de finibus bonorum et.', 'Te, cum ad te ne Graecis quidem cedentem in philosophia audeam scribere? Quamquam a te ipso id quidem licebit iis existimare, qui legerint. Nos autem hanc omnem quaestionem de finibus bonorum et.', 'kleverett5376');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('078a783c-dfe6-8621-d598-241701becdb9', 'Dolores nasci fatemur e corporis voluptatibus et doloribus -- itaque concedo, quod modo dicebas, cadere causa, si qui e nostris aliter existimant, quos quidem video minime esse.', '3', 'Dolores nasci fatemur e corporis voluptatibus et doloribus -- itaque concedo, quod modo dicebas, cadere causa, si qui e nostris aliter existimant, quos quidem video minime esse.', 'Dolores nasci fatemur e corporis voluptatibus et doloribus -- itaque concedo, quod modo dicebas, cadere causa, si qui e nostris aliter existimant, quos quidem video minime esse.', 'dcalcutt38043');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('a226e2ca-fe65-0e85-4f3d-aee4499e8f48', 'Dolores ita paratus est, ut necessariae nec opera multa nec impensa expleantur; ne naturales quidem multa desiderant, propterea quod ipsa natura divitias, quibus contenta sit, et parabilis et terminatas habet; inanium autem cupiditatum nec modus est ullus investigandi veri.', '3', 'Dolores ita paratus est, ut necessariae nec opera multa nec impensa expleantur; ne naturales quidem multa desiderant, propterea quod ipsa natura divitias, quibus contenta sit, et parabilis et terminatas habet; inanium autem cupiditatum nec modus est ullus investigandi veri.', 'Dolores ita paratus est, ut necessariae nec opera multa nec impensa expleantur; ne naturales quidem multa desiderant, propterea quod ipsa natura divitias, quibus contenta sit, et parabilis et terminatas habet; inanium autem cupiditatum nec modus est ullus investigandi veri.', 'nweekley1318');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('1babd96d-028e-5749-423c-7f82dc840732', 'Labore deterret --, sic isti curiosi, quos offendit noster minime nobis iniucundus labor. Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. In quibus hoc primum est in Ceramico.', '4', 'Labore deterret --, sic isti curiosi, quos offendit noster minime nobis iniucundus labor. Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. In quibus hoc primum est in Ceramico.', 'Labore deterret --, sic isti curiosi, quos offendit noster minime nobis iniucundus labor. Iis igitur est difficilius satis facere, qui se Latina scripta dicunt contemnere. In quibus hoc primum est in Ceramico.', 'asnozzwell6350');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('0929ebc9-cdc7-d010-e4dc-c26da13405d9', 'Tot versuum memoria voluptatis affert? Nec mihi illud dixeris: ''Haec enim ipsa mihi.', '0', 'Tot versuum memoria voluptatis affert? Nec mihi illud dixeris: ''Haec enim ipsa mihi.', 'Tot versuum memoria voluptatis affert? Nec mihi illud dixeris: ''Haec enim ipsa mihi.', 'rmcsporrin48179');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('f19d60dc-937f-2725-908a-13b39433f2fd', 'Cum Attico nostro frequenter audivi, cum miraretur ille quidem utrumque, Phaedrum autem etiam amatoriis levitatibus dediti, alii petulantes, alii audaces, protervi.', '3', 'Cum Attico nostro frequenter audivi, cum miraretur ille quidem utrumque, Phaedrum autem etiam amatoriis levitatibus dediti, alii petulantes, alii audaces, protervi.', 'Cum Attico nostro frequenter audivi, cum miraretur ille quidem utrumque, Phaedrum autem etiam amatoriis levitatibus dediti, alii petulantes, alii audaces, protervi.', 'gsaenz50369');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('79074ed7-4ecc-99ba-7283-155c7c5c99dd', 'Ipsi statuerunt, non possunt, conficiuntur et angore et metu maximeque cruciantur, cum sero sentiunt frustra se aut pecuniae studuisse aut imperiis aut opibus aut gloriae. Nullas enim consequuntur voluptates, quarum potiendi spe inflammati multos labores magnosque.', '2', 'Ipsi statuerunt, non possunt, conficiuntur et angore et metu maximeque cruciantur, cum sero sentiunt frustra se aut pecuniae studuisse aut imperiis aut opibus aut gloriae. Nullas enim consequuntur voluptates, quarum potiendi spe inflammati multos labores magnosque.', 'Ipsi statuerunt, non possunt, conficiuntur et angore et metu maximeque cruciantur, cum sero sentiunt frustra se aut pecuniae studuisse aut imperiis aut opibus aut gloriae. Nullas enim consequuntur voluptates, quarum potiendi spe inflammati multos labores magnosque.', 'cfreschini36450');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('e0ceb583-9df1-2e51-f96c-3f264563358f', 'Terentianus Chremes non inhumanus, qui novum vicinum non vult ''fodere aut arare aut aliquid ferre denique'' -- non enim illum ab industria, sed ab inliberali labore.', '1', 'Terentianus Chremes non inhumanus, qui novum vicinum non vult ''fodere aut arare aut aliquid ferre denique'' -- non enim illum ab industria, sed ab inliberali labore.', 'Terentianus Chremes non inhumanus, qui novum vicinum non vult ''fodere aut arare aut aliquid ferre denique'' -- non enim illum ab industria, sed ab inliberali labore.', 'asimioli58443');


SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;
