import React from 'react'
import Puzzle from './Puzzle'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { View, Text } from './components/Themed'

export default function App () {
    return (
    <SafeAreaProvider>
        <Puzzle />
    </SafeAreaProvider>
    );
}