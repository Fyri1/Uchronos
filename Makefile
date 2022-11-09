install: 
	make -C server setup
	make -C client install

start-frontend:
	make -C ./client start

start-backend:
	make -C ./server start

