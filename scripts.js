// Selectors
const vcrPowerButton = document.querySelector(".powerbtn .powerbutton");
const vcrPowerButtonLight = document.querySelector(".powerbutton__light");
const vcrTapeCarriage = document.querySelector(".carriage");
const vcrPlayButton = document.querySelector(".playrecrewff .playbutton");
const vcrRewButton = document.querySelector(".playrecrewff .rewbutton");
const vcrFfButton = document.querySelector(".playrecrewff .ffbutton");
const vcrStopButton = document.querySelector(".stoppause .stopbutton");
const vcrPauseButton = document.querySelector(".stoppause .pausebutton");
const vcrEjectButton = document.querySelector(".eject .ejectbutton");
const vcrDisplayText = document.querySelector(".displayarea .displaytext");

const crtPicture = document.querySelector(".crt__image");
const crtGlass = document.querySelector(".crt__glass");
const channelNum = document.querySelector(".channel");

const tvPowerButton = document.querySelector(".button--power");
const tvChannelUpButton = document.querySelector(".button--channelup");
const tvChannelDownButton = document.querySelector(".button--channeldown");

// Constants & Variables
const videoURL =
  "https://ia800909.us.archive.org/32/items/Detour/Detour_512kb.mp4";
const staticImageURL = "https://assets.codepen.io/8841541/static.gif";
let rewindInterval = null;
let movieTime = 0;
let rewindSpeed = 1;

// Helper Functions

/**
 * Adds a class to an element.
 * @param {HTMLElement} element - The element to add the class to.
 * @param {string} className - The class to add.
 */
const addClass = (element, className) => {
  element.classList.add(className);
};

/**
 * Removes a class from an element.
 * @param {HTMLElement} element - The element to remove the class from.
 * @param {string} className - The class to remove.
 */
const removeClass = (element, className) => {
  element.classList.remove(className);
};

/**
 * Updates the CRT picture.
 * @param {string} img - The image URL.
 * @param {string} video - The video URL.
 */
const updateCRTPicture = (img, video) => {
  crtPicture.setAttribute("poster", img || "");
  crtPicture.setAttribute("src", video || "");
};

// Main Functions

/**
 * Gets the current power status of the TV and VCR
 * @returns powerStatus - The current power status of the TV and VCR
 */
const getCurrentStatus = () => {
  return {
    tvIsOn: document.querySelector(".crt__image--on"),
    vcrIsOn: document.querySelector(".powerbutton__light--on"),
    carriageIsClosed: document.querySelector(".carriage--close"),
  };
};

/**
 * Update the channel and CRT image based on the channel number.
 */
const updateWhatsOn = () => {
  const { vcrIsOn, carriageIsClosed } = getCurrentStatus();
  const currentChannel = parseInt(channelNum.innerText.trim());

  if (currentChannel === 3) {
    if (vcrIsOn) {
      if (carriageIsClosed) {
        updateCRTPicture("", videoURL); // Play the video
      } else {
        updateCRTPicture("", ""); // Show the blue screen
      }
    } else {
      updateCRTPicture(staticImageURL, ""); // Show static when VCR is off
    }
  } else {
    updateCRTPicture(staticImageURL, ""); // Show static for other channels
  }
};

/**
 * Turn the VCR on or off
 */
const vcrPowerSwitch = () => {
  const { vcrIsOn } = getCurrentStatus();
  if (!vcrIsOn) {
    addClass(vcrPowerButtonLight, "powerbutton__light--on");
    addClass(vcrDisplayText, "displaytext--on");
  } else {
    removeClass(vcrPowerButtonLight, "powerbutton__light--on");
    removeClass(vcrDisplayText, "displaytext--on");
  }
  updateWhatsOn();
};

/**
 * Start rewinding the video at 2x speed
 */
const startRewind = () => {
  crtPicture.pause();
  clearInterval(rewindInterval);
  rewindInterval = setInterval(() => {
    crtPicture.currentTime = Math.max(
      crtPicture.currentTime - 0.1 * rewindSpeed,
      0
    );
  }, 50);
};

/**
 * Stop rewinding the video
 */
const stopRewind = () => {
  clearInterval(rewindInterval);
  rewindInterval = null;
  rewindSpeed = 1;
};

/**
 *  formats the time in HH:MM:SS format
 * @param {Number} timer
 * @returns
 */
