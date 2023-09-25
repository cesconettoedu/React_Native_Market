import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, FlatList, Image, KeyboardAvoidingView, TextInput, Modal } from "react-native";
import { Camera, CameraType } from 'expo-camera';
import { supabase } from "../supabase/supabase";

function Products() {
  const [openCamera, setOpenCamera] = useState(false);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [allItens, setAllItens] = useState();
  const [newProdName, setNewProdName] = useState();
  const [visibImgleModal, setVisibleImgModal] = useState(false);
  const [single, setSingle] = useState({})

  

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
   useEffect(() => {
    getAllItens()      
  },[openCamera, visibImgleModal])


  // Add new prdocut to list /////////////////////////
  const addNewItem = async (storageUrl) => {
    
    const { data: Products, error } = await supabase
    .from("Products")
    .insert([
      { prodName: newProdName, uri: image},
    ]);
    return Products;
  };


  // Delete Product /////////////////////////////////////
   const deleteProd = async (id) => {
    const { data: Products, error } = await supabase
      .from('Products')
      .delete()
      .eq('id', id)
  }






  
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
    
          <FlatList      
            data={allItens}
            renderItem={ ({ item }) => (
              
              <View key={item.id} style={styles.itemSingle}>
                <TouchableOpacity
                  onPress={() => {setVisibleImgModal(true); 
                     setSingle(item)
                  }}
                >
                   {/* {console.log(single)}  */}
                  <Text style={styles.productName} numberOfLines={1}>{item.prodName}</Text>
                  <Image 
                    source={{uri: `${item.uri}`}}
                    width={100}
                    height={115}
                    borderRadius={8}
                    borderWidth={1}
                    borderColor={'rgb(90, 90, 90)'}
                    alt="error"
                    />
                </TouchableOpacity>
              </View>
              )}    
               numColumns={3}
          />
          
          <Modal
              visible={visibImgleModal}
              transparent={false}
              animationType="slide"
          >
            <SafeAreaView style={styles.modalImageCont}>        
              <Image 
                style={styles.modalImage}
                source={{uri: `${single.uri}`}}
                borderRadius={8}
                borderWidth={1}
                borderColor={'rgb(90, 90, 90)'}
                alt="error"
              />
              <Text style={styles.modalTitle}>{single.prodName}</Text>

              <View style={{flexDirection: 'row', top: 100}}>
                <TouchableOpacity style={styles.button} onPress={() => {deleteProd(single.id); setVisibleImgModal(false)}}>
                  <Text style={styles.takePic}>delete</Text>
                </TouchableOpacity>
                <Text style={{alignSelf: 'center'}}>OR</Text>
                <TouchableOpacity style={styles.button} onPress={() => setVisibleImgModal(false)}>
                  <Text style={styles.takePic}>close</Text>       
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Modal>

        </View>

        <TouchableOpacity onPress={() => setOpenCamera(true)}>
          <Text style={styles.title}>OPEN CAMERA</Text>
        </TouchableOpacity>
        
      </>
      }

      {openCamera && 
        <View style={styles.container}>
        

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

          <View style={styles.prevTakeBtn}>         
            <View style={styles.previewPic}>
              <Image 
                    source={{uri: `${image}`}}
                    width={80}
                    height={110}
                    borderRadius={8}
                    alt="error"
              />
            </View>
            <TouchableOpacity  onPress={takePicture}>
              <Text style={styles.takePic}>TAKE PIC</Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            behavior="padding"
            
          >
            <TextInput
              style={styles.input}
              underlineColorAndroid="transparent"
              placeholder="Product name or description"
              placeholderTextColor="#4a4e69"
              autoCapitalize='words'
              maxLength={42}
              value={newProdName}
              onChangeText={setNewProdName}
            />
          </KeyboardAvoidingView>


          <View style={{flexDirection: 'row'}}>

         
          <TouchableOpacity style={styles.button} onPress={() => setOpenCamera(false)}>
            <Text style={styles.takePic}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{alignSelf: 'center'}}>OR</Text>
           <TouchableOpacity style={styles.button}
            onPress={(data) => {
              addNewItem(data);
              setOpenCamera(false);                    
            }}
            >
            <Text style={styles.takePic}>Save</Text>
          </TouchableOpacity>

          </View>

        </View>
      }

    </>
  );
}



export default Products;

const styles = StyleSheet.create({
  listCont:{
    flex: 1,
    flexWrap: "wrap",
    padding: 10,
    borderRadius: 5,
    height: 580,
    backgroundColor: 'gray', 
  },
 
  itemSingle: {
    alignSelf: "center",
    width: 100,
    margin: 4,
    backgroundColor: 'rgb(210, 210, 210)',
    borderRadius: 8,
  },

  productName: {
    padding:5
  },
  
  container: {
    flex: 1,
    justifyContent: 'center',
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
  camera: {
    alignSelf: 'center',
    width: 250,
    height: Platform.OS === 'ios'? 550: 250,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    borderRadius: 20,
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

  prevTakeBtn:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    margin: 20
  },

  previewPic: {
    alignSelf: 'center',
    marginTop: 5,
    width: 80,
    height: Platform.OS === 'ios'? 550: 110,
    borderColor: "#4a4e69",
    borderWidth: 1, 
    borderRadius: 8
  },

  input: {
    borderRadius: 5,
    margin: 5,
    height: 40,
    borderColor: "#4a4e69",
    borderWidth: 1,
    paddingLeft: 10
  },



  modalImageCont:{
    justifyContent: "center",
    backgroundColor: 'rgba(0,0,0,.5)',
    height: "95%",
    margin: 10,
    borderRadius:8,
    alignItems: 'center',
  },
  modalImage: {
    margin: 10,
    width: '94%',
    height: 255
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 35,
  },


});
