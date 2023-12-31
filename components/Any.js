import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList} from "react-native";
import { supabase } from "../supabase/supabase";
import Task from './Task';

function Any() {
  const [allList, setAllList] = useState();
  

  const getList = async () => {
    let { data: Edstodo, error } = await supabase
    .from('Edstodo')
    .select('*')
    .eq('place', 'Any')
    .order('product');  
      setAllList(Edstodo) 
      return Edstodo
  }  

  useEffect(() => {
    getList() 
  },[allList])

  return (

    <View style={styles.any}>
      <Text style={styles.title}>Any Market</Text>
      
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
    backgroundColor: '#48A8F8',
    height: Platform.OS === 'ios'? 550: 400,
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