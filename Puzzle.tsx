import React, { useState, useEffect, useRef } from 'react'
import { View, TextInput, TouchableOpacity, Text } from "./components/Themed"
import { StyleSheet, TextInput as DefaultInput } from 'react-native'
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

    let correct = Data['harry potter and the half blood prince'];
    console.log(correct)

    const [booltest, setBooltest] = useState(true);

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
    const [actors, setActors] = useState([correct[1],"_","_","_","_","_"])

    const [arrtest, setArrtest] = useState([styles.input])

    const inputRefs = [useRef(null), useRef(null)]

    function textHandler(text: string, column: number){
        let newData = [];
        for (let i = 0; i < holdoverdata.length; i += 1){
            if (holdoverdata[i].includes(text.toLowerCase())){
                newData.push(holdoverdata[i]);
            }
        }
        
        // if this isn't here the text updates don't work. i have no idea why this is.
        setOldText(text);
        console.log(oldText);
        holdoverdata = newData;
        //console.log(holdoverdata);
        if (text.length < newoldtext[column].length){
            peektexts = texts;
            for (let i = (column * 3); i < Math.min((column + 1) * 3, (column * 3) + newData.length); i += 1){
                peektexts[i] = "";
            }
            setTexts(peektexts);
            holdoverdata = filmmockdata;
            peekdisplays = displays;
            for (let i = column * 3; i < (column + 1) * 3; i += 1){
                peekdisplays[i] = "none";
            }
            setDisplays(peekdisplays);
        }
        else{
            peektexts = texts;
            for (let i = (column * 3); i < Math.min((column + 1) * 3, (column * 3) + newData.length); i += 1){
                peektexts[i] = Data[newData[i - (column * 3)]][0];
            }
            setTexts(peektexts);
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

    function guess(box: number){
        setBooltest(false);
        let section = Math.floor(box / 3);
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
            ref={inputRefs[0]} style={booltest ? arrtest[0] : styles.none} onChange={(e) => {textHandler(e.target.value, 0)}}>
        </DefaultInput>
        <View style={booltest ? styles.none : styles.input}>
            <Text>Harry Potter and the Half-Blood Prince</Text>
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
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value, 1)}}></TextInput>
        <TouchableOpacity style={{display: displays[3]}} onPress={() => guess(3)}>
            <Text>{texts[3]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[4]}} onPress={() => guess(4)}>
            <Text>{texts[4]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[5]}} onPress={() => guess(5)}>
            <Text>{texts[5]}</Text>
        </TouchableOpacity>
        <Text style={actors[2].length > 1 ? null : styles.black}>{actors[2]}</Text>
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value, 2)}}></TextInput>
        <TouchableOpacity style={{display: displays[6]}} onPress={() => guess(6)}>
            <Text>{texts[6]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[7]}} onPress={() => guess(7)}>
            <Text>{texts[7]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[8]}} onPress={() => guess(8)}>
            <Text>{texts[8]}</Text>
        </TouchableOpacity>
        <Text style={actors[3].length > 1 ? null : styles.black}>{actors[3]}</Text>
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value, 3)}}></TextInput>
        <TouchableOpacity style={{display: displays[9]}} onPress={() => guess(9)}>
            <Text>{texts[9]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[10]}} onPress={() => guess(10)}>
            <Text>{texts[10]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[11]}} onPress={() => guess(11)}>
            <Text>{texts[11]}</Text>
        </TouchableOpacity>
        <Text style={actors[4].length > 1 ? null : styles.black}>{actors[4]}</Text>
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value, 4)}}></TextInput>
        <TouchableOpacity style={{display: displays[12]}} onPress={() => guess(12)}>
            <Text>{texts[12]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[13]}} onPress={() => guess(13)}>
            <Text>{texts[13]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[14]}} onPress={() => guess(14)}>
            <Text>{texts[14]}</Text>
        </TouchableOpacity>
        <Text style={actors[5].length > 1 ? null : styles.black}>{actors[5]}</Text>
        <TextInput style={styles.input} onChange={(e) => {textHandler(e.target.value, 5)}}></TextInput>
        <TouchableOpacity style={{display: displays[15]}} onPress={() => guess(15)}>
            <Text>{texts[15]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[16]}} onPress={() => guess(16)}>
            <Text>{texts[16]}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{display: displays[17]}} onPress={() => guess(17)}>
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
    }
})