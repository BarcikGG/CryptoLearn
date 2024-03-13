import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { View, Text, Image, TextInput, StyleSheet, Alert, SafeAreaView } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from "../../../utils/config";
import { primaryColor } from "../../../constants/Colors";
import SelectDropdown from "react-native-select-dropdown";

function AddCourseScreen({navigation, route}: any) {
    const themes = ['crypto', 'trading', 'all'];
    const [title, setTitle] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [about, setAbout] = useState<string>('');
    const [theme, setTheme] = useState<string>('');
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
        if (!title || !about || !price || !theme) return;
        try {
            const formData = new FormData();
    
            if (pickedImage) {
                const imageBlob: Blob = {
                    uri: pickedImage,
                    type: 'image/jpeg',
                    name: 'photo.jpg',
                };
            
                formData.append('image', imageBlob);
                formData.append('title', title);
                formData.append('about', about);
                formData.append('price', price);
                formData.append('theme', theme);
        
                const response = await fetch(`${BASE_URL}/add-course`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                });
        
                const data = await response.json();
                if (data.course.status == 404 ||  data.course.status == 401) {
                    Alert.alert("Ошибка добавления", data.course.message);
                } else {
                    navigation.replace('Courses', {type: 'all'});
                }
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
                    placeholder="Название курса"
                    value={title}
                    onChangeText={text => setTitle(text)}
                    style={[styles.inputContainer]}
                />
                <Image
                    style={{ height: 200, width: 200,
                        resizeMode: 'cover', 
                        borderRadius: 75,
                        marginBottom: 10 }} 
                    source={{uri: imageUri }} />
                <Text 
                    onPress={pickImage}
                    style={{fontSize: 20, color: primaryColor, fontWeight: '400', marginBottom: 20}}
                    >Выбрать фото
                </Text>
                
                <TextInput
                    placeholder="Описание курса"
                    value={about}
                    onChangeText={text => setAbout(text)}
                    style={[styles.inputContainer]}
                />
                <TextInput
                    placeholder="Цена $"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={text => setPrice(text)}
                    style={[styles.inputContainer]}
                />

                <SelectDropdown
                        defaultButtonText="Выберите тип курса"
                        buttonStyle={styles.dropBtn}
                        dropdownStyle={styles.drop}
                        data={themes}
                        onSelect={(selectedItem) => {
                            setTheme(selectedItem);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item;
                        }}
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

export default AddCourseScreen;