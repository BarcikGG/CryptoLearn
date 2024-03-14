import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { View, Text, Image, TextInput, StyleSheet, Alert, SafeAreaView } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { primaryColor } from "../../constants/Colors";
import { BASE_URL } from "../../utils/config";

function AddLessonScreen({navigation, route}: any) {
    const { id } = route.params;
    const [title, setTitle] = useState<string>('');
    const [about, setAbout] = useState<string>('');
    const [pickedImage, setPickedImage] = useState<string>('');
    
    const imageUri = useMemo(() => {
        return pickedImage || "";
    }, [pickedImage]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerRight: () => (
            <View style={{flexDirection: "row", gap: 16, alignItems: "center", paddingEnd: 10}}>
                <Text onPress={AddCourse} style={{fontSize: 20, color: primaryColor, fontWeight: '600'}}>Создать</Text>           
            </View>
            ),
            headerLeft: () => (
            <View style={{flexDirection: "row", gap: 16, alignItems: "center", paddingStart: 10}}>
                <Text onPress={() => navigation.goBack()} style={{fontSize: 20, color: primaryColor, fontWeight: '400'}}>Назад</Text>
            </View>
            )
        }, [])
    });

    useEffect(() => {
        ensurePermissions();
    }, []);

    const ensurePermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Необходимо разрешение на использование фото.');
        }
    };

    const compressImage = async (uri: string) => {
        try {
          const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 600, height: 600 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );
      
          return manipResult.uri;
        } catch (error) {
          console.error('Error compressing image:', error);
          return uri;
        }
      };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
          selectionLimit: 1,
          base64: true
        });
      
        if (!result.canceled) {
            const compressedImg = await compressImage(result.assets[0].uri);
            setPickedImage(compressedImg);
        }
    };

    const AddCourse = async () => {
        if (!title || !about) return;
        try {
            const formData = new FormData();

            if (pickedImage) {
                const imageBlob: Blob = {
                    uri: pickedImage,
                    type: 'image/jpeg',
                    name: 'photo.jpg',
                };

                formData.append('image', imageBlob);
            } else {
                formData.append('image', '');
            }
            
            formData.append('id', id);
            formData.append('title', title);
            formData.append('about', about);
    
            const response = await fetch(`${BASE_URL}/add-lesson`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
    
            const data = await response.json();
            if (data.lesson.status == 404 ||  data.lesson.status == 401) {
                Alert.alert("Ошибка добавления", data.lesson.message);
            } else {
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error sending data to server:', error);
        }
    };
         

    return (
        <KeyboardAwareScrollView style={{
            backgroundColor: 'white'
        }}>
            <SafeAreaView
                style={{
                    marginTop: 20, 
                    justifyContent: 'center', 
                    alignItems: 'center'}}>
                
                <TextInput
                    placeholder="Название урока"
                    value={title}
                    onChangeText={text => setTitle(text)}
                    style={[styles.inputContainer]}
                />
                {pickedImage && <Image
                    style={{ height: 200, width: 200,
                        resizeMode: 'cover', 
                        borderRadius: 10,
                        marginBottom: 10 }} 
                    source={{uri: imageUri }} />}
                <Text 
                    onPress={pickImage}
                    style={{fontSize: 20, color: primaryColor, fontWeight: '400', marginBottom: 20}}
                    >Выбрать фото
                </Text>
                
                <TextInput
                    placeholder="Содержимое урока"
                    value={about}
                    multiline={true}
                    onChangeText={text => setAbout(text)}
                    style={[styles.inputContainer, {height: 'auto', minHeight: 45}]}
                />
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
};

const styles = StyleSheet.create({
    drop: {
        marginTop: 5,
        borderRadius: 15
    },
    dropBtn: {
        backgroundColor: 'white', 
        borderColor: 'gray',
        borderWidth: 2,
        borderRadius: 15,
        width: '85%'
    },
    Container: {
        fontWeight: '500',
        fontSize: 20,
        marginBottom: 20,
        paddingStart: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 15,
        height: 45,
        width: '85%',
        textAlignVertical: 'center'
    },
    inputContainer: {
        fontSize: 20,
        marginBottom: 20,
        paddingStart: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 15,
        height: 45,
        width: '85%'
    },
    input: {
        borderRadius: 15,
        fontSize: 20,
        paddingStart: 20,
        backgroundColor: 'white',
        height: 45,
        width: '100%',
        borderColor: 'gray',
        borderBottomWidth: 1,
    },
    inputLast: {
        borderRadius: 15,
        fontSize: 20,
        paddingStart: 20,
        backgroundColor: 'white',
        height: 45,
        width: '100%',
    }
});

export default AddLessonScreen;