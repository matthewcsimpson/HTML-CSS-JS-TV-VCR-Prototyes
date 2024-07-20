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

const tvPowerButton = document.querySelector(".button--power");
const tvChannelUpButton = document.querySelector(".button--channelup");
const tvChannelDownButton = document.querySelector(".button--channeldown");
const tvVolumeUpButton = document.querySelector(".button--volumeup");
const tvVolumeDownButton = document.querySelector(".button--volumedown");
const tvPictureBackground = document.querySelector(".crt__background");

const tvWrongChannel = document.querySelector(".crt__image--wrongchannel");
const tvChannelThree = document.querySelector(".crt__image--channelthree");
const tvGlass = document.querySelector(".crt__glass");

const displayChannelNum = document.querySelector(".channel");
const displayIndicator = document.querySelector(".indicator");
const displayPlay = document.querySelector(".indicator__icon--play");
const displayPause = document.querySelector(".indicator__icon--pause");
const displayStop = document.querySelector(".indicator__icon--stop");
const displayRew = document.querySelector(".indicator__icon--rewind");
const displayFf = document.querySelector(".indicator__icon--fastforward");

// Constants & Variables
const videoURL =
  "https://ia800909.us.archive.org/32/items/Detour/Detour_512kb.mp4";
const staticImageURL = "https://assets.codepen.io/8841541/static.gif";
const NUMBER_OF_CHANNELS = 13;
const VOLUME_LEVELS = 10;

let rewindInterval = null;
let movieTime = 0;
let rewindSpeed = 1;
let currentVolume = 1;

// Helpers

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
 * Gets the current power status of the TV and VCR
 * @returns 
 */
const getCurrentStatus = () => {
  return {
    tvIsOn: document.querySelector(".crt__glass--on"),
    vcrIsOn: document.querySelector(".powerbutton__light--on"),
    carriageIsClosed: document.querySelector(".carriage--close")
  };
};

// Main Functions

/**
 * Update the channel and TV image based on the channel number.
 */
const updateWhatsOn = () => {
  const { tvIsOn, vcrIsOn, carriageIsClosed } = getCurrentStatus();
  const currentChannel = parseInt(displayChannelNum.innerText.trim());

  if (tvIsOn) {
    if (currentChannel === 3) {
      if (vcrIsOn) {
        if (carriageIsClosed) {
          console.log("---> tvOn, channe3, vcrOn, carriageClosed");

          removeClass(tvChannelThree, "crt__image--hidden");
          addClass(tvWrongChannel, "crt__image--hidden");
          tvChannelThree.volume = currentVolume;
        } else {
          console.log("----> tvOn, channel 3, vcrOn, carriageOpen");
          addClass(tvChannelThree, "crt__image--hidden");
          removeClass(tvWrongChannel, "crt__image--hidden");
          addClass(tvWrongChannel, "crt__image--on");
          removeClass(tvWrongChannel, "crt__image--static");
        }
      } else {
        console.log("----> tvOn, channel 3, vcrOFF, carriageOpen");

        addClass(tvChannelThree, "crt__image--hidden");
        removeClass(tvWrongChannel, "crt__image--hidden");
        removeClass(tvWrongChannel, "crt__image--on");
        addClass(tvWrongChannel, "crt__image--static");
        tvChannelThree.volume = 0;
      }
    } else {
      console.log("----> tvOn, channel not 3");
      addClass(tvChannelThree, "crt__image--hidden");
      removeClass(tvWrongChannel, "crt__image--hidden");
      removeClass(tvWrongChannel, "crt__image--on");
      addClass(tvWrongChannel, "crt__image--static");
      tvChannelThree.volume = 0;
    }
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
    tvChannelThree.pause();
    removeClass(vcrPowerButtonLight, "powerbutton__light--on");
    removeClass(vcrDisplayText, "displaytext--on");
  }
  updateWhatsOn();
};

/**
 * Start rewinding the video at 2x speed
 */
