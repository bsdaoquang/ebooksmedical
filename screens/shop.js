import React, {useState} from 'react'
import {
	View, Text, StyleSheet
} from 'react-native'

export default function ShopScreen({navigation}){
	return(
		<View style={styles.container}>
			<View style={styles.inner}>
				<Text>Chào bạn, phần này đang được xây dựng, bạn vui lòng quay lại sau nhé</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: '#fafafa',
		justifyContent: 'center',
		alignItems: 'center'
	},

	inner:{
		padding: 20,
		
	}
})