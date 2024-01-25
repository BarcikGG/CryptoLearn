import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import CourseButton from '../../components/Course/CourseButton'

export default function CoursesScreen({navigation, route}: {navigation: any, route: any}) {
    const { type } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: `Курсы по ${type}`,
        }, [])
    });
    //в зависимости от type отправлять гет запрос на нужный сервер (ендпоинт == type)
    
    //добавить проверку на то куплен курс или нет, и если нет, 
    //то отображать другой блок с переходом на страницу о курсе
    return (
        <View style={styles.container}>
            <CourseButton/>
            <CourseButton/>
            <CourseButton/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        flexDirection: 'column', 
        alignItems: 'center', 
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 16
    },
})