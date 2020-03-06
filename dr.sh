docker rm $(docker ps -aq)

docker rmi $(docker images -aq)

