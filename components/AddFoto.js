import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Platform, FlatList} from "react-native";
import { useNavigation } from "@react-navigation/native";


// its just a button to send to a page to check the products

function AddFoto() {
  
 const navigation = useNavigation();


  return (
    <>
      <TouchableOpacity onPress={() =>
        navigation.navigate('Products', {name: 'Products'})}>
        <Text style={styles.title}>Product foto Add or Check</Text>     
      </TouchableOpacity>
    </>
  )
}

export default AddFoto

const styles = StyleSheet.create({

  title: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 50,
    fontSize: 20,
    fontWeight:'600',
    textAlign: 'center',
    margin: 15
  },


})