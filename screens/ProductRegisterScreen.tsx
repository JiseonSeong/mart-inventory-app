import React, {useState} from "react";
import { KeyboardAvoidingView, Platform, View, TextInput, Button, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";

//년월입력시 월 마지막날짜로 계산
const getLastDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate(); // 해당 월의 마지막 날짜를 반환
};

//추후 여러기능 추가를 위해 함수 표현식 사용
const ProductRegisterScreen = ({navigation}: any) => {
    //입력 상태값 관리
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [brand, setBrand] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [expirationRaw, setExpirationRaw] = useState('');
    const [expirationFormatted, setExpirationFormatted] = useState('');
    const [expirationError, setExpirationError] = useState('');
    const [expirationNone, setExpirationNone] = useState(false); //유통기한 없음 체크박스 상태
    const [isFocused, setIsFocused] = useState(false); //포커스 상태 관리
    const [stock, setStock] = useState('');

    const validateExpiration = (formatted: string) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
            setExpirationError('**유효한 날짜 형식이 아닙니다.** (예: 20250413 or 202504)');
            return;
        }

        const [yearStr, monthStr, dayStr] = formatted.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);

        //const inputDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
        //const isValidDate = inputDate.getFullYear() === year && inputDate.getMonth() + 1 === month && inputDate.getDate() === day;
        //const minDate = new Date('2025-01-01'); 
        //const maxDate = new Date('2090-12-31'); 

        if (month < 1 || month > 12) {
            setExpirationError('**입력된 유통기한을 확인해주세요**');
            return;
        }

        const lastDay = getLastDayOfMonth(year, month);
        if (day < 1 || day > lastDay) {
            setExpirationError(`**입력된 유통기한을 확인해주세요**`);
            return;
        }

        const inputDate = new Date(year, month - 1, day); // 월은 0부터 시작하므로 month - 1
        const minDate = new Date(2025, 0, 1); // 2025-01-01
        const maxDate = new Date(2090, 11, 31); // 2090-12-31

        if (inputDate < minDate || inputDate > maxDate) {
            setExpirationError('**입력된 유통기한을 확인해주세요.**');
            return;
        }
        setExpirationError(''); //유효한 날짜일 경우 에러 메시지 초기화
    };

    const handleBlurExpiration = () => {
        const numeric = expirationRaw.replace(/[^0-9]/g, ''); //숫자만 남기기
        
        if (numeric.length === 6) {
            const year = Number(numeric.slice(0, 4));
            const month = Number(numeric.slice(4, 6));
            const lastDay = getLastDayOfMonth(year, month);
            const formatted = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
            setExpirationFormatted(formatted);
            validateExpiration(formatted);
        } else if (numeric.length === 8) {
            const year = Number(numeric.slice(0, 4));
            const month = Number(numeric.slice(4, 6));
            const day = Number(numeric.slice(6, 8));
            const formatted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            setExpirationFormatted(formatted);
            validateExpiration(formatted);
        } else if (numeric.length === 0) {
            setExpirationFormatted(''); //빈칸일 경우 초기화
            setExpirationError('');
        } else {
            setExpirationFormatted(''); //잘못된 형식일 경우 초기화
            setExpirationError('유효한 유통기한을 입력해주세요. (예: 20250413 or 202504)');
        }   
    };



    //상품 등록 함수
    const handleSubmit = async () => {
        if (!name || !type || !brand || !price || !stock || (!expirationFormatted && !expirationNone)) {
            Alert.alert("필수 항목을 입력해주세요.");
            return;
        }
        if (expirationError && !expirationNone) {
            Alert.alert("등록실패", expirationError);
            return;
        }
        try {
            await addDoc(collection(db, "items"), {
                name,
                type,
                brand,
                price: parseFloat(price),
                discountPrice: parseFloat(discountPrice),
                expirationDate: expirationNone ? null : expirationFormatted,
                stock: parseInt(stock),
            });
            Alert.alert("상품 등록 성공!");
            navigation.goBack(); //상품 등록 후 이전 화면으로 돌아가기
        } catch (error) {
            console.error("상품 등록 실패: ", error);
            Alert.alert("상품 등록 실패", "다시 시도해주세요.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
            <View style={styles.header}>
                <Text style={styles.headerText}>상품 등록</Text>
            </View>
        <KeyboardAvoidingView style={{ flex:1 }} behavior="padding">

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>상품명*</Text>
            <TextInput
                placeholder="상품명*"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Text style={styles.label}>상품 종류*</Text>
            <TextInput
                placeholder="상품 종류"
                value={type}
                onChangeText={setType}
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Text style={styles.label}>브랜드*</Text>
            <TextInput
                placeholder="브랜드"
                value={brand}
                onChangeText={setBrand}
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Text style={styles.label}>가격*</Text>
            <TextInput
                placeholder="예: 399 → $3.99"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Text style={styles.label}>할인 가격</Text>
            <TextInput
                placeholder="예: 299 → $2.99"
                value={discountPrice}
                onChangeText={setDiscountPrice}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Text style={styles.label}>유통기한</Text>
            <TouchableOpacity onPress={() => {
                const toggled = !expirationNone;
                setExpirationNone(toggled); //버튼 상태 변경
                if (toggled) {
                    setExpirationRaw('');
                    setExpirationFormatted('');
                    setExpirationError(''); //체크박스 선택 시 에러 메시지 초기화
                }
            }}
            style={[styles.toggleButton, expirationNone && styles.toggleButtonActive]}>
                <Text style={styles.toggleButtonText}>{expirationNone ? '유통기한 없음' : '유통기한을 입력해주세요'}</Text>
            </TouchableOpacity>
            <TextInput style={[styles.input, expirationNone && styles.inputDisabled]} placeholder={expirationNone ? "없음" : "*예: 20250413 or 202504"} value={isFocused ? expirationRaw : expirationFormatted} onChangeText={setExpirationRaw} keyboardType="numeric" maxLength={8} onFocus={() => !expirationNone && setIsFocused(true)} onBlur={() => {setIsFocused(false); if (!expirationNone) handleBlurExpiration();}} editable={!expirationNone} placeholderTextColor="#888"/>
            <Text style={styles.helperText}>{expirationNone ? '*유통기한 없이 등록됩니다.' : expirationError ? expirationError : ''}</Text>
            <Text style={styles.label}>재고 수량*</Text>
            <TextInput
                placeholder="0"
                value={stock}
                onChangeText={setStock}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#888"
            />
            <Button title="상품 등록" onPress={handleSubmit} />
            <Button title="등록 취소" onPress={() => navigation.goBack()} color="red" />
        </ScrollView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#f8f8f8",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        minHeight: 50,
    },
    container: {
        paddingHorizontal: 16,
        paddingBottom: 32,
        
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center",
        color: "#000",
        opacity: 1,
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
    toggleButton: {
        padding: 10,
        borderRadius: 6,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        marginBottom: 10,
    },
    toggleButtonActive: {
        backgroundColor: '#b0e0b0',
    },
    toggleButtonText: {
        fontSize: 16,
        color: '#333',
    },
    inputDisabled: {
        backgroundColor: '#ddd',
        color: '#aaa',
    },
});

export default ProductRegisterScreen;