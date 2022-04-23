import React, {useState} from 'react'
import { Modal, ModalBody } from 'react-bootstrap'
import Data from "./constants/Data"
import PointlessWords from './constants/PointlessWords'
import "./styles.css"
import styled, { keyframes } from 'styled-components'
import { flipInX, fadeInRight } from 'react-animations'

//console.log(Object.keys(Data))


//declaring styling variables

const filmmockdata : Array<string> = Object.keys(Data)

const width = window.innerWidth
const height = window.innerHeight
const relevantWidth = width > height ? width / 3 : width * .9
const relevantPadding = width > height ? relevantWidth : width * .05
const spotHeight = height * .13
//console.log(height, spotHeight)

let today : Date = new Date();
let date : string = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear()

const flipInAnimation = keyframes`${flipInX}`
const fadeInRightAnimation = keyframes`${fadeInRight}`

// 1 guess, 2, 3, 4, 5, 6, miss, streak, has played today, guess 1, 2, 3, 4, 5, 6, has seen rules, dark mode
//document.cookie = "0//0//0//0//0//0//0//0//false//_//_//_//_//_//_//false//false//" + date;

let cookie = document.cookie
if (!cookie || cookie.length < 1){
    document.cookie = "0//0//0//0//0//0//0//0//false//_//_//_//_//_//_//false//false//" + date;
    cookie = document.cookie
}

const outsideData = cookie.split("//")
console.log(outsideData[8])
if (outsideData[8] === "false"){
    for (let i = 9; i <= 14; i += 1){
        outsideData[i] = "_";
    }
    document.cookie = outsideData.join("//")
}

let maxAttempts = Math.max(parseInt(outsideData[0]),parseInt(outsideData[1]),parseInt(outsideData[2]),
parseInt(outsideData[3]),parseInt(outsideData[4]),parseInt(outsideData[5]))

