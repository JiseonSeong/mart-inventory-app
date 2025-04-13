import React from "react";
import {View, Text, StyleSheet} from "react-native";

const ProductRegisterScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>상품 등록 화면</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
    },
});

export default ProductRegisterScreen;