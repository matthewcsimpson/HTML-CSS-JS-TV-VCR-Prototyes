// Channel Data
const channels = [
  {
    chan: "01",
    img: "./assets/imgs/testpattern.png",
  },
  {
    chan: "02",
    img: "./assets/imgs/fountain.gif",
  },
  {
    chan: "03",
    img: "./assets/imgs/static.gif",
  },
  {
    chan: "04",
    img: "./assets/imgs/charlie.gif",
  },
  {
    chan: "05",
    img: "./assets/imgs/static.gif",
  },
  {
    chan: "06",
    img: "./assets/imgs/dawson.gif",
  },
  {
    chan: "07",
    img: "./assets/imgs/static.gif",
  },
  {
    chan: "08",
    img: "./assets/imgs/st.gif",
  },
  {
    chan: "09",
    img: "./assets/imgs/static.gif",
  },
  {
    chan: "10",
    img: "./assets/imgs/fellowkids.gif",
  },
  {
    chan: "11",
    img: "./assets/imgs/mal.gif",
  },
  {
    chan: "12",
    img: "./assets/imgs/homer.gif",
  },
];

// Selectors
const tube = document.querySelector(".crt__image");
const picture = document.querySelector(".crt__screen");
const display = document.querySelector(".channel");

const basePowerButton = document.querySelector(".base__button--power");
const remotePowerbutton = document.querySelector(
  ".remote__firstrowbutton--power"
);

const baseChannelUpButton = document.querySelector(".base__button--channelup");
const remoteChannelUpButton = document.querySelector(
  ".remote__functionbutton--channelup"
);

const baseChannelDownButton = document.querySelector(
  ".base__button--channeldown"
);
const remoteChannelDownButton = document.querySelector(
  ".remote__functionbutton--channeldown"
);

const numberButtons = document.querySelectorAll(".remote__number");
const displayButton = document.querySelector(
  ".remote__functionbutton--display"
);

// Functions
const channelDisplay = (display) => {
  display.classList.add("channel--on");
  setTimeout(() => {
    display.classList.remove("channel--on");
  }, 3000);
};

/**
 * Turn the TV on or off
 * @param {Element} tube - The CRT image element
 * @param {Element} picture - The CRT screen element
 * @param {Element} display - The channel display element
 */
const powerSwitch = (tube, picture, display, channels) => {
  const isOn = document.querySelector(".crt__image--on");
  if (isOn) {
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
 *
 * @param {Object} channels
 * @param {Element} tube
 * @param {Element} display
 */
const channelUp = (channels, tube, display) => {
  const isOn = document.querySelector(".crt__image--on");
  if (isOn) {
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
 *
 * @param {Object} channels
 * @param {Element} tube
 * @param {Element} display
 */
const channelDown = (channels, tube, display) => {
  const isOn = document.querySelector(".crt__image--on");

  if (isOn) {
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

/**
 * Select a channel directly.
 * If the channel does not exist, display the channel number + static
 * @param {Array} channels
 * @param {Element} tube
 * @param {Element} display
 * @param {Array} channelInput
 */
const channelSelect = (channels, tube, display, input) => {
  const channel = channels.find((channel) => channel.chan === input);
  if (channel) {
    display.innerText = channel.chan;
    tube.style.backgroundImage = `url(${channel.img})`;
    channelDisplay(display);
  } else {
    display.innerText = input;
    tube.style.backgroundImage = `url(./assets/imgs/static.gif)`;
    channelDisplay(display);
  }
};

// Default
const channelInput = [];
display.innerText = channels[0].chan;
tube.style.backgroundImage = `url(${channels[0].img})`;

// Event Listeners
// Power
basePowerButton.addEventListener("click", () => {
  powerSwitch(tube, picture, display, channels);
});
remotePowerbutton.addEventListener("click", () => {
  powerSwitch(tube, picture, display, channels);
});

// Channel Up
baseChannelUpButton.addEventListener("click", () => {
  channelUp(channels, tube, display);
});
remoteChannelUpButton.addEventListener("click", () => {
  channelUp(channels, tube, display);
});

// Channel Down
baseChannelDownButton.addEventListener("click", () => {
  channelDown(channels, tube, display);
});
remoteChannelDownButton.addEventListener("click", () => {
  channelDown(channels, tube, display);
});

// Number Buttons
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isOn = document.querySelector(".crt__image--on");
    if (isOn) {
      channelInput.push(button.innerText);
      if (channelInput.length === 2) {
        channelSelect(channels, tube, display, channelInput.join(""));
        channelInput.length = 0;
      }
    }
  });
});

displayButton.addEventListener("click", () => {
  channelDisplay(display);
});
