#! /bin/bash
./node_modules/protractor/bin/webdriver-manager update --standalone
./node_modules/protractor/bin/webdriver-manager start &
node scripts/web-server.js &
open http://localhost:8000/demo/index.html