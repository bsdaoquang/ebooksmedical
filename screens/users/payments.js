import React, {useEffect, useState} from 'react'
import {
	View, Text, TouchableOpacity, StyleSheet, Share, ToastAndroid, FlatList, ScrollView, Image
} from 'react-native'
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {firebaseApp} from '../../firebaseConfig'
import * as Linking from 'expo-linking';

export default function PaymentsScreen({navigation, route}){

	var {uid} = route.params
	var email 

	firebaseApp.database().ref('Users').child(uid).on('value', snap => {
		email = snap.val().email
	})

	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	title: '',
	    	headerStyle:{
    			backgroundColor: '#fafafa',
    			shadowColor: 'transparent',
		        shadowRadius: 0,
		        shadowOffset: {
		            height: 0,
		        },
		        elevation:0
    		},
	    });
  	}, [navigation]);

  	var goi = [
  		{id: 1, point: "1.000"},
  		{id: 5, point: "5.000"},
  		{id: 10, point: "10.000"},
  		{id: 20, point: "20.000"},
  		{id: 50, point: "50.000"},
  		{id: 100, point: "100.000"},
  		{id: 200, point: "200.000"},
  		{id: 500, point: "500.000"},
  	]

  	const [choice, setChoice] = useState(0)

  	function selectVipPackage(itemVip, pay){
  		setChoice(itemVip)
  	}

  	//share để nhận điểm
  	const onShare = async () => {
  		try {
  			const result = await Share.share({
  				title: 'Sách y học miễn phí',
        		message: 'https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc',
        		url: 'https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc',
  			});

  			console.log(result.action)
  			if (result.action === Share.sharedAction) {
  				if (result.activityType) {
          			// shared with activity type of result.activityType
          			console.log(result.activityType)
		      	} else {
		          // shared
		          console.log('Đã chia sẻ')
		      	}

		  	} else if (result.action === Share.dismissedAction) {
		        // dismissed
		        console.log('Hủy bỏ chia sẻ')
		    }
		} catch (error) {
			alert(error.message);
		}
	};

  	async function guiyeucau(){
		firebaseApp.database().ref('Users').child(uid).child('giaodich').push({
			time: new Date().getTime(),
			sotien: choice,
			noidung: 'Nạp tiền',
			trangthai: 'Chờ xác nhận',
			loaigiaodich: 'Nạp'
		}).then((snap) => {
			//gửi thông báo cho admin
			firebaseApp.database().ref('Users').child('wbquswyP16TPO4xEBAu36P1d5P13').child('giaodich').push({
				time: new Date().getTime(),
				sotien: choice,
				trangthai: 'Chờ xác nhận',
				noidung: 'Nạp tiền từ ' + email,
				loaigiaodich: 'Nạp',
				uid: uid,
				magiaodich: snap.key
			})

			//thông báo đến quản trị viên
			firebaseApp.database().ref('Users').child('wbquswyP16TPO4xEBAu36P1d5P13').child('alerts').push({
				title: 'Giao dịch mới',
				time: new Date().getTime(),
				from: 'system',
				uid: uid,
				content: 'Giao dịch nạp tiền mới từ ' + email,
				read: false,
				magiaodich: snap.key
			})

			//lưu vào thông báo thanh toán
			firebaseApp.database().ref('Users').child(uid).child('alerts').push({
				title: 'Giao dịch mới',
				time: new Date().getTime(),
				from: 'system',
				content: 'Giao dịch ' + choice + '.000đ của bạn đã được gửi đi thành công. Chúng tôi sẽ cộng điểm cho bạn ngay khi nhận được thanh toán.',
				read: false
			})
		})

		alert('Yêu cầu của bạn đã được gửi đi, chúng tôi sẽ cộng điểm cho bạn ngay khi nhận được khoản thanh toán.')
	}

  	var goiContent = []
  	goi.forEach(item => {
  		goiContent.push(
  			<TouchableOpacity key={item.id}
  				onPress={() => selectVipPackage(item.id, item.point)}
            	style={{...styles.btnPay, backgroundColor: choice === item.id ? '#1abc9c' : 'coral'}}>
            	{
            		choice === item.id ? 
						<Feather name="check-circle" size={18} style={{position: 'absolute', right: 0, top: 0}} color='white'/>
            		: null
            	}
            	
            	<Text style={styles.point}>{item.id}</Text>	
            	<Text style={{...styles.desc, color: '#ecf0f1'}}>{item.point}đ</Text>
            </TouchableOpacity>
  		)
  	})

	return(
		<ScrollView style={styles.container}>
			<View style={styles.inner}>
				<Text style={styles.desc}>Tiền trong phần mềm, dùng để tải nhanh ebook, tài liệu có trong phần mềm mà không cần xem quảng cáo.</Text>
				
				{/*<Text style={styles.title}>Nhận điểm tải miễn phí</Text>
				<View style={styles.btnContainer}>
					<TouchableOpacity style={styles.btn} onPress={() => ToastAndroid.show('Đang phát triển', ToastAndroid.SHORT)}>
						<Text style={{...styles.desc, flex: 1}}>Mời bạn bè</Text>
						<Text style={{...styles.desc, color: 'white', backgroundColor: 'coral', padding: 5, borderRadius: 10}}>+10 điểm</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.btn} onPress={() => ToastAndroid.show('Đang phát triển', ToastAndroid.SHORT)}>
						<Text style={{...styles.desc, flex: 1}}>Chia sẻ ứng dụng</Text>
						<Text style={{...styles.desc, color: 'white', backgroundColor: 'coral', padding: 5, borderRadius: 10}}>+5 điểm</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.btn} onPress={() => ToastAndroid.show('Đang phát triển', ToastAndroid.SHORT)}>
						<Text style={{...styles.desc, flex: 1}}>Upload tài liệu</Text>
						<Text style={{...styles.desc, color: 'white', backgroundColor: 'coral', padding: 5, borderRadius: 10}}>+0.8 điểm mỗi lượt tải</Text>
					</TouchableOpacity>
				</View>*/}

				<Text style={styles.title}>Nạp tiền</Text>
				<View style={styles.btnContainer}>
					<Text style={styles.desc}>Chọn 1 trong các gói dưới đây</Text>
					<View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 10, justifyContent: 'center', alignItems: 'center'}}>
						{goiContent}
					</View>
				</View>

				{choice !== 0 ?
					<View>
						<Text style={styles.title}>Hướng dẫn nạp tiền</Text>
						<View style={styles.btnContainer}>
							<Text style={styles.desc}>Bước 1:</Text>
							<Text>Chuyển tiền vào tài khoản</Text>
							<Text style={{marginTop: 15, fontWeight: 'bold'}}>1. Ngân hàng Sacombank</Text>
							<Text>Số tài khoản: 050089283911</Text>
							<Text>Chủ tài khoản: Đào Văn Quang</Text>

							<Text style={{marginVertical: 20}}>Hoặc</Text>

							<Text style={{fontWeight: 'bold'}}>2. Ví điện tử MOMO</Text>
							<Text>Số tài khoản: 0328323686</Text>
							<Text>Chủ tài khoản: Đào Văn Quang</Text>

							<Text style={{marginTop: 15, fontWeight: 'bold'}}>Nội dung: N{choice} {email}</Text>

							<Text style={{...styles.desc, marginTop: 20, fontWeight: 'bold'}}>Bước 2:</Text>
							<Text>Chuyển đúng số tiền {choice}.000đ, nhớ nhập đúng nội dung chuyển tiền nhé</Text>
							
							<Text style={{...styles.desc, marginTop: 20, fontWeight: 'bold'}}>Bước 3:</Text>
							<View style={{justifyContent: 'center', alignItems: 'center'}}>
								<Text>Bấm vào xác nhận đã chuyển tiền</Text>
								<TouchableOpacity 
									onPress={() => guiyeucau()}
									style={{backgroundColor: '#1abc9c', paddingVertical: 10, paddingHorizontal: 20, marginVertical: 10, justifyContent: 'center', borderRadius: 5}}>
									<Text style={{color: 'white'}}>Xác nhận đã chuyển tiền</Text>
								</TouchableOpacity>
							</View>
							<Text>Nếu bạn cần hỗ trợ, liên hệ Hotline: 0328323686</Text>
						</View>
					</View>
					: null
				}
			</View>		
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: '#fafafa'
	},
	inner:{
		padding: 20
	},

	title:{
		fontWeight: 'bold',
		color: '#34495e',
		fontSize: 14,
		paddingVertical: 10
	},

	desc:{
		color: '#34495e',
		fontSize: 14
	},

	btnContainer:{
		borderBottomColor: '#e0e0e0',
		borderBottomWidth: 1,
		paddingBottom: 20
	},

	btn:{
		paddingVertical: 10,
		flexDirection: 'row',
	},

	point:{
		fontSize: 28,
		color: 'white',
		fontWeight: 'bold'
	},

	btnPay:{
		width: 80,
		height: 80,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		backgroundColor: 'coral',
		margin: 5,
		borderRadius: 10
	}
})