import { Image, View, Text } from 'react-native'

export default function Loading() {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
            <Image source={require('../../../assets/loading-fast.gif')} style={{width: 200, height: 200, marginTop: -20}} />
        </View>
    )
}