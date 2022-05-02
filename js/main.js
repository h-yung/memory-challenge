// BUGS
// pokemon not getting cut from rando length after assignment - or rather, there are rando assignments of repeat pokemon to that array
// sprites still not matching up with names in alt.

// following cleanup and rewrit as class, will share to github


// technically doesn't need local Storage either - just a local variable unless someone comes back after browser close
// build out as a class



  /*
  Options to explore:
  1. create actions array to iterate over, possibly with a delay between each.
  2. Nest functions. But not v readable. 
  dump16(rando16Names, rando16Sprites) 
  INSIDE get16()
  and 
  getGoal6(rando16Names, rando16Sprites)
  INSIDE dump16
  3. use promises. PROBLEM: Don't know what result I'm returning in Promises with .then
  4. use async / await which is ~Promises
  */

// fetch no more than 16 pokemon at random. 
// Dump into an array. 
// Add to a board that user can interact with.
// from the array, select 6 pokemon at random.
// fetch images of the 6 pokemon, and display in the show sequence area.

// gamelogic...check wupArray against array of 6.


// VARIABLES
let wins;
let moves = 0;

const url = 'https://pokeapi.co/api/v2/pokemon/'

let rando16Names = [];
let rando16Sprites = [];

let goal6Names = [];
let goal6Sprites = [];

const wip6Names = [];


// parts of contents
const welcome = document.querySelector('#welcome')
  let chatWhileLoad = document.querySelector('#welcome').querySelector('p')
  let mc = document.querySelector('#mc')
  let commentary = ["Welcome! There are more than 898 Pokemon - and that's a lot.", "We caught 16 Pokemon this week, and now we're preparing our team lineup of six.", "So, how well do you remember your Pokemon? Let's find out!"]
  const instructions = document.querySelector('#instructions')
const credits = document.querySelector('#credits')
const gameplay = document.querySelector('#gameplay')


// *** ON LOAD, 
// Populate a local array. Store in localStorage. Reduces runtime during game, better experience for user, more processing on client-side because fewer calls to server.
// localStorage.setItem("names", JSON.stringify(names))
// DO A ONE-TIME SETUP. Don't integrate with existing functions and code for regular runtime.

if (!localStorage.getItem('rando16Names')){
  document.querySelector('nav').classList.add('noShow');

  setTimeout(() => {
    document.querySelector('#welcome').querySelector('section').querySelector('span').classList.add('noShow')
    document.querySelector('#welcome').querySelector('section').querySelector('h1').classList.add('noShow')
    document.querySelector('#welcome').querySelector('img').classList.add('noShow')
    chatWhileLoad.classList.remove('noShow')
    mc.classList.remove('noShow') //otherwise caught in the img selector above

    for (let i=0; i < commentary.length; i++){
      setTimeout(() => {
        // rotate through commentary
        chatWhileLoad.textContent = commentary[i]
      }, 3000*i);
    }
  }, 2000);
  
  setTimeout(() => {
    console.log(rando16Names.length, rando16Sprites.length)
    localStorage.setItem('rando16Names', JSON.stringify(rando16Names))
    localStorage.setItem('rando16Sprites', JSON.stringify(rando16Sprites))
  }, 8500); // check how long actually needed. the crucial stuff inside this timeout needs outputs from the get16() below.
  get16(); //only runs for the 1-time setup
}



// show/hide actions
const showInstruct = document.querySelector('#showInstruct')
const newGame = document.querySelector('#newGame')
const showCreds = document.querySelector('#showCreds')

// hide/show contents. could further simplify into 1 function to check variable, then match variables
showInstruct.addEventListener('click', function(){
  toggleVisible(instructions, credits, gameplay, welcome)
})

showCreds.addEventListener('click', function(){
  toggleVisible(credits, instructions, gameplay, welcome)
})


function toggleVisible(showThis, hideThis1, hideThis2, hideThis3){
  showThis.classList.remove('noShow')
  hideThis1.classList.add('noShow')
  hideThis2.classList.add('noShow')
  hideThis3.classList.add('noShow')
}




