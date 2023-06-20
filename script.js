document.addEventListener('DOMContentLoaded', async function() {
  let score = 0;
  let currentIndex = 0;
  let ongoingRound = true; 
  let numberRound = 10;
  const baseUrl = 'http://46.226.110.124:1337';
  const mediaUrl = `${baseUrl}/api/whichcontentisreal-mediacontents`;
  const nextButton = document.getElementById('next');
  const media1 = document.getElementById('media1');
  const media2 = document.getElementById('media2');
  const scoreElement = document.getElementById('score');
  const info = document.getElementById('info');
  const game = document.getElementById('game');
  const mediaArrays = await getMedia(mediaUrl, numberRound);
  const title = document.querySelector('.title');
  const description = document.querySelector('.description');
  const scoreText = document.querySelector('.scoreText');
  const nextText = document.querySelector('.nextText');


  
  //Get the language prefix from url
  let currentLanguage = window.location.pathname.split("/")[1];
  //SET THE GAME
  setMedia();
  
  nextButton.addEventListener('click', setMedia);
  media1.addEventListener('click', function() {
      if (ongoingRound) {
        handleClick(this);
        ongoingRound = false;  // Set ongoingRound to false after a choice is made
      }
    });
  media2.addEventListener('click', function() {
      if (ongoingRound) {
        handleClick(this);
        ongoingRound = false;  // Set ongoingRound to false after a choice is made
      }
    });

  title.textContent = translations[currentLanguage].appTitle
  description.textContent = translations[currentLanguage].description
  scoreText.textContent  = translations[currentLanguage].scoreText
  nextText.textContent = translations[currentLanguage].nextText



  function setMedia() {
    ongoingRound = true;
    // Hide info
    info.style.display = 'none';
    console.log(currentIndex)
    console.log(mediaArrays.realContentUrls.length)
    if (currentIndex >= mediaArrays.realContentUrls.length) {
      console.log(translations)
      console.log(translations[currentLanguage])
      game.innerHTML = `<h2 class="finishText">${translations[currentLanguage].finishMessage}</h2>
                        <h2 class="finalScore">${translations[currentLanguage].scoreText} ${score}/10</h2>
                        <button class="playAgainButton" id="playAgain">${translations[currentLanguage].playAgain}</button>`;
      document.getElementById('playAgain').addEventListener('click', restartGame);
      return;
    }

    // Disable next button
    nextButton.disabled = true;

    // Reset borders
    media1.style.border = '5px solid transparent';
    media2.style.border = '5px solid transparent';

    // Determine if the current media is a video or image
    const isVideo1 = mediaArrays.realContentUrls[currentIndex].includes('.mp4');
    const isVideo2 = mediaArrays.fakeContentUrls[currentIndex].includes('.mp4');

    // Randomize media positions
    if (Math.random() < 0.5) {
      setMediaElement(media1, mediaArrays.realContentUrls[currentIndex], isVideo1, mediaArrays.realContentCaptions[currentIndex], 'true');
      setMediaElement(media2, mediaArrays.fakeContentUrls[currentIndex], isVideo2, mediaArrays.fakeContentCaptions[currentIndex], 'false');
    } else {
      setMediaElement(media1, mediaArrays.fakeContentUrls[currentIndex], isVideo2, mediaArrays.fakeContentCaptions[currentIndex], 'false');
      setMediaElement(media2, mediaArrays.realContentUrls[currentIndex], isVideo1, mediaArrays.realContentCaptions[currentIndex], 'true');
    }

    currentIndex++;
  }

  function setMediaElement(element, source, isVideo, info, isCorrect) {
    if (isVideo) {
      element.innerHTML = `<video width=data-info="${info}" controls><source src="${source}" type="video/mp4"></video>`;
    } else {
      element.innerHTML = `<img data-info="${info}" src="${source}">`;
    }
    element.dataset.correct = isCorrect;
  }
  
  function handleClick(element) {
    nextButton.disabled = false;
    const correct = element.dataset.correct === 'false';
    const mediaElement = element.firstChild;
    const mediaInfo = mediaElement.dataset.info;

    element.style.border = correct ? '5px solid green' : '5px solid red';
    info.style.display = 'block';
    info.textContent = mediaInfo;
    if(correct){
      score++;
      scoreElement.innerHTML = `${score}`;
    }
    scoreText.innerHTML = `${translations[currentLanguage].scoreText}<span id='score' style='color: #2F4FBB;'>${score}</span>/10`;
}

  async function getMedia(mediaUrl, mediaAmount) {
    // Get all media from API
    const resp = await fetch(`${mediaUrl}?populate=*`).then(response => response.json());
    const data = resp['data'];

    // Get media with attribute is_real equal to true
    let realMedia = data.filter(item => item.attributes.is_real).map(item => item.attributes.media.data);
    let flattenedRealMedia = shuffleArray([].concat(...realMedia));
    let realUrls = flattenedRealMedia.map(item => baseUrl + item.attributes.url).slice(0, mediaAmount);
    let realCaptions = flattenedRealMedia.map(item => item.attributes.caption).slice(0, mediaAmount);

    // Get media with attribute is_real equal to false
    let fakeMedia = data.filter(item => !item.attributes.is_real).map(item => item.attributes.media.data);
    let flattenedFakeMedia = shuffleArray([].concat(...fakeMedia));
    let fakeUrls = flattenedFakeMedia.map(item => baseUrl + item.attributes.url).slice(0, mediaAmount);
    let fakeCaptions = flattenedFakeMedia.map(item => item.attributes.caption).slice(0, mediaAmount);

    return {
        realContentUrls: realUrls,
        realContentCaptions: realCaptions,
        fakeContentUrls: fakeUrls,
        fakeContentCaptions: fakeCaptions,
    };
}

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  function restartGame() {
    location.reload();
  }
});

let translations = {
  en: {
    finishMessage: 'Thanks you for playing !',
    startAgain: 'Start Again',
    appTitle : "Which content is AI-generated ?",
    description: "Select which media you think has been generated by an AI ?",
    scoreText:"Your Score : ",
    nextText: "Next",
    playAgain: "Play again"
  },
  fr: {
    finishMessage: "Merci d'avoir joué ",
    startAgain: 'Recommencer',
    appTitle : "Quel contenu est généré par une AI?",
    description: "Sélectionnez le média qui vous semble avoir été généré par une AI",
    scoreText:"Ton score : ",
    nextText: "Suivant",
    playAgain: "Rejouer"

  },
  nl: {
    finishMessage: 'bedankt voor het spelen !',
    startAgain: 'Begin',
    appTitle : "Welke inhoud wordt gegenereerd door een AI ?",
    description: "Selecteer de media die volgens jou zijn gegenereerd door een AI",
    scoreText:"Uw score : ",
    nextText: "Next",
    playAgain: "Opnieuw spelen"

    // Add more keys and translations as needed
  },

  // Add more languages as needed
};