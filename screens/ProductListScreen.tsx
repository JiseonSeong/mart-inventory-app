import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useNavigation } from "@react-navigation/native";

type Product = {
    id: string;
    name: string;
    price: number;
    discountPrice: number;
    expirationDate: string;
    brand: string;
    stock: number;
    type: string;
};

export default function ProductListScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    //useNavigation을 사용하여, 현재 화면의 네비게이션 속성을 가져옴

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'items')); //fetch products from firestore
            
                const productsData: Product[] = [];
                querySnapshot.forEach((doc) => {
                    productsData.push({ id: doc.id, ...doc.data() } as Product);
                });
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemBox}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text>Type: {item.type}</Text>
                        <Text>Brand: {item.brand}</Text>
                        <Text>Price: ${item.price}</Text>
                        <Text>Discount Price: ${item.discountPrice}</Text>
                        <Text>Expiration: {item.expirationDate}</Text>
                        <Text>Stock: {item.stock}</Text>
                    </View>
                )}
            />

            {/* 상품등록 버튼 */}
            <TouchableOpacity
                style={{ backgroundColor: '#007BFF', padding: 10, borderRadius: 5, marginTop: 20 }}
                onPress={() => navigation.navigate('ProductRegister' as never)} //타입 에러방지 
            >
                <Text style={{ color: '#fff', textAlign: 'center' }}>상품등록</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    itemBox: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    }

});