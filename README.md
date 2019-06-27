# RCHK Auction

## Database protection

Nginx config in docker

    server {

        listen       80;

        root    /rchk_auction/frontend/dist;

        location / {

            index   index.html;

        }

        location /database/ {
            proxy_pass      http://rethinkdb:8080/;
            proxy_set_header Host $host;
            auth_basic "Restricted";
            auth_basic_user_file /etc/nginx/conf.d/.htpasswd;
            proxy_redirect off;
            proxy_set_header Authorization "";
        }

    }

The .htpasswd is the file we need. It stores a username and an encrypted password.

We need it to do http auth.

[How to generate .htpasswd](https://www.digitalocean.com/community/tutorials/how-to-set-up-http-authentication-with-nginx-on-ubuntu-12-10)

This file is under /nginx (file will copy to prod. when build)

We mounted it inside docker-compose.yml

As a result, client can only connect the database admin panel through https://auction.rchk.edu.hk/database together with pwd.

# Getting Started

## Prequisites

This product is developed using the following modules and frameworks:

* Frontend
    * Vuejs 2.6.6 (or above)
    * Vuex
    * Vuetify
    * [VueSocketIO](https://github.com/MetinSeylan/Vue-Socket.io)
* Backend
    * nodejs
    * express
    * Socket.IO
* Database
    * rethinkdb
* Others
    * Docker
    * nginx

## Installation

Pull the project from github

    # install require modules in all files
    cd fronend
    npm install

    cd backend
    npm install

    # copy nginx conf file to production nginx folder
    cp ./rchk-auction.conf /etc/nginx/conf.d/rchk-auction.conf

    # build docker
    sh rebuild.sh

    # restart nginx
    sudo nginx -s reload

This project is using :

* front end : 7000
* back end : 7082

## Maintenance

### Database

To use admin UI of database,

use https://auction.rchk.edu.hk/database

You have to login before accessing the page.

### Accessing files

Most of the files are mounted

If you want to get into docker container

    docker exec -it <CONTAINER ID> /bin/bash

## Authors

This project is developed by [Kit Lung](https://github.com/kitlung) in 2019.