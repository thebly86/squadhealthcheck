FROM ubuntu:18.04

RUN apt-get update

# Setup MySQL:
RUN mkdir /dockerSetUpTemp &&\
    echo "root" > /dockerSetUpTemp/mysqlSetup &&\
    echo "root" >> /dockerSetUpTemp/mysqlSetup &&\
    apt-get install -y mysql-server=5.7* < /dockerSetUpTemp/mysqlSetup &&\
    /etc/init.d/mysql start &&\
    mysql --user=root --password=$MYSQL_ROOT_PASSWORD --execute="GRANT ALL PRIVILEGES ON *.* TO 'testUser'@'%' IDENTIFIED BY 's3curePa55word'" && \
    mysql --user=root --password=$MYSQL_ROOT_PASSWORD --execute="SET GLOBAL connect_timeout = 10;" && \
    /etc/init.d/mysql stop

RUN chown -R mysql:mysql /var/lib/mysql /var/run/mysqld 

ADD my.cnf /etc/mysql/my.cnf

CMD chown -R mysql:mysql /var/lib/mysql /var/run/mysqld  && \
/etc/init.d/mysql start & bash