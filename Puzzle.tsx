import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput, TouchableOpacity, Text } from "./components/Themed"
import { StyleSheet, TextInput as DefaultInput } from 'react-native'
import Data from "./constants/Data"
import PointlessWords from './constants/PointlessWords'

console.log(Object.keys(Data))

const filmmockdata : Array<string> = Object.keys(Data)

export default function Puzzle () {

    let holdoverdata = filmmockdata;
    let peekTexts;
    let peekOldTexts;
    let peekGuessStyles;
    let peekBools;
    let peekGuessTexts;

    const [correct] = useState(Data[filmmockdata[Math.floor(Math.random() * filmmockdata.length)]]);
    console.log(correct)
    
    const [bools, setBools] = useState([true, true, true, true, true, true])

    const [oldText, setOldText] = useState('')
    const [newoldtext, setNewOldText] = useState(['','','','','',''])
    const [texts, setTexts] = useState([
        "","","",
        "","","",
        "","","",
        "","","",
        "","","",
        "","",""])
    const [actors, setActors] = useState([correct[1],"_","_","_","_","_"])
    const [guessTexts, setGuessTexts] = useState(["","","","","",""])
    const [guessStyles, setGuessStyles] = useState([styles.input, styles.input, styles.input, styles.input, styles.input, styles.input])

    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

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
        if (text.length < newoldtext[column].length){
            peekTexts = texts;
            for (let i = (column * 3); i < Math.min((column + 1) * 3, (column * 3) + newData.length); i += 1){
                peekTexts[i] = "";
            }
            setTexts(peekTexts);
            holdoverdata = filmmockdata;
        }
        else{
            peekTexts = texts;
            for (let i = (column * 3); i < (column + 1) * 3; i += 1){
                if (i < (column * 3) + newData.length){
                    peekTexts[i] = Data[newData[i - (column * 3)]][0];
                }
                else{
                    peekTexts[i] = "";
                }
            }
            setTexts(peekTexts);
        }

        peekOldTexts = newoldtext;
        newoldtext[column] = text;
        setNewOldText(peekOldTexts);
        // now we need to know where we are in the chain of command so we can render 3 suggestion boxes under.
    }

    function guess(box: number){
        let section = Math.floor(box / 3);
        peekGuessTexts = guessTexts;
        peekGuessTexts[section] = texts[box];
        setGuessTexts(peekGuessTexts);
        //setBooltest(false);
        if (texts[box] === correct[0]){
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
            return;
        }
        else{
            let wordsGuess = new Set(texts[box].split(" "));
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
        setBools(peekBools);
        if (box < 15){
            let peekactors = actors;
            peekactors[section + 1] = correct[section + 2];
            setActors(peekactors);
            console.log(actors);
        }
        textHandler("", section);
    }

    return <View>
        <Text>{actors[0]}</Text>
        <DefaultInput 
            ref={inputRefs[0]} style={bools[0] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 0)}}>
        </DefaultInput>
        <View style={bools[0] ? styles.none : guessStyles[0]}>
            <Text>{guessTexts[0]}</Text>
        </View>
        <TouchableOpacity style={styles.hover} onPress={() => guess(0)}>
            <Text>{texts[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(1)}>
            <Text>{texts[1]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(2)}>
            <Text>{texts[2]}</Text>
        </TouchableOpacity>
        <Text style={actors[1].length > 1 ? null : styles.black}>{actors[1]}</Text>
        <DefaultInput 
            ref={inputRefs[1]} style={bools[1] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 1)}}>
        </DefaultInput>
        <View style={bools[1] ? styles.none : guessStyles[1]}>
            <Text>{guessTexts[1]}</Text>
        </View>
        <TouchableOpacity style={styles.hover} onPress={() => guess(3)}>
            <Text>{texts[3]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(4)}>
            <Text>{texts[4]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(5)}>
            <Text>{texts[5]}</Text>
        </TouchableOpacity>
        <Text style={actors[2].length > 1 ? null : styles.black}>{actors[2]}</Text>
        <TextInput style={bools[2] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 2)}}></TextInput>
        <View style={bools[2] ? styles.none : guessStyles[2]}>
            <Text>{guessTexts[2]}</Text>
        </View>
        <TouchableOpacity style={styles.hover} onPress={() => guess(6)}>
            <Text>{texts[6]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(7)}>
            <Text>{texts[7]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(8)}>
            <Text>{texts[8]}</Text>
        </TouchableOpacity>
        <Text style={actors[3].length > 1 ? null : styles.black}>{actors[3]}</Text>
        <TextInput style={bools[3] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 3)}}></TextInput>
        <View style={bools[3] ? styles.none : guessStyles[3]}>
            <Text>{guessTexts[3]}</Text>
        </View>
        <TouchableOpacity style={styles.hover} onPress={() => guess(9)}>
            <Text>{texts[9]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(10)}>
            <Text>{texts[10]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(11)}>
            <Text>{texts[11]}</Text>
        </TouchableOpacity>
        <Text style={actors[4].length > 1 ? null : styles.black}>{actors[4]}</Text>
        <TextInput style={bools[4] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 4)}}></TextInput>
        <View style={bools[4] ? styles.none : guessStyles[4]}>
            <Text>{guessTexts[4]}</Text>
        </View>
        <TouchableOpacity style={styles.hover} onPress={() => guess(12)}>
            <Text>{texts[12]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(13)}>
            <Text>{texts[13]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(14)}>
            <Text>{texts[14]}</Text>
        </TouchableOpacity>
        <Text style={actors[5].length > 1 ? null : styles.black}>{actors[5]}</Text>
        <TextInput style={bools[5] ? styles.input : styles.none} onChange={(e) => {textHandler(e.target.value, 5)}}></TextInput>
        <View style={bools[5] ? styles.none : guessStyles[5]}>
            <Text>{guessTexts[5]}</Text>
        </View>
        <TouchableOpacity style={styles.hover} onPress={() => guess(15)}>
            <Text>{texts[15]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(16)}>
            <Text>{texts[16]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.hover} onPress={() => guess(17)}>
            <Text>{texts[17]}</Text>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({
    text: {
        margin: 5,
    },
    container: {
        alignContent: 'center'
    },
    input: {
        borderWidth: 1,
        borderColor: "black"
    },
    none: {
        display: 'none'
    },
    black: {
        backgroundColor: "black"
    },
    hover: {
        overflow: 'hidden'
    },
    yellow: {
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "yellow",
    },
    green: {
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "green",
    },
    gray: {
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "gray",
    }
})