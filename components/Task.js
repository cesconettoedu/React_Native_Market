import React, {useState, useEffect, useMemo} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { supabase } from "../supabase/supabase";
import RadioGroup from 'react-native-radio-buttons-group';



const Task = ({data}) => {

  const [modalVisible, setModalVisible] = useState(false);

  const deleteItem = async (id) => {
    const { data: Edstodo, error } = await supabase
      .from('Edstodo')
      .delete()
      .eq('id', id)
    }
    
        
  // to move (update) market
  const radioButtons = useMemo(() => ([
        {
            id: 'Any', 
            label: 'Any',
            value: 'Any Market'
        },
        {
            id: 'Dollarama',
            label: 'Dollarama',
            value: 'Dollarama'
        },
        {
            id: 'Costco',
            label: 'Costco',
            value: 'Costco'
        }
    ]), []);      

  const [newPlace, setNewPlace] = useState();
  const [selectedId, setSelectedId] = useState(data.place);

  const updateProduct = async (id) => {
    const { data: Edstodo, error } = await supabase
    .from('Edstodo')
    .update({ place: newPlace, product: data.product })
    .eq('id', data.id)
    return Edstodo;
  };

  const handleUpProd = () => {
    setNewPlace(selectedId) //i use the ID as a name(place) here, not a number as in id from table 
  }
  
  useEffect(() => {
    updateProduct();
  },[modalVisible])


  

  return (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}>
        
        <View style={styles.itemLeft}> 

          <View style={ data.place === 'Costco'  ? styles.costcoColor :  data.place === 'Dollarama'  ? styles.dollaramaColor: styles.square}>
            <Text>{data.place}</Text>
          </View>     
          
          <Text style={styles.product} numberOfLines={1}>{data.product}</Text>
      
          <TouchableOpacity 
            style={styles.circularCont}
            onPress={() => {deleteItem(data.id)}}>
            <View style={styles.circular}><Text>🗑️</Text></View>
          </TouchableOpacity>
    
        </View>
          
      </TouchableOpacity>



        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={[styles.modalText, {textDecorationLine: 'underline'}]}>Full description:</Text>
              <Text style={styles.modalTextProd}>" {data.product} "</Text>
                       
              <Text style={styles.modalTextor}>{'\n'} {'\n'} If you want move to other market:</Text>
                
              <RadioGroup 
                radioButtons={radioButtons} 
                onPress={setSelectedId}
                selectedId={selectedId}
                layout='row'
              />

              <View style={styles.options}>
                
              <TouchableOpacity 
                onPress={() => {handleUpProd(); setModalVisible(!modalVisible)}}
              >
                <View style={[styles.button, styles.buttonClose]}>
                  <Text style={styles.textStyle}>Update</Text>
                </View>
              
              </TouchableOpacity>
          
                <Text style={styles.modalText}> {'\n'}OR</Text>
                
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Close description</Text>
              </TouchableOpacity>
                
              </View>
            </View>
          </View>
        </Modal>
    
    </View>
   
    
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    margin: 2, 
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  square: {
    width: 80,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
    alignItems: 'center',   
  },
  product: {
    //limit size of product description field
    width: Platform.OS === 'ios'? 220: 175
  },
  circular: {
    justifyContent: 'flex-end',
    width: 20,
    height: 20,
    left: Platform.OS === 'ios'? '180%': '60%'
  },
  costcoColor: {
    width: 80,
    height: 24,
    backgroundColor: 'red',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
    alignItems: 'center', 
  },
  dollaramaColor: {
    width: 80,
    height: 24,
    backgroundColor: 'green',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
    alignItems: 'center', 
  },



  
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: 'rgba(90, 90, 90, 0.9)',
  },
  modalView: {
    bottom: -40,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 7,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTextProd:{
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 600,
  },
  modalTextor: {
    margin: 15,
    textAlign: 'center',
  },
  options: {
    marginTop: 20
  }
});

export default Task