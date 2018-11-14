#!/bin/bash

cd /srv/git/squadhealthcheck

npm install

npm run build

cp -r /srv/git/squadhealthcheck/dist/* /var/www/html

find /var/www/html -type f -exec chown apache:apache {} \;
find /var/www/html -type d -exec chown apache:apache {} \;

find /var/www/html -type f -exec chmod 750 {} \;
find /var/www/html -type d -exec chmod 750 {} \;
chcon -R -t httpd_sys_content_t /var/www/html/