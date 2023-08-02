import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Platform, FlatList} from "react-native";
import { supabase } from "../supabase/supabase";
import Task from './Task';

function Any() {
  const [allList, setAllList] = useState();
  const [count, setCount] = useState();

  const getList = async () => {
    let { data: Edstodo, error } = await supabase
    .from('Edstodo')
    .select('*')
    .order('place')
    .order('product');
      setAllList(Edstodo); 
      setCount(Edstodo.length);
      return Edstodo
  }  

  useEffect(() => {
    getList() 
  },[allList])

  return (

    <View style={styles.any}>
      <Text style={styles.title}>{count}  items to buy in total</Text>
      
      <FlatList
        style={styles.flatList}
        data={allList}
        renderItem={({ item }) => (
          <Task data={item}/> 
        )} 
      /> 
    </View>
  )
}

export default Any

const styles = StyleSheet.create({
  any: {
    backgroundColor: '#AEB6BD',
    height: Platform.OS === 'ios'? 550: 450,
    borderRadius: 5
  },
  title: {
    fontSize: 20,
    fontWeight:'600',
    textAlign: 'center',
    marginBottom: 10
  },
    flatList: {
    marginBottom: 2,
  }

})