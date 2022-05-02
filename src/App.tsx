import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Modal, ModalBody } from 'react-bootstrap';
import styled, { Keyframes, keyframes, StyledComponent } from 'styled-components';
import { flipInX, fadeInRight } from 'react-animations';
import Data from './constants/Data';
import { Order, InitialDate } from './constants/Order';
import PointlessWords from './constants/PointlessWords';
import './styles.css';

// used to style the guesses for being correct/close/incorrect
interface InputStyle{
  backgroundColor?: string;
  borderRadius?: number;
  paddingTop?: number;
}

// https://javascript.info/cookie#getcookie-name
function getCookie(name: string) {
  const matches : RegExpMatchArray | null = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`
    )
  );
  return matches ? decodeURIComponent(matches[1]) : "";
}

// all the possible answers, sorted alphabetically
const filmdata: Array<string> = Object.keys(Data);
filmdata.sort();

// need width and height for responsive design
const width : number = window.innerWidth;
const height : number = window.innerHeight;
// if we're on a phone, we need to use different widths than if we're on a computer
const relevantWidth : number = width > height ? width / 3 : width * 0.9;
const relevantGraphWidth : number = width > height ? width / 5 : width * 0.75;
const relevantPadding : number = width > height ? relevantWidth : width * 0.05;
// height of sections of puzzle remains the same proportion irrespective of platform
const spotHeight : number = height * 0.13;

// the current time
const today: Date = new Date();
// keeping a string date to compare with the one stored in the cookie.
const date = `${
  today.getMonth() + 1
}/${today.getDate()}/${today.getFullYear()}`;

// initializing a new date object and setting it to midnight tomorrow
const tomorrow: Date = new Date();
tomorrow.setDate(today.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);
// console.log(tomorrow.getTime(), today.getTime());

// determining the number of days from the first date we started using this ordering array
const firstDay: Date = new Date(InitialDate);
const fromFirst: number = Math.floor(
  (today.getTime() - firstDay.getTime()) / (1000 * 3600 * 24)
);
// console.log(today, firstDay)

// animations
const flipInAnimation : Keyframes = keyframes`${flipInX}`;
const fadeInRightAnimation : Keyframes = keyframes`${fadeInRight}`;

// top level div for the puzzle itself
const Puzzle : StyledComponent<"div", any, {}, never> = styled.div`
  width: ${relevantWidth}px;
  box-sizing: content-box;
  margin-left: ${relevantPadding}px;
`;

// the buttons that the user guesses with
const HoverButton : StyledComponent<"button", any, {}, never> = styled.button`
  width: ${relevantWidth}px;
  margin-left: ${relevantPadding}px;
  border-radius: ${height * 0.02}px;
  height: ${height * 0.04}px;
  overflow: hidden;
  position: absolute;
  border-width: 1px;
  border-color: black;
  z-index: 7;
  color: black;
  text-align: left;
`;

// the text in the hover buttons
const HoverText : StyledComponent<"span", any, {}, never> = styled.span`
  font-size: ${height / 40}px;
`;

// a bar that displays instead of an actor
const Hider : StyledComponent<"div", any, {}, never> = styled.div`
  height: ${spotHeight * 0.45}px;
  border-radius: ${height * 0.02}px;
  animation: 1s ${fadeInRightAnimation};
`;

// take up the whole page
const TopLevel : StyledComponent<"div", any, {}, never> = styled.div`
  height: ${height}px;
  padding: auto;
`;

// text input
const Input : StyledComponent<"input", any, {}, never> = styled.input`
  border-radius: ${height * 0.02}px;
  border-width: 1px;
  border-color: black;
  border-style: solid;
  height: ${spotHeight * 0.45}px;
  font-size: ${height / 40}px;
  box-sizing: border-box;
`;

// the text that replaces the input once it is used
const AboveInput : StyledComponent<"div", any, {}, never> = styled.div`
  border-radius: ${height * 0.02}px;
  border-width: 1px;
  border-color: black;
  border-style: solid;
  height: ${spotHeight * 0.45}px;
  font-size: ${height / 40}px;
`;

// one of the six actor-input pairs
const Spot : StyledComponent<"div", any, {}, never> = styled.div`
  margin-top: 0;
  padding-bottom: ${spotHeight * 0.1}px;
  height: ${spotHeight}px;
  overflow: hidden;
`;

// the name of an actor
const Actor : StyledComponent<"div", any, {}, never> = styled.div`
  padding-top: ${height / 200}px;
  height: ${spotHeight * 0.45}px;
  font-size: ${height / 40}px;
  overflow: hidden;
  border-width: 1px;
  border-color: black;
  border-radius: ${height / 50}px;
  text-align: center;
  border-style: solid;
  animation: 1s ${flipInAnimation};
`;

// navbar with media tag for maximum size
const MyNavbar : StyledComponent<"div", any, {}, never> = styled.div`
  height: ${height * 0.08}px;
  margin-bottom: ${height * 0.02}px;
  @media screen and (max-width: 700px) {
    height: ${width * 0.08}px;
    margin-bottom: ${height * 0.1 - width * 0.08}px;
  }
  top: 0;
  width: 100%;
`;

// navbar text again with media tag
const NavbarText : StyledComponent<"span", any, {}, never> = styled.span`
  cursor: pointer;
  font-size: ${width * 0.02}px;
  position: absolute;
  padding-top: ${height * 0.02}px;
  overflow: hidden;
  width: ${width * 0.2}px;
  text-align: center;
  @media screen and (min-width: 1000px) {
    font-size: 20px;
  }
`;

// the S T A R D L E logo
const Logo : StyledComponent<"span", any, {}, never> = styled.span`
  color: rgba(127, 127, 127, 0.9);
  font-size: ${width / 30}px;
  cursor: auto;
  position: absolute;
  text-align: center;
  width: ${width * 0.2}px;
  display: inline-block;
  margin-top: ${height * 0.01}px;
  @media screen and (min-width: 1000px) {
    font-size: 33px;
  }
`;

// the title of a stat
const StatTitle : StyledComponent<"div", any, {}, never> = styled.div`
  font-size: ${height / 50}px;
  text-align: center;
`;

// a stat (streak, winrate, etc.)
const Stat : StyledComponent<"div", any, {}, never> = styled.div`
  font-size: ${height / 30}px;
  text-align: center;
`;

// the possible locations of the hovering buttons
const hoverLocations : {top: number}[] = [
  { top: height * 0.21 },
  { top: height * 0.25 },
  { top: height * 0.29 },
  { top: height * 0.34 },
  { top: height * 0.38 },
  { top: height * 0.42 },
  { top: height * 0.47 },
  { top: height * 0.51 },
  { top: height * 0.55 },
  { top: height * 0.6 },
  { top: height * 0.64 },
  { top: height * 0.68 },
  { top: height * 0.73 },
  { top: height * 0.77 },
  { top: height * 0.81 },
  { top: height * 0.86 },
  { top: height * 0.9 },
  { top: height * 0.94 },
];

// reset cookie for debugging
// document.cookie = "data="

// the data we use from the cookie!
let dataCookie : string = getCookie('data');
// console.log(dataCookie);
if (!dataCookie || dataCookie.length < 1) {
  // 1 guess solves, 2, 3, 4, 5, 6, miss, streak, has played today, guess 1, 2, 3, 4, 5, 6, has seen rules, dark mode, date last played, maxstreak
  document.cookie = `data=${encodeURIComponent(
    '0//0//0//0//0//0//0//0//false//_//_//_//_//_//_//false//false//1/2/2003//0'
  )}; expires=Tue, 19 Jan 2038 03:14:07 GMT;`;
  dataCookie =
    '0//0//0//0//0//0//0//0//false//_//_//_//_//_//_//false//false//1/2/2003//0';
}

// how long til midnight tomorrow
const timeLeft : number = tomorrow.getTime() - today.getTime();

// splitting our cookie data into an array
const outsideData : Array<string> = dataCookie.split('//');
// has our user seen the rules yet? if no, show it to them
const outsideRules : boolean = outsideData[15] === 'false';
// if the user has not seen the rules, they will after having loaded the site, so set this bool to true
if (outsideRules === true) {
  outsideData[15] = 'true';
  document.cookie = `data=${encodeURIComponent(
    outsideData.join('//')
  )}; expires=Tue, 19 Jan 2038 03:14:07 GMT;`;
}
// initial false value for typing purposes, never changed
const initialVisible: boolean = false;
// has our user played today?
const todaySolved : boolean = outsideData[17] === date;
// if they have not, the cookie will have stored yesterday's guesses, remove them
if (!todaySolved) {
  for (let i : number = 9; i <= 14; i += 1) {
    outsideData[i] = '_';
  }
  document.cookie = `data=${encodeURIComponent(
    outsideData.join('//')
  )}; expires=Tue, 19 Jan 2038 03:14:07 GMT;`;
}

// most commonly used number of attempts to solve, stored for graph width in stats modal
const outsideMaxAttempts : number = Math.max(
  1,
  Math.max(
    parseInt(outsideData[0]),
    parseInt(outsideData[1]),
    parseInt(outsideData[2]),
    parseInt(outsideData[3]),
    parseInt(outsideData[4]),
    parseInt(outsideData[5])
  )
);
// how many times the user has played the game
const outsidePlayed : number =
  parseInt(outsideData[0]) +
  parseInt(outsideData[1]) +
  parseInt(outsideData[2]) +
  parseInt(outsideData[3]) +
  parseInt(outsideData[4]) +
  parseInt(outsideData[5]) +
  parseInt(outsideData[6]);
// how many times the user has won the game, so, plays minus losses
const outsideWon : number = outsidePlayed - parseInt(outsideData[6]);
// how many consecutive wins the user has
const outsideStreak : number = parseInt(outsideData[7]);
// the most consecutive wins the user has ever had
const outsideMaxStreak : number = parseInt(outsideData[18]);

export default function App() {
  // keeping track of time for the countdown timer
  const [secondsLeft, setSecondsLeft] : [number, Dispatch<SetStateAction<number>>] = useState(
    Math.floor(timeLeft / 1000) % 60
  );
  const [minutesLeft, setMinutesLeft] : [number, Dispatch<SetStateAction<number>>] = useState(
    Math.floor(timeLeft / (1000 * 60)) % 60
  );
  const [hoursLeft, setHoursLeft] : [number, Dispatch<SetStateAction<number>>] = useState(
    Math.floor(timeLeft / (1000 * 60 * 60)) % 24
  );

  // ticking down every second
  useEffect(() => {
    const timer : NodeJS.Timeout = setTimeout(() => {
      if (secondsLeft === 0) {
        setSecondsLeft(60);
        if (minutesLeft === 0) {
          setMinutesLeft(60);
          setHoursLeft(hoursLeft - 1);
        } else {
          setMinutesLeft(minutesLeft - 1);
        }
      } else {
        setSecondsLeft(secondsLeft - 1);
      }
    }, 1000);
    return () => clearTimeout(timer);
  });

  // converts number from 0 - 60 to the appropriate amount of seconds/minutes
  function getstrTimeLeft(time: number) {
    if (time === 60) {
      return '00';
    }
    if (time < 10) {
      return `0${time}`;
    }

    return time;
  }

  // using all these as middlemen to set our state objects rather than do it through the array itself
  let holdoverdata : string[] = filmdata;
  let peekGuessStyles : object[];
  let peekBools : boolean[];
  let peekGuessSpans : string[];
  let peekHoverSpans : string[];
  let peekHoverDisplays : boolean[];
  let peekCurHoverLocations : {top : number}[];

  // the correct answer
  const [correct] : [string[], Dispatch<SetStateAction<string[]>>] = useState(Data[filmdata[Order[fromFirst]]]);

  // our stats calculated earlier, as well as successrate
  const [maxAttempts, setMaxAttempts] : [number, Dispatch<SetStateAction<number>>] = useState(outsideMaxAttempts);
  const [played, setPlayed] : [number, Dispatch<SetStateAction<number>>] = useState(outsidePlayed);
  const [streak, setStreak] : [number, Dispatch<SetStateAction<number>>] = useState(outsideStreak);
  const [maxStreak, setMaxStreak] : [number, Dispatch<SetStateAction<number>>] = useState(outsideMaxStreak);
  const [successRate, setSuccessRate] : [number, Dispatch<SetStateAction<number>>] = useState(
    outsideWon / Math.max(1, played)
  );
  // console.log(successRate)

  // date from the cookie
  const [data] : [string[], Dispatch<SetStateAction<string[]>>] = useState(outsideData);
  // whether or not the puzzle is playable depends on if it has been played today, which we track here
  const [solved, setSolved] : [boolean, Dispatch<SetStateAction<boolean>>] = useState(todaySolved);

  // which of the six spots is currently being used for input
  const [active, setActive] : [number, Dispatch<SetStateAction<number>>] = useState(0);
  // can we see the rules/stats/about modal?
  const [rulesVisible, setRulesVisible] : [boolean, Dispatch<SetStateAction<boolean>>] = useState(outsideRules);
  const [statsVisible, setStatsVisible] : [boolean, Dispatch<SetStateAction<boolean>>] = useState(initialVisible);
  const [aboutVisible, setAboutVisible] : [boolean, Dispatch<SetStateAction<boolean>>] = useState(initialVisible);

  // are we in dark mode?
  const [darkMode, setDarkMode] : [boolean, Dispatch<SetStateAction<boolean>>] = useState(data[16] === 'true');
  // if we are not we have to use classnames to enforce the background color on the body
  if (!darkMode) {
    document.body.classList.add('white');
  }

  // where can we input text right now?
  const [bools, setBools] : [boolean[], Dispatch<SetStateAction<boolean[]>>] = useState(
    solved === false
      ? [true, false, false, false, false, false]
      : [false, false, false, false, false, false]
  );

  // these are the style options for a guess being correct, close, or incorrect.
  const green : InputStyle = {
    backgroundColor: '#77D353',
    borderRadius: height / 50,
    paddingTop: height / 200,
  };
  const yellow : InputStyle = {
    backgroundColor: '#FFD185',
    borderRadius: height / 50,
    paddingTop: height / 200,
  };
  const gray : InputStyle = {
    backgroundColor: 'lightgray',
    borderRadius: height / 50,
    paddingTop: height / 200,
  };
  const blank : InputStyle = {};

  // things i don't want to display
  const none : {display: string} = {
    display: 'none',
  };

  // function to check if a guess is close to the correct answer, provided it isn't correct
  function yellowCheck(ourGuess: string) {
    // sanitizing both the guess and the correct answer
    const strGuess : string = ourGuess.replace(/[^a-z0-9 ]/gi, '');
    const correctSans : string = correct[0].replace(/[^a-z0-9 ]/gi, '');
    // making lists of words! wordsguess is a set so we can check if it has a word slightly faster
    const wordsGuess : Set<string> = new Set(strGuess.split(' '));
    const wordset : string[] = correctSans.split(' ');
    let flag : boolean = false;
    wordset.forEach((item) => {
      if (!PointlessWords.has(item) && wordsGuess.has(item)) {
        // if you return in a forEach you just break the loop, so I'm using a flag outside the function.
        flag = true;
      }
    });
    return flag;
  }

  // a relic from an early version, reason for its presence in textHandler
  const [olddiv, setOlddiv] : [string, Dispatch<SetStateAction<string>>] = useState('');
  // the actors we're displaying
  const [actors, setActors] : [string[], Dispatch<SetStateAction<string[]>>] = useState(
    solved === false
      ? [correct[1], '_', '_', '_', '_', '_']
      : [correct[1], correct[2], correct[3], correct[4], correct[5], correct[6]]
  );
  // the user's guesses for the day
  const [guessSpans, setGuessSpans] : [string[], Dispatch<SetStateAction<string[]>>] = useState(
    solved === false
      ? ['', '', '', '', '', '']
      : [data[9], data[10], data[11], data[12], data[13], data[14]]
  );
  // the styles on the boxes that display the user's guess after they have made it
  const [guessStyles, setGuessStyles] : [InputStyle[], Dispatch<SetStateAction<InputStyle[]>>] = useState(
    solved === false
      ? [blank, blank, blank, blank, blank, blank]
      : [
          (() => {
            // writing and calling lambdas so that we may avoid having nested ternary expressions, which eslint does not like
            if (data[9].length > 1) {
              if (data[9] === correct[0]) {
                return green;
              }
              if (yellowCheck(data[9])) {
                return yellow;
              }
              return gray;
            }
            return blank;
          }).call(undefined),
          (() => {
            if (data[10].length > 1) {
              if (data[10] === correct[0]) {
                return green;
              }
              if (yellowCheck(data[10])) {
                return yellow;
              }
              return gray;
            }
            return blank;
          }).call(undefined),
          (() => {
            if (data[11].length > 1) {
              if (data[11] === correct[0]) {
                return green;
              }
              if (yellowCheck(data[11])) {
                return yellow;
              }
              return gray;
            }
            return blank;
          }).call(undefined),
          (() => {
            if (data[12].length > 1) {
              if (data[12] === correct[0]) {
                return green;
              }
              if (yellowCheck(data[12])) {
                return yellow;
              }
              return gray;
            }
            return blank;
          }).call(undefined),
          (() => {
            if (data[13].length > 1) {
              if (data[13] === correct[0]) {
                return green;
              }
              if (yellowCheck(data[13])) {
                return yellow;
              }
              return gray;
            }
            return blank;
          }).call(undefined),
          (() => {
            if (data[14].length > 1) {
              if (data[14] === correct[0]) {
                return green;
              }
              if (yellowCheck(data[14])) {
                return yellow;
              }
              return gray;
            }
            return blank;
          }).call(undefined),
        ]
  );

  // the text in the spans in the hover buttons
  const [hoverSpans, setHoverSpans]  : [string[], Dispatch<SetStateAction<string[]>>] = useState(['', '', '']);
  // whether or not a hover button is currently being displayed
  const [hoverDisplays, setHoverDisplays]  : [boolean[], Dispatch<SetStateAction<boolean[]>>] = 
    useState([initialVisible, initialVisible, initialVisible]);
  // where the hover buttons currently are
  const [curHoverLocations, setCurHoverLocations]  : [{top : number}[], Dispatch<SetStateAction<{top : number}[]>>] = useState([
    hoverLocations[0],
    hoverLocations[1],
    hoverLocations[2],
  ]);

  // shows the suggested possible guess using the user's text
  function textHandler(pretext: string, column: number) {
    // sanitized
    const text : string = pretext.replace(/[^a-z0-9 ]/gi, '');
    // the data displayed in each box
    const newData : string[] = [];
    // if the previous suggestions still work use them.
    for (let i : number = 0; i < holdoverdata.length; i += 1) {
      if (holdoverdata[i].includes(text.toLowerCase())) {
        newData.push(holdoverdata[i]);
      }
    }

    // if this isn't here the textbox updates are way too slow. not sure why. i think it's similar to how useEffect works, but I don't know.
    setOlddiv(text);

    holdoverdata = newData;
    // setting the hover texts and display props to the appropriate values
    peekHoverSpans = hoverSpans;
    peekHoverDisplays = hoverDisplays;
    // if there is no text, hide all of the hover buttons
    if (text.length === 0) {
      for (
        let i : number = column * 3;
        i < Math.min((column + 1) * 3, column * 3 + newData.length);
        i += 1
      ) {
        peekHoverSpans[i % 3] = '';
        peekHoverDisplays[i % 3] = false;
      }
      holdoverdata = filmdata;
    } else {
      for (let i : number = column * 3; i < (column + 1) * 3; i += 1) {
        if (i < column * 3 + newData.length) {
          [peekHoverSpans[i % 3]] = Data[newData[i - column * 3]];
          peekHoverDisplays[i % 3] = true;
        } else {
          peekHoverSpans[i % 3] = '';
          peekHoverDisplays[i % 3] = false;
        }
      }
    }
    // setting
    setHoverSpans(peekHoverSpans);
    setHoverDisplays(peekHoverDisplays);
  }

  // guess function takes in the current location, of the 18 possible, where the hover button clicked is
  function guess(box: number) {
    if (box > 17) {
      // this will break the page if allowed to run so we abort it
      return;
    }
    // which of the six spots are we in?
    let section : number = Math.floor(box / 3);
    // we set active to 1 + current value since a guess deactivates a section
    setActive(active + 1);
    // recording this guess in the cookie
    data[section + 9] = hoverSpans[box % 3];
    // setting the display text as the appropriate button text
    peekGuessSpans = guessSpans;
    peekGuessSpans[section] = hoverSpans[box % 3];
    setGuessSpans(peekGuessSpans);
    // if the guess is correct end the game
    if (hoverSpans[box % 3] === correct[0]) {
      // we solved it
      setSolved(true);
      // record how many guesses this took
      data[section] = (parseInt(data[section]) + 1).toString();
      // if we have a new record for most attempts with X guesses record that
      if (parseInt(data[section]) > maxAttempts) {
        setMaxAttempts(maxAttempts + 1);
      }
      // we have played today
      data[8] = 'true';
      // add 1 to streak
      data[7] = (parseInt(data[7]) + 1).toString();
      // record max streak if applicable
      if (parseInt(data[7]) > maxStreak) {
        setMaxStreak(parseInt(data[7]));
        data[18] = data[7];
      }
      // set these things for the stat modal
      setStreak(streak + 1);
      setPlayed(played + 1);
      // record last date played
      data[17] = date;
      // finally encode in the cookie
      document.cookie = `data=${encodeURIComponent(
        data.join('//')
      )}; expires=Tue, 19 Jan 2038 03:14:07 GMT;`;
      // set success rate for modal
      setSuccessRate((outsideWon + 1) / (played + 1));
      // set the displayed text to green
      peekGuessStyles = guessStyles;
      peekGuessStyles[section] = green;
      setGuessStyles(peekGuessStyles);
      // set all bools to false so no input can be made
      peekBools = bools;
      for (let i : number = 0; i < peekBools.length; i += 1) {
        peekBools[i] = false;
      }
      setBools(peekBools);
      // hide all the hover buttons
      textHandler('', section);
      // show all the actors
      const peekactors : string[] = actors;
      while (section < correct.length - 1) {
        peekactors[section + 1] = correct[section + 2];
        section += 1;
      }
      setActors(peekactors);
      setTimeout(() => {
        // we're about to show the stats modal so we need to make sure the timer is set to the right value
        const curTimeLeft : number = tomorrow.getTime() - new Date().getTime();
        setSecondsLeft(Math.floor(curTimeLeft / 1000) % 60);
        setMinutesLeft(Math.floor(curTimeLeft / (1000 * 60)) % 60);
        setHoursLeft(Math.floor(curTimeLeft / (1000 * 60 * 60)) % 24);
        setStatsVisible(true);
      }, 1000);
      return;
    }
    // otherwise we take our current word and test for closeness
    const curWord : string = hoverSpans[box % 3];
    textHandler('', section);
    // here is the test
    const yellowResult : boolean = yellowCheck(curWord);
    if (yellowResult) {
      // if it is close, set the display box to yellow
      peekGuessStyles = guessStyles;
      peekGuessStyles[section] = yellow;
      setGuessStyles(peekGuessStyles);
    } else {
      // otherwise set it to gray
      peekGuessStyles = guessStyles;
      peekGuessStyles[section] = gray;
      setGuessStyles(peekGuessStyles);
    }

    // deny input to this section
    peekBools = bools;
    peekBools[section] = false;

    // set the hover buttons to appropriate locations
    peekCurHoverLocations = curHoverLocations;
    peekCurHoverLocations[0] = hoverLocations[(section + 1) * 3];
    peekCurHoverLocations[1] = hoverLocations[(section + 1) * 3 + 1];
    peekCurHoverLocations[2] = hoverLocations[(section + 1) * 3 + 2];
    setCurHoverLocations(peekCurHoverLocations);
    if (box < 15) {
      // if we have more to do show the next actor
      peekBools[section + 1] = true;
      const peekactors : string[] = actors;
      peekactors[section + 1] = correct[section + 2];
      setActors(peekactors);
      // console.log(actors);
    } else {
      // if not we lost, solved is true
      setSolved(true);
      // record that we missed
      data[6] = (parseInt(data[6]) + 1).toString();
      // set streak to 0
      data[7] = '0';
      setStreak(0);
      // similar as before
      setPlayed(played + 1);
      data[17] = date;
      document.cookie = `data=${encodeURIComponent(
        data.join('//')
      )}; expires=Tue, 19 Jan 2038 03:14:07 GMT;`;
      setSuccessRate(outsideWon / (played + 1));
      setTimeout(() => {
        const curTimeLeft : number = tomorrow.getTime() - new Date().getTime();
        setSecondsLeft(Math.floor(curTimeLeft / 1000) % 60);
        setMinutesLeft(Math.floor(curTimeLeft / (1000 * 60)) % 60);
        setHoursLeft(Math.floor(curTimeLeft / (1000 * 60 * 60)) % 24);
        setStatsVisible(true);
      }, 1000);
    }
    setBools(peekBools);
  }

  return (
    <TopLevel>
      <Modal
        show={rulesVisible}
        onHide={() => {
          setRulesVisible(false);
        }}
      >
        <ModalBody className={darkMode ? 'darklv5' : 'lightcolors'}>
          <div className={`modalbody ${darkMode ? 'darklv5' : 'lightcolors'}`}>
            <div
              className={`${
                darkMode ? 'darklv5' : 'lightcolors'
              } basictext rulestext bold`}
            >
              HOW TO PLAY
            </div>
            <div
              className={`${
                darkMode ? 'darklv5' : 'lightcolors'
              } basictext rulestext`}
            >
              Guess the <span className="modallogo">S T A R D L E</span> in six
              tries.
            </div>
            <div
              className={`${
                darkMode ? 'darklv5' : 'lightcolors'
              } basictext rulestext`}
            >
              Enter your guesses into the boxes below the actors.
            </div>
            <Actor
              className={`${darkMode ? 'darklv1' : 'lightcolors'} modalactor`}
            >
              Tom Hanks
            </Actor>
            <Actor
              style={{ animation: 'none' }}
              className={`${darkMode ? 'darklv2' : 'lightcolors'} modalactor`}
            />
            <div
              className={`${
                darkMode ? 'darklv5' : 'lightcolors'
              } basictext rulestext`}
            >
              Guess by pressing a movie title suggested by the text box.
            </div>
            <div
              className={`${
                darkMode ? 'darklv5' : 'lightcolors'
              } basictext rulestext`}
            >
              After each guess the color of the text box will change to show how
              close your title is to the STARDLE.
            </div>
            <div
              className={`${
                darkMode ? 'darklv5' : 'lightcolors'
              } basictext rulestext`}
            >
              If a guess is correct, you win.
            </div>
            <AboveInput style={green} className="modalactor">
              <div className="textinput blacktext">Toy Story 4</div>
            </AboveInput>
            <div
              className={`${
                darkMode ? 'darklv5' : 'lightcolors'
              } basictext rulestext`}
            >
              If a guess has words in common with the Stardle:
            </div>
            <AboveInput style={yellow} className="modalactor">
              <div className="textinput blacktext">Toy Story 3</div>
            </AboveInput>
            <div
              className={`${
                darkMode ? 'darklv5' : 'lightcolors'
              } basictext rulestext`}
            >
              If a guess has no words in common with the Stardle:
            </div>
            <AboveInput style={gray} className="modalactor">
              <div className="textinput blacktext">Cast Away</div>
            </AboveInput>
            <div
              className={`${
                darkMode ? 'darklv5' : 'lightcolors'
              } basictext rulestext`}
            >
              A new Stardle will be available every day.
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        show={statsVisible}
        onHide={() => {
          setStatsVisible(false);
        }}
      >
        <ModalBody className={darkMode ? 'darklv5' : 'lightcolors'}>
          <div className={`modalbody ${darkMode ? 'darklv5' : 'lightcolors'}`}>
            <div
              className={darkMode ? 'darklv5' : 'lightcolors'}
              style={{ fontSize: height / 50, textAlign: 'center' }}
            >
              {solved ? 'The answer was' : ''}
            </div>
            <div
              className={darkMode ? 'darklv5' : 'lightcolors'}
              style={{
                fontSize: height / 30,
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              {solved ? correct[0].toUpperCase() : ''}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                width: '100%',
              }}
            >
              <StatTitle>Played</StatTitle>
              <StatTitle>Success Rate</StatTitle>
              <StatTitle>Streak</StatTitle>
              <StatTitle>Max Streak</StatTitle>
              <Stat>{played}</Stat>
              <Stat>{Math.trunc(successRate * 100)}%</Stat>
              <Stat>{streak}</Stat>
              <Stat>{maxStreak}</Stat>
            </div>
            <div
              style={{ textAlign: 'center', fontSize: height / 40 }}
              className="bold"
            >
              GUESS DISTRIBUTION
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '5fr 95fr' }}>
              <div>
                <div
                  style={{
                    fontSize: height / 50,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                >
                  1
                </div>
                <div
                  style={{
                    fontSize: height / 50,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                >
                  2
                </div>
                <div
                  style={{
                    fontSize: height / 50,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                >
                  3
                </div>
                <div
                  style={{
                    fontSize: height / 50,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                >
                  4
                </div>
                <div
                  style={{
                    fontSize: height / 50,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                >
                  5
                </div>
                <div
                  style={{
                    fontSize: height / 50,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                >
                  6
                </div>
              </div>
              <div style={{}}>
                <div
                  style={{
                    backgroundColor: '#77D353',
                    width:
                      (parseInt(data[0]) / maxAttempts) * relevantGraphWidth,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                />
                <div
                  style={{
                    backgroundColor: '#77D353',
                    width:
                      (parseInt(data[1]) / maxAttempts) * relevantGraphWidth,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                />
                <div
                  style={{
                    backgroundColor: '#FFD185',
                    width:
                      (parseInt(data[2]) / maxAttempts) * relevantGraphWidth,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                />
                <div
                  style={{
                    backgroundColor: '#FFD185',
                    width:
                      (parseInt(data[3]) / maxAttempts) * relevantGraphWidth,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                />
                <div
                  style={{
                    backgroundColor: 'lightgray',
                    width:
                      (parseInt(data[4]) / maxAttempts) * relevantGraphWidth,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                />
                <div
                  style={{
                    backgroundColor: 'lightgray',
                    width:
                      (parseInt(data[5]) / maxAttempts) * relevantGraphWidth,
                    height: height / 40,
                    marginTop: height / 100,
                    marginBottom: height / 100,
                  }}
                />
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: height / 50 }}>
              Next STARDLE in
            </div>
            <div style={{ textAlign: 'center', fontSize: height / 40 }}>
              {getstrTimeLeft(hoursLeft)}:{getstrTimeLeft(minutesLeft)}:
              {getstrTimeLeft(secondsLeft)}
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        show={aboutVisible}
        onHide={() => {
          setAboutVisible(false);
        }}
      >
        <ModalBody className={darkMode ? 'darklv5' : 'lightcolors'}>
          <div>
            Made by Nick Green{' '}
            <a href="http://nickgreensf.com">(nickgreensf.com)</a>
          </div>
          <div>Based on Wordle</div>
          <div>Movie data from Wikipedia</div>
        </ModalBody>
      </Modal>
      <MyNavbar className={darkMode ? 'darklv2' : 'lightcolors'}>
        <NavbarText
          onClick={() => {
            setRulesVisible(true);
          }}
        >
          RULES
        </NavbarText>
        <NavbarText
          style={{ left: width * 0.2 }}
          onClick={() => {
            const curTimeLeft : number = tomorrow.getTime() - new Date().getTime();
            setSecondsLeft(Math.floor(curTimeLeft / 1000) % 60);
            setMinutesLeft(Math.floor(curTimeLeft / (1000 * 60)) % 60);
            setHoursLeft(Math.floor(curTimeLeft / (1000 * 60 * 60)) % 24);
            setStatsVisible(true);
          }}
        >
          STATS
        </NavbarText>
        <Logo style={{ left: width * 0.4 }}>S T A R D L E</Logo>
        <NavbarText
          style={{ left: width * 0.8 }}
          onClick={() => {
            // when we set the darkmode toggle, we also have to set classname for the body
            if (darkMode) {
              document.body.classList.add('white');
              data[16] = 'false';
            } else {
              document.body.classList.remove('white');
              data[16] = 'true';
            }
            console.log(darkMode);
            document.cookie = `data=${encodeURIComponent(
              data.join('//')
            )}; expires=Tue, 19 Jan 2038 03:14:07 GMT;`;
            setDarkMode(!darkMode);
            // console.log(document.cookie)
          }}
        >
          DARKMODE
        </NavbarText>
        <NavbarText
          style={{ left: width * 0.6 }}
          onClick={() => {
            setAboutVisible(true);
          }}
        >
          ABOUT
        </NavbarText>
      </MyNavbar>
      <HoverButton
        className={`hover shortwidth ${darkMode ? 'darklv5 ' : 'lightcolors '}${
          hoverDisplays[0] ? '' : 'none'
        }`}
        style={curHoverLocations[0]}
        onClick={() => guess(active * 3)}
      >
        <HoverText className={darkMode ? 'darklv5' : 'lightcolors'}>
          {hoverSpans[0]}
        </HoverText>
      </HoverButton>
      <HoverButton
        className={`hover shortwidth ${darkMode ? 'darklv5 ' : 'lightcolors '}${
          hoverDisplays[1] ? '' : 'none'
        }`}
        style={curHoverLocations[1]}
        onClick={() => guess(1 + active * 3)}
      >
        <HoverText className={darkMode ? 'darklv5' : 'lightcolors'}>
          {hoverSpans[1]}
        </HoverText>
      </HoverButton>
      <HoverButton
        className={`hover shortwidth ${darkMode ? 'darklv5 ' : 'lightcolors '}${
          hoverDisplays[2] ? '' : 'none'
        }`}
        style={curHoverLocations[2]}
        onClick={() => guess(2 + active * 3)}
      >
        <HoverText className={darkMode ? 'darklv5' : 'lightcolors'}>
          {hoverSpans[2]}
        </HoverText>
      </HoverButton>
      <Puzzle>
        <Spot>
          <Actor className={darkMode ? 'darklv2' : 'lightcolors'}>
            {actors[0]}
          </Actor>
          <Input
            className={`${bools[0] ? '' : 'none '}textinput ${
              darkMode ? 'darklv2' : 'lightcolors'
            }`}
            onChange={(e) => {
              textHandler(e.target.value, 0);
            }}
          />
          <AboveInput style={bools[0] ? none : guessStyles[0]}>
            <div className="blacktext">
              {guessSpans[0].length > 1 ? guessSpans[0] : ''}
            </div>
          </AboveInput>
        </Spot>
        <Spot>
          <Hider
            className={(() => {
              if (actors[1].length > 1) {
                return 'none';
              }
              if (darkMode) {
                return 'darklv4';
              }
              return 'black';
            }).call(undefined)}
          />
          <Actor
            className={
              (actors[1].length > 1 ? '' : 'none ') +
              (darkMode ? 'darklv2' : 'lightcolors')
            }
          >
            {actors[1]}
          </Actor>
          <Input
            className={`${bools[1] ? '' : 'none '}textinput ${
              darkMode ? 'darklv2' : 'lightcolors'
            }`}
            onChange={(e) => {
              textHandler(e.target.value, 1);
            }}
          />
          <AboveInput style={bools[1] ? none : guessStyles[1]}>
            <div className="blacktext">
              {guessSpans[1].length > 1 ? guessSpans[1] : ''}
            </div>
          </AboveInput>
        </Spot>
        <Spot>
          <Hider
            className={(() => {
              if (actors[2].length > 1) {
                return 'none';
              }
              if (darkMode) {
                return 'darklv4';
              }
              return 'black';
            }).call(undefined)}
          />
          <Actor
            className={
              (actors[2].length > 1 ? '' : 'none ') +
              (darkMode ? 'darklv2' : 'lightcolors')
            }
          >
            {actors[2]}
          </Actor>
          <Input
            className={`${bools[2] ? '' : 'none '}textinput ${
              darkMode ? 'darklv2' : 'lightcolors'
            }`}
            onChange={(e) => {
              textHandler(e.target.value, 2);
            }}
          />
          <AboveInput style={bools[2] ? none : guessStyles[2]}>
            <div className="blacktext">
              {guessSpans[2].length > 1 ? guessSpans[2] : ''}
            </div>
          </AboveInput>
        </Spot>
        <Spot>
          <Hider
            className={(() => {
              if (actors[3].length > 1) {
                return 'none';
              }
              if (darkMode) {
                return 'darklv4';
              }
              return 'black';
            }).call(undefined)}
          />
          <Actor
            className={
              (actors[3].length > 1 ? '' : 'none ') +
              (darkMode ? 'darklv2' : 'lightcolors')
            }
          >
            {actors[3]}
          </Actor>
          <Input
            className={`${bools[3] ? '' : 'none '}textinput ${
              darkMode ? 'darklv2' : 'lightcolors'
            }`}
            onChange={(e) => {
              textHandler(e.target.value, 3);
            }}
          />
          <AboveInput style={bools[3] ? none : guessStyles[3]}>
            <div className="blacktext">
              {guessSpans[3].length > 1 ? guessSpans[3] : ''}
            </div>
          </AboveInput>
        </Spot>
        <Spot>
          <Hider
            className={(() => {
              if (actors[4].length > 1) {
                return 'none';
              }
              if (darkMode) {
                return 'darklv4';
              }
              return 'black';
            }).call(undefined)}
          />
          <Actor
            className={
              (actors[4].length > 1 ? '' : 'none ') +
              (darkMode ? 'darklv2' : 'lightcolors')
            }
          >
            {actors[4]}
          </Actor>
          <Input
            className={`${bools[4] ? '' : 'none '}textinput ${
              darkMode ? 'darklv2' : 'lightcolors'
            }`}
            onChange={(e) => {
              textHandler(e.target.value, 4);
            }}
          />
          <AboveInput style={bools[4] ? none : guessStyles[4]}>
            <div className="blacktext">
              {guessSpans[4].length > 1 ? guessSpans[4] : ''}
            </div>
          </AboveInput>
        </Spot>
        <Spot>
          <Hider
            className={
              // actors[5].length > 1 ? 'none' : darkMode ? ' darklv4' : ' black'
              (() => {
                if (actors[5].length > 1) {
                  return 'none';
                }
                if (darkMode) {
                  return 'darklv4';
                }
                return 'black';
              }).call(undefined)
            }
          />
          <Actor
            className={
              (actors[5].length > 1 ? '' : 'none ') +
              (darkMode ? 'darklv2' : 'lightcolors')
            }
          >
            {actors[5]}
          </Actor>
          <Input
            className={`${bools[5] ? '' : 'none '}textinput ${
              darkMode ? 'darklv2' : 'lightcolors'
            }`}
            onChange={(e) => {
              textHandler(e.target.value, 5);
            }}
          />
          <AboveInput style={bools[5] ? none : guessStyles[5]}>
            <div className="blacktext">
              {guessSpans[5].length > 1 ? guessSpans[5] : ''}
            </div>
          </AboveInput>
        </Spot>
      </Puzzle>
    </TopLevel>
  );
}
