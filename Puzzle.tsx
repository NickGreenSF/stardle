import React, { useState, useEffect, useRef } from 'react'
//import { View, TextInput, TouchableOpacity, Text } from "./components/Themed"
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Platform } from 'react-native'
import Data from "./constants/Data"
import PointlessWords from './constants/PointlessWords'

console.log(Object.keys(Data))

const filmmockdata : Array<string> = Object.keys(Data)

export default function Puzzle () {

    let holdoverdata = filmmockdata;
    let peekOldTexts;
    let peekGuessStyles;
    let peekBools;
    let peekGuessTexts;
    let peekHoverTexts;
    let peekHoverDisplays;

    const [correct] = useState(Data[filmmockdata[Math.floor(Math.random() * filmmockdata.length)]]);
    //console.log(correct)

    const [active, setActive] = useState(0);
    
    const [bools, setBools] = useState([true, false, false, false, false, false])

    const [oldText, setOldText] = useState('')
    const [newoldtext, setNewOldText] = useState(['','','','','',''])
    const [actors, setActors] = useState([correct[1],"_","_","_","_","_"])
    const [guessTexts, setGuessTexts] = useState(["","","","","",""])
    const [guessStyles, setGuessStyles] = useState([styles.input, styles.input, styles.input, styles.input, styles.input, styles.input])
    const [hoverTexts, setHoverTexts] = useState(["","",""])
    const [hoverDisplays, setHoverDisplays] = useState([false, false, false])

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
                section += 1;
            }
            setActors(peekactors);
            //console.log(actors);
            return;
        }
        else{
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
        if (box < 15){
            peekBools[section + 1] = true;
            let peekactors = actors;
            peekactors[section + 1] = correct[section + 2];
            setActors(peekactors);
            //console.log(actors);
        }
        setBools(peekBools);
        textHandler("", section);
    }

    return <View style={styles.toplevel}>
        <View style={styles.navbar}>navbar?</View>
        <TouchableOpacity 
            style={[styles.hover, styles.firstSug, hoverDisplays[0] ? null : styles.none]} 
            onPress={() => guess((active * 3))}>
                {hoverTexts[0]}
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.hover, styles.secondSug, hoverDisplays[1] ? null : styles.none]} 
            onPress={() => guess(1 + (active * 3))}>
                {hoverTexts[1]}
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.hover, styles.thirdSug, hoverDisplays[2] ? null : styles.none]} 
            onPress={() => guess(2 + (active * 3))}>
                {hoverTexts[2]}
        </TouchableOpacity>
        <View style={styles.container}>
            <View style={styles.spot}>
                <Text style={styles.actor}>{actors[0]}</Text>
                <TextInput 
                    style={bools[0] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 0)}}>
                </TextInput>
                <View style={[styles.input, bools[0] ? styles.none : guessStyles[0]]}>
                    <Text>{guessTexts[0]}</Text>
                </View>
            </View>
            <View style={styles.spot}>
                <Text style={actors[1].length > 1 ? styles.actor : styles.black}>{actors[1]}</Text>
                <TextInput 
                    style={bools[1] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 1)}}>
                </TextInput>
                <View style={[styles.input, bools[1] ? styles.none : guessStyles[1]]}>
                    <Text>{guessTexts[1]}</Text>
                </View>
            </View>
            <View style={styles.spot}>
                <Text style={actors[2].length > 1 ? styles.actor : styles.black}>{actors[2]}</Text>
                <TextInput style={bools[2] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 2)}}></TextInput>
                <View style={[styles.input, bools[2] ? styles.none : guessStyles[2]]}>
                    <Text>{guessTexts[2]}</Text>
                </View>
            </View>
            <View style={styles.spot}>
                <Text style={actors[3].length > 1 ? styles.actor : styles.black}>{actors[3]}</Text>
                <TextInput style={bools[3] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 3)}}></TextInput>
                <View style={[styles.input, bools[3] ? styles.none : guessStyles[3]]}>
                    <Text>{guessTexts[3]}</Text>
                </View>
            </View>
            <View style={styles.spot}>
                <Text style={actors[4].length > 1 ? styles.actor : styles.black}>{actors[4]}</Text>
                <TextInput style={bools[4] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 4)}}></TextInput>
                <View style={[styles.input, bools[4] ? styles.none : guessStyles[4]]}>
                    <Text>{guessTexts[4]}</Text>
                </View>
            </View>
            <View style={styles.spot}>
                <Text style={actors[5].length > 1 ? styles.actor : styles.black}>{actors[5]}</Text>
                <TextInput style={bools[5] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 5)}}></TextInput>
                <View style={[styles.input, bools[5] ? styles.none : guessStyles[5]]}>
                    <Text>{guessTexts[5]}</Text>
                </View>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    text: {
        margin: "5%",
    },
    container: {
        alignContent: 'center',
        marginHorizontal: "40%",
        height: "90%",
    },
    input: {
        borderWidth: 1,
        borderColor: "black",
        height: "50%"
    },
    none: {
        display: 'none'
    },
    black: {
        backgroundColor: "black",
        height: "50%"
    },
    hover: {
        overflow: "hidden",
        position: "absolute",
        width: "20%",
        height: "10%",
        borderWidth: 1,
        borderColor: "white",
        zIndex: 7,
        backgroundColor: "gray"
    },
    yellow: {
        backgroundColor: "#FFD185",
    },
    green: {
        backgroundColor: "#77D353",
    },
    gray: {
        backgroundColor: "gray",
    },
    spot: {
        marginVertical: "1%",
        height: "14%",
        overflow: "hidden",
    },
    actor: {
        height: "50%",
        fontSize: "100%",
        overflow: 'hidden',
        fontStyle: 'italic',
        borderWidth: 1,
        borderColor: "black",
        borderBottomWidth: 0
    },
    navbar: {
        top: 0,
        height: "5%"
    },
    firstSug: {
        top: "15%"
    },
    secondSug: {
        top: "35%"
    },
    thirdSug: {
        top: "55%"
    },
    toplevel: {
        height: "100%"
    }
})