import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput, TouchableOpacity, Text } from "./components/Themed"
import { StyleSheet, TextInput as HiddenText } from 'react-native'
import Data from "./constants/Data"

console.log(Object.keys(Data))

const filmmockdata : Array<string> = Object.keys(Data)



export default function Puzzle () {
    // function keyHandler(key: string, keyCode: number){
    //     inputRef.current.focus()
    //     console.log(key)
    //     if (key.length === 1 && /[a-zA-Z ]/.test(key)){
    //         console.log("etter")
    //         setTextOne(textOne + key)
    //     }
    //     else if (key === "Backspace" && textOne.length > 0){
    //         setTextOne(textOne.substring(0, textOne.length - 1))
    //     }
    // }

    // const [textOne, setTextOne] = useState("")

    // const inputRef = useRef(null);
    // useEffect(() => {
    //     inputRef.current && inputRef.current.focus();
    // }, []);

    // // 
    // <HiddenText ref={inputRef} style={{width: 0, height: 0}} onKeyPress={(e) => {
    //     // used to prevent from losing focus on pressing Tab or Enter
    //     if (e.keyCode === 9 || e.keyCode === 13 || e.key === "Alt"){
    //         e.preventDefault();
    //     }
    //     keyHandler(e.key);
    //     inputRef.current && inputRef.current.focus();
    // }}></HiddenText>
    
//     <TouchableOpacity onPress={() => keyHandler("q")}>
//     <Text>Q</Text>
// </TouchableOpacity>
// <TouchableOpacity onPress={() => keyHandler("w")}>
//     <Text>W</Text>
// </TouchableOpacity>
// <TouchableOpacity onPress={() => keyHandler("e")}>
//     <Text>E</Text>
// </TouchableOpacity>

    let holdoverdata = filmmockdata;
    let peekdisplays;
    let peektexts;
    let peekoldtexts;

    const [oldText, setOldText] = useState('')
    const [newoldtext, setnewoldtext] = useState(['','','','','',''])
    const [displays, setDisplays] = useState([
        "none","none","none",
        "none","none","none",
        "none","none","none",
        "none","none","none",
        "none","none","none",
        "none","none","none"])
    const [texts, setTexts] = useState([
        "","","",
        "","","",
        "","","",
        "","","",
        "","","",
        "","",""])

    function textHandler(text: string, column: number){
        let newData = [];
        for (let i = 0; i < holdoverdata.length; i += 1){
            if (holdoverdata[i].includes(text.toLowerCase())){
                newData.push(holdoverdata[i]);
            }
        }
        peektexts = texts;
        for (let i = (column * 3); i < Math.min((column + 1) * 3, (column * 3) + newData.length); i += 1){
            peektexts[i] = Data[newData[i - (column * 3)]][0];
        }
        setTexts(peektexts);
        // if this isn't here the text updates don't work. i have no idea why this is.
        setOldText(text);
        console.log(oldText);
        holdoverdata = newData;
        //console.log(holdoverdata);
        if (text.length < newoldtext[column].length){
            holdoverdata = filmmockdata;
            peekdisplays = displays;
            for (let i = column * 3; i < (column + 1) * 3; i += 1){
                peekdisplays[i] = "none";
            }
            setDisplays(peekdisplays);
        }
        else{
            peekdisplays = displays;
            for (let i = column * 3; i < (column + 1) * 3; i += 1){
                if (i - (column * 3) < newData.length){
                    peekdisplays[i] = "flex";
                }
                else{
                    peekdisplays[i] = "none";
                }
            }
            setDisplays(peekdisplays);
        }

        peekoldtexts = newoldtext;
        newoldtext[column] = text;
        setnewoldtext(peekoldtexts);
        // now we need to know where we are in the chain of command so we can render 3 suggestion boxes under.
    }

    return <View>
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value, 0)}}></TextInput>
        <TouchableOpacity style={{display: displays[0]}}>
            <Text>{texts[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[1]}}>
            <Text>{texts[1]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[2]}}>
            <Text>{texts[2]}</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value, 1)}}></TextInput>
        <TouchableOpacity style={{display: displays[3]}}>
            <Text>{texts[3]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[4]}}>
            <Text>{texts[4]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[5]}}>
            <Text>{texts[5]}</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value, 2)}}></TextInput>
        <TouchableOpacity style={{display: displays[6]}}>
            <Text>{texts[6]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[7]}}>
            <Text>{texts[7]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[8]}}>
            <Text>{texts[8]}</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value, 3)}}></TextInput>
        <TouchableOpacity style={{display: displays[9]}}>
            <Text>{texts[9]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[10]}}>
            <Text>{texts[10]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[11]}}>
            <Text>{texts[11]}</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value, 4)}}></TextInput>
        <TouchableOpacity style={{display: displays[12]}}>
            <Text>{texts[12]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[13]}}>
            <Text>{texts[13]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[14]}}>
            <Text>{texts[14]}</Text>
        </TouchableOpacity>
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value, 5)}}></TextInput>
        <TouchableOpacity style={{display: displays[15]}}>
            <Text>{texts[15]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[16]}}>
            <Text>{texts[16]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[17]}}>
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
    }
})