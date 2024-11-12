create database e-commerce;

use e-commerce;

create table address
(
    address_id       bigint auto_increment
        primary key,
    commune          varchar(255) null,
    district         varchar(255) null,
    province         varchar(255) null,
    specific_address varchar(255) null
);

create table category
(
    name                 varchar(255) not null
        primary key,
    parent_category_name varchar(255) null,
    constraint FK2fev52lixpq850g4otq5k6x2o
        foreign key (parent_category_name) references category (name)
);

create table category_policy
(
    policy_id          bigint auto_increment
        primary key,
    apply_date         date         null,
    policy_description varchar(255) null,
    policy_name        varchar(255) null,
    release_date       date         null
);

create table category_policy_category
(
    policy_id   bigint       not null,
    category_id varchar(255) not null,
    constraint FKevt26jvv1u7joifgcpm5t2v1y
        foreign key (category_id) references category (name),
    constraint FKj8v5qyfpswcy9g82yd4wv4chb
        foreign key (policy_id) references category_policy (policy_id)
);

create table delivery
(
    delivery_name varchar(255) not null
        primary key
);

create table invalidated_token
(
    id          varchar(255) not null
        primary key,
    expiry_time datetime(6)  null
);


create table product_instance
(
    root_product_instance_id varchar(64) not null
        primary key,
    price                    bigint      null,
    quantity_in_stock        bigint      null
);

create table shop_policy
(
    policy_id          bigint auto_increment
        primary key,
    apply_date         date         null,
    policy_description varchar(255) null,
    policy_name        varchar(255) null,
    release_date       date         null
);

create table user
(
    username     varchar(255) not null
        primary key,
    created_date date         null,
    dob          date         null,
    email        varchar(255) null,
    first_name   varchar(255) null,
    last_name    varchar(255) null,
    password     varchar(255) null,
    phone        varchar(255) null
);

create table admin
(
    username varchar(255) not null
        primary key,
    constraint FKct0xnk0e2pv9jotrkeqy09xde
        foreign key (username) references user (username)
);

create table activity
(
    activity_id          bigint auto_increment
        primary key,
    activity_date        date         null,
    activity_description varchar(255) null,
    activity_name        varchar(255) null,
    admin_id             varchar(255) null,
    constraint FK9dlk8w5g378e9xldxtinaeqf1
        foreign key (admin_id) references admin (username)
);

create table business
(
    username varchar(255) not null
        primary key,
    constraint FKk8fuufvbi73yjwqdygtk7pyqp
        foreign key (username) references user (username)
);

create table buyer
(
    username varchar(255) not null
        primary key,
    constraint FKd71jfoj2ebl8pemeo888nsr8h
        foreign key (username) references business (username)
);

create table cart
(
    composite_cart_id varchar(255) not null,
    username          varchar(255) not null,
    total_price       bigint       null,
    total_quantity    bigint       null,
    cart_buyer_id     varchar(255) not null,
    primary key (composite_cart_id, username),
    constraint UKgo4xymrb2m6vy79343r18gx3g
        unique (cart_buyer_id),
    constraint FKe51tumpt3o4fmwrlw10rlevu0
        foreign key (cart_buyer_id) references buyer (username)
);

create table cart_product_instance
(
    product_instance_id varchar(255) not null,
    quantity            bigint       null,
    buyer_cart_id       varchar(255) not null,
    buyer_id            varchar(255) not null,
    primary key (buyer_cart_id, buyer_id, product_instance_id),
    constraint FK9nib0pkfp15rutkeb0fexe6pf
        foreign key (product_instance_id) references product_instance (root_product_instance_id),
    constraint FKoyorputj93qkj790pvs1s8ayu
        foreign key (buyer_cart_id, buyer_id) references cart (composite_cart_id, username)
);

create table category_policy_admin
(
    policy_id bigint       not null,
    admin_id  varchar(255) not null,
    constraint FK5531ffmeuej05jhtgttskt6j2
        foreign key (admin_id) references admin (username),
    constraint FKq7u4t1ewrgl6noxmvhtwgpkn0
        foreign key (policy_id) references category_policy (policy_id)
);

create table delivery_infor
(
    id             bigint auto_increment
        primary key,
    phone_number   varchar(255) null,
    recipient_name varchar(255) null,
    address_id     bigint       not null,
    buyer_id       varchar(255) not null,
    constraint UK5l0k1230er99fy3syu2nl46jf
        unique (address_id),
    constraint FK32maa26wgwgy36s8imc3apx3u
        foreign key (buyer_id) references buyer (username),
    constraint FKikqj6a1ea5cldjahmhmxr522s
        foreign key (address_id) references address (address_id)
);

