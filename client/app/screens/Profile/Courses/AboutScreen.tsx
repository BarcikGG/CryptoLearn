import { StyleSheet, Text, View, Image, Dimensions, ScrollView, Pressable } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../../utils/config';

export default function AboutScreen({route}: any) {
    const navigation = useNavigation();
    const { course } = route.params;
    const isNewCourse = course.avatar.startsWith("/uploads") ? true : false;
    const url = BASE_URL.slice(0, BASE_URL.length - 4);

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: 'Курс',
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