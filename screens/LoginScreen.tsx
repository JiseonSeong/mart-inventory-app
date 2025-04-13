import React, {useState} from "react";
import {View, TextInput, Button, StyleSheet, Alert} from "react-native";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../navigation/AppNavigator";
import {useNavigation} from "@react-navigation/native";
//RootStackParamList를 타입으로 받아오는 useNavigation을 사용하여, 현재 화면의 네비게이션 속성을 가져옴

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
    //입력창에서 입력한 이메일/비밀번호를 저장할 상태 변수
    //useState는 React의 Hook으로, 상태 변수를 생성하고 관리하는 데 사용됨
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation<LoginScreenNavigationProp>();
    //Login화면에서 사용할 수 있는 네비게이션 타입 정의 및 초기화

    //로그인 버튼을 누르면 Firebase Auth를 사용하여 로그인 시도
    //로그인 성공 시, ProductList 화면으로 이동
    const handleLogin = async () => {
        try {
            const auth = getAuth();
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert("Login successful");
            navigation.replace("ProductList");
            } catch(error: any) {
            Alert.alert("Login failed", error.message);
        }

    }

//이메일/비밀번호 입력창과 로그인 버튼을 포함한 화면(UI) 구성
return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

//스타일 정의
//스타일은 React Native의 StyleSheet를 사용하여 정의함
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});