create table payment_info
(
    card_number      varchar(255) not null
        primary key,
    bank_name        varchar(255) null,
    card_holder_name varchar(255) null,
    business_id      varchar(255) null,
    constraint FK843j0bdu1xjm4kpegbe2vr0ng
        foreign key (business_id) references business (username)
);

create table payment_order
(
    payment_order_id varchar(255) not null
        primary key,
    buyer_id         varchar(255) not null,
    constraint FKn0u6l205mqxutfbqpdpl8y8sr
        foreign key (buyer_id) references buyer (username)
);

create table seller
(
    followers  int          null,
    shop_name  varchar(255) null,
    username   varchar(255) not null
        primary key,
    address_id bigint       not null,
    constraint UKpwb44pfjo99nve4cj9s4fa5tg
        unique (address_id),
    constraint FKl3wd5axaup1lsnsd9fhh0p6hs
        foreign key (username) references business (username),
    constraint FKopt4gyyicn4akyj4bossfp10g
        foreign key (address_id) references address (address_id)
);

create table follow
(
    followee_id varchar(255) not null,
    follower_id varchar(255) not null,
    primary key (followee_id, follower_id),
    constraint FK4xpb46tkhrut03qw9ej42glo9
        foreign key (followee_id) references seller (username),
    constraint FKba47uidjow00la66q8ws86wya
        foreign key (follower_id) references buyer (username)
);

create table orders
(
    root_order_id          varchar(255) not null
        primary key,
    delivery_code          varchar(255) null,
    delivery_date          date         null,
    delivery_join_date     date         null,
    delivery_status        varchar(255) null,
    expected_delivery_date date         null,
    status                 varchar(255) null,
    total_price            bigint       null,
    delivery_id            varchar(255) null,
    payment_odrder_id      varchar(255) null,
    seller_id              varchar(255) null,
    constraint FKiqoyghlcoagihjeufolwetin7
        foreign key (seller_id) references seller (username),
    constraint FKormoby8boopcrl8epgg4od23n
        foreign key (payment_odrder_id) references payment_order (payment_order_id),
    constraint FKtkrur7wg4d8ax0pwgo0vmy20c
        foreign key (delivery_id) references delivery (delivery_name)
);

create table order_product_instance
(
    order_id            varchar(255) not null,
    product_instance_id varchar(255) not null,
    quantity            bigint       null,
    primary key (order_id, product_instance_id),
    constraint FKkelcojcgu35cpgqhnb19yvmtw
        foreign key (product_instance_id) references product_instance (root_product_instance_id),
    constraint FKqqrn0uj1x2yp2n6ca0oi9noqi
        foreign key (order_id) references orders (root_order_id)
);

create table product
(
    root_product_id varchar(64)  not null
        primary key,
    description     varchar(255) null,
    name            varchar(255) null,
    category_name   varchar(255) not null,
    seller_id       varchar(255) not null,
    constraint FKesd6fy52tk7esoo2gcls4lfe3
        foreign key (seller_id) references seller (username),
    constraint FKmxhoec7wquhjv31p300vqahdo
        foreign key (category_name) references category (name)
);

create table admin_product
(
    product_id varchar(64)  not null,
    admin_id   varchar(255) not null,
    constraint FK76be2f7y25tg0atuqgk1whg8v
        foreign key (product_id) references product (root_product_id),
    constraint FKnp3hmk6jyqiau37wqvta8a6h2
        foreign key (admin_id) references admin (username)
);

create table attribute
(
    root_attribute_id bigint auto_increment
        primary key,
    name              varchar(255) null,
    product_id        varchar(64)  not null,
    constraint FKodmc4a3tlyg001pq3owlhwsgv
        foreign key (product_id) references product (root_product_id)
);

create table attribute_instance
(
    attribute_id bigint       not null,
    instance_id  varchar(64)  not null,
    value        varchar(255) null,
    primary key (attribute_id, instance_id),
    constraint FKfvjm0s5r0muxeenfmg4it5eok
        foreign key (attribute_id) references attribute (root_attribute_id)
);

create table build_product
(
    product_id_r          varchar(64) not null,
    product_instance_id   varchar(64) not null,
    attribute_id          bigint      not null,
    attribute_instance_id varchar(64) not null,
    primary key (attribute_id, attribute_instance_id, product_id_r, product_instance_id),
    constraint FK24r1uuvl9y394lfbne57cdsx2
        foreign key (attribute_id, attribute_instance_id) references attribute_instance (attribute_id, instance_id),
    constraint FK42wav3vwftq9y5umkub2n1yvv
        foreign key (product_instance_id) references product_instance (root_product_instance_id),
    constraint FKntb3vsubq5iqd6pfssjpi643k
        foreign key (product_id_r) references product (root_product_id)
);

