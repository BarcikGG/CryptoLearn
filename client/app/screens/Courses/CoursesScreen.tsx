import { Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import CourseButton from '../../components/Course/CourseButton'
import ICourse from '../../models/ICourse';
import Loading from '../../components/elements/Loading';
import $api from '../../http';

export default function CoursesScreen({navigation, route}: {navigation: any, route: any}) {
    const { type } = route.params;
    const [ courses, setCourses ] = useState<ICourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    let title = '';
    enum Type {
        Crypto = 'crypto',
        Trading = 'trading',
        All = 'all',
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
        default:
            title = 'Курсы';
      }

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: title,
        }, [])
    });

    //в зависимости от type отправлять гет запрос на нужный сервер (ендпоинт == type)
    
    //добавить проверку на то куплен курс или нет, и если нет, 
    //то отображать другой блок с переходом на страницу о курсе

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

    useEffect(() => {
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

    return (
        <View style={{backgroundColor: 'white', width: '100%'}}>
            {courses ? 
                <FlatList
                data={courses?.map((news, index) => ({ key: index, news: news }))}
                keyExtractor={(item) => item.key.toString()}
                renderItem={({ item }) => <CourseButton course={item.news} isBought={false} />}
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
        height: '100%',
        flexDirection: 'column', 
        alignItems: 'center', 
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 16
    },
})