import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, Platform} from "react-native";
import { supabase } from "../supabase/supabase";
import Task from './Task';

function Dollarama() {
  const [allList, setAllList] = useState();
  

  const getList = async () => {
    let { data: Edstodo, error } = await supabase
    .from('Edstodo')
    .select('*')
    .eq('place', 'Dollarama')
    .order('product');  
      setAllList(Edstodo) 
      return Edstodo
  }  

  useEffect(() => {
    getList() 
  },[allList])

  return (

    <View style={styles.any}>
      <Text style={styles.title}>Dollarama Only</Text>
      
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

export default Dollarama

const styles = StyleSheet.create({
  any: {
    backgroundColor: '#008751',
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