import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import $api from '../../http';
import Loading from '../../components/elements/Loading';
import CourseButton from '../../components/Course/CourseButton';
import ILesson from '../../models/ILesson';
import LessonButton from '../../components/Lesson/LessonButton';

export default function LessonsScreen({navigation, route}: {navigation: any, route: any}) {
    let { course } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [lessons, setLessons] = useState<ILesson[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: course.title,
        }, [navigation, course])
    });

    const fetchLessons = async() => {
        try {
            const response = await $api.get(`/lessons/${course.id}`);
            setLessons(response.data);
        } catch (error) {
            console.error('Error getting courses:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить уроки');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        fetchLessons();
    }, [refreshing]);

    const onRefresh = () => {
        setRefreshing(true);
    };

    if (isLoading) {
        return (
            <Loading/>
        );
    }

    return (
        <View style={{backgroundColor: 'white', width: '100%'}}>
            {lessons ? 
                <FlatList
                data={lessons.map((lesson, index) => ({ key: index, lesson: lesson }))}
                keyExtractor={(item) => item.key.toString()}
                renderItem={({ item }) => {
                    return <LessonButton lesson={item.lesson} navigation={navigation} />;
                }}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={true}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            :
                <View style={styles.container}>
                    <Text style={{ 
                        textAlign: 'center', 
                        fontSize: 20, 
                        marginTop: 10}}>
                            На данный момент уроков нет
                    </Text>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 'auto',
        minHeight: '100%',
        flexDirection: 'column', 
        alignItems: 'center', 
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        paddingBottom: 50,
        gap: 16
    },
})