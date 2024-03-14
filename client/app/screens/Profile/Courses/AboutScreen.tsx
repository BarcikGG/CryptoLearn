import { StyleSheet, Text, View, Image, Dimensions, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../../../utils/config';
import { useRole } from '../../../contexts/RoleContext';

export default function AboutScreen({route}: any) {
    const { userRole } = useRole();
    const navigation = useNavigation();
    const { course } = route.params;
    const isNewCourse = course.avatar.startsWith("/uploads") ? true : false;
    const url = BASE_URL.slice(0, BASE_URL.length - 4);

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: 'Курс',
          headerRight: () => {
            if (userRole === 'admin') {
                return (
                    <TouchableOpacity style={{flexDirection: "row", gap: 16, alignItems: "center"}}>
                        <Ionicons onPress={() => navigation.navigate("Add lesson", {id: course.id})} name="add-circle-outline" size={24} color="black" />
                    </TouchableOpacity>
                )
            } else return null;
          },
        })
    });

    return (
        <View style={{alignItems: 'center', backgroundColor: 'white', width: '100%', height: '100%'}}>
            <ScrollView style={{width: '100%'}}>
                <Text style={styles.title}>{course.title}</Text>
                <Image source={{uri: isNewCourse ? url + course.avatar : course.avatar}} style={styles.img}/>

                <View style={{paddingHorizontal: 15}}>
                    <Text style={[styles.lessons, {marginBottom: 20}]}>О курсе</Text>
                    <Text style={styles.text}>{course.about}</Text>

                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                        <Text style={styles.lessons}>Продолжительность: </Text>
                        <Text style={[styles.lessons, {fontWeight: '400'}]}>{course.lessonscount.toString()} уроков</Text>
                    </View>

                    <Pressable>
                        <Text></Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    img: {
        width: 250,
        height: 250,
        alignSelf: 'center',
        marginHorizontal: 10,
        marginVertical: 20
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        marginVertical: 10
    },
    text: { 
        textAlign: 'left', 
        fontSize: 20
    },
    lessons: {
        fontSize: 20,
        fontWeight: '600'
    }
})