const formatTime = (timer) => {
  const hours = Math.floor(timer / 3600);
  const minuteSeconds = timer % 3600;
  const minutes = Math.floor(minuteSeconds / 60);
  const seconds = Math.floor(minuteSeconds % 60);

  const hourString = hours < 10 ? `0${hours}` : hours.toString();
  const minuteString = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondString = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${hourString}:${minuteString}:${secondString}`;
};

/**
 * Close the tape carriage
 */
const closeCarriage = () => {
  removeClass(vcrTapeCarriage, "carriage--open");
  void vcrTapeCarriage.offsetWidth; // Force reflow
  addClass(vcrTapeCarriage, "carriage--close");
  updateWhatsOn();
};

/**
 * Open/eject the tape carriage
 */
const ejectCarriage = () => {
  const { vcrIsOn } = getCurrentStatus();
  if (vcrIsOn) {
    removeClass(vcrTapeCarriage, "carriage--close");
    void vcrTapeCarriage.offsetWidth; // Force reflow
    addClass(vcrTapeCarriage, "carriage--open");
    updateWhatsOn();
  }
};

/**
 * Turn the TV on or off
 */
const tvPowerSwitch = () => {
  const { tvIsOn } = getCurrentStatus();
  if (tvIsOn) {
    removeClass(crtPicture, "crt__image--on");
    removeClass(crtGlass, "crt__glass--on");
    removeClass(channelNum, "channel--on");
  } else {
    updateWhatsOn();
    addClass(crtPicture, "crt__image--on");
    addClass(crtGlass, "crt__glass--on");
    channelDisplay();
  }
};

/**
 * Display the channel number briefly
 */
const channelDisplay = () => {
  addClass(channelNum, "channel--on");
  setTimeout(() => {
    removeClass(channelNum, "channel--on");
  }, 3000);
};

/**
 * Increment the channel
 */
const channelUp = () => {
  const { tvIsOn } = getCurrentStatus();
  if (tvIsOn) {
    let currentChannel = parseInt(channelNum.innerText.trim());
    currentChannel = (currentChannel % 13) + 1;
    channelNum.innerText = String(currentChannel).padStart(2, "0");
    updateWhatsOn();
    channelDisplay();
  }
};

/**
 * Decrement the channel
 */
const channelDown = () => {
  const { tvIsOn } = getCurrentStatus();
  if (tvIsOn) {
    let currentChannel = parseInt(channelNum.innerText.trim());
    currentChannel = ((currentChannel - 2 + 13) % 13) + 1;
    channelNum.innerText = String(currentChannel).padStart(2, "0");
    updateWhatsOn();
    channelDisplay();
  }
};

// Event Listeners
// VCR Power
vcrPowerButton.addEventListener("click", vcrPowerSwitch);

// VCR Carriage Open or Close
vcrTapeCarriage.addEventListener("click", closeCarriage);

vcrEjectButton.addEventListener("click", ejectCarriage);

// TV Power
tvPowerButton.addEventListener("click", tvPowerSwitch);

// Channel Up
tvChannelUpButton.addEventListener("click", channelUp);

// Channel Down
tvChannelDownButton.addEventListener("click", channelDown);

// Track the time of the video
crtPicture.addEventListener("timeupdate", () => {
  movieTime = formatTime(crtPicture.currentTime);
  vcrDisplayText.innerText = movieTime;
});

// Play Button
vcrPlayButton.addEventListener("click", () => {
  if (crtPicture.getAttribute("src") === videoURL) {
    crtPicture.play();

    if (crtPicture.playbackRate !== 1) {
      crtPicture.playbackRate = 1;
    }
    if (rewindInterval) {
      stopRewind();
    }
  }
});

// Pause Button
vcrPauseButton.addEventListener("click", () => {
  if (crtPicture.getAttribute("src") === videoURL) {
    crtPicture.pause();
  }
});

// Fast Forward Button
vcrFfButton.addEventListener("click", () => {
  if (crtPicture.getAttribute("src") === videoURL) {
    if (crtPicture.paused || rewindInterval) {
      crtPicture.playbackRate = 1;
      crtPicture.play();
      if (rewindInterval) {
        stopRewind();
      }
    }

    switch (crtPicture.playbackRate) {
      case 1:
        crtPicture.playbackRate = 2;
        break;
      case 2:
        crtPicture.playbackRate = 4;
        break;
      default:
        // Do nothing for any other playbackRate
        break;
    }
  }
});

// Rewind Button
vcrRewButton.addEventListener("click", () => {
  if (crtPicture.getAttribute("src") === videoURL) {
    if (rewindInterval) {
      switch (rewindSpeed) {
        case 1:
          rewindSpeed = 2;
          break;
        case 2:
          rewindSpeed = 4;
          break;
        case 4:
        default:
          rewindSpeed = 1;
          break;
      }
    } else {
      rewindSpeed = 1;
      startRewind();
    }
    startRewind();
  }
});

// Stop Button
vcrStopButton.addEventListener("click", () => {
  if (crtPicture.getAttribute("src") === videoURL) {
    crtPicture.pause();
    crtPicture.removeAttribute("src"); // Remove the video source
    crtPicture.load(); // Reset the video element
  }
});
