// Refactoring 3: OOP, further reducing publicly accessible methods from the object. Classes after
// review alt: SELECTOR_HERE.addEventListener('click', object.method.bind(object)). Otherwise the original "this" scope is lost by the time the event is fired
// Would also apply to other contexts where the object method is passed as a callback (not just specifically for an event listener)?
//use of anon function "wrapper" for the event listener callback: creates a closure which manages to retain the "this" reference


const url = 'https://pokeapi.co/api/v2/pokemon/'
let commentary = ["Welcome! There are more than 898 Pokemon - and that's a lot.", "We caught 16 Pokemon this week, and now we're preparing our team lineup of six.", "So, how well do you remember your Pokemon? Let's find out!"]


function MemoryGame(baseUrl, commentary){
    let url = baseUrl; //local-private variable
    let rando16Names = []; //keeps names and such hidden, cannot be called out
    let rando16 = [];
    let goal6 = [];
    let goal6Names = [];

    // gameplay
    this.wip6Names = []; //lets you check user action
    this.wins = 0; //starts at zero until updated
    this.moves = 0; //not saved between sessions, never updated until gameplay
    this.isFirstGame = true; //starts here unless localstorage says otherwise

    // customizable contents upon creation
    let initialChat = commentary; //an array to cycle through, length of 3 ideally.

    // constants specific to object instance of poke memory game
    const welcome = document.querySelector('#welcome')
    const chatWhileLoad = document.querySelector('#welcome').querySelector('p')
    const mc = document.querySelector('#mc')
    const nav = document.querySelector('nav')
    const instructions = document.querySelector('#instructions')
    const credits = document.querySelector('#credits')
    const gameplay = document.querySelector('#gameplay')
    const choose = document.querySelector('#choose')
    const sequence = document.querySelector('#sequence')
    const board = document.querySelector('.board')
    const hintBox = document.querySelector('#hintBox')
        // below: to show/hide
    this.showInstruct = document.querySelector('#showInstruct')
    this.newGame = document.querySelector('#newGame')
    this.showCreds = document.querySelector('#showCreds')

    const show = function(showThis){
        // should I prioritize reducing parameters at expense of more lines of code bc of specificity?
        showThis.classList.remove('noShow')
    } 
    const noShow = function(hideThis){
        // split out from toggleVisible for clarity
        // note that this is not the same as hide (and ".hide" changes opacity where ".noShow" changes display value)
        hideThis.classList.add('noShow')
    }

    this.showInstructions = function(){
        // specificity adds lines...

        show(instructions)
        noShow(credits)
        noShow(gameplay)
        noShow(welcome)
    }

    this.showCredits = function(){
        // specificity adds lines...
        show(credits)
        noShow(instructions)
        noShow(gameplay)
        noShow(welcome)
    }

    this.checkIfFirst = function(){
        if (localStorage.getItem('isFirstGame')){
            this.isFirstGame = localStorage.getItem('isFirstGame'); 
        }
        return this.isFirstGame
    }

    this.giveIntro = function(){
        // hardcoded without parameters because it's a onetime with specific pieces shown
        if (this.isFirstGame === true){
            noShow(nav)
            setTimeout(() => {
                noShow(welcome.querySelector('section').querySelector('span'))
                noShow(welcome.querySelector('section').querySelector('h1'))
                noShow(welcome.querySelector('img'))
                show(chatWhileLoad)
                show(mc)  //otherwise caught in the img selector above
        
                for (let i=0; i < initialChat.length; i++){
                    setTimeout(() => {
                        // rotate through commentary assigned to initialChat
                        chatWhileLoad.textContent = initialChat[i]
                    }, 3000*i);
                }
            }, 2500);
        
            setTimeout(() => {
                show(nav);
                noShow(chatWhileLoad);
                noShow(mc);
            }, 11000);
        }
    }

    this.showStartScreen = function(){
        // basically a bunch of callbacks
        show(welcome)
        noShow(credits)
        noShow(gameplay)
        noShow(instructions)
    }

    this.setRecords = function(){
        if (this.isFirstGame){
            // only run if this.isFirstGame is true
            localStorage.setItem('levelsWon', this.wins); 
        } else {
            this.wins = +localStorage.getItem('levelsWon') 
            // then await user input from nav
        }
        this.isFirstGame = false;
        localStorage.setItem('isFirstGame', this.isFirstGame); 
    }

    const makeLists = function(){
        // hardcoding to end the parameters soup
        const baseUrl = url; //references external variable "url"
        fetch(`${baseUrl}?limit=898`) //adding the limit query parameter helped line up the requests that were getting routed to randos before
            .then(res => res.json()) // parse response as JSON
            .then(data => {
                for (let i=0; i < 16; i++){
                    let random = Math.floor(Math.random()*898) 
                    let name = data.results[random].name;
                    rando16Names.push(name)
                    if (rando16Names.length === 16){
                        // only when arrNames has 16 names should you trigger the following loop
                        for (const name of rando16Names){
                            fetch(baseUrl+name)
                            .then(res => res.json()) // parse response as JSON
                            .then(indivData => {
                                let img = indivData.sprites['front_default']
                                let newObj = {name, img} 
                                rando16.push(newObj)
                                if (rando16.length === 16){
                                    // trigger only when there are 16 objects in arr
                                    dump(rando16,`.choice:empty`, true)
                                    getGoal6() //populates goal6 array
                                    dump(goal6,`#sequence`, false, this.wins)// show sequence onscreen
                                    // unhide gameplay elements, how that they are populated
                                    show(choose.querySelector('h2'))
                                    show(sequence)
                                    show(board)
                                    console.log('here is how far we got')
                                    increaseDifficulty() //will annul some of the above
                                    console.log('increase difficulty should have run')
                                }
                            })
                            .catch(err => {
                                console.log(`error ${err}`)
                            });
                        }
                    }
                }
                
            })
            .catch(err => {
                console.log(`error ${err}`)
            });
    }

    const shuffle = function(arr){
        let random; //not sure why declaring it inside the loop has an initialization error. compare use of random in makeList
        for (i= arr.length-1; i>=0; i--){
            random = Math.floor(Math.random()*arr.length)
            [arr[i], arr[random]] = [arr[random], arr[i]]
        }
        return arr
    }

    const dump = function(arr, parentElementSelector, hide){
        for (const entry of arr){
            const subset = document.createElement('img')
            subset.src = entry.img; //this should be in array as a string by time of assignment but somehow still populates slower than nameArray (offset by 1).
            subset.alt = entry.name; //this will be used later for game logic
            // querySelector (not querySelectorAll !) should after getting the first match without further specification of "first of node list of .choice:empty elements"...
            // hide is a boolean - helps keep this bloc reusable for goal6 after dumping 16
            if (hide){
                subset.classList.add('hide');
            }
            document.querySelector(parentElementSelector).appendChild(subset) 
        }
    }

    const increaseDifficulty = function(){
        this.wins = +localStorage.getItem('levelsWon')
        if(this.wins > 2){
            const children = Array.from(sequence.children) 
            children.forEach(child => child.classList.add('silhouette')) 
            setTimeout(() => {
                noShow(sequence);
            }, 4000)
    
        }else if (this.wins > 1){
            // level 2 penalty
            setTimeout(() => {
                noShow(sequence);
            }, 4000)
        }else if (this.wins > 0){
            // level 1 penalty
            const children = Array.from(sequence.children) 
            children.forEach(child => child.classList.add('silhouette')) 
        }
    }

    const getGoal6 = function(){
        shuffle(rando16) // you don't want them lined up compared to the board order
        for (i=0; i < 6; i++){
            let random = Math.floor(Math.random()*rando16.length)
            goal6.push(rando16[random])
            goal6Names.push(rando16[random].name) //making an array of the names for easier comp later
            // There cannot be than one of a certain Pokemon 
            rando16.splice(random, 1)
        }
    }

    this.startGame = function(){
        this.resetAll();
        makeLists();
        // unhide gameplay
        show(gameplay)
        noShow(instructions)
        noShow(credits)
        noShow(welcome)
    }

    const hidePoke = function(){
        // a specific name for a game-instance-specific need
        document.querySelectorAll(`.choice`).forEach(element=> element.firstElementChild?.classList.add('hide'));
        document.querySelectorAll(`.choice`).forEach(element => element.classList.remove('ballHide'));
    }

    this.resetBoard = function(){
        //mid-game reset, for sequence error
        this.wip6Names.length = 0;
        hidePoke();
    }
    this.resetAll = function(){
        this.resetBoard();
        rando16.length = 0;
        rando16Names.length = 0;
        //shuffled the above at dump16 but since that is chained to new call (get16), redundancy built in
        goal6.length = 0;
        goal6Names.length = 0;
        this.moves = 0;

        // fix headings
        choose.querySelector('h2').textContent = "Choose your pokemon"

        // delete all children img of the .choice sections and the #sequence section
        sequence.replaceChildren()
        document.querySelectorAll('.choice').forEach(element => element.replaceChildren())

        // hide empty nonactionable elements
        noShow(choose.querySelector('h2'))
        noShow(sequence)
        noShow(board) //don't let it be visible or accessible until things populated
    }

    this.revealPoke = function(event, idOfChoice){
        // another v specific name for instance-specific gameplay
        // to further take apart to remove parameters
        this.moves += 1;
  
        //hint, cheatmode - potentially break out
        if (this.moves > 20 && this.wins > 2){
            let exit = prompt('You are now on cheat mode! Type anything to return to the game.', '')
            if (exit !==""){
                this.moves = 0;
            }
            //give a glimpse of where all the pokemon are
            document.querySelectorAll(`.choice`).forEach(element=> element.firstElementChild.classList.remove('hide'));
            document.querySelectorAll(`.choice`).forEach(element => element.classList.add('ballHide'));
        
            setTimeout(() => {
                this.hidePoke()
            }, 1); 
    
        }else if (this.moves > 10 && localStorage.getItem('levelsWon') > 2){
            // check visual for the following

            hintBox.classList.remove('hide')
            hintBox.textContent = `Hint: The Pokemon you're looking for are: ${goal16.names.join(', ')}`
            setTimeout(() => {
                hintBox.classList.add('hide')
                hintBox.textContent = ``
            }, 1000); //hint disappears after 1 second
            this.moves = 15; //speed up to cheatmode
        } 
    
        // classList is not actual array, so can't use .includes()
        if (event.currentTarget.id === idOfChoice){
            document.querySelector(`#${idOfChoice}`).classList.add('ballHide');
            //typeof output is actually an object - DOM Token list and not array
            document.querySelector(`#${idOfChoice}`).firstElementChild.classList.remove('hide');
            // click.target.children.classList.remove('hide'); //can't use this else lasts only for duration of click
            // there should only be 1 img child anyway
        }
    }

    this.recreateGoal = function(event){
        // don't push to wip6Names if it's already clicked and Poke img is viewable. 
        // However, .hide is probably simultaneously removed, so
        // prevent double count by value of img alt instead.
    
        if (!this.wip6Names.includes(event.target.alt)){
            this.wip6Names.push(event.target.alt) 
        } //else keep running
    }

    this.checkVsGoal = function(){
        for (let i=0; i < this.wip6Names.length; i++){
            if (this.wip6Names[i] != goal6Names[i]){
              choose.querySelector('h2').textContent = "Sorry, try again!"
              
              setTimeout(() => {
                choose.querySelector('h2').textContent = "Choose your pokemon"
                  // reset WIP but keep sequence
                  this.resetBoard();
              }, 1000);
              }  
          }
      
          if (this.wip6Names.length === goal6Names.length && goal6Names.every((entry, index) => entry === this.wip6Names[index])){
              this.wins = +this.wins + 1;
              localStorage.setItem('levelsWon', this.wins)
              this.wins = +localStorage.getItem('levelsWon')
              const congrats = document.createElement('h1')
              congrats.textContent="Well done! You caught them all!"
              sequence.replaceChildren(congrats) //wonder if this replicates congrats 6x or just provides 1 bc 1 arg
              
              if (this.wins > 3){
                  choose.querySelector('h2').textContent = "Thanks for playing! You have beaten all current levels."
              }else {
                  choose.querySelector('h2').textContent = "Take it to the next Level with a new lineup..."
              }
             
       
          }
    }

}



