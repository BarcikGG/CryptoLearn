import { StyleSheet, Text, View, Image, ScrollView, Pressable, Dimensions } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../utils/config';

export default function LessonScreen({route}: any) {
    const screenWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    const url = BASE_URL.slice(0, BASE_URL.length - 4);
    const { lesson } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: ''
        })
    });

    return (
        <View style={{alignItems: 'center', backgroundColor: 'white', width: '100%', height: '100%'}}>
            <ScrollView style={{width: '100%'}}>
                <Text style={styles.title}>{lesson.title}</Text>
                {lesson.image && <Image source={{uri: url + lesson.image}} style={[
                    styles.img, 
                    {width: screenWidth * 0.95, height: screenWidth * 0.95}]}/>}

                <View style={{paddingHorizontal: 15}}>
                    <Text style={styles.text}>{lesson.description}</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    img: {
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