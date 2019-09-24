# Barbecrowd backend

Barbecrowd application can be found [here](https://gitlab.lrz.de/ga62moj/seba).
## Prerequisites

Both for the back end and front end application check

* nodejs [official website](https://nodejs.org/en/) - nodejs includes [npm](https://www.npmjs.com/) (node package manager)

Just for the backend application:

* mongodb [official installation guide](https://docs.mongodb.org/manual/administration/install-community/)

## Setup (before first run)

Go to the backend folder:
```
cd seba/app/backend/
```

**Install node dependencies**

```
npm install
```

**Set up your database**

* Create a new directory where your database will be stored (it's a good idea to separate data and business logic - the data directory should be on a different place than your app)
* Start the database server
```
mongod --dbpath relative/path/to/databases
```

You can use `./reset-db-and-start-db.sh` to create a directory in `../db/` and start mongo. Do not forget the set the environment variables below.

**Set the environment variables**

This variables are based in your local configuration
```bash
export PORT=3000
export MONGODB_URI="mongodb://localhost:27017/bbcdb"
export JWT_SECRET="very secret secret"
```

## Start the project

```bash
npm start
```