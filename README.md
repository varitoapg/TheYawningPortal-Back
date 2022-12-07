# The Yawning Portal

> Meet the mightiest warriors in this tavern! Or maybe start you journey creating your own D&D character!

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup](#setup)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)
- [Contact](#contact)

## General Information

Here it is the end of my trip in ISDI Coders web development bootcamp with my final project.
With The Yawning Portal you can create in an easy way your own characters to play Dungeons and Dragons. It is a copy of a simplified D&D spreadsheet to keep your characters.
If you are a DM it's useful too to save all your NPC of your games.

This projects works with an API Rest, if you are interested, here you have the link for it: https://github.com/isdi-coders-2022/Alvaro-Parada_Back-Final-Project-202209-BCN

## Technologies Used

### BACKEND

- Node
- Express
- Typescript
- Bcrypt
- Express-validation
- Fishery
- JSONwebtoken
- Mongoose

## Features

- ✅[Sonar Backend](https://sonarcloud.io/project/overview?id=isdi-coders-2022_Alvaro-Parada_Back-Final-Project-202209-BCN)

## Setup

If you are interested in this project, all you need to do is clone this repository and install the dependencies
in _package.json_. Use the code below to do it.

```
git clone https://github.com/isdi-coders-2022/Alvaro-Parada_Back-Final-Project-202209-BCN
cd Alvaro-Parada_Front-Final-Project-202209-BCN
npm install

```

After it finish, you need to run these code:

```
npm run build:dev
npm run start:dev
```

## Endpoints

### Not protected endpoints

#### [POST]/users/register

- Response 201 if user created correctly, hashing its password
- Response 409 it user or email is already in use

#### [POST] /users/login

- Response 200 if hashed password matches with the one in the database
- Response 401 if not match

### Protected endpoints

#### [GET]/characters

- Response 200 and an array of characters and the information about total characters if exists next and previous page

#### [GET]/characters/:idCharacter

- Response 200 and the character information searched

#### [POST]/characters/create/:idCharacter

- Response 201 when a new character is created, also updates user information

#### [DELETE]/characters/delete

- Response 200 if character is deleted. Updates user information

#### [PATCH]/characters/edit/:idCharacter

- Response 201 when a new character is updated

## Project Status

Project is: _in progress_

## Room For Improvement

Room for improvement:

- Make stronger middleware to handle images
- Return the backup url of image if user doesn't have it

## Acknowledgements

- Many thanks to everyone who kept fighting these months in the bootcamp, specially those who stayed close the last weeks
- An special thanks to all professorate of ISDI Coders
- The last but not least thanks to my family who supported me in the distance. And thanks to my girlfriend who never stops believing in me

## Contact

Created by [Álvaro Parada García](https://www.linkedin.com/in/alvaro-parada/) - feel free to contact me!