/**calls */
//keeping baseURL and commentary outside for easier change of obj application

const pokeGame = new MemoryGame(url, commentary);
pokeGame.showStartScreen();

pokeGame.checkIfFirst(); //has to precede giveIntro and setRecords, in that order
pokeGame.giveIntro(); //has to precede set records, which immediately sets .isFirstGame to false


pokeGame.setRecords();


pokeGame.newGame.addEventListener('click', function(){pokeGame.startGame()}) 

// pokeGame.showInstruct.addEventListener('click', pokeGame.showInstructions)
pokeGame.showInstruct.addEventListener('click', function(){pokeGame.showInstructions()})

pokeGame.showCreds.addEventListener('click', function(){pokeGame.showCredits()})

    
// feedback and processing for user choice
// visual effects
document.querySelectorAll('.choice').forEach(element => element.addEventListener('click', function(event){
    // get id of section, pass as second argument of revealPoke. currentTarget gets the parent element, which is the section holding the img
    // To pass an argument to revealPoke, house inside anon function and call with the arguments
    pokeGame.revealPoke(event, event.currentTarget.id) //contains within itself a reset
    pokeGame.recreateGoal(event);
    
    // I need the reveal to happen briefly before checkVsGoal kicks in
    setTimeout(() => {
      pokeGame.checkVsGoal()
    }, 1000)
  }))