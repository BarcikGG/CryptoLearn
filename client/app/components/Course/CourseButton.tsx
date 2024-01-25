import { StyleSheet, Text, Image, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { primaryColor } from '../../constants/Colors';

export default function CourseButton() {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Image source={{uri: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"}} style={styles.img}/>
        <View style={styles.about}>
            <Text style={{ fontWeight: '600', fontSize: 18 }}>Course name</Text>
            <Text>Amount of lessons</Text>
        </View>
      </View>
      <View style={styles.button}>
        <Ionicons name="play" size={24} color={primaryColor} />
        <Text style={{fontWeight: '400', color: primaryColor, fontSize: 16}}>Продолжить учиться</Text>
        <View style={{ width: 24 }}></View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        borderRadius: 15,
        height: 'auto',
        width: '100%',
        backgroundColor: 'white'
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
    }
})