import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert, TouchableOpacity, SafeAreaView, Platform, FlatList, Image, KeyboardAvoidingView, TextInput, Modal } from "react-native";
import { Camera, CameraType } from 'expo-camera';
import { supabase } from "../supabase/supabase";
import { v4 as uuidv4} from 'uuid';

function Products() {
  const [openCamera, setOpenCamera] = useState(false);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [allItens, setAllItens] = useState();
  const [newProdName, setNewProdName] = useState("");
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


  // Add new prdocut to list and make sure has foto on /////////////////////////
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

  const addNewItem = async (storageUrl) => {
    let url = getFromStorage(storageUrl);
    
    // console.log(image);
    
    const { data: Products, error } = await supabase
    .from("Products")
    .insert([
      { prodName: newProdName, uri: image, fullUrl: url},
    ]);
    return Products;
  };


  // transform image //////
  async function uploadImages(newImageUrl) {
    let filename = uuidv4();
    let pathUser =  filename + ".jpg";
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
                    width={110}
                    height={130}
                    borderRadius={5}
                    alt="error"
              />
            </View>
            <TouchableOpacity  onPress={takePicture}>
              <Text style={styles.takePic}>TAKE PHOTO</Text>
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

         
          <TouchableOpacity style={styles.button} 
            onPress={() => {
              setOpenCamera(false)
              setImage(null);
              setNewProdName('');
            }}>
            <Text style={styles.takePic}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{alignSelf: 'center'}}>OR</Text>
           <TouchableOpacity style={styles.button}
            onPress={() => {
              uploadImages(image)
              .then((data) => {
              console.log('aaaaaaaaaa',data);
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