export default function App () {

    //console.log(document.cookie)

    //console.log(date)

    let holdoverdata = filmmockdata;
    let peekOlddivs;
    let peekGuessStyles;
    let peekBools;
    let peekGuessSpans;
    let peekHoverSpans;
    let peekHoverDisplays;
    let peekCurHoverLocations;

    const [correct] = useState(Data[filmmockdata[Math.floor(Math.random() * filmmockdata.length)]]);
    //console.log(correct)
    // 1 guess, 2, 3, 4, 5, 6, miss, streak, has played today, guess 1, 2, 3, 4, 5, 6, has seen rules, dark mode
    //document.cookie = "0//0//0//0//0//0//0//0//false//_//_//_//_//_//_//false//false//" + date;
    // const [cookie, setCookie] = useState(document.cookie)
    // if (!cookie || cookie.length < 1){
    //     document.cookie = "0//0//0//0//0//0//0//0//false//_//_//_//_//_//_//false//false//" + date;
    //     setCookie(document.cookie)
    // }
    
    const [data] = useState(outsideData)
    //data[8] === "false" ? false : true
    const [solved, setSolved] = useState(false)

    const [active, setActive] = useState(0);
    const [rulesVisible, setRulesVisible] = useState(data[15] === "false" ? true : false)
    if (rulesVisible === true){
        data[15] = "true";
        document.cookie = data.join("//")
    }
    const [statsVisible, setStatsVisible] = useState(false)

    // if (data[data.length - 1] === "false"){
    //     data[data.length - 1] = "true";
    //     document.cookie = data.join("//");
    //     console.log(data);
    // }

    const [darkMode, setDarkMode] = useState(data[16] === "true" ? true : false)
    if (!darkMode){
        document.body.classList.add("white");
    }
    
    const [bools, setBools] = useState(solved === false ? [true, false, false, false, false, false] : [false, false, false, false, false, false])

    const green = {
        backgroundColor: "#77D353",
        borderRadius: height/50,
        paddingTop: height/200
    };
    const yellow = {
        backgroundColor: "#FFD185",
        borderRadius: height/50,
        paddingTop: height/200
    };
    const gray = {
        backgroundColor: "lightgray",
        borderRadius: height/50,
        paddingTop: height/200
    };
    const none = {
        display: "none"
    };
    const blank = {}

    function yellowCheck(guess: string){
        //console.log(guess)
        let wordsGuess = new Set(guess.split(" "));
        let wordset = correct[0].split(" ");
        let flag = false;
        wordset.forEach(function(item){
            if (!PointlessWords.has(item) && wordsGuess.has(item)){
                //console.log(item)
                flag = true;
            }
        })
        return flag
    }

    const [olddiv, setOlddiv] = useState('')
    const [newoldtext, setNewOlddiv] = useState(['','','','','',''])
    const [actors, setActors] = useState(solved === false ? 
        [correct[1],"_","_","_","_","_"] : [correct[1], correct[2],correct[3],correct[4],correct[5],correct[6]])
    const [guessSpans, setGuessSpans] = useState(solved === false ? ["","","","","",""] : 
    [data[9], data[10], data[11], data[12], data[13], data[14]])
    const [guessStyles, setGuessStyles] = useState(solved === false ? [blank, blank, blank, blank, blank, blank] : 
    [data[9].length > 1 ? (data[9] === correct[0] ? green : (yellowCheck(data[9]) ? yellow : gray)) : blank, 
    data[10].length > 1 ? (data[10] === correct[0] ? green : (yellowCheck(data[10]) ? yellow : gray)) : blank, 
    data[11].length > 1 ? (data[11] === correct[0] ? green : (yellowCheck(data[11]) ? yellow : gray)) : blank, 
    data[12].length > 1 ? (data[12] === correct[0] ? green : (yellowCheck(data[12]) ? yellow : gray)) : blank, 
    data[13].length > 1 ? (data[13] === correct[0] ? green : (yellowCheck(data[13]) ? yellow : gray)) : blank, 
    data[14].length > 1 ? (data[14] === correct[0] ? green : (yellowCheck(data[14]) ? yellow : gray)) : blank])
    const [hoverSpans, setHoverSpans] = useState(["","",""])
    const [hoverDisplays, setHoverDisplays] = useState([false, false, false])
    const hoverLocations = 
    [{top: height * .21}, {top: height * .25}, {top: height * .29}, 
        {top: height * .34}, {top: height * .38}, {top: height * .42}, 
        {top: height * .47}, {top: height * .51}, {top: height * .55}, 
        {top: height * .6}, {top: height * .64}, {top: height * .68}, 
        {top: height * .73}, {top: height * .77}, {top: height * .81}, 
        {top: height * .86}, {top: height * .9}, {top: height * .94}]
    const [curHoverLocations, setCurHoverLocations] = useState([hoverLocations[0], hoverLocations[1], hoverLocations[2]])
    //animateds[0].addListener( ( { value } ) => rotations[0] = value );
    //flipBackBlack(0);

    function textHandler(text: string, column: number){
        let newData = [];
        for (let i = 0; i < holdoverdata.length; i += 1){
            if (holdoverdata[i].includes(text.toLowerCase())){
                newData.push(holdoverdata[i]);
            }
        }
        
        // if this isn't here the text updates don't work. i have no idea why this is.
        setOlddiv(text);

        holdoverdata = newData;
        //console.log(holdoverdata);
        peekHoverSpans = hoverSpans;
        peekHoverDisplays = hoverDisplays;
        if (text.length === 0){
            for (let i = (column * 3); i < Math.min((column + 1) * 3, (column * 3) + newData.length); i += 1){
                peekHoverSpans[i % 3] = "";
                peekHoverDisplays[i % 3] = false;
            }
            holdoverdata = filmmockdata;
        }
        else{
            for (let i = (column * 3); i < (column + 1) * 3; i += 1){
                if (i < (column * 3) + newData.length){
                    peekHoverSpans[i % 3] = Data[newData[i - (column * 3)]][0];
                    peekHoverDisplays[i % 3] = true;
                }
                else{
                    peekHoverSpans[i % 3] = "";
                    peekHoverDisplays[i % 3] = false;
                }
            }
        }
        //console.log("setting hover texts here")
        setHoverSpans(peekHoverSpans);
        setHoverDisplays(peekHoverDisplays);
        peekOlddivs = newoldtext;
        newoldtext[column] = text;
        setNewOlddiv(peekOlddivs);
        // now we need to know where we are in the chain of command so we can render 3 suggestion boxes under.
    }

    function guess(box: number){
        if (box > 17){
            // this will break the page if allowed to run so we abort it
            return
        }
        let section = Math.floor(box / 3);
        setActive(active + 1);
        data[section + 9] = hoverSpans[box % 3];
        peekGuessSpans = guessSpans;
        peekGuessSpans[section] = hoverSpans[box % 3];
        setGuessSpans(peekGuessSpans);
        //setBooltest(false);
        if (hoverSpans[box % 3] === correct[0]){
            //console.log("winner!");
            console.log(section, data[section])
            setSolved(true);
            data[section] = (parseInt(data[section]) + 1).toString();
            data[8] = "true";
            console.log(section, data[section])
            document.cookie = data.join("//");
            peekGuessStyles = guessStyles;
            peekGuessStyles[section] = green;
            setGuessStyles(peekGuessStyles);
            peekBools = bools;
            for (let i = 0; i < peekBools.length; i += 1){
                peekBools[i] = false;
            }
            setBools(peekBools);
            textHandler("", section)
            let peekactors = actors;
            while (section < correct.length - 1){
                peekactors[section + 1] = correct[section + 2];
                section += 1;
            }
            setActors(peekactors);
            setTimeout(()=>{setStatsVisible(true)}, 1000)
            //console.log(actors);
            return;
        }
        else{
            let curWord = hoverSpans[box % 3];
            textHandler("", section);
            let yellowResult = yellowCheck(curWord);
            //console.log(yellowResult)
            if (yellowResult){
                peekGuessStyles = guessStyles;
                peekGuessStyles[section] = yellow;
                setGuessStyles(peekGuessStyles);
            }
            else {
                peekGuessStyles = guessStyles;
                peekGuessStyles[section] = gray;
                setGuessStyles(peekGuessStyles);
            }
        }
        peekBools = bools;
        peekBools[section] = false;
        
        peekCurHoverLocations = curHoverLocations;
        peekCurHoverLocations[0] = hoverLocations[(section + 1) * 3];
        peekCurHoverLocations[1] = hoverLocations[(section + 1) * 3 + 1];
        peekCurHoverLocations[2] = hoverLocations[(section + 1) * 3 + 2];
        setCurHoverLocations(peekCurHoverLocations);
        if (box < 15){
            peekBools[section + 1] = true;
            let peekactors = actors;
            peekactors[section + 1] = correct[section + 2];
            setActors(peekactors);
            //console.log(actors);
        }
        else{
            setSolved(true);
            data[6] = (parseInt(data[6]) + 1).toString();
            document.cookie = data.join("//")
            setTimeout(()=>{setStatsVisible(true)}, 1000);
        }
        setBools(peekBools);
    }

    const [widthTest, setWidthTest] = useState(90)

    return <TopLevel>
        <Modal show={rulesVisible} onHide={() => {
            setRulesVisible(false)
        }}>
            <ModalBody className={(darkMode ? "darklv5" : "lightcolors")}>
                <div className={"modalbody " + (darkMode ? "darklv5" : "lightcolors")}>
                    <div className={(darkMode ? "darklv5" : "lightcolors") + " basictext rulestext bold"}>
                        HOW TO PLAY
                    </div>
                    <div className={(darkMode ? "darklv5" : "lightcolors") + " basictext rulestext"}>
                        Guess the <span className="modallogo">S T A R D L E</span> in six tries.
                    </div>
                    <div className={(darkMode ? "darklv5" : "lightcolors") + " basictext rulestext"}>
                        Enter your guesses into the boxes below the actors.
                    </div>
                    <Actor className={(darkMode ? "darklv1" : "lightcolors") + " modalactor"}>
                        Tom Hanks
                    </Actor>
                    <Actor
                        className={(darkMode ? "darklv2" : "lightcolors") + " modalactor"}>
                    </Actor>
                    <div className={(darkMode ? "darklv5" : "lightcolors") + " basictext rulestext"}>
                        Guess by pressing a movie title suggested by the text box.
                    </div>
                    <div className={(darkMode ? "darklv5" : "lightcolors") + " basictext rulestext"}>
                        After each guess the color of the text box will change to show how close your title is to the STARDLE.
                    </div>
                    <div className={(darkMode ? "darklv5" : "lightcolors") + " basictext rulestext"}>
                        If a guess is correct, you win.
                    </div>
                    <AboveInput style={green} className="modalactor">
                        <div className={"textinput"}>Toy Story 4</div>
                    </AboveInput>
                    <div className={(darkMode ? "darklv5" : "lightcolors") + " basictext rulestext"}>
                        If a guess has words in common with the Stardle:
                    </div>
                    <AboveInput style={yellow} className="modalactor">
                        <div className={"textinput"}>Toy Story 3</div>
                    </AboveInput>
                    <div className={(darkMode ? "darklv5" : "lightcolors") + " basictext rulestext"}>
                        If a guess has no words in common with the Stardle:
                    </div>
                    <AboveInput style={gray} className="modalactor">
                        <div className={"textinput"}>Cast Away</div>
                    </AboveInput>
                    <div className={(darkMode ? "darklv5" : "lightcolors") + " basictext rulestext"}>
                        A new Stardle will be available every day.
                    </div>
                </div>
            </ModalBody>
        </Modal>
        <Modal show={statsVisible} onHide={() => {setStatsVisible(false)}}>
            <ModalBody className={(darkMode ? "darklv5" : "lightcolors")}>
                <div className={"modalbody " + (darkMode ? "darklv5" : "lightcolors")}>
                    <div className={(darkMode ? "darklv5" : "lightcolors") + " resultstext basictext"}>
                        {solved ? "The answer was" : ""}
                    </div>
                    <div className={(darkMode ? "darklv5" : "lightcolors") + " answer"}>
                        {solved ? correct[0].toUpperCase() : ""}
                    </div>
                    <div>{data}</div>
                    <div style={{borderLeft: "1px solid white"}}>
                        <div style={{backgroundColor: "green", width: (parseInt(data[0]) / maxAttempts) * (width/3), height: height/40}}></div>
                        <div style={{backgroundColor: "green", width: (parseInt(data[1]) / maxAttempts) * (width/3), height: height/40}}></div>
                        <div style={{backgroundColor: "green", width: (parseInt(data[2]) / maxAttempts) * (width/3), height: height/40}}></div>
                        <div style={{backgroundColor: "green", width: (parseInt(data[3]) / maxAttempts) * (width/3), height: height/40}}></div>
                        <div style={{backgroundColor: "green", width: (parseInt(data[4]) / maxAttempts) * (width/3), height: height/40}}></div>
                        <div style={{backgroundColor: "green", width: (parseInt(data[5]) / maxAttempts) * (width/3), height: height/40}}></div>
                    </div>
                    
                </div>
            </ModalBody>
        </Modal>
        <MyNavbar>
            <span className={(darkMode ? "darklv1" : "lightcolors") + " basictext ptr"} 
                onClick={() => {setRulesVisible(true)}}>
                    rules 
            </span>
            <span className={(darkMode ? "darklv1" : "lightcolors") + " basictext ptr"} 
                onClick={() => {setStatsVisible(true)}}>
                        stats
            </span>
            <span className="toptext">S T A R D L E</span>
            <span className={(darkMode ? "darklv1" : "lightcolors") + " basictext ptr"} 
                onClick={() => {
                    if (darkMode){
                        document.body.classList.add("white");
                        data[16] = "false";
                    } else{
                        document.body.classList.remove("white");
                        data[16] = "true";
                    }
                    console.log(darkMode)
                    document.cookie = data.join("//")
                    setDarkMode(!darkMode);
                    //console.log(document.cookie)
                }}>
                        darkmode
            </span>
        </MyNavbar>
        <HoverButton 
            className={"hover shortwidth " + (darkMode ? "darklv5 " : "lightcolors ") + (hoverDisplays[0] ? "" : "none")} style={curHoverLocations[0]} 
            onClick={() => guess((active * 3))}>
                <HoverText className={(darkMode ? "darklv5" : "lightcolors")}>{hoverSpans[0]}</HoverText>
        </HoverButton>
        <HoverButton 
            className={"hover shortwidth " + (darkMode ? "darklv5 " : "lightcolors ") + (hoverDisplays[1] ? "" : "none")} style={curHoverLocations[1]} 
            onClick={() => guess(1 + (active * 3))}>
                <HoverText className={(darkMode ? "darklv5" : "lightcolors")}>{hoverSpans[1]}</HoverText>
        </HoverButton>
        <HoverButton 
            className={"hover shortwidth " + (darkMode ? "darklv5 " : "lightcolors ") + (hoverDisplays[2] ? "" : "none")} style={curHoverLocations[2]} 
            onClick={() => guess(2 + (active * 3))}>
                <HoverText className={(darkMode ? "darklv5" : "lightcolors")}>{hoverSpans[2]}</HoverText>
        </HoverButton>
        <Puzzle>
            <Spot>
                <Actor className={(darkMode ? "darklv2" : "lightcolors")}>{actors[0]}</Actor>
                <Input 
                    className={(bools[0] ? "" : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                    onChange={(e) => {textHandler(e.target.value, 0)}}>
                </Input>
                <AboveInput style={(bools[0] ? none : guessStyles[0])}>
                    <div className="blacktext">{guessSpans[0].length > 1 ? guessSpans[0] : ""}</div>
                </AboveInput>
            </Spot>
            <Spot>
                <Hider 
                    className={actors[1].length > 1 ? "none" : ((darkMode ? "darklv4" : "black"))}>
                </Hider>
                <Actor className={(actors[1].length > 1 ? "" : "none ") + (darkMode ? "darklv2" : "lightcolors")}>{actors[1]}
                </Actor>
                <Input 
                    className={(bools[1] ? "" : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                    onChange={(e) => {textHandler(e.target.value, 1)}}>
                </Input>
                <AboveInput style={(bools[1] ? none : guessStyles[1])}>
                    <div className="blacktext">{guessSpans[1].length > 1 ? guessSpans[1] : ""}</div>
                </AboveInput>
            </Spot>
            <Spot>
                <Hider 
                    className={actors[2].length > 1 ? "none" : ((darkMode ? " darklv4" : " black"))}>
                </Hider>
                <Actor className={(actors[2].length > 1 ? "" : "none ") + (darkMode ? "darklv2" : "lightcolors")}>{actors[2]}
                </Actor>
                <Input 
                    className={(bools[2] ? "" : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                    onChange={(e) => {textHandler(e.target.value, 2)}}>
                </Input>
                <AboveInput style={(bools[2] ? none : guessStyles[2])}>
                    <div className="blacktext">{guessSpans[2].length > 1 ? guessSpans[2] : ""}</div>
                </AboveInput>
            </Spot>
            <Spot>
                <Hider 
                    className={actors[3].length > 1 ? "none" : ((darkMode ? " darklv4" : " black"))}>
                </Hider>
                <Actor className={(actors[3].length > 1 ? "" : "none ") + (darkMode ? "darklv2" : "lightcolors")}>{actors[3]}
                </Actor>
                <Input 
                    className={(bools[3] ? "" : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                    onChange={(e) => {textHandler(e.target.value, 3)}}>
                </Input>
                <AboveInput style={(bools[3] ? none : guessStyles[3])}>
                    <div className="blacktext">{guessSpans[3].length > 1 ? guessSpans[3] : ""}</div>
                </AboveInput>
            </Spot>
            <Spot>
                <Hider 
                    className={actors[4].length > 1 ? "none" : ((darkMode ? " darklv4" : " black"))}>
                </Hider>
                <Actor className={(actors[4].length > 1 ? "" : "none ") + (darkMode ? "darklv2" : "lightcolors")}>{actors[4]}
                </Actor>
                <Input 
                    className={(bools[4] ? "" : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                    onChange={(e) => {textHandler(e.target.value, 4)}}>
                </Input>
                <AboveInput style={(bools[4] ? none : guessStyles[4])}>
                    <div className="blacktext">{guessSpans[4].length > 1 ? guessSpans[4] : ""}</div>
                </AboveInput>
            </Spot>
            <Spot>
                <Hider 
                    className={actors[5].length > 1 ? "none" : ((darkMode ? " darklv4" : " black"))}>
                </Hider>
                <Actor className={(actors[5].length > 1 ? "" : "none ") + (darkMode ? "darklv2" : "lightcolors")}>{actors[5]}
                </Actor>
                <Input 
                    className={(bools[5] ? "" : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                    onChange={(e) => {textHandler(e.target.value, 5)}}>
                </Input>
                <AboveInput style={(bools[5] ? none : guessStyles[5])}>
                    <div className="blacktext">{guessSpans[5].length > 1 ? guessSpans[5] : ""}</div>
                </AboveInput>
            </Spot>
        </Puzzle>
    </TopLevel>
}


const Puzzle = styled.div`
    width: ${relevantWidth}px;
    box-sizing: content-box;
    margin-left: ${relevantPadding}px
`

const HoverButton = styled.button`
    width: ${relevantWidth}px;
    margin-left: ${relevantPadding}px;
    border-radius: ${height * .02}px;
    height: ${height * .04}px;
    overflow: hidden;
    position: absolute;
    border-width: 1px;
    border-color: black;
    z-index: 7;
    color: black;
    text-align: left;
`

const HoverText = styled.span`
    font-size: ${height/40}px
`

const Hider = styled.div`
    height: ${spotHeight * .45}px;
    border-radius: ${height * .02}px;
    animation: 1s ${fadeInRightAnimation}
`

const TopLevel = styled.div`
    height: ${height}px;
    padding: auto;
`

const Input = styled.input`
    border-radius: ${height * .02}px;
    border-width: 1px;
    border-color: black;
    border-style: solid;
    height: ${spotHeight * .45}px;
    font-size: ${height / 40}px;
    box-sizing: border-box;
`

const AboveInput = styled.div`
    border-radius: ${height * .02}px;
    border-width: 1px;
    border-color: black;
    border-style: solid;
    height: ${spotHeight * .45}px;
    font-size: ${height / 40}px;
`

const Spot = styled.div`
    margin-top: 0;
    padding-bottom: ${spotHeight * .1}px;
    height: ${spotHeight}px;
    overflow: hidden;
`

const Actor = styled.div`
    padding-top: ${height / 200}px;
    height: ${spotHeight * .45}px;
    font-size: ${height / 40}px;
    overflow: hidden;
    border-width: 1px;
    border-color: black;
    border-radius: ${height / 50}px;
    text-align: center;
    border-style: solid;
    animation: 1s ${flipInAnimation}
`

const MyNavbar = styled.div`
    height: ${height * .1}px;
    top: 0;
    overflow: hidden;
    text-align: center;
    width: 100%;
`

// Our base here is rgb(18, 18, 18), to go up a level, simply add 2.55 * the % opaque of the white transparency recommended.