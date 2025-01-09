const SpeechRecognition =
  window.speechRecognition || window.webkitSpeechRecognition;
const weatherApi = "5aeb7a1274e9488a7d52d1e76afc53f3";
const userLocation = "DELHI";
const audio = new Audio("alarm.mp3");
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function wakeUpAtTime(minutes) {
  const timeInMilliseconds = minutes * 1000;
  console.log("hi");
  const wakeUp = () => {
    audio.play();
  };
  setTimeout(wakeUp, timeInMilliseconds);
}
function getTime(date = new Date()) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  let hour = hours % 12;
  if (hour === 0) {
    hour = 12;
  }
  const meridiem = hours >= 12 ? "PM" : "AM";

  return `${hour}:${minutes} ${meridiem}`;
}

const introduction =
  "Let me introduce myself: I'm Optimus Prime, your personal voice assistant, created by Sameer. I'm here to assist you with a variety of tasks as best as I can, 24 hours a day, 7 days a week. The system is now fully operational. Ask me anything.";

const greetingsResponse = "Hi sir, how can I help you?";
const imFine = "I'm fine, tell me what can i do for you.";
let date = new Date();
const currentDate = date.toLocaleDateString();
const time = getTime();
const commands = {
  "introduce yourself": introduction,
  "what is my name": "Your name is Sameer",
  "number of member in my family":
    "You have 5 members in your family, including you. there name is Shah Alam,anjuman ara,sahib,altaaf and last but not the least sameer",
  "check my mailbox":
    "I openend your mailbox sir I checked there is no new mail",
  "hello optimus": greetingsResponse,
  "hi optimus": greetingsResponse,
  "hi there": greetingsResponse,
  "hello there": greetingsResponse,
  "how are you": imFine,
  "who are you": introduction,
  "date today": "today's date is " + currentDate,
  "good ": "Thank you sir, please let me know if you have any questions.",
  "what's today's date": "today date is " + currentDate,
  "yes i am fine": "good to hear that!",
  "yeah i am fine": "good to hear that!",

  // skript starts here
  "turn off the alarm": `Okay sir , but its ${time} sir, time to wake up!`,
  "stop the alarm": `Okay sir , but its ${time} sir, time to wake up!`,
  // second line
  "no i do not want to wake up": "okay, i'm calling your father!",
  "no i don't want to wake up": "okay, i'm calling your father!",
  "don't disturb me": "okay, i'm calling your father!",
  // third line
  "don't do that": "then wake up, you have alot of work to do!",
  // fourth line
  "just give me 10 minutes": "no sir,i'm starting alarm again.",
  "just give me 10 more minutes": "no sir, i'm starting alarm again.",
  // 5th line
  "i'm waking up": "Good sir, lets start working",
  "i am waking up": "Good sir, lets start working",
  // 6th line
  "what time is it": `its ${time} sir`,
  // 8th line
  // -- ask about weather
  // 9th line
  "what's day today": `today is ${weekday[date.getDay()]} sir`,
  // 10th line
  "just give me 5 minutes": "okay sir, i'm waiting for you",
  "i'll be back soon": "okay sir, i'm waiting for you",
  // 11th line
  "i am back": "Good to see you sir. What are the plans for today?",
  "what i was doing last night":
    "Sir, I noticed you were solving some math problems last night. You even fell asleep while doing an integration. Are you alright?",
  // 9th line
  // -- check mail box
  // -- check facebook
  // 10th line
  "going to do some exercise and i want you to take a break":
    "Ok sir im going to take a nap",
  "going to do some exercise i want you to take a break":
    "Ok sir im going to take a nap",
};

const checkCommands = {
  mailbox: ["https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox", 7],
  facebook: ["https://www.facebook.com/", 0],
};

if (SpeechRecognition) {
  const listener = new SpeechRecognition();

  listener.continuos = true;

  listener.onresult = (e) => {
    const index = e.resultIndex;
    let transcript = e.results[index][0].transcript;
    transcript = transcript.toLowerCase();
    console.log(transcript);

    if (transcript.includes("open")) {
      const array = transcript.split(" ");
      const execute = array[array.indexOf("open") + 1];
      speak(`opening ${execute} sir`);
      window.open(`https://www.${execute}.com/`);
    } else if (transcript.includes("check my")) {
      const array = transcript.split(" ");
      const execute = array[array.indexOf("my") + 1];
      if (execute in checkCommands) {
        const newWindow = checkCommands[execute][0];
        window.open(newWindow);
        const notifications = checkCommands[execute][1];
        speak(
          `opening your ${execute} profile. checking your notifications. ${
            notifications > 0
              ? `you have ${notifications} messages on your ${execute} sir.`
              : "you dont have any notification sir."
          }`
        );
      } else {
        speak("Cannot Understand what you say");
      }
    } else if (transcript.includes("weather")) {
      const location = transcript.split("weather in ")[1] || userLocation;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApi}&units=metric`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const weather = `The weather in ${location} is currently ${data.weather[0].main}, with a temperature of ${data.main.temp}°C.`;
          speak(weather);
        })
        .catch((error) => {
          speak("Sorry, I couldn't get the weather information.");
        });
    } else {
      for (const command in commands) {
        if (transcript.includes(command.toLocaleLowerCase())) {
          if (
            command === "just give me 10 minutes" ||
            command === "just give me 10 more minutes"
          ) {
            wakeUpAtTime(0.9);
          }
          speak(commands[command]);
          break;
        }
      }
      speak("Cannot Understand what you say");
    }
  };

  function start(params) {
    listener.start();
    if (!audio.paused) {
      setTimeout(() => {
        audio.pause();
      }, 3000);
    }
    // setTimeout(() => {
    //   speak(introduction);
    // }, 1000);
  }
  function stop(params) {
    listener.stop();
  }
} else {
  alert(
    'Your browser does not support speech recognition Please use "Chrome","Microsoft Edge" or "Opera'
  );
}

function speak(text) {
  const speaker = window.speechSynthesis;

  if (!speaker.speaking) {
    const speech = new SpeechSynthesisUtterance();
    const voices = speaker.getVoices();
    speech.voice = voices[4];
    speech.text = text;
    speech.pitch = 1;
    speech.rate = 1;
    speech.volume = 1.4;

    speaker.speak(speech);

    let r = setInterval(() => {
      console.log(speechSynthesis.speaking);
      if (!speechSynthesis.speaking) {
        clearInterval(r);
      }
    }, 14000);
  }
}

window.onload = () => {
  speak("  ");
};
