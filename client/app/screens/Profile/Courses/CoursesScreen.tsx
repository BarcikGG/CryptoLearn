import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import CourseButton from '../../../components/Course/CourseButton'
import ICourse from '../../../models/ICourse';
import Loading from '../../../components/elements/Loading';
import $api from '../../../http';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../../../contexts/RoleContext';
import { useAuth } from '../../../contexts/AuthContext';

export default function CoursesScreen({navigation, route}: {navigation: any, route: any}) {
    let { type } = route.params;
    const { userRole } = useRole();
    const { userId } = useAuth();
    const [ courses, setCourses ] = useState<ICourse[]>([]);
    const [ coursesBought, setCoursesBought ] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    let onlyOwner = type === 'my' ? true : false;

    let title = '';
    enum Type {
        Crypto = 'crypto',
        Trading = 'trading',
        All = 'all',
        My = 'my'
    }

    switch (type) {
        case Type.Crypto:
            title = 'Курсы по криптовалюте';
          break;
        case Type.Trading:
            title = 'Курсы по трейдингу';
          break;
        case Type.All:
            title = 'Все курсы';
          break;
        case Type.My:
            title = 'Мои курсы';
          break;
        default:
            title = 'Курсы';
      }

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: title,
          headerRight: () => {
            if (userRole === 'admin') {
                return (
                    <TouchableOpacity style={{flexDirection: "row", gap: 16, alignItems: "center"}}>
                    <Ionicons onPress={() => navigation.navigate("Add course")} name="add-circle-outline" size={24} color="black" />
                    </TouchableOpacity>
                )
            } else return null;
          },
        }, [navigation, title])
    });

    const fetchCourses = async() => {
        try {
            const response = await $api.get(`/courses/${type}`);
            setCourses(response.data);
        } catch (error) {
            console.error('Error getting courses:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить курсы');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }

    const fetchCoursesBought = async() => {
        try {
            const response = await $api.get(`/courses-bought/${userId}`);
            setCoursesBought(response.data);
        } catch (error) {
            console.error('Error getting courses:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить курсы');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }

    useEffect(() => {
        fetchCoursesBought();

        if(type === 'my') type = 'all'
        fetchCourses();
    }, [refreshing]);

    const onRefresh = () => {
        setRefreshing(true);
    };

    if (isLoading) {
        return (
            <Loading/>
        );
    }
    
    function checkIsBought(id: number) {
        let isBought = false;
        isBought = coursesBought.includes(id);

        if(userRole === 'admin') return true;

        return isBought;
    }

    return (
        <View style={{backgroundColor: 'white', width: '100%'}}>
            {courses ? 
                <FlatList
                data={courses.map((course, index) => ({ key: index, course: course }))}
                keyExtractor={(item) => item.key.toString()}
                renderItem={({ item }) => {
                    if (onlyOwner && checkIsBought(item.course.id)) {
                      return <CourseButton navigation={navigation} 
                                        course={item.course} 
                                        isBought={checkIsBought(item.course.id)} />;
                    } else if (!onlyOwner) {
                      return <CourseButton navigation={navigation}
                                        course={item.course} 
                                        isBought={checkIsBought(item.course.id)} />;
                    }
                    return null;
                  }}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={true}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            :
                <View>
                    <Text style={{ 
                        textAlign: 'center', 
                        fontSize: 20, 
                        marginTop: 10}}>
                            На данный момент курсов нет
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