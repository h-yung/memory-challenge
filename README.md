# pokemon-memory-game
Memory game that works a bit like two-factor authentication and uses the PokeAPI. Built with HTML, CSS, and vanilla JS. Feedback and sugestions are welcome.

## Summary
Players are given a sequence of six random Pokemon and must click on a grid of 4 x 4 Pokeballs to recreate the same order of Pokemon. Levels of difficulty increase as they go. Local storage is used to preserve number of wins so that players can continue at their last level in a previous browser session.

## [Demo](https://h-yung.github.io/pokemon-memory-game/)

## Why compared to two-factor authentication?
Resemblance is in a very primitive sense: 
1. A random array of predetermined length, containing only strings, is generated.
2. The user must input the values of each element in the same order as provided.
3. The user input is validated against the random array and must match in order to advance past the current screen or stage. 
In two-factor authentication, of course, you would receive the correct string on your other device and simply input. Here, the effort comes from the intentional concealment of the right strings, and eventually (as difficulty increases), the need to memorize the right order the player must match.

## Special features
Hints and a "cheat mode" are built into this otherwise simple but frustrating game.
A user's first visit results in a short intro with a talkative Gengar. :)

## Done 
Since ref-2:
* Refactored to build as an object
* Cleaning up nested calls in asynchronous function (fetch()): Readability > conciseness for now

## Upcoming (to resolve or do)
Technical questions: 
* [ref-2] Why wrapping object methods inside anon function for event listeners works, while merely providing object.method as a callback does not. Note that many methods internally call other object methods (this) - suspect an issue of closure.
* shuffle function: unsure why declaring the randomizing index inside the loop throws an initialization error, compared to that construction in the makeLists function
To do: Refactor to build as a class
