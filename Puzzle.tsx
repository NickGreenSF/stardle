import React from 'react'
import { View, TextInput } from "./components/Themed"
import { StyleSheet } from 'react-native'

let mockdata : Array<String> = [
    "Harry Potter and the Half-Blood Prince",
    "Daniel Radcliffe",
    "Rupert Grint",
    "Emma Watson",
    "Helena Bonham Carter",
    "Robbie Coltrane",
    "Warwick Davis"
]

export default function Puzzle () {
    return <View>
        <TextInput style={styles.text}></TextInput>
        <TextInput style={styles.text}></TextInput>
        <TextInput style={styles.text}></TextInput>
        <TextInput style={styles.text}></TextInput>
        <TextInput style={styles.text}></TextInput>
        <TextInput style={styles.text}></TextInput>
        qwertyuiop
    </View>
}

const styles = StyleSheet.create({
    text: {
        flex: 1,
    },
})