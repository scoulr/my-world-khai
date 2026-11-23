const opening = document.querySelector("#opening");
const introPlay = document.querySelector("#intro-play");
const introPlayStatus = document.querySelector("#intro-play-status");
const flowerGarden = document.querySelector("#flower-garden");
const openingCaption = document.querySelector("#opening-caption");
const openingNext = document.querySelector("#opening-next");
const letterScene = document.querySelector("#letter-scene");
const memoriesScene = document.querySelector("#memories");
const catScene = document.querySelector("#cat-scene");
const letterPaper = document.querySelector("#letter-paper");
const letterCopy = document.querySelector("#letter-copy");
const pageCount = document.querySelector("#page-count");
const nextPage = document.querySelector("#next-page");
const nextLabel = document.querySelector("#next-label");
const musicControl = document.querySelector("#music-control");
const playMusic = document.querySelector("#play-music");
const musicNote = document.querySelector("#music-note");
const song = document.querySelector("#song");
const pageFlipAudio = document.querySelector("#page-flip-audio");
const miawAudio = document.querySelector("#miaw-audio");
const speechBubble = document.querySelector("#speech-bubble");
const catAudioNote = document.querySelector("#cat-audio-note");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pages = [
  [
    "Suddenly, my life feels so much more beautiful because you fill my days. You’re the one who’s never absent when it comes to calling me cute every single day, even though you don’t damn well realize that you’re much cuter than I am."
  ],
  [
    "I love you in so many ways. I love you by standing by your side. I love you by appreciating every second of your presence. I love you by trying to remember every little thing you like. I love you by praying that you receive the kindest things this world has to offer.",
    "You have no idea how kind you are, how adorable you are, and how grateful I am to have you. You make my heart bloom like flowers, and somehow, it keeps blooming a little more every day because of you. Perhaps, wouldn’t you like to see it bloom even more as time goes by?"
  ],
  [
    "You have no idea how pretty you are, how handsome you are, or how every single word you say gives me another reason to adore you even more.",
    "My sweet love, you’re the unexpected surprise in my life, someone I never knew I needed, let alone someone I would come to yearn for this much."
  ]
];
const flowerColors = ["#f1d9bc", "#ef8eae", "#e36b80", "#f0ce69", "#f5a4bd", "#fff0d6", "#d97682", "#f4d36f", "#e984a0"];
const bloomArt = [" .+. ", "+*#*+", "*#@#*", "+*#*+", " .+. "];
const budArt = ["  .  ", " .o. ", "  |  ", "  |  ", " /|\\ "];
let currentPage = 0;
let bloomComplete = false;
let pageTransitioning = false;

function renderArt(element, lines) {
  element.replaceChildren();
  lines.forEach((line) => {
    const row = document.createElement("span");
    row.className = "art-row";
    [...line].forEach((character) => {
      const cell = document.createElement("span");
      cell.textContent = character === " " ? "\u00a0" : character;
      if (character === "@") cell.className = "center-cell";
      row.append(cell);
    });
    element.append(row);
  });
}

function createFlowers() {
  for (let index = 0; index < flowerColors.length; index += 1) {
    const plant = document.createElement("div");
    const head = document.createElement("pre");
    const stem = document.createElement("pre");
    const stemRows = 6 + (index % 4);
    const stemArt = Array.from({ length: stemRows }, (_, row) => {
      if (row === stemRows - 2 && index < 3) return " /|  ";
      if (row === stemRows - 2 && index > 5) return "  |\\ ";
      return row % 3 === 1 ? " /|\\ " : "  |  ";
    });

    plant.className = "plant";
    plant.style.setProperty("--bloom", flowerColors[index]);
    head.className = "plant-head bud";
    head.setAttribute("aria-hidden", "true");
    stem.className = "plant-stem";
    stem.setAttribute("aria-hidden", "true");
    renderArt(head, budArt);
    renderArt(stem, stemArt);
    plant.append(head, stem);
    flowerGarden.append(plant);
  }
}

function makePetals(scene) {
  const layer = scene.querySelector(".petals");
  if (!layer || layer.childElementCount) return;
  const colors = ["#f3c4ca", "#fff1e7", "#dfb6c8", "#ead6aa", "#f7dce0"];
  const count = reducedMotion ? 8 : 16;
  for (let index = 0; index < count; index += 1) {
    const petal = document.createElement("i");
    const pixel = 2 + Math.floor(Math.random() * 2);
    petal.className = "petal";
    petal.setAttribute("aria-hidden", "true");
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--pixel", `${pixel}px`);
    petal.style.setProperty("--duration", `${11 + Math.random() * 12}s`);
    petal.style.setProperty("--delay", `${-Math.random() * 20}s`);
    petal.style.setProperty("--angle", `${Math.round(Math.random() * 50 - 25)}deg`);
    petal.style.setProperty("--petal-color", colors[index % colors.length]);
    for (let square = 0; square < 7; square += 1) petal.append(document.createElement("span"));
    layer.append(petal);
  }
}

function showScene(scene) {
  [opening, letterScene, memoriesScene, catScene].forEach((item) => item.classList.add("hidden"));
  scene.classList.remove("hidden");
  if (scene === memoriesScene) memoriesScene.classList.add("revealed");
}