create table review_content
(
    root_review_content_id varchar(255) not null
        primary key,
    content                varchar(255) null,
    rating                 double       null,
    reply_content          varchar(255) null,
    seller_reply_content   varchar(255) null,
    seller_id              varchar(255) null,
    constraint FKl5x8l8paw5g94snjily0q2tka
        foreign key (seller_id) references seller (username)
);

create table review
(
    buyer_username      varchar(64) not null,
    payment_order_id    varchar(64) not null,
    product_instance_id varchar(64) not null,
    review_content_id   varchar(64) not null,
    primary key (buyer_username, payment_order_id, product_instance_id, review_content_id),
    constraint FK5e1qjntwidp36utfu7qcpu7me
        foreign key (buyer_username) references buyer (username),
    constraint FK9q5tvs8mr1d50xhspk82w0sc8
        foreign key (review_content_id) references review_content (root_review_content_id),
    constraint FKg0pjww1c2vmergv4mb9icthmi
        foreign key (payment_order_id) references payment_order (payment_order_id),
    constraint FKse21m6py64x4jutopsfcdc6vg
        foreign key (product_instance_id) references product_instance (root_product_instance_id)
);

create table shop_policy_admin
(
    policy_id bigint       not null,
    admin_id  varchar(255) not null,
    constraint FK5wsxd1f98jv48m283p8qogjkm
        foreign key (admin_id) references admin (username),
    constraint FKptntjbtjy1e6bwl1ido5q2st2
        foreign key (policy_id) references shop_policy (policy_id)
);

create table admin_buyer
(
    buyer_id varchar(255) not null,
    admin_id varchar(255) not null,
    constraint FKc1cvulj11extj06q4bsoiq3te
        foreign key (buyer_id) references buyer (username),
    constraint FKpvffrtl943yydjgp8rwjke3lt
        foreign key (admin_id) references admin (username)
);

create table shop_policy_seller
(
    policy_id bigint       not null,
    seller_id varchar(255) not null,
    admin_id  varchar(255) not null,
    constraint FKhadt6snstck37y14etvykhpjx
        foreign key (policy_id) references shop_policy (policy_id),
    constraint FKnbec42pvfsh5kivvt4bk3j7g6
        foreign key (seller_id) references seller (username),
    constraint FKurfkl34sm8i7bi1o1u9wmwb
        foreign key (admin_id) references admin (username)
);




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
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('69d60f96-16df-edcc-bd1d-633e78233df4', '3898.07', '59');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('ac50f09b-3d0a-ef82-7982-60d15722a30d', '3898.07', '59');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('049b697c-c62b-2351-f9cc-a6cb7b5dbe45', '3898.07', '59');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('8907bc34-08cb-f0a7-f1fe-4c0b4ad6d5bc', '3898.07', '59');
INSERT INTO product_instance (root_product_instance_id, price, quantity_in_stock) VALUES ('d6e8464a-287c-2716-6726-d56758d4c3b8', '3898.07', '59');



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



INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('1', '2024-03-20 04:44:21', 'This policy outlines the conditions under which customers can cancel their orders, including timeframes and eligibility for refunds', 'Cancellation Policy', '2024-03-20 04:44:22');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('2', '2024-05-12 03:42:11', 'These terms govern the use of the shop\'s services, including customer rights and obligations, the shop\'s responsibilities, and the legal framework for transactions.', 'Terms of Service', '2024-05-12 03:42:12');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('3', '2024-04-04 13:29:00', 'This policy defines the warranty coverage provided for products sold by the shop, including duration, exclusions, and the process for filing claims.', 'Warranty Policy', '2024-04-04 13:29:01');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('4', '2024-02-22 11:55:57', 'This policy explains the conditions under which products can be returned, including time limits, condition requirements, and eligibility for refunds or exchanges.', 'Return Policy', '2024-02-22 11:55:58');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('5', '2023-10-29 21:50:42', 'This policy outlines the accepted payment methods, billing procedures, and any payment-related terms customers need to know before making a purchase.', 'Payment Policy', '2023-10-29 21:50:43');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('6', '2024-06-04 17:28:47', 'This policy covers shipping options, delivery timeframes, costs, and any restrictions on shipping locations or methods for different types of products.', 'Shipping Policy', '2024-06-04 17:28:48');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('7', '2024-09-01 04:19:16', 'These terms apply to members of the shop\'s loyalty or membership program, outlining benefits, eligibility, and any specific conditions for membership participation.', 'Membership Terms', '2024-09-01 04:19:17');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('8', '2024-08-28 00:27:20', 'This policy details how the shop collects, uses, and protects customers\' personal information, ensuring privacy and security in compliance with applicable laws.', 'Privacy Policy', '2024-08-28 00:27:21');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('9', '2024-03-31 20:24:19', 'This policy outlines the shop\'s commitment to providing high-quality customer service, including support channels, response times, and resolution procedures for customer complaints or issues.', 'Customer Service Policy', '2024-03-31 20:24:20');
INSERT INTO shop_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('10', '2023-11-24 17:48:41', 'This policy explains the terms under which discounts are offered, including eligibility criteria, discount percentages, and any exclusions or limitations.', 'Discount Policy', '2023-11-24 17:48:42');



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


INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('b40fe935-8519-e6f2-3282-491e31acea24', '780eaa2a-957d-00bb-845f-03b977148763', '25');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('bde0dd1f-11b6-e6f9-765b-dfbdfce0c62b', '99e2b2e9-27cf-7a47-f008-bb1f58b6cac4', '34');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('605fe035-5b94-8481-0840-bcb89d9eb566', '1c109a3f-996b-7af7-6808-d3a80af58486', '86');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('8a1fe0db-a3c4-9bd2-0691-dc017d73fee6', '15c41dfd-0938-37a1-090f-05c5ce16663a', '52');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('a062765a-3295-7ac1-f4c9-a3897e31fb8c', '9834ba86-71b7-6921-8ff7-91af5573290f', '18');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('a9b4e28d-fef7-b3bc-ed69-7e981046e770', 'de5cd764-5a27-8c11-e4ea-14c4663bce08', '35');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('6bcc1f12-1bd9-21cc-a865-27becfabd8ba', 'b49608fb-2f9f-af5c-4855-57b7567be9e6', '90');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('e0129331-7ade-5503-e4d7-033c67cd1340', '29415cf8-9bbd-4e2a-0d71-0caa31152633', '11');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('3df3dc0a-54d7-597d-ee4c-b0aee8c67b79', '78c08bf7-01fa-7c2c-6cbd-0622ac246986', '38');
INSERT INTO order_product_instance (order_id, product_instance_id, quantity) VALUES ('29d5e553-c2dc-c13a-a2c5-50d313f465ef', 'ffca2b00-0df7-62d0-2b6a-6961ec643469', '17');


INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('1', '2024-06-23 13:33:12', 'This policy provides comprehensive coverage for pets, including medical expenses, accident protection, and wellness care to ensure the health and happiness of your pet.', 'Pet Insurance', '2024-06-23 13:33:15');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('2', '2024-04-03 09:55:51', 'This policy covers individuals who suffer from physical or mental disabilities, providing financial support and access to necessary healthcare services.', 'Disability Insurance', '2024-04-03 09:55:54');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('3', '2024-07-31 22:11:13', 'This policy offers protection against liabilities that may arise from accidental damage or injury caused to third parties, ensuring financial safety', 'Liability Insurance', '2024-07-31 22:11:16');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('4', '2024-05-31 11:45:43', 'This auto insurance policy provides coverage for damages caused to your vehicle due to accidents, theft, or natural disasters, ensuring financial protection and peace of mind while on the road.', 'Auto Insurance', '2024-05-31 11:45:46');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('5', '2024-08-24 09:09:40', 'This life insurance policy ensures that your loved ones are financially supported in the event of your passing, providing peace of mind and financial security.', 'Life Insurance', '2024-08-24 09:09:43');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('6', '2024-07-05 21:44:14', 'This health insurance policy covers medical expenses, providing financial assistance for treatments, hospital stays, and other healthcare needs.', 'Health Insurance', '2024-07-05 21:44:17');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('7', '2024-07-02 21:56:33', 'This policy protects homeowners from financial loss caused by damage to property, covering incidents such as fire, theft, or natural disasters.', 'Homeowners Insurance', '2024-07-02 21:56:36');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('8', '2024-04-02 21:00:19', 'This renters insurance policy offers protection for personal belongings against theft, fire, and other unforeseen circumstances, providing financial peace of mind', 'Renters Insurance', '2024-04-02 21:00:22');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('9', '2024-10-01 09:00:40', 'This travel insurance policy covers unexpected events during your travels, including trip cancellations, medical emergencies, lost luggage, and travel delays, ensuring a safe and worry-free journey.', 'Travel Insurance', '2024-10-01 09:00:43');
INSERT INTO category_policy (policy_id, apply_date, policy_description, policy_name, release_date) VALUES ('10', '2024-02-07 17:33:47', 'This long-term care insurance policy provides financial support for individuals who need assistance with daily activities due to aging, illness, or disability, covering home care or nursing home costs.', 'Long-term Care Insurance', '2024-02-07 17:33:50');


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


INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('fa67c9ad-4d98-dad3-87f0-5b00f6643eef', 'The quality is excellent! Very satisfied with my purchase.', '4', 'Thank you! We’re glad you’re happy with the product.', 'Thank you! We’re glad you’re happy with the product.', 'dmickelwright31174');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('1dce09f1-1ad4-3dcd-24e1-21351c191cae', 'The product arrived on time, but the packaging was damaged', '3', 'Sorry for the packaging issue! We’ll make sure to improve it.', 'Sorry for the packaging issue! We’ll make sure to improve it.', 'dlewsley41328');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('2b9f33ef-2b0e-50ae-1918-fb7aa47e95fb', 'Not as expected. The color is much darker than in the photos', '3', 'We’re sorry about the color discrepancy! Feel free to return or exchange it', 'We’re sorry about the color discrepancy! Feel free to return or exchange it', 'kleverett5376');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('078a783c-dfe6-8621-d598-241701becdb9', 'Fits perfectly! Very comfortable to wear, highly recommend', '4.5', 'Thanks for your review! We’re happy you love it!', 'Thanks for your review! We’re happy you love it!', 'dcalcutt38043');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('a226e2ca-fe65-0e85-4f3d-aee4499e8f48', 'The material is soft and breathable, perfect for summer', '3', 'Thank you for the kind words! We appreciate your feedback.', 'Thank you for the kind words! We appreciate your feedback.', 'nweekley1318');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('1babd96d-028e-5749-423c-7f82dc840732', 'The size was a bit off, but overall good quality.', '4', 'We’re sorry for the sizing issue. Let us know if you\'d like to exchange it', 'We’re sorry for the sizing issue. Let us know if you\'d like to exchange it', 'asnozzwell6350');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('0929ebc9-cdc7-d010-e4dc-c26da13405d9', 'Good value for the price. I would buy again', '5', 'Thank you for your support! We look forward to serving you again.', 'Thank you for your support! We look forward to serving you again.', 'rmcsporrin48179');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('f19d60dc-937f-2725-908a-13b39433f2fd', 'I had to wait longer than expected for delivery.', '3', 'Apologies for the delay! We’ll work to improve our delivery speed.', 'Apologies for the delay! We’ll work to improve our delivery speed.', 'gsaenz50369');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('79074ed7-4ecc-99ba-7283-155c7c5c99dd', 'The fabric feels cheap. I’m not happy with this product', '2', 'Sorry for the disappointment! Please contact us for a return or refund.', 'Sorry for the disappointment! Please contact us for a return or refund.', 'cfreschini36450');
INSERT INTO review_content (root_review_content_id, content, rating, reply_content, seller_reply_content, seller_id) VALUES ('e0ceb583-9df1-2e51-f96c-3f264563358f', 'Great product, exactly as described. Will buy again!', '4.5', 'Thank you! We’re thrilled you\'re satisfied. See you next time!', 'Thank you! We’re thrilled you\'re satisfied. See you next time!', 'asimioli58443');



INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('jvan daalen4926', '31e5740f-375f-0ec2-6cfc-d417008fcd19', '780eaa2a-957d-00bb-845f-03b977148763', 'fa67c9ad-4d98-dad3-87f0-5b00f6643eef');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('mselwyn39960', '8b5dc727-26cb-f3d6-5de3-ec54d5a41fcb', '99e2b2e9-27cf-7a47-f008-bb1f58b6cac4', '1dce09f1-1ad4-3dcd-24e1-21351c191cae');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('rellerbeck14523', 'cc365ff1-c37c-2042-90d9-e655c6cb4494', '1c109a3f-996b-7af7-6808-d3a80af58486', '2b9f33ef-2b0e-50ae-1918-fb7aa47e95fb');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('ppowland34378', '5015a5cc-511d-e746-97ff-0be9ffc6abe6', '15c41dfd-0938-37a1-090f-05c5ce16663a', '078a783c-dfe6-8621-d598-241701becdb9');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('blorincz32984', 'dc1245d1-cfd9-46cf-4e26-c0cd7fa7e38e', '9834ba86-71b7-6921-8ff7-91af5573290f', 'a226e2ca-fe65-0e85-4f3d-aee4499e8f48');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('rmcatamney60369', '37e34c3f-0274-6735-be85-f1ecf375f960', 'de5cd764-5a27-8c11-e4ea-14c4663bce08', '1babd96d-028e-5749-423c-7f82dc840732');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('klogsdale63588', '7a33eae5-b3e9-b04b-dacb-0e079b0c1d39', 'b49608fb-2f9f-af5c-4855-57b7567be9e6', '0929ebc9-cdc7-d010-e4dc-c26da13405d9');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('nteanby25634', '8609280d-db4c-766b-0b16-80a9cabb12b4', '29415cf8-9bbd-4e2a-0d71-0caa31152633', 'f19d60dc-937f-2725-908a-13b39433f2fd');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('dphilbrick34048', 'b31d990f-9a98-da5b-1fa4-d6c8669646a0', '78c08bf7-01fa-7c2c-6cbd-0622ac246986', '79074ed7-4ecc-99ba-7283-155c7c5c99dd');
INSERT INTO review (buyer_username, payment_order_id, product_instance_id, review_content_id) VALUES ('adarby50179', '7477da52-bff0-54ce-502e-374e38eee1c5', 'ffca2b00-0df7-62d0-2b6a-6961ec643469', 'e0ceb583-9df1-2e51-f96c-3f264563358f');


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




INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('343845589024837', 'Wells Fargo', 'Jess Van Daalen', 'jvan daalen4926');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('5583688290168521', 'Chase Bank', 'Maggie Selwyn', 'mselwyn39960');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('4598572308399896', 'Regions Bank', 'Rolph Ellerbeck', 'rellerbeck14523');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('4185316840977', 'PNC Bank', 'Preston Powland', 'ppowland34378');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('5341591821883217', 'Santander Bank', 'Bart Lorincz', 'blorincz32984');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('4948758296539', 'Santander Bank', 'Rhody McAtamney', 'rmcatamney60369');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('342753249056341', 'Bank of America', 'Ker Logsdale', 'klogsdale63588');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('612160325664449369', 'Wells Fargo', 'Natala Teanby', 'nteanby25634');
INSERT INTO payment_info (card_number, bank_name, card_holder_name, business_id) VALUES ('5240559814206771', 'US Bank', 'Debby Philbrick', 'dphilbrick34048');
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


ALTER TABLE category DROP FOREIGN KEY FK2fev52lixpq850g4otq5k6x2o;

INSERT INTO category (name, parent_category_name) VALUES ('Mobile Accessories', 'Beauty');
INSERT INTO category (name, parent_category_name) VALUES ('Automotive', 'Mobile Accessories');
INSERT INTO category (name, parent_category_name) VALUES ('Jewelry', 'Sports');
INSERT INTO category (name, parent_category_name) VALUES ('Sports', 'Clothing');
INSERT INTO category (name, parent_category_name) VALUES ('Clothing', 'Automotive');
INSERT INTO category (name, parent_category_name) VALUES ('Electronics', 'Toys');
INSERT INTO category (name, parent_category_name) VALUES ('Beauty', 'Groceries');
INSERT INTO category (name, parent_category_name) VALUES ('Furniture', 'Jewelry');
INSERT INTO category (name, parent_category_name) VALUES ('Groceries', 'Furniture');
INSERT INTO category (name, parent_category_name) VALUES ('Toys', 'Electronics');

ALTER TABLE category
    ADD CONSTRAINT FK2fev52lixpq850g4otq5k6x2o FOREIGN KEY (parent_category_name) REFERENCES category(name);



INSERT INTO category_policy_category (policy_id, category_id) VALUES ('1', 'Automotive');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('2', 'Mobile Accessories');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('3', 'Jewelry');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('4', 'Sports');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('5', 'Clothing');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('6', 'Electronics');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('7', 'Beauty');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('8', 'Furniture');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('9', 'Groceries');
INSERT INTO category_policy_category (policy_id, category_id) VALUES ('10', 'Toys');


INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('b4fb95ec-0555-3236-b96e-c8750a83adbe', 'A unique fruit with a sweet fragrance and slight tartness, perfect for jams and cooking, offering both rich flavor and nutritional benefits', 'Quince', 'Sports', 'dmickelwright31174');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('a726bd9a-f195-0d6c-30a9-6220ca580250', 'A crisp and juicy fruit with a balance of sweetness and tartness, loved for its flavor, versatility, and health benefits."', 'Apple', 'Jewelry', 'dlewsley41328');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('8907bc34-08cb-f0a7-f1fe-4c0b4ad6d5bc', 'A vibrant, tangy fruit with a refreshing taste and rich in vitamins, perfect for a nutritious snack or adding a tropical twist to dishes', 'Kiwi', 'Clothing', 'kleverett5376');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('80f36cc5-6613-6a4e-84d3-5cb4c84aedf7', 'A sweet, juicy fruit enjoyed fresh or dried, packed with antioxidants and perfect for snacking or adding flavor to recipes.', 'Grape', 'Electronics', 'dcalcutt38043');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('15c9e862-b50f-0820-bdc4-216171e88ab5', 'A juicy, sweet fruit with a delicate fragrance and soft texture, loved for its flavor and packed with vitamins', 'Peach', 'Toys', 'nweekley1318');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('678bb1e4-130e-9c40-4843-be0fc498a3f6', 'A small, dark berry known for its tartness and high antioxidant content, often used in jams, syrups, and immune-boosting remedies.', 'Elderberry', 'Beauty', 'asnozzwell6350');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('c54d6f0d-4f7e-d70d-a3c5-c1505b163497', 'A refreshing, hydrating fruit with a sweet, crisp taste, perfect for cooling off on hot days and rich in vitamins A and C.', 'Watermelon', 'Furniture', 'rmcsporrin48179');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('544d47d1-8e43-20bc-8cb3-84de33f2fd65', 'A unique citrus fruit with a rough, bumpy peel and a tangy-sweet flavor, combining the best of orange, grapefruit, and tangerine tastes.', 'Ugli fruit', 'Automotive', 'gsaenz50369');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('15aa6023-df37-a3e1-e067-5a9626c2ff24', 'A soft, sweet fruit with a rich texture and small edible seeds, known for its honey-like flavor and versatility in sweet and savory dishes.', 'Fig', 'Mobile Accessories', 'cfreschini36450');
INSERT INTO product (root_product_id, description, name, category_name, seller_id) VALUES ('69d60f96-16df-edcc-bd1d-633e78233df4', 'A smooth-skinned fruit similar to a peach, offering a juicy, sweet flavor and packed with vitamins and antioxidants.', 'Nectarine', 'Groceries', 'asimioli58443');



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
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('9', 'dimensions', '15aa6023-df37-a3e1-e067-5a9626c2ff24');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('10', 'accessories', '69d60f96-16df-edcc-bd1d-633e78233df4');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('11', 'origin', 'b4fb95ec-0555-3236-b96e-c8750a83adbe');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('12', 'composition', 'b4fb95ec-0555-3236-b96e-c8750a83adbe');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('13', 'brand', 'a726bd9a-f195-0d6c-30a9-6220ca580250');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('15', 'warranty', '8907bc34-08cb-f0a7-f1fe-4c0b4ad6d5bc');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('16', 'season', '8907bc34-08cb-f0a7-f1fe-4c0b4ad6d5bc');
INSERT INTO attribute (root_attribute_id, name, product_id) VALUES ('17', 'ingredients', '8907bc34-08cb-f0a7-f1fe-4c0b4ad6d5bc');





INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('1', 'ad9d265c-3fad-8d5f-d337-2c2c55368038', 'Smooth');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('2', 'a8cca1e3-4e50-7d71-087c-4de1e1574916', '250 ml');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('3', '97fc90a5-c1de-b559-7cd4-b2628e1831b4', 'Cotton');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('4', '06fe4492-1a03-92c8-bb59-88943224d4a3', 'Casual');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('5', '4d5e9051-1a14-12fc-42f5-3b4223611d51', '500 ml');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('6', '6985c448-b40e-53ae-3294-e8f39d70b5e7', 'Plastic');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('7', 'e4692363-43a3-e5c8-be4f-499f159504eb', 'Spring');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('8', 'df3cdd53-9b44-3aa3-e8d6-50444d360681', '4.5 stars');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('9', '02439c0f-b11d-a136-4ff8-76aa2e1e6d05', '10 x 15 x 20 cm');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('10', 'bb0b7541-1985-9b07-65d3-7a662abbbb1c', 'Charger');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('1', '7bfeebc3-31fb-5b1d-e17c-c2dd782782d3', 'Rough');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('1', 'eb981dc4-081d-bc6f-500e-01b6b91d5b8c', 'Soft');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('11', 'e46edfd5-6611-3973-ad89-463ab2118399', 'Italy');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('11', 'c67a1131-d166-70a9-e11b-6142ec30f989', 'Japan');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('12', 'c98d41d1-970b-ce21-98ae-f4a10a210c34', '100% Cotton');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('2', '010b5124-83ee-8b33-aafc-9a13d9d143ae', '500 ml');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('13', '5bb34de0-9f2f-b1a9-8640-ea7289b56a6a', 'Apple');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('13', '3c7f10d5-4a77-b23e-15b9-c7feee7d9589', 'Samsung');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('13', 'a7a9d692-d1d8-6fda-0051-ef499750dbce', 'Oppo');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('3', '7d6591c7-c2ad-3a19-c175-03aea590b8d9', 'Stainless Steel');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('15', '42418847-28ac-e415-3774-a95a43619cb4', '1 year');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('15', '01274d4b-4e42-5f6f-9c57-ddb5036bfc85', '2 years');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('16', 'b06a281f-5129-caf5-0ffa-5ff6aae7a6a9', 'Summer');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('16', '9aec0abc-2e05-b27f-fd28-db263ebafddb', 'Winter');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('17', 'f526d354-bb34-d7b4-053a-ca8a2a516716', 'Water');
INSERT INTO attribute_instance (attribute_id, instance_id, value) VALUES ('17', 'e34bc25e-e2bd-0efe-c92e-7e79c91d7464', 'Oil');





INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id ) VALUES ('b4fb95ec-0555-3236-b96e-c8750a83adbe', '780eaa2a-957d-00bb-845f-03b977148763', '1', 'ad9d265c-3fad-8d5f-d337-2c2c55368038');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id ) VALUES ('b4fb95ec-0555-3236-b96e-c8750a83adbe', '69d60f96-16df-edcc-bd1d-633e78233df4', '1', '7bfeebc3-31fb-5b1d-e17c-c2dd782782d3');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id ) VALUES ('b4fb95ec-0555-3236-b96e-c8750a83adbe', 'ac50f09b-3d0a-ef82-7982-60d15722a30d', '1', 'eb981dc4-081d-bc6f-500e-01b6b91d5b8c');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id ) VALUES ('b4fb95ec-0555-3236-b96e-c8750a83adbe', '049b697c-c62b-2351-f9cc-a6cb7b5dbe45', '11', 'e46edfd5-6611-3973-ad89-463ab2118399');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id ) VALUES ('b4fb95ec-0555-3236-b96e-c8750a83adbe', '8907bc34-08cb-f0a7-f1fe-4c0b4ad6d5bc', '11', 'c67a1131-d166-70a9-e11b-6142ec30f989');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id ) VALUES ('b4fb95ec-0555-3236-b96e-c8750a83adbe', 'd6e8464a-287c-2716-6726-d56758d4c3b8', '12', 'c98d41d1-970b-ce21-98ae-f4a10a210c34');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('a726bd9a-f195-0d6c-30a9-6220ca580250', '99e2b2e9-27cf-7a47-f008-bb1f58b6cac4', '2', 'a8cca1e3-4e50-7d71-087c-4de1e1574916');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('8907bc34-08cb-f0a7-f1fe-4c0b4ad6d5bc', '1c109a3f-996b-7af7-6808-d3a80af58486', '3', '97fc90a5-c1de-b559-7cd4-b2628e1831b4');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('80f36cc5-6613-6a4e-84d3-5cb4c84aedf7', '15c41dfd-0938-37a1-090f-05c5ce16663a', '4', '06fe4492-1a03-92c8-bb59-88943224d4a3');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('15c9e862-b50f-0820-bdc4-216171e88ab5', '9834ba86-71b7-6921-8ff7-91af5573290f', '5', '4d5e9051-1a14-12fc-42f5-3b4223611d51');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('678bb1e4-130e-9c40-4843-be0fc498a3f6', 'de5cd764-5a27-8c11-e4ea-14c4663bce08', '6', '6985c448-b40e-53ae-3294-e8f39d70b5e7');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('c54d6f0d-4f7e-d70d-a3c5-c1505b163497', 'b49608fb-2f9f-af5c-4855-57b7567be9e6', '7', 'e4692363-43a3-e5c8-be4f-499f159504eb');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('544d47d1-8e43-20bc-8cb3-84de33f2fd65', '29415cf8-9bbd-4e2a-0d71-0caa31152633', '8', 'df3cdd53-9b44-3aa3-e8d6-50444d360681');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('15aa6023-df37-a3e1-e067-5a9626c2ff24', '78c08bf7-01fa-7c2c-6cbd-0622ac246986', '9', '02439c0f-b11d-a136-4ff8-76aa2e1e6d05');
INSERT INTO build_product (product_id_r, product_instance_id, attribute_id, attribute_instance_id) VALUES ('69d60f96-16df-edcc-bd1d-633e78233df4', 'ffca2b00-0df7-62d0-2b6a-6961ec643469', '10', 'bb0b7541-1985-9b07-65d3-7a662abbbb1c');