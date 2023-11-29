# Arcade Surf

## Overview

What is your app? Brief description in a couple of sentences.
- A web application where users connect to a session with other players and play minigames together in real time.

### Problem

Why is your app needed? Background information around any pain points or other reasons.
- To help groups of friends that want to play something together.

### User Profile

Who will use your app? How will they use it? Any special considerations that your app must take into account.
- Groups of friends or people that want to play multiplayer games.

### Features

List the functionality that your app will include. These can be written as user stories or descriptions with related details. Do not describe _how_ these features are implemented, only _what_ needs to be implemented.
- Users can log in to play and update their score. After starting the app, they can join a lobby with other players. Here they can pick a minigame and play it with others.

## Implementation

### Tech Stack

List technologies that will be used in your app, including any libraries to save time or provide more functionality. Be sure to research any potential limitations.
- Sockets, JWT, React, Phaser, Node, Express

### APIs

List any external sources of data that will be used in your app.
- None

### Sitemap

List the pages of your app with brief descriptions. You can show this visually, or write it out.
- Homepage - where users can view games and create or join lobbies
- Login page - users can log in here
- Signup page - users can sign up for an account here
- All Lobbies page - lists lobbies that the user can join
- Lobby page - page that users are taken to when they join a lobby, where they can play games

### Mockups

Provide visuals of your app's screens. You can use tools like Figma or pictures of hand-drawn sketches.

### Data

Describe your data and the relationships between them. You can show this visually using diagrams, or write it out. 
- Users
- Lobbies
- Users to Lobbies (many to many)

### Endpoints

List endpoints that your server will implement, including HTTP methods, parameters, and example responses.
- Authentication - login, signup, verify identity
- Socket Server - handles users connecting and disconnecting, joining and leaving rooms, winning games and communicating the score to other players

### Auth

Does your project include any login or user profile functionality? If so, describe how authentication/authorization will be implemented.
- Yes, it is implemented using JWT

## Roadmap

Scope your project as a sprint. Break down the tasks that will need to be completed and map out timeframes for implementation. Think about what you can reasonably complete before the due date. The more detail you provide, the easier it will be to build.

## Nice-to-haves

Your project will be marked based on what you committed to in the above document. Under nice-to-haves, you can list any additional features you may complete if you have extra time, or after finishing.
- 3D rendering
- Gyroscope integration
- many more games
- different match types
- Battle Royale mode
- "Mario Party"-esque style board game mode