Ad Connect
==========
Welcome to the Ad Connect repo.
- [See the wiki](https://github.com/SD-adconnect/Ad-Connect/wiki) for help with things, or to help others by posting content there.
- [See the issues](https://github.com/SD-adconnect/Ad-Connect/issues) for what needs to be done or discuss solutions

What it does
-------------
- Creates a sqlite database with some simple tables, or if it is on heroku synchs the production database (postgresql)
- Generates routes using Express and Sequelize to allow data manipulation (basic CRUD for each model)
- **since the sqlite db is included in the git repo at the moment, cloning this gives you the db**
    - (this is a terrible idea) 
- Serves everything under `/public` directly as static files
- Public contains a sample router based Polymer app, minimally interacting with the database and showing some cool features of <app-router>

To see it Action
-----------------
Eventually it will be up on Heroku, but for now:

- download [PostMan](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en)
- install git
    - [using github](https://windows.github.com/) we will probably migrate to github later anyway so the ui that comes here is useful
    **OR**
    - [using bitbucket](https://confluence.atlassian.com/display/BITBUCKET/Bitbucket+101;jsessionid=33ACDACFF155DF63C5E80CD3A7540983.node3) since their client SourceTree works anywhere and they have nice tutorials.
- install [node](http://nodejs.org/download/) make sure to say yes to modifying your path if it asks
- boot up git bash (should come with the github kit)
- clone this repo
- run `npm install`
- run `npm run start`
- navigate your browser to `localhost:3000` to see the polymer stuffs
- navigate to `localhost:3000/api` using your REST client of choice (see postman above), to play with what little api there is so far

Api
---
- [Current Docs](https://github.com/SD-adconnect/Ad-Connect/wiki/API-Documentation-v1)

SOON tm
-------
- heroku server
- tests
- better install guide, maybe an install script for windows
