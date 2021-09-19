import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';

export default function DonateScreen(){

	const appJson = require('../app.json')
	
	return(

		<ScrollView style={styles.container}>
			<View style={styles.logoContain}>
				<Text style={{...styles.title, color: 'coral'}}>XIN CHÂN THÀNH CÁM ƠN BẠN!</Text>
				<Text style={styles.desc}>Sự ủng hộ của bạn là nguồn động lực to lớn nhất để tôi tiếp tục cố gắng phát triển phần mềm ngày càng phục vụ bạn tốt hơn</Text>
			</View>

			<View style={styles.descContent}>
				<Text style={{...styles.desc, paddingVertical: 15}}>Bạn có thể ủng hộ tôi theo các cách sau đây:</Text>
				<Text style={styles.title}>Ngân hàng Agribank - CN Định Quán</Text>
				<Text style={styles.desc}>STK: 5907205160067</Text>
				<Text style={styles.desc}>Tên tài khoản: Đào Văn Quang</Text>
			</View>

			<View style={styles.descContent}>
				<Text style={styles.title}>Ngân hàng Sacombank</Text>
				<Text style={styles.desc}>STK: 050089283911</Text>
				<Text style={styles.desc}>Tên tài khoản: Đào Văn Quang</Text>
			</View>

			<View style={styles.descContent}>
				<Text style={styles.title}>Chuyển khoản qua MOMO</Text>
				<Text style={styles.desc}>SĐT: 0328323686</Text>
				<Text style={styles.desc}>Tên tài khoản: Đào Văn Quang</Text>
			</View>
			

			<View style={styles.logoContain}>
				<Text style={styles.desc}>Một lần nữa</Text>
				<Text style={{...styles.title, color: 'coral'}}>XIN CHÂN THÀNH CÁM ƠN BẠN!</Text>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: '#fff',
		padding: 8
	},

	logoContain:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		paddingVertical: 10
	},

	logoImg:{
		width: 150,
		height: 150
	},

	title:{
		fontWeight: 'bold',
		fontSize: 16
	},

	desc:{
		paddingVertical: 5
	},

	descContent:{
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		paddingVertical: 10
	}
})	