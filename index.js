const buttonColors = ['red', 'blue', 'green', 'yellow'];

const blueSound = new Audio('./sounds/blue.mp3');
const greenSound = new Audio('./sounds/green.mp3');
const redSound = new Audio('./sounds/red.mp3');
const yellowSound = new Audio('./sounds/yellow.mp3');
const wrongSound = new Audio('./sounds/wrong.mp3');

const gamePattern = [];
const userClickedPattern = [];

let currentLevel = 0;
let userSequence = 0;
let randomNumber;
let randomChosenColor;

function playSound(buttonColor) {
  switch (buttonColor) {
    case 'red':
      redSound.play();
      break;
    case 'blue':
      blueSound.play();
      break;
    case 'green':
      greenSound.play();
      break;
    case 'yellow':
      yellowSound.play();
      break;
    default:
      wrongSound.play();
      break;
  }
}

function nextSequence() {
  randomNumber = Math.floor(Math.random() * 3);
  randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  flash(randomChosenColor);
}

function flash(randomChosenColor) {
  $('#' + randomChosenColor).fadeTo(100, 0.3, function () {
    $(this).fadeTo(500, 1.0);
    playSound(randomChosenColor);
  });
}

function animatePress(currentColor) {
  $('#' + currentColor).addClass('pressed');
  playSound(currentColor);
  setTimeout(() => {
    $('#' + currentColor).removeClass('pressed');
  }, 100);
}

function checkAnswer(userSequence, userChosenColour) {
  return gamePattern[userSequence] === userChosenColour;
}

function play() {
  $(document).keydown(function (e) {
    const key = e.key;
    if (key) {
      $(document).off('keydown');
      nextSequence();
      $('#level-title').text('Level ' + currentLevel);
      $('.btn').click(function () {
        const userChosenColour = $(this).attr('id');

        userClickedPattern.push(userChosenColour);
        animatePress(userChosenColour);

        if (checkAnswer(userSequence, userChosenColour)) {
          ++userSequence;
          if (userSequence > currentLevel) {
            ++currentLevel;
            userSequence = 0;
            setTimeout(() => nextSequence(), 500);
            $('#level-title').text('Level ' + currentLevel);
          }
        } else {
          wrongSound.play();
          userSequence = 0;
          currentLevel = 0;
          gamePattern.length = 0;
          userClickedPattern.length = 0;
          $('body').addClass('game-over');
          setTimeout(() => $('body').removeClass('game-over'), 200);
          $('#level-title').text('Game Over, Press Any Key to Restart');
          $('.btn').off('click');
          play();
        }
      });
    }
  });
}
play();
