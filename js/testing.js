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
  let chatWhileLoad = document.querySelector('#welcome').querySelector('p')
  let mc = document.querySelector('#mc')
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




 // intro talk
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
 }, 2500);

 setTimeout(() => {
     document.querySelector('nav').classList.remove('noShow');
 }, 11000);
 