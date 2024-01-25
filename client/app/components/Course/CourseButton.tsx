import { StyleSheet, Text, Image, View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { primaryColor } from '../../constants/Colors';
import ShadowView from 'react-native-shadow-view';
import ICourse from '../../models/ICourse';

export default function CourseButton({isBought, course}: {isBought: boolean, course: ICourse}) {
  return (
    <ShadowView style={styles.shadowContainer}>
        <View style={styles.container}>
            <View style={styles.info}>
                <Image source={{uri: course.avatar}} style={styles.img}/>
                <View style={styles.about}>
                    <Text style={{ fontWeight: '600', fontSize: 18 }}>{course.title}</Text>
                    <Text>{course.lessonscount.toString()} уроков</Text>
                </View>
            </View>
            {isBought ? 
                <Pressable style={styles.button}>
                    <Ionicons name="play" size={24} color={primaryColor} />
                    <Text style={{fontWeight: '400', color: primaryColor, fontSize: 16}}>Продолжить учиться</Text>
                    <View style={{ width: 24 }}></View>
                </Pressable> 
                : 
                <Pressable style={styles.button}>
                    <Text style={{fontWeight: '600', color: primaryColor, fontSize: 18}}>${course.price.toString()}</Text>
                    <Text style={{fontWeight: '400', color: primaryColor, fontSize: 16}}>Купить</Text>
                    <View style={{ width: 24 }}></View>
                </Pressable>
            }
        </View>
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
        width: '100%',
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