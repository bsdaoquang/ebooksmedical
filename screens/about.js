import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking } from 'react-native';

export default function AboutScreen(){

	const appJson = require('../app.json')
	
	return(

		<ScrollView style={styles.container}>
			<View style={styles.logoContain}>
				<Image source={require('../assets/icon.png')} style={styles.logoImg}/>
				<Text style={styles.title}>{appJson.expo.name}</Text>
				<Text style={styles.desc}>Phiên bản: {appJson.expo.version}</Text>
			</View>

			<View style={styles.descContent}>
				<Text style={styles.title}>Chính sách sử dụng</Text>
				<Text style={styles.desc}>
					<Text style={{color: '#1abc9c', fontWeight: 'bold'}}>{appJson.expo.name}</Text> là một sản phẩm của <Text style={{fontWeight: 'bold'}}>Y Học Số</Text> - Nền tảng giải pháp phần mềm y học, do <Text style={{fontWeight: 'bold'}}>BS Đào Quang</Text> phát triển.
				</Text>

				<Text style={styles.desc}>Đây là phần mềm hoàn toàn miễn phí, Bạn không cần phải đăng ký thành viên, cũng như không cần đóng bất cứ 1 loại chi phí nào để có thể tải ebook có trong phần mềm.</Text>
				<Text style={styles.desc}>Phần mềm này sử dụng chung cơ sở dữ liệu với website <Text style={{color: '#1abc9c'}} onPress={() => Linking.openURL('https://thuvien.yhocso.net/thuvien')}>https://thuvien.yhocso.net/thuvien</Text>. Bạn cũng có thể tải sách trên trang website nếu muốn.</Text>
				<Text style={styles.desc}>Chúng tôi không thu thập dữ liệu của bạn khi bạn sử dụng phần mềm.</Text>
				<Text style={styles.desc}>Trong phần mềm có quảng cáo để có kinh phí duy trì hoạt động và phát triển của phần mềm.</Text>

				<Text style={styles.desc}>Toàn bộ Ebook có trong phần mềm được sưu tầm trên internet, mọi bản quyền đều thuộc về tác giả.</Text>
				<Text style={styles.desc}>{appJson.expo.name} không giữ bản quyền và khuyến khích bạn nên mua sách giấy khi có điều kiện để ủng hộ tác giả. Toàn bộ Ebook có trong hệ thống đều được chia sẻ miễn phí cho cộng đồng. {appJson.expo.name} không khuyến khích bạn thương mại hóa những Ebook này.</Text>
				<Text style={styles.desc}></Text>
				<Text style={styles.desc}>Nếu bạn là tác giả của những ebook đó và không muốn chia sẻ nó, chúng tôi rất xin lỗi bạn và mong bạn hãy <Text style={{fontWeight: 'bold', color: 'coral'}} onPress={() => Linking.openURL('mailto: bsdaoquangadmod@gmail.com')}>thông báo cho tôi biết.</Text> tôi cam kết sẽ gỡ bỏ nó khỏi phần mềm ngay.</Text>
			</View>

			<View style={styles.authorContain}>
				<Text style={styles.title}>Tác giả</Text>
				<View style={styles.logoContain}>
					<Image source={require('../assets/images/avatar_daoquang.jpg')} style={styles.logoImg}/>
					<Text style={{...styles.title, paddingVertical: 8}}>BS. Đào Quang</Text>
				</View>
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
		paddingVertical: 15
	}
})	