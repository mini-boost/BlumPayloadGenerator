#!/bin/bash
echo "Check updates from github."
git pull
echo "Check updates from node modules."
npm i
echo "Start server."
npm start