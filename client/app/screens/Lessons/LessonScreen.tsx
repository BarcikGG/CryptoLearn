import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../utils/config';
import $api from '../../http';
import { useRole } from '../../contexts/RoleContext';

export default function LessonScreen({route}: any) {
    const { userRole } = useRole();
    const screenWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    const url = BASE_URL.slice(0, BASE_URL.length - 4);
    const { lesson } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: '',
          headerRight: () => {
            if (userRole === 'admin') {
                return (
                    <TouchableOpacity style={{flexDirection: "row", gap: 16, alignItems: "center"}}>
                        <Ionicons onPress={deleteCourse} name="trash-outline" size={24} color="red" />
                    </TouchableOpacity>
                )
            } else return null;
          },
        })
    });

    const deleteCourse = async () => {
        Alert.alert(
            'Подтверждение удаления',
            'Вы уверены, что хотите удалить этот урок?',
            [
                {
                    text: 'Отмена',
                    onPress: () => console.log('Удаление отменено'),
                    style: 'cancel',
                },
                {
                    text: 'Удалить',
                    onPress: async () => {
                        try {
                            const response = await $api.delete(`/lesson/${lesson.id}`);
                            Alert.alert('Успех!', 'Урок удален');
                            navigation.goBack();
                        } catch (error) {
                            Alert.alert('Ошибка', 'Не удалось удалить урок');
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={{alignItems: 'center', backgroundColor: 'white', width: '100%', height: '100%'}}>
            <ScrollView style={{width: '100%'}}>
                <Text style={styles.title}>{lesson.title}</Text>
                {lesson.image && 
                    <Image 
                        source={{uri: url + lesson.image}}
                        style={[
                            styles.img, 
                            {width: screenWidth * 0.95, height: screenWidth * 0.95}]}
                    />
                }
                <View style={{paddingHorizontal: 15}}>
                    <Text style={styles.text}>{lesson.description}</Text>
                </View>

                {/* TODO: 
                    add "complete" btn which sends req to server (add lesson to completed lessons) 
                */}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    img: {
        alignSelf: 'center',
        marginHorizontal: 10,
        marginVertical: 20,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginVertical: 10
    },
    text: { 
        textAlign: 'left', 
        fontSize: 20,
        paddingBottom: 30
    },
    lessons: {
        fontSize: 20,
        fontWeight: '600'
    }
})