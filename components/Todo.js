import React, {useState, useEffect, useMemo} from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Keyboard, KeyboardAvoidingView, TextInput, Platform} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from "../supabase/supabase";
import RadioGroup from 'react-native-radio-buttons-group';


import any from "../assets/logo/any11.png"
import costco from "../assets/logo/costco1.png"
import dollarama from "../assets/logo/dol22.png"
import All from "./All"
import Any from "./Any"
import Dollarama from "./Dollarama"
import Costco from "./Costco";

export default function Todo() {

  const [showLogo, setShowLogo] = useState(false);

  const [showAny, setShowAny] = useState(false);
  const [showDollarama, setShowDollarama] = useState(false);
  const [showCostco, setShowCostco] = useState(false);
  const [showAll, setShowAll] = useState(true);
   
  const [selectedId, setSelectedId] = useState('Any');
  const [prod, setProd] = useState();

 
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


  const handleAddProd = () => {
    Keyboard.dismiss();
    addNewProduct();
    setProd(null);
  }


  // add new product to buy
  const addNewProduct = async () => {
    const { data, error } = await supabase
    .from("Edstodo")
    .insert([
      { place: selectedId , product: prod },
    ]);
    return data;
  };
   

  const clickLogo = () => {
    setShowLogo(true)
    setTimeout(() => {
      setShowLogo(false)
    }, 1500);  
  }


  useEffect(() => {
    
  },[ ])
 
    return (
      <SafeAreaView behavior={Platform.OS === "ios" ? "padding" : "height"}>
    {/* </SafeAreaView>    <SafeAreaView behavior={Platform.OS === "ios" ? "padding" : "height"}> */}
    {showLogo &&
      <View style={{width: "100%", height: "100%",backgroundColor: '#000000', justifyContent: 'center'}}>
        <Image 
          source = {require('../assets/eulogoSquareTodo.png')} 
          style = {{ width: 340, height: 340,  }}
        />
        <Text style={{textAlign: 'center', color: '#7FB069', fontSize: 40, fontWeight: 600}}>Ed's Market List</Text>
      </View>
    }
    {!showLogo &&
      <>
      <View style={styles.all}>
        <TouchableOpacity 
         onPress={() => { clickLogo() }}
        >
        <Image 
          source = {require('../assets/eulogoSquareTodo.png')} 
          style = {{ width: 50, height: 50, marginRight: 30, borderRadius: 30, backgroundColor: '#000000' }}
        />

        </TouchableOpacity>
        <Text style={styles.eds}>Ed's Market List</Text>

        <TouchableOpacity 
          onPress={() => {setShowAll(true); setShowAny(false); setShowDollarama(false); setShowCostco(false)}}
        >
          <View style={ showAll && showAll ? [styles.logoAllSelected, { borderColor: '#AEB6BD'}] : styles.logoAll}>
            <Text>Show ALL</Text>
          </View>
        </TouchableOpacity>

      </View>
  
  
      <View style={styles.logoCont}>
        <TouchableOpacity
          onPress={() => {setShowAll(false); setShowAny(true); setShowDollarama(false); setShowCostco(false)}}
        >
          <View style={ showAny && showAny ? [styles.logoBackSelected, { borderColor: '#48A8F8'}] : styles.logoBack}>
            <Image
              source={any}
              alt="any"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {setShowAll(false); setShowAny(false); setShowDollarama(false); setShowCostco(true)}}
        >
          <View style={ showCostco && showCostco ? [styles.logoBackSelected, { borderColor: '#F35230'}] : styles.logoBack}>
            <Image
              source={costco}
              alt="costco"  
            />
          </View>
        </TouchableOpacity>
       
        <TouchableOpacity
          onPress={() => {setShowAll(false); setShowAny(false); setShowDollarama(true); setShowCostco(false)}}
        >
          <View style={ showDollarama && showDollarama ? [styles.logoBackSelected, { borderColor: '#008751'}] : styles.logoBack}>
            <Image
              source={dollarama}
              alt="dollarama"
            />
          </View>
        </TouchableOpacity>
       
      </View>

      {/* show task of a selected option*/}
        <View style={styles.taskContainer}>
          
          {showAll && <All/>}
          {showAny && <Any/>}
          {showDollarama && <Dollarama/>}
          {showCostco && <Costco/>}
          
        </View>



      {/* task to save */}
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.writeTaskWrapper}
      >
        <TextInput 
          style={styles.input} 
          placeholder={"What do you need buy?"} 
          autoCapitalize='sentences'
          maxLength={70}
          value={prod}
          onChangeText={text => setProd(text)} 
        />
        <View style={styles.radioAdd}>
        
          <RadioGroup 
            radioButtons={radioButtons} 
            onPress={setSelectedId}
            selectedId={selectedId}
            layout='row'
          />
        
          <TouchableOpacity 
            onPress={() => handleAddProd()}
          >
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+ 🛒</Text>
            </View>
          </TouchableOpacity>
        
        </View>
      </KeyboardAvoidingView>
      </>
      }   
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  all: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginHorizontal: 5
  },
  eds: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: "600",
    paddingRight: 15
  },
  logoAll:{
    width: 90,
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    marginLeft: 5
  },
  logoAllSelected: {
    width: 95,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
  },
  logoCont: {
    flexDirection: 'row',
    justifyContent: "space-around",
    paddingTop: 10
  },
  logoBack: {
    width: 110,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  logoBackSelected: {
    width: 115,
    height: 65,
    backgroundColor: '#FFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
  },
  taskContainer: {
    margin: 5,
    padding: 5,
    height: Platform.OS === 'ios'? 650: 560,
  },
  writeTaskWrapper: {
    position:'absolute',
    bottom: Platform.OS === 'ios'? 0: -5,
    width: '100%',
    justifyContent: "space-around",
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,    
  },
  input: {
    paddingVertical: Platform.OS === 'ios'? 10: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
    width: '82%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addWrapper: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    marginLeft: 15,
   
  }, 
  radioAdd: {
    flexDirection: 'row',
    paddingBottom: 15,
    marginTop: 10
  },
});
