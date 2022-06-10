// preloading and local storing apparently can be overkill, don't bother unless you want to 
// the no-local storage flavor, unless you want to preserve in browser the wins/moves

// VARIABLES
let wins = 0;
let moves = 0;

let isFirstGame;
if (localStorage.getItem('isFirstGame')){
    isFirstGame = localStorage.getItem('isFirstGame'); 
}else {
    isFirstGame = true;
    localStorage.setItem('isFirstGame', isFirstGame)
}

const url = 'https://pokeapi.co/api/v2/pokemon/'

let rando16Names = [];
let rando16 = [];

let goal6 = [];
let goal6Names = [];

const wip6Names = [];



// parts of contents
const welcome = document.querySelector('#welcome')
const chatWhileLoad = document.querySelector('#welcome').querySelector('p')
const mc = document.querySelector('#mc')
  let commentary = ["Welcome! There are more than 898 Pokemon - and that's a lot.", "We caught 16 Pokemon this week, and now we're preparing our team lineup of six.", "So, how well do you remember your Pokemon? Let's find out!"]
const instructions = document.querySelector('#instructions')
const credits = document.querySelector('#credits')
const gameplay = document.querySelector('#gameplay')
const hintBox = document.querySelector('#hintBox')

// show/hide actions
const showInstruct = document.querySelector('#showInstruct')
const newGame = document.querySelector('#newGame')
const showCreds = document.querySelector('#showCreds')

function toggleVisible(showThis, hideThis1, hideThis2, hideThis3){
    showThis.classList.remove('noShow')
    hideThis1.classList.add('noShow')
    hideThis2.classList.add('noShow')
    hideThis3.classList.add('noShow')
}

showInstruct.addEventListener('click', function(){
    toggleVisible(instructions, credits, gameplay, welcome)
})
  
showCreds.addEventListener('click', function(){
    toggleVisible(credits, instructions, gameplay, welcome)
})


// *** ON LOAD for first time, do a ONE-TIME intro. 
// the welcome screen will never be shown again so currently not restored to earlier state. Can someday stand in for loading screen?
if (isFirstGame === true){
    toggleVisible(welcome, credits, gameplay, instructions);
    isFirstGame = false;
    localStorage.setItem('isFirstGame', isFirstGame)
    isFirstGame = localStorage.getItem('isFirstGame')

    localStorage.setItem('levelsWon', wins) //wins should be 0

    // intro talk
    document.querySelector('nav').classList.add('noShow');

    setTimeout(() => {
        welcome.querySelector('section').querySelector('span').classList.add('noShow')
        welcome.querySelector('section').querySelector('h1').classList.add('noShow')
        welcome.querySelector('img').classList.add('noShow')
        chatWhileLoad.classList.remove('noShow')
        mc.classList.remove('noShow') //otherwise caught in the img selector above

        for (let i=0; i < commentary.length; i++){
            setTimeout(() => {
                // rotate through commentary
                chatWhileLoad.textContent = commentary[i]
            }, 3000*i);
        }
    }, 2500);

    setTimeout(() => {
        document.querySelector('nav').classList.remove('noShow');
        chatWhileLoad.classList.add('noShow')
        mc.classList.add('noShow')
    }, 11000);
    

} else {
    wins = +localStorage.getItem('levelsWon') 
    // then await user input from nav
}


// first create an array of names - rando16Names
// then using each name, create obj with 2 key values and push to new array, rando16
// however, goal16 get and dump is also nested here to avoid async issues

