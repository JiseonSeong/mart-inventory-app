import React from 'react';
//화면 간 이동(전환) 라이브러리
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductRegisterScreen from '../screens/ProductRegisterScreen';

//각 화면의 이름과 파라미터 정의
//undefined는 해당 화면으로 이동할 때 별로의 전달 값(파라미터)가 없음을 의미
//이렇게 정의해두면, 나중에 화면 간 이동 시에 파라미터를 전달할 수 있음
export type RootStackParamList = {
    Login: undefined;
    ProductList: undefined;
    ProductRegister: undefined; //ProductRegister 화면 추가
    };

const Stack = createNativeStackNavigator<RootStackParamList>();

//전체 네비게이션 구조를 담은 컴포넌트
//각 화면을 Stack.Screen으로 정의(등록)하고, Stack.Navigator로 감싸줌
//initialRouteName은 앱이 시작할 때 보여줄 화면을 지정함
//hearerShown: false는 해당 화면의 헤더를 숨김; 상단 타이틀바 숨기기
export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }}/>
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="ProductRegister" component={ProductRegisterScreen} options={{ title: '상품 등록' }}/>
        </Stack.Navigator>
    );
}