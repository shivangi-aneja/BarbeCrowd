#!/bin/bash

rm ../db/ -rf
mkdir ../db
mongod --dbpath ../db/