function renderPage() {
  if (!pages[currentPage]) {
    throw new RangeError(`Letter page ${currentPage + 1} is not defined.`);
  }
  letterCopy.replaceChildren();
  pages[currentPage].forEach((text) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    letterCopy.append(paragraph);
  });

  if (currentPage === 2) {
    const signoff = document.createElement("p");
    signoff.className = "letter-signoff";
    const to = document.createElement("span");
    to.textContent = "To my sweet,";
    const name = document.createElement("span");
    name.className = "signature";
    name.textContent = "Khai";
    signoff.append(to, name);
    letterCopy.append(signoff);
  }

  pageCount.textContent = `${String(currentPage + 1).padStart(2, "0")} / 03`;
  nextLabel.textContent = currentPage === 2 ? "Our photographs" : "Turn the page";
  document.querySelector("#back-label").textContent = currentPage === 0 ? "Flowers" : "Back";
}

function playPageFlip() {
  pageFlipAudio.currentTime = 0;
  pageFlipAudio.play().catch(() => {
    pageFlipAudio.dataset.unavailable = "true";
  });
}

async function startMusic() {
  introPlay.disabled = true;
  introPlayStatus.textContent = "";
  song.volume = 0.45;
  try {
    await song.play();
    if (song.paused) {
      throw new Error("Music playback did not start.");
    }
    opening.classList.add("music-intro-dismissed");
    opening.classList.remove("music-intro-active");
    musicControl.hidden = true;
    bloomBouquet();
  } catch (error) {
    console.error("Background music playback failed.", error);
    introPlay.disabled = false;
    introPlayStatus.textContent = "Could not play the song. Tap to retry.";
  }
}

function enterLetter() {
  currentPage = 0;
  renderPage();
  showScene(letterScene);
  openingNext.hidden = true;
}

function finishBloom() {
  bloomComplete = true;
  flowerGarden.classList.add("gathered");
  openingCaption.textContent = "and there you are, in full bloom.";
  window.setTimeout(enterLetter, reducedMotion ? 300 : 1300);
}

function bloomBouquet() {
  const plants = [...flowerGarden.children];
  openingCaption.textContent = "little by little, finding the light…";
  plants.forEach((plant, index) => {
    const startDelay = reducedMotion ? 0 : index * 120;
    window.setTimeout(() => plant.classList.add("growing"), startDelay);
    window.setTimeout(() => {
      const head = plant.querySelector(".plant-head");
      renderArt(head, bloomArt);
      head.classList.remove("bud");
      head.classList.add("opening");
    }, (reducedMotion ? 100 : 1350) + index * (reducedMotion ? 0 : 210));
  });
  window.setTimeout(finishBloom, reducedMotion ? 250 : 3900);
}

function navigatePage(direction) {
  if (pageTransitioning) return;
  const targetPage = currentPage + direction;
  if (targetPage < 0 || targetPage >= pages.length) return;
  pageTransitioning = true;
  nextPage.disabled = true;
  document.querySelector("#letter-back").disabled = true;
  playPageFlip();
  letterPaper.classList.add("turning");
  window.setTimeout(() => {
    currentPage = targetPage;
    renderPage();
    letterPaper.classList.remove("turning");
    nextPage.disabled = false;
    document.querySelector("#letter-back").disabled = false;
    pageTransitioning = false;
  }, reducedMotion ? 20 : 280);
}

createFlowers();
[letterScene, memoriesScene, catScene].forEach(makePetals);
introPlay.addEventListener("click", startMusic);

openingNext.addEventListener("click", enterLetter);
nextPage.addEventListener("click", () => {
  if (currentPage < pages.length - 1) {
    navigatePage(1);
    return;
  }
  playPageFlip();
  showScene(memoriesScene);
});

document.querySelector("#letter-back").addEventListener("click", () => {
  if (currentPage > 0) {
    navigatePage(-1);
    return;
  }
  playPageFlip();
  showScene(opening);
  openingNext.hidden = !bloomComplete;
});

document.querySelector("#photos-back").addEventListener("click", () => {
  currentPage = pages.length - 1;
  renderPage();
  playPageFlip();
  showScene(letterScene);
});

document.querySelector("#to-cat").addEventListener("click", () => showScene(catScene));
document.querySelector("#cat-back").addEventListener("click", () => showScene(memoriesScene));

playMusic.addEventListener("click", () => {
  song.play().then(() => {
    musicControl.hidden = true;
    musicNote.textContent = "";
  }).catch(() => {
    musicNote.textContent = "Music could not be played.";
  });
});

document.querySelector("#cat-button").addEventListener("click", () => {
  speechBubble.classList.remove("show");
  void speechBubble.offsetWidth;
  speechBubble.classList.add("show");
  miawAudio.currentTime = 0;
  miawAudio.play().then(() => {
    catAudioNote.hidden = true;
  }).catch(() => {
    catAudioNote.textContent = "Meow sound could not be played.";
    catAudioNote.hidden = false;
  });
});

document.querySelectorAll(".polaroid img").forEach((image) => {
  image.addEventListener("error", () => {
    image.alt = "This photograph could not be loaded.";
    image.parentElement.classList.add("photo-missing");
  });
});
