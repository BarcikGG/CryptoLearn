import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Image, TextInput, StyleSheet, Platform, Alert, SafeAreaView } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'; 
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../../contexts/AuthContext";
import $api from "../../http";
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from "../../utils/config";
import IUser from "../../models/IUser";
import { primaryColor } from "../../constants/Colors";

function EditProfileScreen({navigation, route}: any) {
    const { userId } = useAuth();
    const [ user ] = useState(route.params.user as IUser);
    const [username, setUsername] = useState<string>(user?.username || '');
    const [email, setEmail] = useState<string>(user?.email || '');
    const [firstname, setFirstname] = useState<string>(user?.name || '');
    const [surname, setSurname] = useState<string>(user?.surname || '');
    const [pickedImage, setPickedImage] = useState<string>('');

    const randomKey = new Date().getTime().toString();
    const imageUri = pickedImage || user?.avatar;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerRight: () => (
            <View style={{flexDirection: "row", gap: 16, alignItems: "center", paddingEnd: 10}}>
                <Text onPress={UpdateProfile} style={{fontSize: 20, color: primaryColor, fontWeight: '600'}}>Сохранить</Text>           
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
          selectionLimit: 1,
          base64: true
        });
      
        if (!result.canceled) {
          setPickedImage(result.assets[0].uri);
        }
    };

    const UpdateProfile = async () => {
        try {
            const formData = new FormData();
    
            if (pickedImage) {
                formData.append('image', {
                    uri: pickedImage,
                    type: 'image/jpeg',
                    name: 'photo.jpg',
                });
            } else {
                if (user.avatar) formData.append('image', user.avatar);
            }
    
            formData.append('id', user.id.toString());
            formData.append('username', username);
            formData.append('name', firstname);
            formData.append('surname', surname);
            formData.append('email', email);
    
            const response = await fetch(`${BASE_URL}/user-update`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
    
            const data = await response.json();
            //console.log(data);

            if (data.updatedUser.status == 404) {
                Alert.alert("Ошибка обновления", data.updatedUser.message);
            } else if (data.updatedUser.status == 401) {
                Alert.alert("Ошибка обновления", data.updatedUser.message);
            } else {
                navigation.replace('Main');
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
                <Image 
                    key={randomKey}
                    style={{ height: 150, width: 150, 
                        resizeMode: 'cover', 
                        borderRadius: 75,
                        marginBottom: 10 }} 
                    source={{uri: imageUri }} />
                <Text 
                    onPress={pickImage}
                    style={{fontSize: 20, color: primaryColor, fontWeight: '400', marginBottom: 20}}
                    >Выбрать новое фото
                </Text>
                
                <TextInput
                        placeholder={user.username ? user.username : "Никнейм"}
                        value={username}
                        onChangeText={text => setUsername(text)}
                        style={[styles.inputContainer]}
                />
                <View style={{
                        borderRadius: 15, 
                        backgroundColor: 'white',
                        borderColor: 'gray', 
                        borderWidth: 2,
                        width: '85%',
                        marginBottom: 10}}>
                    <TextInput
                        placeholder={user.name ? firstname : "Имя"}
                        value={firstname}
                        onChangeText={text => setFirstname(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder={user.surname ? surname : "Фамилия"}
                        value={surname}
                        onChangeText={text => setSurname(text)}
                        style={styles.inputLast}
                    />
                </View>
                <Text
                    style={{width: '75%', 
                        color: 'gray', 
                        fontSize: 16, 
                        marginBottom: 20}}
                        >
                        Введите имя для полного заполнения профиля.
                </Text>
                
                <TextInput
                        placeholder={user.email ? user.email : "Почта"}
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={[styles.inputContainer]}
                />
                <View style={{marginTop: -5, width: '85%'}}>
                    {user.isverified 
                        ?  <View style={{flexDirection: 'row', gap: 5}}>
                            <MaterialIcons name="verified" size={24} color="green"/>
                            <Text style={{textAlignVertical: 'center', fontSize: 16}}>Почта подтверждена!</Text>
                        </View>
                        : <View style={{flexDirection: 'row', gap: 5}}>
                            <MaterialIcons name="cancel" size={24} color="red"/>
                            <Text style={{textAlignVertical: 'center', fontSize: 16}}>Почта не подтверждена</Text>
                        </View>
                    } 
                </View>
            </SafeAreaView>
        </KeyboardAwareScrollView>
    )
};

const styles = StyleSheet.create({
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

export default EditProfileScreen;