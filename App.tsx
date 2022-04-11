import React, { useState, useEffect, useRef } from 'react'
//import { View, TextInput, TouchableOpacity, Text } from "./components/Themed"
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Animated, Dimensions, Modal, TouchableWithoutFeedback, Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Data from "./constants/Data"
import PointlessWords from './constants/PointlessWords'

//console.log(Object.keys(Data))


//declaring styling variables
const dimensions = Dimensions.get("screen")
const width = dimensions.width
const height = Platform.OS === "web" ? dimensions.height * .9 : dimensions.height
const spotheight = height * .13
//console.log(dimensions, width, height)

const filmmockdata : Array<string> = Object.keys(Data)

export default function App () {

    let holdoverdata = filmmockdata;
    let peekOldTexts;
    let peekGuessStyles;
    let peekBools;
    let peekGuessTexts;
    let peekHoverTexts;
    let peekHoverDisplays;
    let peekCurHoverLocations;

    const [correct] = useState(Data[filmmockdata[Math.floor(Math.random() * filmmockdata.length)]]);
    //console.log(correct)

    const [active, setActive] = useState(0);
    const [rulesVisible, setRulesVisible] = useState(true)
    const [settingsVisible, setSettingsVisible] = useState(false)

    const [darkMode, setDarkMode] = useState(false)
    
    const [bools, setBools] = useState([true, false, false, false, false, false])

    // YAY IT LOOKS HORRIBLE

    const [oldText, setOldText] = useState('')
    const [newoldtext, setNewOldText] = useState(['','','','','',''])
    const [actors, setActors] = useState([correct[1],"_","_","_","_","_"])
    const [guessTexts, setGuessTexts] = useState(["","","","","",""])
    const [guessStyles, setGuessStyles] = useState([styles.input, styles.input, styles.input, styles.input, styles.input, styles.input])
    const [hoverTexts, setHoverTexts] = useState(["","",""])
    const [hoverDisplays, setHoverDisplays] = useState([false, false, false])
    const hoverLocations = [styles.zero, styles.one, styles.two, styles.three, styles.four, styles.five, styles.six, styles.seven,
    styles.eight, styles.nine, styles.ten, styles.eleven, styles.twelve, styles.thirteen, styles.fourteen, styles.fifteen, styles.sixteen, 
    styles.seventeen]
    const [curHoverLocations, setCurHoverLocations] = useState([styles.zero, styles.one, styles.two])
    const animateds = [
        useRef( new Animated.Value( 90 ) ).current,
        useRef( new Animated.Value( 90 ) ).current,
        useRef( new Animated.Value( 90 ) ).current,
        useRef( new Animated.Value( 90 ) ).current,
        useRef( new Animated.Value( 90 ) ).current
    ]
    const rotations = [0,0,0,0,0]
    //animateds[0].addListener( ( { value } ) => rotations[0] = value );
    for (let i = 0; i < animateds.length; i += 1){
        animateds[i].addListener( ( { value } ) => rotations[i] = value );
    }
    //flipBackBlack(0);

    function textHandler(text: string, column: number){
        let newData = [];
        for (let i = 0; i < holdoverdata.length; i += 1){
            if (holdoverdata[i].includes(text.toLowerCase())){
                newData.push(holdoverdata[i]);
            }
        }
        
        // if this isn't here the text updates don't work. i have no idea why this is.
        setOldText(text);

        holdoverdata = newData;
        //console.log(holdoverdata);
        peekHoverTexts = hoverTexts;
        peekHoverDisplays = hoverDisplays;
        if (text.length < newoldtext[column].length){
            for (let i = (column * 3); i < Math.min((column + 1) * 3, (column * 3) + newData.length); i += 1){
                peekHoverTexts[i % 3] = "";
                peekHoverDisplays[i % 3] = false;
            }
            holdoverdata = filmmockdata;
        }
        else{
            for (let i = (column * 3); i < (column + 1) * 3; i += 1){
                if (i < (column * 3) + newData.length){
                    peekHoverTexts[i % 3] = Data[newData[i - (column * 3)]][0];
                    peekHoverDisplays[i % 3] = true;
                }
                else{
                    peekHoverTexts[i % 3] = "";
                    peekHoverDisplays[i % 3] = false;
                }
            }
        }
        console.log("setting hover texts here")
        setHoverTexts(peekHoverTexts);
        setHoverDisplays(peekHoverDisplays);
        peekOldTexts = newoldtext;
        newoldtext[column] = text;
        setNewOldText(peekOldTexts);
        // now we need to know where we are in the chain of command so we can render 3 suggestion boxes under.
    }

    function guess(box: number){
        if (box > 17){
            // this will break the page if allowed to run so we abort it
            return
        }
        let section = Math.floor(box / 3);
        setActive(active + 1);
        peekGuessTexts = guessTexts;
        peekGuessTexts[section] = hoverTexts[box % 3];
        setGuessTexts(peekGuessTexts);
        //setBooltest(false);
        if (hoverTexts[box % 3] === correct[0]){
            //console.log("winner!");
            peekGuessStyles = guessStyles;
            peekGuessStyles[section] = styles.green;
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
            //console.log(actors);
            return;
        }
        else{
            textHandler("", section);
            let wordsGuess = new Set(hoverTexts[box % 3].split(" "));
            peekGuessStyles = guessStyles;
            peekGuessStyles[section] = styles.gray;
            setGuessStyles(peekGuessStyles);
            for (let item of new Set(correct[0].split(" "))){
                if (!PointlessWords.has(item) && wordsGuess.has(item)){
                    //console.log("overlap");
                    peekGuessStyles = guessStyles;
                    peekGuessStyles[section] = styles.yellow;
                    setGuessStyles(peekGuessStyles);
                    break;
                }
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
            // flipBackBlack(active);
            // //console.log(requestAnimationFrame(flipBackBlack))
            // let animating = true;
            // let val;
            // while (animating){
            //     val = requestAnimationFrame(flipBackBlack);
            //     if (val > 3000){
            //         animating = false;
            //     }
            //     //console.log(val)
            // }
            //console.log("Done")
            let peekactors = actors;
            peekactors[section + 1] = correct[section + 2];
            setActors(peekactors);
            flipForwardActor(active);
            //console.log(actors);
        }
        setBools(peekBools);
    }

    function flipForwardActor (i: number){
        if (i > 4){
            return
        }
        //console.log(animateds[i])
        Animated.timing( animateds[i], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        } ).start();
    };

    return <SafeAreaProvider style={darkMode ? styles.darkcolors : styles.lightcolors}>
        <View style={styles.toplevel}>
            <Modal style={styles.rules} animationType="fade" transparent={true} visible={rulesVisible}>
                <TouchableWithoutFeedback onPress={() => {setRulesVisible(false)}}>
                    <View style={styles.modalback}>
                        <View style={styles.modalfront}>
                            <View style={styles.modalbody}>
                                <Text>HOW TO PLAY</Text>
                                <Text>Guess the <Text style={styles.modallogo}>S T A R D L E</Text> in six tries.</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>    
            </Modal>
            <View style={[styles.navbar]}>
                <Text>
                    <Text onPress={() => {setRulesVisible(true)}}>rules</Text>
                    <Text style={styles.toptext}>S T A R D L E</Text>
                    <Text onPress={() => {setDarkMode(!darkMode)}}>darkmode</Text>
                </Text>
            </View>
            <TouchableOpacity 
                style={[styles.hover, hoverDisplays[0] ? null : styles.none, curHoverLocations[0]]} 
                onPress={() => guess((active * 3))}>
                    <Text style={styles.hovertext}>{hoverTexts[0]}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.hover, hoverDisplays[1] ? null : styles.none, curHoverLocations[1]]} 
                onPress={() => guess(1 + (active * 3))}>
                    <Text style={styles.hovertext}>{hoverTexts[1]}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.hover, hoverDisplays[2] ? null : styles.none, curHoverLocations[2]]} 
                onPress={() => guess(2 + (active * 3))}>
                    <Text style={styles.hovertext}>{hoverTexts[2]}</Text>
            </TouchableOpacity>
            <View style={styles.container}>
                <View style={styles.spot}>
                    <Text style={[styles.actor, darkMode ? styles.darkcolors : styles.lightcolors]}>{actors[0]}</Text>
                    <TextInput 
                        style={[bools[0] ? styles.input : styles.none, styles.textinput, darkMode ? styles.darkcolors : styles.lightcolors]} 
                        onChange={(e) => {textHandler(e.target.value, 0)}}>
                    </TextInput>
                    <View style={[styles.input, bools[0] ? styles.none : guessStyles[0]]}>
                        <Text style={styles.textinput}>{guessTexts[0]}</Text>
                    </View>
                </View>
                <View style={styles.spot}>
                    <View 
                        style={actors[1].length > 1 ? styles.none : [styles.black, darkMode ? styles.lightcolors : styles.darkcolors]}>
                    </View>
                    <Animated.Text style={[actors[1].length > 1 ? styles.actor : styles.none, darkMode ? styles.darkcolors : styles.lightcolors, {
                        transform: [{ rotateX: animateds[0].interpolate({
                        inputRange: [ 0, 360 ],
                        outputRange: [ "0deg", "360deg" ]
                        }) }]}]}>{actors[1]}
                    </Animated.Text>
                    <TextInput 
                        style={[bools[1] ? styles.input : styles.none, styles.textinput, darkMode ? styles.darkcolors : styles.lightcolors]} 
                        onChange={(e) => {textHandler(e.target.value, 1)}}>
                    </TextInput>
                    <View style={[styles.input, bools[1] ? styles.none : guessStyles[1]]}>
                        <Text style={styles.textinput}>{guessTexts[1]}</Text>
                    </View>
                </View>
                <View style={styles.spot}>
                    <View 
                        style={actors[2].length > 1 ? styles.none : [styles.black, darkMode ? styles.lightcolors : styles.darkcolors]}>
                    </View>
                    <Animated.Text style={[actors[2].length > 1 ? styles.actor : styles.none, darkMode ? styles.darkcolors : styles.lightcolors, {
                        transform: [{ rotateX: animateds[1].interpolate({
                        inputRange: [ 0, 360 ],
                        outputRange: [ "0deg", "360deg" ]
                        }) }]}]}>{actors[2]}
                    </Animated.Text>
                    <TextInput 
                        style={[bools[2] ? styles.input : styles.none, styles.textinput, darkMode ? styles.darkcolors : styles.lightcolors]} 
                        onChange={(e) => {textHandler(e.target.value, 2)}}>
                    </TextInput>
                    <View style={[styles.input, bools[2] ? styles.none : guessStyles[2]]}>
                        <Text style={styles.textinput}>{guessTexts[2]}</Text>
                    </View>
                </View>
                <View style={styles.spot}>
                    <View 
                        style={actors[3].length > 1 ? styles.none : [styles.black, darkMode ? styles.lightcolors : styles.darkcolors]}>
                    </View>
                    <Animated.Text style={[actors[3].length > 1 ? styles.actor : styles.none, darkMode ? styles.darkcolors : styles.lightcolors, {
                        transform: [{ rotateX: animateds[2].interpolate({
                        inputRange: [ 0, 360 ],
                        outputRange: [ "0deg", "360deg" ]
                        }) }]}]}>{actors[3]}
                    </Animated.Text>
                    <TextInput 
                        style={[bools[3] ? styles.input : styles.none, styles.textinput, darkMode ? styles.darkcolors : styles.lightcolors]} 
                        onChange={(e) => {textHandler(e.target.value, 3)}}>
                    </TextInput>
                    <View style={[styles.input, bools[3] ? styles.none : guessStyles[3]]}>
                        <Text style={styles.textinput}>{guessTexts[3]}</Text>
                    </View>
                </View>
                <View style={styles.spot}>
                    <View 
                        style={actors[4].length > 1 ? styles.none : [styles.black, darkMode ? styles.lightcolors : styles.darkcolors]}>
                    </View>
                    <Animated.Text style={[actors[4].length > 1 ? styles.actor : styles.none, darkMode ? styles.darkcolors : styles.lightcolors, {
                        transform: [{ rotateX: animateds[3].interpolate({
                        inputRange: [ 0, 360 ],
                        outputRange: [ "0deg", "360deg" ]
                        }) }]}]}>{actors[4]}
                    </Animated.Text>
                    <TextInput 
                        style={[bools[4] ? styles.input : styles.none, styles.textinput, darkMode ? styles.darkcolors : styles.lightcolors]} 
                        onChange={(e) => {textHandler(e.target.value, 4)}}>
                    </TextInput>
                    <View style={[styles.input, bools[4] ? styles.none : guessStyles[4]]}>
                        <Text style={styles.textinput}>{guessTexts[4]}</Text>
                    </View>
                </View>
                <View style={styles.spot}>
                    <View 
                        style={actors[5].length > 1 ? styles.none : [styles.black, darkMode ? styles.lightcolors : styles.darkcolors]}>
                    </View>
                    <Animated.Text style={[actors[5].length > 1 ? styles.actor : styles.none, darkMode ? styles.darkcolors : styles.lightcolors, {
                        transform: [{ rotateX: animateds[4].interpolate({
                        inputRange: [ 0, 360 ],
                        outputRange: [ "0deg", "360deg" ]
                        }) }]}]}>{actors[5]}
                    </Animated.Text>
                    <TextInput 
                        style={[bools[5] ? styles.input : styles.none, styles.textinput, darkMode ? styles.darkcolors : styles.lightcolors]} 
                        onChange={(e) => {textHandler(e.target.value, 5)}}>
                    </TextInput>
                    <View style={[styles.input, bools[5] ? styles.none : guessStyles[5]]}>
                        <Text style={styles.textinput}>{guessTexts[5]}</Text>
                    </View>
                </View>
            </View>
        </View>
    </SafeAreaProvider>
}