const startRewind = () => {
  tvChannelThree.pause();
  clearInterval(rewindInterval);
  rewindInterval = setInterval(() => {
    tvChannelThree.currentTime = Math.max(
      tvChannelThree.currentTime - 0.1 * rewindSpeed,
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
  console.log("close movietime", movieTime);

  removeClass(vcrTapeCarriage, "carriage--open");
  void vcrTapeCarriage.offsetWidth; // Force reflow
  addClass(vcrTapeCarriage, "carriage--close");
  tvChannelThree.setAttribute("src", videoURL);
  tvChannelThree.currentTime = movieTime;
  tvChannelThree.load();
  updateWhatsOn();
};

/**
 * Open/eject the tape carriage
 */
const ejectCarriage = () => {
  const { vcrIsOn } = getCurrentStatus();
  if (vcrIsOn) {
    movieTime = tvChannelThree.currentTime;
    console.log("eject movietime", movieTime);
    removeClass(vcrTapeCarriage, "carriage--close");
    console.log("eject movietime", movieTime);
    void vcrTapeCarriage.offsetWidth; // Force reflow
    console.log("eject movietime", movieTime);
    tvChannelThree.setAttribute("src", "");
    console.log("eject movietime", movieTime);
    tvChannelThree.load();
    console.log("eject movietime", movieTime);
    addClass(vcrTapeCarriage, "carriage--open");
    console.log("eject movietime", movieTime);
    updateWhatsOn();
  }
};

/**
 * Turn the TV on or off
 */
const tvPowerSwitch = () => {
  const { tvIsOn } = getCurrentStatus();

  if (tvIsOn) {
    removeClass(tvGlass, "crt__glass--on");
    removeClass(displayChannelNum, "channel--on");
    addClass(tvWrongChannel, "crt__image--hidden");
    addClass(tvChannelThree, "crt__image--hidden");
  } else {
    addClass(tvGlass, "crt__glass--on");
    updateWhatsOn();
    channelDisplay();
  }
};

/**
 * Display the channel number briefly
 */
const channelDisplay = () => {
  addClass(displayChannelNum, "channel--on");
  setTimeout(() => {
    removeClass(displayChannelNum, "channel--on");
  }, 3000);
};

/**
 * Increment the channel
 */
const channelUp = () => {
  const { tvIsOn } = getCurrentStatus();
  if (tvIsOn) {
    let currentChannel = parseInt(displayChannelNum.innerText.trim());
    currentChannel = (currentChannel % NUMBER_OF_CHANNELS) + 1;
    displayChannelNum.innerText = String(currentChannel).padStart(2, "0");
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
    let currentChannel = parseInt(displayChannelNum.innerText.trim());
    currentChannel =
      ((currentChannel - 2 + NUMBER_OF_CHANNELS) % NUMBER_OF_CHANNELS) + 1;
    displayChannelNum.innerText = String(currentChannel).padStart(2, "0");
    updateWhatsOn();
    channelDisplay();
  }
};

// Event Listeners
// VCR
// VCR Power
vcrPowerButton.addEventListener("click", vcrPowerSwitch);

// VCR Carriage Open or Close
vcrTapeCarriage.addEventListener("click", closeCarriage);
vcrEjectButton.addEventListener("click", ejectCarriage);

// Play Button
vcrPlayButton.addEventListener("click", () => {
  const { tvIsOn, vcrIsOn } = getCurrentStatus();
  if (tvChannelThree.getAttribute("src") === videoURL && vcrIsOn) {
    tvChannelThree.play();
    if (!tvIsOn) {
      tvChannelThree.volume = 0;
    }
    if (tvChannelThree.playbackRate !== 1) {
      tvChannelThree.playbackRate = 1;
    }
    if (rewindInterval) {
      stopRewind();
    }
  }
});

// Fast Forward Button
vcrFfButton.addEventListener("click", () => {
  const { vcrIsOn } = getCurrentStatus();
  if (tvChannelThree.getAttribute("src") === videoURL && vcrIsOn) {
    if (tvChannelThree.paused || rewindInterval) {
      tvChannelThree.playbackRate = 1;
      tvChannelThree.play();
      if (rewindInterval) {
        stopRewind();
      }
    }

    switch (tvChannelThree.playbackRate) {
      case 1:
        tvChannelThree.playbackRate = 2;
        break;
      case 2:
        tvChannelThree.playbackRate = 4;
        break;
      default:
        // Do nothing for any other playbackRate
        break;
    }
  }
});

// Rewind Button
vcrRewButton.addEventListener("click", () => {
  if (tvChannelThree.getAttribute("src") === videoURL) {
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
  if (tvChannelThree.getAttribute("src") === videoURL) {
    tvChannelThree.pause();
  }
});

// Pause Button
vcrPauseButton.addEventListener("click", () => {
  if (tvChannelThree.getAttribute("src") === videoURL) {
    tvChannelThree.pause();
  }
});

// Track the time of the video
tvChannelThree.addEventListener("timeupdate", () => {
  vcrDisplayText.innerText = formatTime(tvChannelThree.currentTime);
});

// TV
// TV Power
tvPowerButton.addEventListener("click", tvPowerSwitch);
// Change Channel
tvChannelUpButton.addEventListener("click", channelUp);
tvChannelDownButton.addEventListener("click", channelDown);
// Change Volume
tvVolumeUpButton.addEventListener("click", () => {
  const volume = tvChannelThree.volume;
  if (volume < 1) {
    tvChannelThree.volume += 1 / VOLUME_LEVELS;
    currentVolume = tvChannelThree.volume;
  }
});
tvVolumeDownButton.addEventListener("click", () => {
  const volume = tvChannelThree.volume;
  if (volume > 0) {
    tvChannelThree.volume -= 1 / VOLUME_LEVELS;
    currentVolume = tvChannelThree.volume;
  }
});
