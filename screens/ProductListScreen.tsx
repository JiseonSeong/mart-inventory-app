import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

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

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
            const productsData: Product[] = snapshot.docs.map((doc) => ({
                id: doc.id, ...doc.data()} as Product));
            setProducts(productsData);
            setLoading(false);
        }, (error) => {
            console.error("실시간 데이터 수신 오류", error);
            setLoading(false);
        });

        return () => unsubscribe(); // Clean up the subscription on unmount
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