# Project description
This project is about realising the technical exercise giving by the company Lempire.

## Announcement reminders

Using Meteor JS with Blaze as front-end framework, realise a list of export who answer to the following rules
- The page should display an export button who permit to start in an asynchronous way a new export
- The page should display the export list and their progress
- When the export is done, the list should display an url as the result.
- An export is defined as the following way :
  - An export is done when is getting 100%
  - He progresses at 5% per second
  - When he is done he select a random url in the following possibilities :
    - https://www.lempire.com/
    - https://www.lemlist.com/
    - https://www.lemverse.com/
    - https://www.lemstash.com/
You are free to implant the whole fonctionality in the way that seems most relevent to you.
The goal of the exercise is to show that you fully understand the greats basic principles of Meteor.
So, think about removing the insecure and autopublish packages. 
## Install project
To install node dependency
```
meteor npm i
```

## Start project
To start the application in development mode you need to do the following command
```
npm run start
```

## Launch test
To launch unit test of the application you need to do the following command
```
npm run test
```

## Deploy on your
Meteor cloud
```
meteor deploy nathanael-lempire-exercise.meteorapp.com --free --mongo
```

## Github Actions
I put test on github actions
```
git tag deploy/1.0.x
git push -u origin deploy/1.0.x
```
> replace x by the version you want to set

# Author
ELSIABETH Nathanaël
2023-01-27
