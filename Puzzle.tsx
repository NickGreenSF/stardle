import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput, TouchableOpacity, Text } from "./components/Themed"
import { StyleSheet, TextInput as HiddenText } from 'react-native'

let mockdata : Array<String> = [
    "Harry Potter and the Half-Blood Prince",
    "Daniel Radcliffe",
    "Rupert Grint",
    "Emma Watson",
    "Helena Bonham Carter",
    "Robbie Coltrane",
    "Warwick Davis"
]

let filmmockdata : Array<String> = [
    "jericho",
    "iron man",
    "watership down",
    "harry potter and the half blood prince",
    "harry potter and the deathly hallows",
]



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

    const [oldText, setOldText] = useState('')
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

    function textHandler(text: string){
        console.log(oldText);
        if (text.length < oldText.length){
            console.log("less")
            holdoverdata = filmmockdata;
            peekdisplays = displays;
            peekdisplays[0] = "none";
            setDisplays(peekdisplays);
        }
        else{
            peekdisplays = displays;
            peekdisplays[0] = "flex";
            setDisplays(peekdisplays);
        }
        let newData = [];
        for (let i = 0; i < holdoverdata.length; i += 1){
            if (holdoverdata[i].includes(text.toLowerCase())){
                newData.push(holdoverdata[i]);
            }
        }
        peektexts = texts;
        for (let i = 0; i < newData.length; i += 1){
            peektexts[i] = newData[i];
        }
        setTexts(peektexts)
        setOldText(text)
        holdoverdata = newData;
        console.log(holdoverdata);
        // now we need to know where we are in the chain of command so we can render 3 suggestion boxes under.
    }

    return <View>
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value)}}></TextInput>
        <TouchableOpacity style={{display: displays[0]}}>
            <Text>{texts[0]}</Text>
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