import React, {useState} from 'react'
import { Modal, ModalBody, ModalDialog } from 'react-bootstrap'
import Data from "./constants/Data"
import PointlessWords from './constants/PointlessWords'
import "./styles.css"

//console.log(Object.keys(Data))


//declaring styling variables

const filmmockdata : Array<string> = Object.keys(Data)

export default function App () {

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
    document.cookie = "0//0//0//0//0//0//0//0//false//_//_//_//_//_//_//false//false";
    const [cookie, setCookie] = useState(document.cookie)
    if (!cookie || cookie.length < 1){
        document.cookie = "0//0//0//0//0//0//0//0//false//_//_//_//_//_//_//false//false";
        setCookie(document.cookie)
    }
    
    const [data] = useState(cookie.split("//"))
    const [solved, setSolved] = useState(false)

    const [active, setActive] = useState(0);
    const [rulesVisible, setRulesVisible] = useState(data[data.length - 2] === "false" ? false : false)
    const [statsVisible, setStatsVisible] = useState(false)

    if (data[data.length - 1] === "false"){
        data[data.length - 1] = "true";
        document.cookie = data.join("//");
        console.log(data);
    }

    const [darkMode, setDarkMode] = useState(data[data.length - 1] === "false" ? true : false)
    if (!darkMode){
        document.body.classList.add("white");
    }
    
    const [bools, setBools] = useState([true, false, false, false, false, false])

    // YAY IT LOOKS HORRIBLE

    const [olddiv, setOlddiv] = useState('')
    const [newoldtext, setNewOlddiv] = useState(['','','','','',''])
    const [actors, setActors] = useState([correct[1],"_","_","_","_","_"])
    const [guessSpans, setGuessSpans] = useState(["","","","","",""])
    const [guessStyles, setGuessStyles] = useState(["input", "input", "input", "input", "input", "input"])
    const [hoverSpans, setHoverSpans] = useState(["","",""])
    const [hoverDisplays, setHoverDisplays] = useState([false, false, false])
    const hoverLocations = ["zero", "one", "two", "three", "four", "five", "six", "seven",
    "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", 
    "seventeen"]
    const [curHoverLocations, setCurHoverLocations] = useState(["zero", "one", "two"])
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
        peekGuessSpans = guessSpans;
        peekGuessSpans[section] = hoverSpans[box % 3];
        setGuessSpans(peekGuessSpans);
        //setBooltest(false);
        if (hoverSpans[box % 3] === correct[0]){
            //console.log("winner!");
            setSolved(true);
            peekGuessStyles = guessStyles;
            peekGuessStyles[section] = "green";
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
                console.log(section);
                flipForwardActor(section);
                section += 1;
            }
            setActors(peekactors);
            setTimeout(()=>{setStatsVisible(true)}, 1000)
            //console.log(actors);
            return;
        }
        else{
            //console.log("bad guess", hoverSpans[box % 3])
            let wordsGuess = new Set(hoverSpans[box % 3].split(" "));
            textHandler("", section);
            peekGuessStyles = guessStyles;
            peekGuessStyles[section] = "gray";
            setGuessStyles(peekGuessStyles);
            let wordset = correct[0].split(" ");
            wordset.forEach(function(item){
                if (!PointlessWords.has(item) && wordsGuess.has(item)){
                    //console.log("overlap");
                    peekGuessStyles = guessStyles;
                    peekGuessStyles[section] = "yellow";
                    setGuessStyles(peekGuessStyles);
                    //break;
                }
            })
            // for (let item of new Set(correct[0].split(" "))){
            //     //console.log(item, wordsGuess.has(item), wordsGuess)
            //     if (!PointlessWords.has(item) && wordsGuess.has(item)){
            //         //console.log("overlap");
            //         peekGuessStyles = guessStyles;
            //         peekGuessStyles[section] = "yellow";
            //         setGuessStyles(peekGuessStyles);
            //         break;
            //     }
            // }
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
            flipForwardActor(active);
            //console.log(actors);
        }
        else{
            setTimeout(()=>{setStatsVisible(true)}, 1000);
        }
        setBools(peekBools);
    }

    function flipForwardActor (i: number){
        if (i > 4){
            return
        }
    };

    return <div className={darkMode ? "darklv1" : "lightcolors"}>
        <div className="toplevel">
            <Modal show={rulesVisible} onHide={() => {
                setRulesVisible(false)
            }}>
                <ModalBody>
                    <div className={"modalbody " + (darkMode ? "darklv5" : "lightcolors")}>
                        <div className={(darkMode ? "darklv5" : "lightcolors") + " basictext rulestext bold"}>
                            HOW TO PLAY
                        </div>
                        <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                            Guess the <span className="modallogo">S T A R D L E</span> in six tries.
                        </div>
                        <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                            Enter your guesses into the boxes below the actors.
                        </div>
                        <div className={"actor " + (darkMode ? "darklv2" : "lightcolors") + " modalactor"}>
                            Tom Hanks
                        </div>
                        <div 
                            className={"actor " + (darkMode ? "darklv2" : "lightcolors") + " modalactor"}>
                        </div>
                        <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                            Guess by pressing a movie title suggested by the text box.
                        </div>
                        <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                            After each guess the color of the text box will change to show how close your title is to the STARDLE.
                        </div>
                        <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                            If a guess is correct, you win.
                        </div>
                        <div className="input green modalactor">
                            <div className={"textinput"}>Toy Story 4</div>
                        </div>
                        <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                            If a guess has words in common with the Stardle:
                        </div>
                        <div className="input yellow modalactor">
                            <div className={"textinput"}>Toy Story 3</div>
                        </div>
                        <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                            If a guess has no words in common with the Stardle:
                        </div>
                        <div className="input gray modalactor">
                            <div className={"textinput"}>Cast Away</div>
                        </div>
                        <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                            A new Stardle will be available every day.
                        </div>
                    </div>
                </ModalBody>
                {/* <div onClick={() => {setRulesVisible(false)}}>
                    <div className="modalback">
                        <div className="modalfront" onClick={() => {setRulesVisible(true)}}>
                            <div className={"modalbody " + darkMode ? "darklv5" : "lightcolors"}>
                                <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext bold"}>
                                    HOW TO PLAY
                                </div>
                                <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                                    Guess the <div className="modallogo">S T A R D L E</div> in six tries.
                                </div>
                                <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                                    Enter your guesses into the boxes below the actors.
                                </div>
                                <div className={"actor " + darkMode ? "darklv2" : "lightcolors" + " modalactor"}>
                                    Tom Hanks
                                </div>
                                <input 
                                    className={"input textinput " + darkMode ? "darklv2" : "lightcolors" + " modalactor"}>
                                </input>
                                <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                                    Guess by pressing a movie title suggested by the text box.
                                </div>
                                <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                                    After each guess the color of the text box will change to show how close your title is to the STARDLE.
                                </div>
                                <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                                    If a guess is correct, you win.
                                </div>
                                <div className="input green modalactor">
                                    <div className={"textinput"}>Toy Story 4</div>
                                </div>
                                <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                                    If a guess has words in common with the Stardle:
                                </div>
                                <div className="input yellow modalactor">
                                    <div className={"textinput"}>Toy Story 3</div>
                                </div>
                                <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                                    If a guess has no words in common with the Stardle:
                                </div>
                                <div className="input gray modalactor">
                                    <div className={"textinput"}>Cast Away</div>
                                </div>
                                <div className={darkMode ? "darklv5" : "lightcolors" + " basictext rulestext"}>
                                    A new Stardle will be available every day.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>     */}
            </Modal>
            {/* <Modal show={statsVisible} className={"rules"}>
                <div onClick={() => {setStatsVisible(false)}}>
                    <div className="modalback">
                        <div className="modalfront" onClick={() => {setStatsVisible(true)}}>
                            <div className={"modalbody " + darkMode ? "darklv5" : "lightcolors"}>
                                <div className={darkMode ? "darklv5" : "lightcolors" + " resultstext basictext"}>
                                    {solved ? "The answer was" : ""}
                                </div>
                                <div className={darkMode ? "darklv5" : "lightcolors" + " resultstext answer"}>
                                    {correct[0].toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </Modal> */}
            <div className="navbar">
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
                        } else{
                            document.body.classList.remove("white");
                        }
                        setDarkMode(!darkMode);
                    }}>
                            darkmode
                </span>
            </div>
            <button 
                className={"hover shortwidth " + (darkMode ? "darklv5 " : "lightcolors ") + (hoverDisplays[0] ? "" : "none") + " " + curHoverLocations[0]} 
                onClick={() => guess((active * 3))}>
                    <div className={"hovertext " + (darkMode ? "darklv5" : "lightcolors")}>{hoverSpans[0]}</div>
            </button>
            <button 
                className={"hover shortwidth " + (darkMode ? "darklv5 " : "lightcolors ") + (hoverDisplays[1] ? "" : "none") + " " + curHoverLocations[1]} 
                onClick={() => guess(1 + (active * 3))}>
                    <div className={"hovertext " + (darkMode ? "darklv5" : "lightcolors")}>{hoverSpans[1]}</div>
            </button>
            <button 
                className={"hover shortwidth " + (darkMode ? "darklv5 " : "lightcolors ") + (hoverDisplays[2] ? "" : "none") + " " + curHoverLocations[2]} 
                onClick={() => guess(2 + (active * 3))}>
                    <div className={"hovertext " + (darkMode ? "darklv5" : "lightcolors")}>{hoverSpans[2]}</div>
            </button>
            <div className="container shortwidth">
                <div className="spot">
                    <div className={"actor " + (darkMode ? "darklv2" : "lightcolors")}>{actors[0]}</div>
                    <input 
                        className={(bools[0] ? "input " : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                        onChange={(e) => {textHandler(e.target.value, 0)}}>
                    </input>
                    <div className={"input " + (darkMode ? "darklv3 " : "lightcolors ") + (bools[0] ? "none" : guessStyles[0])}>
                        <div>{guessSpans[0]}</div>
                    </div>
                </div>
                <div className="spot">
                    <div 
                        className={actors[1].length > 1 ? "none" : ("black" + (darkMode ? " darklv4" : ""))}>
                    </div>
                    <div className={(actors[1].length > 1 ? "actor " : "none ") + (darkMode ? "darklv1" : "lightcolors")}>{actors[1]}
                    </div>
                    <input 
                        className={(bools[1] ? "input " : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                        onChange={(e) => {textHandler(e.target.value, 1)}}>
                    </input>
                    <div className={(darkMode ? "darklv3 " : "lightcolors ") + (bools[1] ? "" : guessStyles[1])}>
                        <div className="input textinput">{guessSpans[1]}</div>
                    </div>
                </div>
                <div className="spot">
                    <div 
                        className={actors[2].length > 1 ? "none" : ("black" + (darkMode ? " darklv4" : ""))}>
                    </div>
                    <div className={(actors[2].length > 1 ? "actor " : "none ") + (darkMode ? "darklv1" : "lightcolors")}>{actors[2]}
                    </div>
                    <input 
                        className={(bools[2] ? "input " : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                        onChange={(e) => {textHandler(e.target.value, 2)}}>
                    </input>
                    <div className={"input " + (darkMode ? "darklv3 " : "lightcolors ") + (bools[2] ? "none" : guessStyles[2])}>
                        <div className="textinput">{guessSpans[2]}</div>
                    </div>
                </div>
                <div className="spot">
                    <div 
                        className={actors[3].length > 1 ? "none" : ("black" + (darkMode ? " darklv4" : ""))}>
                    </div>
                    <div className={(actors[3].length > 1 ? "actor " : "none ") + (darkMode ? "darklv1" : "lightcolors")}>{actors[3]}
                    </div>
                    <input 
                        className={(bools[3] ? "input " : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                        onChange={(e) => {textHandler(e.target.value, 3)}}>
                    </input>
                    <div className={"input " + (darkMode ? "darklv3 " : "lightcolors ") + (bools[3] ? "none" : guessStyles[3])}>
                        <div className="textinput">{guessSpans[3]}</div>
                    </div>
                </div>
                <div className="spot">
                    <div 
                        className={actors[4].length > 1 ? "none" : ("black" + (darkMode ? " darklv4" : ""))}>
                    </div>
                    <div className={(actors[4].length > 1 ? "actor " : "none ") + (darkMode ? "darklv1" : "lightcolors")}>{actors[4]}
                    </div>
                    <input 
                        className={(bools[4] ? "input " : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                        onChange={(e) => {textHandler(e.target.value, 4)}}>
                    </input>
                    <div className={"input " + (darkMode ? "darklv3 " : "lightcolors ") + (bools[4] ? "none" : guessStyles[4])}>
                        <div className="textinput">{guessSpans[4]}</div>
                    </div>
                </div>
                <div className="spot">
                    <div 
                        className={actors[5].length > 1 ? "none" : ("black" + (darkMode ? " darklv4" : ""))}>
                    </div>
                    <div className={(actors[5].length > 1 ? "actor " : "none ") + (darkMode ? "darklv1" : "lightcolors")}>{actors[5]}
                    </div>
                    <input 
                        className={(bools[5] ? "input " : "none ") + "textinput " + (darkMode ? "darklv2" : "lightcolors")} 
                        onChange={(e) => {textHandler(e.target.value, 5)}}>
                    </input>
                    <div className={"input " + (darkMode ? "darklv3 " : "lightcolors ") + (bools[5] ? "none" : guessStyles[5])}>
                        <div className="textinput">{guessSpans[5]}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

// Our base here is rgb(18, 18, 18), to go up a level, simply add 2.55 * the % opaque of the white transparency recommended.