function makeLists(baseUrl, length, arrNames, arr){
    fetch(`${baseUrl}?limit=898`) //adding the limit query parameter helped line up the requests that were getting routed to randos before
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            for (let i=0; i < length; i++){
                let random = Math.floor(Math.random()*898) 
                let name = data.results[random].name;
                arrNames.push(name)
                if (arrNames.length === length){
                    // only when arrNames has 16 names should you trigger the following loop
                    for (const name of arrNames){
                        fetch(baseUrl+name)
                        .then(res => res.json()) // parse response as JSON
                        .then(indivData => {
                            let img = indivData.sprites['front_default']
                            let newObj = {name, img} 
                            arr.push(newObj)
                            if (arr.length === length){
                                // trigger only when there are 16 objects in arr
                                dump(rando16,`.choice:empty`, true)
                                getGoal6(rando16, goal6, goal6Names, 6) //populates goal6 array
                                dump(goal6,`#sequence`, false, wins)// show sequence onscreen
                                // unhide gameplay elements, how that they are populated
                                document.querySelector('#choose').querySelector('h2').classList.remove('noShow')
                                document.querySelector('#sequence').classList.remove('noShow')
                                document.querySelector('.board').classList.remove('noShow')
                                increaseDifficulty(wins) //will annul some of the above
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
           
// shuffle order
function shuffle(arr){
    let random; //not sure why declaring it inside the loop has an initialization error. compare use of random in makeList
    for (i= arr.length-1; i>=0; i--){
        random = Math.floor(Math.random()*arr.length)
        [arr[i], arr[random]] = [arr[random], arr[i]]
    }
    return arr
}

function dump(arr, parentElementSelector, hide){
    for (const entry of arr){
        const pokeSubset = document.createElement('img')
        
        pokeSubset.src = entry.img; //this should be in array as a string by time of assignment but somehow still populates slower than nameArray (offset by 1).
        pokeSubset.alt = entry.name; //this will be used later for game logic
        // querySelector (not querySelectorAll !) should after getting the first match without further specification of "first of node list of .choice:empty elements"...
        // hide is a boolean - helps keep this bloc reusable for goal6 after dumping 16
        if (hide){
            pokeSubset.classList.add('hide');
        }
        document.querySelector(parentElementSelector).appendChild(pokeSubset) 
    }
}


// wonder how fast this works after dump - if an issue, fuse with dump somehow for goal16 only
// progressive difficulty time. could make into switch expr.
function increaseDifficulty(levelsWon){
    if(levelsWon > 2){
        const children = Array.from(document.querySelector('#sequence').children) 
        children.forEach(child => child.classList.add('silhouette')) 
        setTimeout(() => {
            document.querySelector('#sequence').classList.add('noShow');
        }, 4000)

    }else if (levelsWon > 1){
        // level 2 penalty
        setTimeout(() => {
            document.querySelector('#sequence').classList.add('noShow');
        }, 4000)
    }else if (levelsWon > 0){
        // level 1 penalty
        const children = Array.from(document.querySelector('#sequence').children) 
        children.forEach(child => child.classList.add('silhouette')) 
        
    
    }

}

function getGoal6(arr, subArr, subNames, length){
    shuffle(arr) // you don't want them lined up compared to the board order
    for (i=0; i < length; i++){
        let random = Math.floor(Math.random()*arr.length)
        subArr.push(arr[random])
        subNames.push(arr[random].name) //making an array of the names for easier comp later
        // There cannot be than one of a certain Pokemon 
        arr.splice(random, 1)
    }
}


// this did not work because callstack chaos; also I didn't need it
// how to check if any object key is undefined/not yet assigned value? to use in checkIfDone
function checkIfDone(exp, callback){
    // exp results in a boolean
    if(exp){    
        callback()
    } else{
        checkIfDone(exp, callback)
    }
}


document.querySelector('#newGame').addEventListener('click', startGame) 

function startGame(){
    resetAll();
    makeLists(url, 16, rando16Names, rando16)
    // console.log(rando16)
    // console.log(rando16.length)

    // nested the following due to asynchronous fetch loops. console logging above will return undefined and zero
    // dump(rando16, [selector]) - create board
    // getGoal6(rando16) - make target sequence
    // dump(goal6, [selector]) SHOW sequence onscreen
    // make page visible to user
    
    // unhide gameplay
    toggleVisible(gameplay, instructions, credits, welcome);
    
    
}


// during gameplay, undo revealPoke on all revealed items
function hidePoke(){
    document.querySelectorAll(`.choice`).forEach(element=> element.firstElementChild?.classList.add('hide'));
    document.querySelectorAll(`.choice`).forEach(element => element.classList.remove('ballHide'));
  }
  
// mid-game reset, for sequence error
function resetBoard(){
    wip6Names.length = 0;
    hidePoke();
}
// restore ALL prior variable values and remove dynamically generated img children
function resetAll(){
    resetBoard();
    rando16.length = 0;
    rando16Names.length = 0;
    //shuffled the above at dump16 but since that is chained to new call (get16), redundancy built in
    goal6.length = 0;
    goal6Names.length = 0;
    moves = 0;
    
    // fix headings
    document.querySelector('#choose').querySelector('h2').textContent = "Choose your pokemon"
  
    // delete all children img of the .choice sections and the #sequence section
    document.querySelector('#sequence').replaceChildren()
    document.querySelectorAll('.choice').forEach(element => element.replaceChildren())
  
    // hide empty nonactionable elements
    document.querySelector('#choose').querySelector('h2').classList.add('noShow')
    document.querySelector('#sequence').classList.add('noShow')
    document.querySelector('.board').classList.add('noShow') //don't let it be visible or accessible until things populated
  
}


// feedback and processing for user choice
// visual effects
document.querySelectorAll('.choice').forEach(element => element.addEventListener('click', function(event){
    // get id of section, pass as second argument of revealPoke. currentTarget gets the parent element, which is the section holding the img
    // To pass an argument to revealPoke, house inside anon function and call with the arguments
    revealPoke(event, event.currentTarget.id) //contains within itself a reset
    recreateGoal(event);
    
    // I need the reveal to happen briefly before checkVsGoal kicks in
    setTimeout(() => {
      checkVsGoal(wip6Names, goal6Names)
    }, 1000)
  }))

// idOfChoice is a string - 'a1', 'b1', etc
function revealPoke(event, idOfChoice){
    moves += 1;
  
    //hint, cheatmode
    if (moves > 20 && wins > 2){
      let exit = prompt('You are now on cheat mode! Type anything to return to the game.', '')
      if (exit !==""){
        moves = 0;
      }
      //give a glimpse of where all the pokemon are
      document.querySelectorAll(`.choice`).forEach(element=> element.firstElementChild.classList.remove('hide'));
      document.querySelectorAll(`.choice`).forEach(element => element.classList.add('ballHide'));
  
      setTimeout(() => {
        hidePoke()
      }, 500); 
  
    }else if (moves > 10 && localStorage.getItem('levelsWon') > 2){
        // check visual for the following

        hintBox.classList.remove('hide')
        hintBox.textContent = `Hint: The Pokemon you're looking for are: ${goal16.names.join(', ')}`
        setTimeout(() => {
            hintBox.classList.add('hide')
            hintBox.textContent = ``
        }, 1000); //hint disappears after 1 second
        moves = 15; //speed up to cheatmode
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

function recreateGoal(event){
    // don't push to wip6Names if it's already clicked and Poke img is viewable. 
    // However, .hide is probably simultaneously removed, so
    // prevent double count by value of img alt instead.
  
    if (!wip6Names.includes(event.target.alt)){
      wip6Names.push(event.target.alt) 
    } //else keep running
    
}


function checkVsGoal(workingList, refList){
    for (let i=0; i < workingList.length; i++){
      if (workingList[i] != refList[i]){
        document.querySelector('#choose').querySelector('h2').textContent = "Sorry, try again!"
        
        setTimeout(() => {
          document.querySelector('#choose').querySelector('h2').textContent = "Choose your pokemon"
            // reset WIP but keep sequence
            resetBoard();
        }, 1000);
        }  
    }

    if (workingList.length === refList.length && refList.every((entry, index) => entry === workingList[index])){
        wins = +wins + 1;
        localStorage.setItem('levelsWon', wins)
        wins = +localStorage.getItem('levelsWon')
        const congrats = document.createElement('h1')
        congrats.textContent="Well done! You caught them all!"
        document.querySelector('#sequence').replaceChildren(congrats) //wonder if this replicates congrats 6x or just provides 1 bc 1 arg
        
        if (wins > 3){
            document.querySelector('#choose').querySelector('h2').textContent = "Thanks for playing! You have beaten all current levels."
        }else {
            document.querySelector('#choose').querySelector('h2').textContent = "Take it to the next Level with a new lineup..."
        }
       
 
    }
    
  
}