// Channel Data
const channels = [
  {
    chan: "01",
    img: "https://assets.codepen.io/8841541/testpattern.png",
  },
  {
    chan: "02",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
  {
    chan: "03",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
  {
    chan: "04",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
  {
    chan: "05",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
  {
    chan: "06",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
  {
    chan: "07",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
  {
    chan: "08",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
  {
    chan: "09",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
  {
    chan: "10",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
  {
    chan: "11",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
  {
    chan: "12",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
  {
    chan: "13",
    img: "https://assets.codepen.io/8841541/static.gif",
  },
];

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

const tube = document.querySelector(".crt__image");
const picture = document.querySelector(".crt__screen");
const display = document.querySelector(".channel");

const tvPowerButton = document.querySelector(".button--power");
const tvChannelUpButton = document.querySelector(".button--channelup");
const tvChannelDownButton = document.querySelector(".button--channeldown");

// Functions
/**
 * Turn the VCR on or off
 * @param {HTMLElement} light
 * @param {HTMLElement} display
 */
const vcrPowerSwitch = (light, display) => {
  const vcrIsOn = document.querySelector(".powerbutton__light--on");
  if (!vcrIsOn) {
    light.classList.add("powerbutton__light--on");
    display.classList.add("displaytext--on");
  } else {
    light.classList.remove("powerbutton__light--on");
    display.classList.remove("displaytext--on");
  }
};

/**
 * Close the tape carriage
 * @param {HTMLElement} carriage - The tape carriage element
 */
const closeCarriage = (carriage) => {
  carriage.classList.remove("carriage--open");
  void carriage.offsetWidth; // Trigger reflow
  carriage.classList.add("carriage--close");
};

/**
 * Open the tape carriage
 * @param {HTMLElement} carriage - The tape carriage element
 */
const openCarriage = (carriage) => {
  carriage.classList.remove("carriage--close");
  void carriage.offsetWidth; // Trigger reflow
  carriage.classList.add("carriage--open");
};

/**
 * Toggle the tape carriage state
 * @param {HTMLElement} carriage - The tape carriage element
 */
const toggleCarriage = (carriage) => {
  if (carriage.classList.contains("carriage--close")) {
    openCarriage(carriage);
  } else {
    closeCarriage(carriage);
  }
};

/**
 * Turn the TV on or off
 * @param {HTMLElement} tube - The CRT image element
 * @param {HTMLElement} picture - The CRT screen element
 * @param {HTMLElement} display - The channel display element
 * @param {Array} channels - Array of channel objects
 */
const tvPowerSwitch = (tube, picture, display, channels) => {
  const tvIsOn = document.querySelector(".crt__image--on");
  if (tvIsOn) {
    tube.classList.remove("crt__image--on");
    picture.classList.remove("crt__screen--on");
    display.classList.remove("channel--on");
  } else {
    tube.classList.add("crt__image--on");
    picture.classList.add("crt__screen--on");
    channelDisplay(display);
  }
};

/**
 * Display the channel number briefly
 * @param {HTMLElement} display - The channel display element
 */
const channelDisplay = (display) => {
  display.classList.add("channel--on");
  setTimeout(() => {
    display.classList.remove("channel--on");
  }, 3000);
};

/**
 * Increment the channel
 * @param {Array} channels - Array of channel objects
 * @param {HTMLElement} tube - The CRT image element
 * @param {HTMLElement} display - The channel display element
 */
const channelUp = (channels, tube, display) => {
  const tvIsOn = document.querySelector(".crt__image--on");
  if (tvIsOn) {
    const currentChannel = display.innerText;
    const currentChannelIndex = channels.findIndex(
      (channel) => channel.chan === currentChannel
    );
    const nextChannelIndex =
      currentChannelIndex === channels.length - 1 ? 0 : currentChannelIndex + 1;
    display.innerText = channels[nextChannelIndex].chan;
    tube.style.backgroundImage = `url(${channels[nextChannelIndex].img})`;
    channelDisplay(display);
  }
};

/**
 * Decrement the channel
 * @param {Array} channels - Array of channel objects
 * @param {HTMLElement} tube - The CRT image element
 * @param {HTMLElement} display - The channel display element
 */
const channelDown = (channels, tube, display) => {
  const tvIsOn = document.querySelector(".crt__image--on");
  if (tvIsOn) {
    const currentChannel = display.innerText;
    const currentChannelIndex = channels.findIndex(
      (channel) => channel.chan === currentChannel
    );
    const nextChannelIndex =
      currentChannelIndex <= 0 ? channels.length - 1 : currentChannelIndex - 1;
    display.innerText = channels[nextChannelIndex].chan;
    tube.style.backgroundImage = `url(${channels[nextChannelIndex].img})`;
    channelDisplay(display);
  }
};

// Default
display.innerText = channels[0].chan;
tube.style.backgroundImage = `url(${channels[0].img})`;

// Event Listeners
// VCR Power
vcrPowerButton.addEventListener("click", () => {
  vcrPowerSwitch(vcrPowerButtonLight, vcrDisplayText);
});

// VCR Carriage Open or Close
vcrTapeCarriage.addEventListener("click", () => {
  closeCarriage(vcrTapeCarriage);
});

vcrEjectButton.addEventListener("click", () => {
  openCarriage(vcrTapeCarriage);
});

// TV Power
tvPowerButton.addEventListener("click", () => {
  tvPowerSwitch(tube, picture, display, channels);
});

// Channel Up
tvChannelUpButton.addEventListener("click", () => {
  channelUp(channels, tube, display);
});

// Channel Down
tvChannelDownButton.addEventListener("click", () => {
  channelDown(channels, tube, display);
});
