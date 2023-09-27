import React from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'


const Load = () => {

  
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
      />
      <Text style={{color: 'white'}}>EDUARDOOOO</Text>
    </View>
  )
}

const styles= StyleSheet.create({
  container:{
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 1,
  }
})



export default Load;