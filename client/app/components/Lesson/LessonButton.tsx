import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { primaryColor } from '../../constants/Colors';
import ShadowView from 'react-native-shadow-view';
import ILesson from '../../models/ILesson';

export default function LessonButton({navigation, lesson}: {navigation: any, lesson: ILesson}) {
  const screenWidth = Dimensions.get('window').width;

  return (
    <ShadowView style={[styles.shadowContainer, {width: screenWidth * 0.90}]}>
        <Pressable style={styles.container} onPress={() => navigation.navigate("Lesson", {lesson: lesson})}>
            <View style={styles.info} >
                <View style={styles.about}>
                    <Text style={{ fontWeight: '600', fontSize: 18 }}>{lesson.title}</Text>
                </View>
            </View>
            <View style={styles.button} >
                <Ionicons name="play" size={24} color={primaryColor} />
                <Text style={{fontWeight: '400', color: primaryColor, fontSize: 16}}>Открыть</Text>
                <View style={{ width: 24 }}></View>
            </View> 
        </Pressable>
    </ShadowView>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderRadius: 15,
        height: 'auto',
        width: '100%',
        backgroundColor: 'white',
    },
    info: {
        flexDirection: 'row',
        padding: 10,
        gap: 10
    },
    button: {
        padding: 10,
        borderTopWidth: 1,
        borderColor: 'lightgray',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    img: {
        marginVertical: 10,
        marginLeft: 10,
        height: 70,
        width: 70,
    },
    about: {
        marginVertical: 10,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    shadowContainer: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
})