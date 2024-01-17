import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function indexTab() {
    return (
        <View>
            <Text>news</Text>
            <Link href={'/(auth)/login'}>Login</Link>
        </View>
    )
}