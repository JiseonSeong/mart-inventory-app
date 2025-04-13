import React, {useState} from "react";
import { View, TextInput, Button, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

//추후 여러기능 추가를 위해 함수 표현식 사용
const ProductRegisterScreen = ({navigation}: any) => {
    //입력 상태값 관리
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [stock, setStock] = useState('');

    //상품 등록 함수
    const handleRegisterProduct = async () => {
        if (!name || !type || !brand || !price || !expirationDate || !stock) {
            Alert.alert("모든 필드를 입력해주세요.");
            return;
        }
        try {
            await addDoc(collection(db, "items"), {
                name,
                type,
                brand,
                price: parseFloat(price),
                discountPrice: parseFloat(discountPrice),
                expirationDate,
                stock: parseInt(stock),
            });
            Alert.alert("상품 등록 성공!");
            navigation.goBack(); //상품 등록 후 이전 화면으로 돌아가기
        } catch (error) {
            console.error("상품 등록 실패: ", error);
            Alert.alert("상품 등록 실패", "다시 시도해주세요.");
        }
    };

   
    const handleExpirationDate = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, ''); //숫자만 입력받기
        if (numericText.length <= 8) {
            setExpirationDate(numericText);
        }
    };

    const getFormatLabel = () => {
        if (expirationDate.length === 8) return `${expirationDate.slice(0, 4)}-${expirationDate.slice(4, 6)}-${expirationDate.slice(6, 8)}`;
        if (expirationDate.length === 6) return `${expirationDate.slice(0, 4)}-${expirationDate.slice(4, 6)}`;
        return '*예시: 20250413 or 202504';
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>상품 등록하기</Text>
            <Text style={styles.label}>상품명</Text>
            <TextInput
                placeholder="상품명"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Text style={styles.label}>상품 종류</Text>
            <TextInput
                placeholder="상품 종류"
                value={type}
                onChangeText={setType}
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Text style={styles.label}>브랜드</Text>
            <TextInput
                placeholder="브랜드"
                value={brand}
                onChangeText={setBrand}
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Text style={styles.label}>가격</Text>
            <TextInput
                placeholder="가격"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Text style={styles.label}>할인 가격</Text>
            <TextInput
                placeholder="할인 가격"
                value={discountPrice}
                onChangeText={setDiscountPrice}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Text style={styles.label}>유통기한</Text>
            <TextInput style={styles.input} placeholder="없음" value={expirationDate} keyboardType="numeric" onChangeText={handleExpirationDate} maxLength={8} placeholderTextColor="#888"/>
            <Text style={styles.helperText}>{getFormatLabel()}</Text>
            <Text style={styles.label}>재고 수량</Text>
            <TextInput
                placeholder="0"
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Button title="상품 등록" onPress={handleRegisterProduct} />
            <Button title="등록 취소" onPress={() => navigation.goBack()} color="red" />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
        textAlign: "left",
        fontWeight: "bold",
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 5,
        paddingLeft: 8,
        borderRadius: 5,
    },
    helperText: {
        fontSize: 12,
        color: "#888",
        marginTop: 0,
        textAlign: "left",
    },
});

export default ProductRegisterScreen;