const styles = StyleSheet.create({
    darkcolors: {
        backgroundColor: "black",
        color: "white",
        borderColor: "white"
    },
    lightcolors: {
        backgroundColor: "white",
        color: "black",
        borderColor: "black"
    },
    container: {
        alignContent: 'center',
        height: height * .9,
        margin: "auto",
        minWidth: width/3
    },
    rules: {
        margin: "50%"
    },
    modalback: {
        backgroundColor: "rgba(0,0,0,.4)",
        width: "100%",
        height: "100%"
    },
    modalfront: {
        backgroundColor: "white",
        marginVertical: "5%",
        marginHorizontal: "20%"
    },
    modalbody: {
        margin: "5%"
    },
    modallogo: {
        color: "rgba(127,127,127,.8)",
        fontSize: "125%"
    },
    input: {
        borderRadius: height/50,
        borderWidth: 1,
        borderColor: "black",
        height: spotheight * .45
    },
    none: {
        display: 'none'
    },
    black: {
        borderRadius: height/50,
        height: spotheight * .45
    },
    hover: {
        overflow: "hidden",
        position: "absolute",
        width: width/3,
        height: height/20,
        borderWidth: 1,
        borderColor: "black",
        zIndex: 7,
        backgroundColor: "white",
        color: "black"
    },
    hovertext: {
        paddingLeft: height/100,
        fontSize: "125%"
    },
    yellow: {
        paddingTop: "1%",
        borderRadius: height/50,
        backgroundColor: "#FFD185",
    },
    green: {
        paddingTop: "1%",
        borderRadius: height/50,
        backgroundColor: "#77D353",
    },
    gray: {
        paddingTop: "1%",
        borderRadius: height/50,
        backgroundColor: "lightgray",
    },
    spot: {
        marginVertical: 0,
        height: spotheight,
        overflow: "hidden",
    },
    actor: {
        height: spotheight * .45,
        fontSize: "125%",
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: "black",
        borderBottomWidth: 0,
        borderRadius: height/50,
        textAlign: "center",
        paddingTop: "1%"
    },
    navbar: {
        top: 0,
        height: "5%",
        width: "100%",
        overflow: "hidden"
    },
    toptext: {
        color: "rgba(127,127,127,.8)",
        fontSize: "250%"
    },
    toplevel: {
        height: "100%",
        color: "gray",
        margin: "auto",
    },
    textinput: {
        paddingLeft: height/100,
        fontSize: "125%",
        borderRadius: height/50
    },
    // BEHOLD THIS LOOKS TERRIBLE, but it's the positions that the suggestion boxes need to be assigned to.
    zero: {
        top: height * .17
    },
    one: {
        top: height * .22
    },
    two: {
        top: height * .27
    },
    three: {
        top: height * .3
    },
    four: {
        top: height * .35
    },
    five: {
        top: height * .4
    },
    six: {
        top: height * .43
    },
    seven: {
        top: height * .48
    },
    eight: {
        top: height * .53
    },
    nine: {
        top: height * .56
    },
    ten: {
        top: height * .61
    },
    eleven: {
        top: height * .66
    },
    twelve: {
        top: height * .69
    },
    thirteen: {
        top: height * .74
    },
    fourteen:{
        top: height * .79
    },
    fifteen: {
        top: height * .82
    },
    sixteen: {
        top: height * .87
    },
    seventeen: {
        top: height * .92
    }
})