document.querySelector('#newGame').addEventListener('click', startGame) 


// visual effects
document.querySelectorAll('.choice').forEach(element => element.addEventListener('click', function(event){
  // get id of section, pass as second argument of revealPoke. currentTarget gets the parent element, which is the section holding the img
  // To pass an argument to revealPoke, house inside anon function and call with the arguments
  revealPoke(event, event.currentTarget.id) //contains within itself a reset
  recreateGoal(event);
  
  // I need the reveal to happen briefly before checkVsGoal kicks in
  setTimeout(() => {
    checkVsGoal(wip6Names)
  }, 1000)

}))

// idOfChoice is a string - 'a1', 'b1', etc
function revealPoke(event, idOfChoice){
  moves += 1;

  if (moves > 20 && localStorage.getItem('levelsWon') > 2){
    let exit = prompt('You are now on cheat mode! Type anything to return to the game.', '')
    if (exit !==""){
      moves = 0;
    }
    document.querySelectorAll(`.choice`).forEach(element=> element.firstElementChild.classList.remove('hide'));
    document.querySelectorAll(`.choice`).forEach(element => element.classList.add('ballHide'));

    setTimeout(() => {
      hidePoke()
    }, 500);

  }else if (moves > 10 && localStorage.getItem('levelsWon') > 2){
    alert(`Hint: The Pokemon you're looking for are: ${rando16Names.join(', ')}`)
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


// checking all functions before replacing event listener on button
function startGame(){

  // if localstorage was manually cleared, startgame triggers this:
  if (!localStorage.getItem('rando16Names')){
    document.querySelector('nav').classList.add('noShow');
  
    setTimeout(() => {
      document.querySelector('#welcome').querySelector('section').querySelector('span').textContent ="Loading..."
      document.querySelector('#welcome').querySelector('section').querySelector('h1').textContent ="Catching new pokemon!"
      // document.querySelector('#welcome').querySelector('img').classList.add('noShow')
      // chatWhileLoad.classList.remove('noShow')
      // mc.classList.remove('noShow') //otherwise caught in the img selector above
  
    }, 4000); //might be too short

  setTimeout(() => {
    console.log(rando16Names.length, rando16Sprites.length)
    localStorage.setItem('rando16Names', JSON.stringify(rando16Names))
    localStorage.setItem('rando16Sprites', JSON.stringify(rando16Sprites))
  }, 8500); // check how long actually needed. the crucial stuff inside this timeout needs outputs from the get16() below.
  get16(); //only runs for the 1-time setup
  }
  

  // restore welcome screen in bkg
  chatWhileLoad.classList.add('noShow')
  mc.classList.add('noShow')
  document.querySelector('#welcome').querySelector('section').querySelector('h1').textContent = "Catching new Pokemon"
  document.querySelector('#welcome').querySelector('section').querySelector('span').textContent = "Loading"
  document.querySelector('#welcome').querySelector('section').querySelector('h1').classList.remove('noShow')
  document.querySelector('#welcome').querySelector('section').querySelector('span').classList.remove('noShow')
  

  if (!localStorage.getItem('levelsWon')){
    localStorage.setItem('levelsWon', 0)
  }
  wins = localStorage.getItem('levelsWon')
  setTimeout(() => {
    resetAll(); //delay on first time so that not null
  }, 2000);
  // get16() don't call again unless there is a new user action to do a different 16 to replace local. In that case, clear localStorage before trigger.

/*The following MUST NOT START until the above is done. Thus these were nested.

  dump16(rando16Names, rando16Sprites) //manually called in console for now
  getGoal6(rando16Names, rando16Sprites) 

*/
}

// convoluted chained shuffle
function shuffle(indexNum, array1, array2){
  console.log(`before shuffle ${array1} .. ${array2}`)
  const indices = [];
  for (let counter=0; counter <indexNum; counter++){
      indices.push(counter)
  }
  const j = Math.floor(Math.random()*indices.length)
  for (let i=indices.length-1; i>=0; i--){
      [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  let newArr1 = [];
  let newArr2 = [];
  for (const index of indices){
      newArr1.push(array1[index])
      newArr2.push(array2[index])
  }
  setTimeout(() => {
      array1 = newArr1;
      array2 = newArr2;
      console.log(`after shuffle ${array1} and ${array2}`)
  }, 500);
  
}

// random chunk of 16 from the API, shuffled after populated
function get16(){
  
  let offset = Math.floor(Math.random()*(898-16)); //-16 since this is an offset figure
  fetch(`${url}?limit=16&offset=${offset}`) //adding the limit query parameter helped line up the requests that were getting routed to randos before
    .then(res => res.json()) // parse response as JSON
    .then(data => {
        for (let i=0; i< 16; i++) {
          setTimeout(() => {
            rando16Names.push(data.results[i].name)
            fetch(data.results[i].url)
            // at least it's just 16 times
              .then(res => res.json()) // parse response as JSON
              .then(indivData => {
                  rando16Sprites.push(indivData.sprites['front_default'])
              })
              .catch(err => {
                  console.log(`error ${err}`)
              });
          }, 500*i); //about 8+sec
        }

    console.log(rando16Names.length, rando16Sprites.length)
    
        // the list length means requests are received and processed at wildly different times,
        // thus pushed to Sprite array achronologically, which results in randomized sprite order
        // need each request to wait til the last one is done and pushed

    })

    .then(()=> {
    // brute force delays - dump16 is the weak linK as rando16sprites array not populating fast enough without this. above often registers length of 0.
      setTimeout(() => {
          console.log(`After some time, length of rando16sprites is ${rando16Sprites.length}`)
          console.log(`Again here are the rando16: ${rando16Names}`)
          console.log(rando16Sprites)
          dump16(rando16Names,rando16Sprites)
          document.querySelector('nav').classList.remove('noShow');
          toggleVisible(instructions, credits, gameplay, welcome); //instructions are default view at start of game though board is now populating
      }, 12000); //factors: intro remarks, and line 184, max duration of get16()
    })
    
    .catch(err => {
        console.log(`error ${err}`)
    });

}

// populate as img children in the board
// Using the image alt as if it's an "id" since string with weird spacing etc still works there

function dump16(nameArray, spriteArray){
  console.log(`at start of dump call, length of rando16sprites is ${rando16Sprites.length}, length of rando16names is ${rando16Names.length}`)
  shuffle(16, rando16Names, rando16Sprites)

  // note that nameArray.length === spriteArray.length is assumed. Not hard-coding but currently should be 16.
    
    setTimeout(() => {
      for (let i=0; i < nameArray.length; i++){
        const pokeSubset = document.createElement('img')
        
        pokeSubset.src = spriteArray[i]; //this should be in array as a string by time of assignment but somehow still populates slower than nameArray (offset by 1).
        pokeSubset.alt = nameArray[i]; //this will be used later for game logic
      
        pokeSubset.classList.add('hide');
        document.querySelector(`.choice:empty`).appendChild(pokeSubset) 
        // querySelector (not querySelectorAll !) should after getting the first match without further specification of "first of node list of .choice:empty elements"...
      }
    }, 1000); //delays for the shuffle above to finish


  toggleVisible(gameplay, instructions, credits, welcome);

}

// create challenge sequence. No need to call API here.
function getGoal6(nameArray, spriteArray){
  // 6 is currently hardcoded but you could always turn it into a parameter and edit the function name
  setTimeout(() => {
    // give time to shuffle first
    for (let counter=5; counter>=0; counter--){ 
      let random = Math.floor(Math.random()*nameArray.length) //assuming lengths are same for name..and sprite..
      goal6Names.push(nameArray[random]); //only need this for future hinting or possibilities
      goal6Sprites.push(spriteArray[random]) //might not need this except for future hinting or possibilities
      
      // There cannot be than one of a certain Pokemon - otherwise selection will fail. So rando16 lengths will eventually become 10
      nameArray.splice(random, 1)
      spriteArray.splice(random, 1)
    }
  }, 300);
  
  console.log(`source array lengths should be 10 at this point. Lengths: ${nameArray.length} and ${spriteArray.length}`)
  
  // the following is done with goal6 as a separate loop...otherwise weird #sequence overpopulation
  document.querySelector('#sequence').replaceChildren() //safeguard
  setTimeout(() => {
    shuffle(6,goal6Names,goal6Sprites)
    for (let i=0; i< goal6Names.length; i++){
      const pokeTarget = document.createElement('img')
      pokeTarget.src = goal6Sprites[i]
      pokeTarget.alt = goal6Names[i] //will be used later for game logic
      document.querySelector('#sequence').appendChild(pokeTarget)
     
    }
    
  }, 500); // needs to be longer than timeout on the .push into goal6 arrays

  if (localStorage.getItem('levelsWon') > 1){
    // level 2: see silhouettes only ever PLUS level 1 consequences assessed later below ~line 286
    console.log('im running')

    setTimeout(() => {
      const children = Array.from(document.querySelector('#sequence').children) //add delay so sequence populates? do at dump?
      children.forEach(child => child.classList.add('silhouette')) //does this iterate properly
    }, 560); //delay for the loop above to finish adding children to #sequence
    
  }
  
  document.querySelector('.board').classList.remove('noShow')


if (localStorage.getItem('levelsWon') > 0 && localStorage.getItem('levelsWon') !=2){
    // level 1: disappearing sequence, also additive effect after level 2.
    setTimeout(() => {
      document.querySelector('#sequence').classList.add('noShow');
     }, 4000)

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

function checkVsGoal(list){
  for (let i=0; i < list.length; i++){
    if (list[i] != goal6Names[i]){
      console.log(`wip[i] is ${wip6Names[i]} and goal6[i] is ${goal6Names[i]}`) //check
      // alert("Sorry, try again!")
      
      document.querySelector('#choose').querySelector('h2').textContent = "Sorry, try again!"
      setTimeout(() => {
        document.querySelector('#choose').querySelector('h2').textContent = "Choose your pokemon"
      }, 1500);

      // reset WIP but keep sequence
      resetBoard();
    } else if (list[i].length === goal6Names[i].length && goal6Names.every((pokemon, index) => pokemon === list[index])){
      wins = +wins + 1;
      document.querySelector('#sequence').replaceChildren()
      const congrats = document.createElement('h1')
      congrats.textContent="You caught them all!"
      
      document.querySelector('#choose').querySelector('h2').textContent = "Take it to the next Level with a new lineup..."
      document.querySelector('#sequence').appendChild(congrats)
      // alert(`You caught them all! Take it to the next Level with a new lineup...`)
      localStorage.setItem('levelsWon', wins)
      return //avoid infinite loop?
    }
  }

}


// reset, called as well at start of new sequence generation
function resetAll(){
  resetBoard();
  rando16Names = JSON.parse(localStorage.rando16Names); 
  rando16Sprites = JSON.parse(localStorage.rando16Sprites);
  // shuffle(16, rando16Names, rando16Sprites) //shuffled again at dump16 but since that is chained to new call (get16), redundancy built in
  goal6Names.length = 0;
  goal6Sprites.length = 0;
  moves = 0;
  
  // brute force!
  setTimeout(()=> {
    getGoal6(rando16Names, rando16Sprites)
  }, 2000)

  // fix headings
  document.querySelector('#choose').querySelector('h2').textContent = "Choose your pokemon"

  // delete all children img of the .choice sections and the #sequence section
  document.querySelector('#sequence').replaceChildren()
  document.querySelectorAll('.choice').forEach(element => element.replaceChildren())

  // hide empty noninteractive elements
  document.querySelector('#sequence').classList.remove('noShow')
  document.querySelector('.board').classList.add('noShow') //don't let it be visible or accessible until things populated

  if(localStorage.getItem('rando16Names')){
    // which it should because literally set above
    setTimeout(() => {
      dump16(rando16Names, rando16Sprites) //get rid of this mess or do closer to startgame
    }, 500);//hopefully enough to reset?

  }

}



