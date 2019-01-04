docker build -t squad-database .
#-v $(pwd)/mysql:/var/lib/mysql
docker run -it -p3306:3306 squad-database