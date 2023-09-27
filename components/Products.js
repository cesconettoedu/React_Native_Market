import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert,ImageBackground, TouchableOpacity, SafeAreaView, Platform, FlatList, Image, KeyboardAvoidingView, TextInput, Modal } from "react-native";
import { Camera, CameraType } from 'expo-camera';
import { supabase } from "../supabase/supabase";
import { v4 as uuidv4} from 'uuid';
import * as ImagePicker from "expo-image-picker";
import bgImage from '../assets/general/waitImage.png'

function Products() {
  const [openCamera, setOpenCamera] = useState(false);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [allItens, setAllItens] = useState();
  const [newProdName, setNewProdName] = useState("");
  const [visibImgleModal, setVisibleImgModal] = useState(false);
  const [single, setSingle] = useState({})
  const [pathFoto, setPathFoto] = useState();
  
  

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


  // Add new product to list and make sure has foto on /////////////////////////
  const toAddNewItem =(data) =>{
    if(image !== null ){
      addNewItem(data);
      setOpenCamera(false); 
    } else {
      Alert.alert(
        'Alert',
        'Please take a photo',
        [
          {
            text: 'Close',
            onDismiss: () => Alert.alert('Cancel Pressed'),
            style: 'cancel',
          },
        ], 
      );
    }
  }
      //to add but first check with the func above//
  const addNewItem = async (storageUrl) => {
    let url = getFromStorage(storageUrl);
    const { data: Products, error } = await supabase
    .from("Products")
    .insert([
      { prodName: newProdName, uri: image, fullUrl: url},
    ]);
    return Products;
  };

  // transform image name to work with storage//////
  async function uploadImages(newImageUrl) {
    let filename = uuidv4();
    let pathUser =  filename + ".jpg";
    setPathFoto(pathUser);
    let file = newImageUrl;
    let formData = new FormData();
    formData.append('Files',{
      uri: file,
      name: filename,
      type: "image/jpg",
    });
    const { data, error } = await supabase    
      .storage
      .from('prodImageStorage')
      .upload(pathUser, formData )
    if(!data) {
      console.log(error);
    }
    return data
  }
  //to get the fullUrl from Storage
   const getFromStorage = (path) => {  
    const { data } = supabase
      .storage
      .from('prodImageStorage')
      .getPublicUrl(path)
      return data.publicUrl   
  }



  /////////////////////// Delete Product /////////////////////////////////////
  const deleteProd = async (data) => {
    // console.log("DDDDDDDDDDDd",data);
    deleteStorageFile(pathFoto);
    deleteInfo(data.id);
  }
    ////delete row from Table///
  const deleteInfo = async (id) => {
    const { data: Products, error } = await supabase
      .from('Products')
      .delete()
      .eq('id', id)
  }
    ///delete image saved at Storage Supabase ////
  const deleteStorageFile = async (path) => {
    const { data, error } = await supabase
    .storage
    .from('prodImageStorage')
    .remove([path])
  }
  


///////////////// Camera  to work ///////////////////////////////////////////////////////////
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






  //to get image from device ////////////////////////////////////////
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [12, 16],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  

  
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
                   {/* {console.log(item)}  */}
                  <Text style={styles.productName} numberOfLines={1}>{item.prodName}</Text>
                  <Image 
                    source={{uri: `${item.fullUrl}`}}
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
          
          {/* ////// MODAL WHEN CLICK O LIST /////////////////////// */}
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

              <View style={{flexDirection: 'row', top: 100, marginBottom: 10}}>
                <TouchableOpacity style={styles.button} 
                  onPress={() => {
                    deleteProd(single); 
                    setVisibleImgModal(false)
                  }}>



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
            <Text style={styles.title}>Add new Item</Text>  
          </TouchableOpacity>

                         
        
      </>
      }

      {openCamera && 
        <View style={styles.container}>
        
          <Text style={styles.live}> ● Live</Text>
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
              <ImageBackground source={bgImage} resizeMode="cover">

              <Image 
                    source={{uri: `${image}`}}
                    width={110}
                    height={130}
                    borderRadius={5}
                    alt="error"
                    />
            </ImageBackground>
            </View>

            <View style={{flexDirection: 'column'}}>
              
              <TouchableOpacity  onPress={pickImage}>
                <Text style={styles.takePic1}>Get from Device</Text>
              </TouchableOpacity>
              
              <Text style={{alignSelf: 'center'}}>OR</Text>
              
              <TouchableOpacity  onPress={takePicture}>
                <Text style={styles.takePic1}>Take Photo</Text>
              </TouchableOpacity>
            </View>

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

         
          <TouchableOpacity style={styles.button} 
            onPress={() => {
              setOpenCamera(false)
              setImage(null);
              setNewProdName('');
            }}>
            <Text style={styles.takePic}>Cancel</Text>
          </TouchableOpacity>
         
           <TouchableOpacity style={styles.button}
            onPress={() => {
              uploadImages(image)
              .then((data) => {
              // console.log('aaaaaaaaaa',data);
                toAddNewItem(data.path);
                setImage(null);
                setNewProdName('');
              })
                             
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
    borderRadius: 5,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    margin: 15,
    padding: 5
  },
  live: {
    alignSelf: 'center',
    color: 'red',
    zIndex: 99,
    top: 20
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
  takePic1: {
    borderWidth: 1,
    borderColor: "#C0C0C0",
    borderRadius: 10,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    margin: 10,
    padding: 8
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
    width: 112,
    height: Platform.OS === 'ios'? 550: 132,
    borderColor: "#4a4e69",
    borderWidth: 1, 
    borderRadius: 6
  },

  input: {
     alignSelf: 'center',
    width: '90%',
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
    height: "98%",
    margin: 10,
    borderRadius:8,
    alignItems: 'center',
  },
  modalImage: {
    margin: 10,
    width: 300,
    height: 300,
    resizeMode: 'stretch',
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 35,
    padding: 1
  },


});
