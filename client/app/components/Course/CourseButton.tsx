import { StyleSheet, Text, Image, View, Pressable, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { primaryColor } from '../../constants/Colors';
import ShadowView from 'react-native-shadow-view';
import ICourse from '../../models/ICourse';
import { BASE_URL } from '../../utils/config';

export default function CourseButton({navigation, isBought, course}: {navigation: any, isBought: boolean, course: ICourse}) {
  const screenWidth = Dimensions.get('window').width;
  const isNewCourse = course.avatar.startsWith("/uploads") ? true : false;
  const url = BASE_URL.slice(0, BASE_URL.length - 4);
  const price = course.price == 0 ? 'Free' : '$' + course.price.toString();

  return (
    <ShadowView style={[styles.shadowContainer, {width: screenWidth * 0.90}]}>
        <View style={styles.container}>
            <Pressable style={styles.info} onPress={() => navigation.navigate("AboutCourse", {course: course})}>
                <Image source={{uri: isNewCourse ? url + course.avatar : course.avatar}} style={styles.img}/>
                <View style={styles.about}>
                    <Text style={{ fontWeight: '600', fontSize: 18 }}>{course.title}</Text>
                    <Text>{course.lessonscount.toString()} уроков</Text>
                </View>
            </Pressable>
            {isBought ? 
                <Pressable style={styles.button} >
                    <Ionicons name="play" size={24} color={primaryColor} />
                    <Text style={{fontWeight: '400', color: primaryColor, fontSize: 16}}>Продолжить учиться</Text>
                    <View style={{ width: 24 }}></View>
                </Pressable> 
                : 
                <Pressable style={styles.button} onPress={() => navigation.navigate("Buy", {course: course})}>
                    <Text style={{fontWeight: '600', color: primaryColor, fontSize: 18}}>{price}</Text>
                    <Text style={{fontWeight: '400', color: primaryColor, fontSize: 16}}>Купить</Text>
                    <Text style={{fontWeight: '600', color: 'rgba(255, 255, 255, 0)', fontSize: 18}}>{price}</Text>
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