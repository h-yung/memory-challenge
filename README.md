# Memory Sequencing Test
A test of one's ability to recreate random sequences of six, made more beautiful with the PokeAPI. Players are given a random sequence of six Pokemon and must click on a grid of 4 x 4 (drawn afresh from 898 possible options each game) to recreate the same order of Pokemon. 

**Demo:** https://h-yung.github.io/pokemon-memory-game/

![sequencing challenge demo](https://i.postimg.cc/pX3CyFQ3/game-pokememory-tablet-2.png)

## How it's made:
**Tech used:** HTML, CSS, JavaScript.

Each new game initiates a call to the PokeAPI to populate both the 16-slot grid board and the random sequence of 6 from the board subset, with listeners for user clicks. Each click also initiates a check to validate the current user choices against the given sequence. Local storage is used to preserve number of wins so that players can continue at their last level in a previous browser session. Specific sequences are not cached. 

Gameplay is an unusually forgiving scenario of two-factor authentication gone wrong, in which the correct string of randomly generated characters fails to reach the user on their second device.

Difficulty increases with levels, moving from the intentional concealment of the reference sequence to timing out such that players must commit the sequence to memory.

## Special features
Hints and a "cheat mode" are built into this otherwise simple but frustrating game.
First-time visitors enjoy a short intro with a talkative Gengar. 

## Optimizations
* 70% rewritten based on OOP principles, especially encapsulation.
* Cleaned up nested .fetch(), resulting in improved performance (by nearly 60s!) but continued to prioritize readability over absolute DRY-ness of the code.
Future refactoring to cover:
* Isolated questions around closure/best practices in the current code base.
* Next-level difficulty could include a countdown clock and timed interval for attempts (limited tries seems unrealistic). Successful recreation of the sequence could also be more rewarding and made shareable.

## Lessons learned
* An alternate approach cached the groups of 16 and 6 in local storage (using stringify and parse to retrieve). This was overkill here but potentially useful for other apps so as to streamline a user's progression (the opposite direction of this project). I may use the local storage caching approach to simplify the user experience for an information-gathering app (temporary storage to aid form prepopulation with data that does not need to be secured, preferences, etc., while still allowing for edits).

* Solving styling problems with CSS alone as much as possible is worth it for the perfomance speed and separation of concerns. One of the most satisfying parts of this project was dynamically generating elements with lightweight animations, while enabling uniform behavior in response to user clicks through pre-tagged slots and CSS selectors.

* Using an array of objects to handle complications with the asynchronous nature of .fetch() (nested API calls) is a simple solution to a problem requiring ordered collections and associated key-value pairs.    
