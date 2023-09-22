import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Platform, FlatList, Image, KeyboardAvoidingView, TextInput } from "react-native";
import { Camera, CameraType } from 'expo-camera';
import { supabase } from "../supabase/supabase";

function Products() {
  const [openCamera, setOpenCamera] = useState(false);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [allItens, setAllItens] = useState();
  const [newProdName, setNewProdName] = useState("");
  
  

  // get all itens from supabase////////////////////////////////////
  const getAllItens = async () => {
    let { data: Products, error } = await supabase
    .from('Products')
    .select('*');
      setAllItens(Products);
      return Products
  }
  

  useEffect(() => {
    getAllItens()      
  },[])


    
  
  
  
  
  
  const addNewItem = async (storageUrl) => {
    
    const { data: Products, error } = await supabase
    .from("Products")
    .insert([
      { prodName: newProdName, uri: image},
    ]);
    return Products;
  };







  
// Camera  to work ///////////////////////////////////////////////////////////
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }
  
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  
  
  // Save Photo ////////////////////////////////////////////////////
  const takePicture = async () => {
    const data = await camera.takePictureAsync(null)
    setImage(data.uri);
  }
  

  
  
  
  return (
    <>

      {!openCamera &&
        <>
        <View style={styles.listCont}>
          <Text>Lista de Produtos</Text>

          <FlatList
            data={allItens}
            renderItem={ ({ item }) => (
              
              <View key={item.id}>
                  <Text>{item.prodName}</Text>
                  <Image source={{uri: `${item.uri}`}}
                    width={80}
                    height={110}
                    borderRadius={8}
                    
                    alt="error"
                  />
              </View>
              )}
              
             
          />
        </View>





        <TouchableOpacity onPress={() => setOpenCamera(true)}>
          <Text style={styles.title}>OPEN CAMERA</Text>
        </TouchableOpacity>
      
        </>
      }

      {openCamera && 
        <View style={styles.container}>
          <TouchableOpacity onPress={() => setOpenCamera(false)}>
        <Text style={styles.takePic}>CLOSE CAMERA</Text>

        </TouchableOpacity>
          <Camera style={styles.camera} type={type} ref={ref => setCamera(ref)}>
            <View style={styles.buttonContainer}>
              {/* CAMERA WILL SHOW HERE */}
              {/* 
                TO FLIP THE CAMERA
              <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity> */}
            </View>
          </Camera>
              <TouchableOpacity  onPress={takePicture}>
                <Text style={styles.takePic}>TAKE PIC</Text>
              </TouchableOpacity>

          <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Product Name"
              placeholderTextColor="#4a4e69"
              autoCapitalize='words'
              maxLength={30}
              value={newProdName}
              onChangeText={setNewProdName}
            />
          </KeyboardAvoidingView>

          <TouchableOpacity style={styles.button}
             
              onPress={(data) => {
                console.log('submit');
                  addNewItem(data);
                              
              }}
            >
            <Text style={styles.takePic}>Submit</Text>
          </TouchableOpacity>
        </View>
      }

    </>
  );
}



export default Products;

const styles = StyleSheet.create({
  listCont:{
    height: 580,
    backgroundColor: 'gray'
  },

  title: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: 50,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    margin: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  takePic: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: 10,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    margin: 15,
    padding: 15
  },
  input: {
    borderRadius: 5,
    margin: 5,
    height: 40,
    borderColor: "#4a4e69",
    borderWidth: 1,
    paddingLeft: 10
  },
});
