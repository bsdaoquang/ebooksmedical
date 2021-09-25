import React, {useEffect, useState} from 'react'
import {
	View, Text, TouchableOpacity, StyleSheet, Share, ToastAndroid, FlatList, ScrollView, Image
} from 'react-native'
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {firebaseApp} from '../../firebaseConfig'
import * as Linking from 'expo-linking';

export default function PaymentsScreen({navigation, route}){

	var {email, uid} = route.params

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
  		{id: 1, point: 1, pay: '1.000đ'},
  		{id: 5, point: 5, pay: '5.000đ'},
  		{id: 10, point: 10, pay: '10.000đ'},
  		{id: 20, point: 20, pay: '20.000đ'},
  		{id: 50, point: 50, pay: '50.000đ'},
  		{id: 100, point: 100, pay: '100.000đ'},
  		{id: 200, point: 200, pay: '200.000đ'},
  		{id: 500, point: 500, pay: '500.000đ'},
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

  	const [image, setImage] = useState(null);

  	useEffect(() => {
  		(async () => {
  			if (Platform.OS !== 'web') {
  				const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  				if (status !== 'granted') {
  					alert('Xin lỗi. bạn phải cấp quyền truy cập để chức năng này có thể hoạt động');
  				}
  			}
  		})();
  	}, []);

  	const pickImage = async () => {
  		let result = await ImagePicker.launchImageLibraryAsync({
  			mediaTypes: ImagePicker.MediaTypeOptions.All,
  			allowsEditing: true,
  			aspect: [2, 4],
  			quality: 0.5,
  		});

  		if (!result.cancelled) {
  			setImage(result.uri);
  		}
  	};

  	async function guiyeucau(){
	  	const blob = await new Promise((resolve, reject) => {
	  		const xhr = new XMLHttpRequest();
	  		xhr.onload = function () {
	  			resolve(xhr.response);
	  		};
	  		xhr.onerror = function (e) {
	  			console.log(e);
	  			reject(new TypeError("Lỗi kết nối"));
	  		};
	  		xhr.responseType = "blob";
	  		xhr.open("GET", image, true);
	  		xhr.send(null);
	  	});

	  	const ref = firebaseApp.storage().ref().child('payments/' + email + (new Date().getTime()));
	  	const snapshot = await ref.put(blob);

		// We're done with the blob, close and release it
		blob.close();

		var imageLink = await snapshot.ref.getDownloadURL();

		//uploadfirebase
		//lưu vào lịch sử của người dùng
		firebaseApp.database().ref('Users').child(uid).child('giaodich').push({
			time: new Date().getTime(),
			sotien: choice,
			noidung: 'Mua điểm tải',
			imgLink: imageLink,
			trangthai: 'Chờ xác nhận',
			loaigiaodich: 'Nạp'
		}).then((snap) => {
			//gửi thông báo cho admin
			firebaseApp.database().ref('Users').child('wbquswyP16TPO4xEBAu36P1d5P13').child('giaodich').push({
				time: new Date().getTime(),
				sotien: choice,
				imgLink: imageLink,
				trangthai: 'Chờ xác nhận',
				noidung: 'Mua điểm tải từ ' + email,
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
				content: 'Giao dịch mua ' + choice + ' điểm tải của bạn đã được gửi đi thành công. Chúng tôi sẽ cộng điểm cho bạn ngay khi nhận được thanh toán.',
				read: false
			})
		})

		alert('Yêu cầu của bạn đã được gửi đi, chúng tôi sẽ cộng điểm cho bạn ngay khi nhận được khoản thanh toán.')
	}

  	var goiContent = []
  	goi.forEach(item => {
  		goiContent.push(
  			<TouchableOpacity key={item.id}
  				onPress={() => selectVipPackage(item.id, item.pay)}
            	style={{...styles.btnPay, backgroundColor: choice === item.id ? '#1abc9c' : 'coral'}}>
            	{
            		choice === item.id ? 
						<Feather name="check-circle" size={18} style={{position: 'absolute', right: 0, top: 0}} color='white'/>
            		: null
            	}
            	
            	<Text style={styles.point}>{item.point}</Text>	
            	<Text style={{...styles.desc, color: '#ecf0f1'}}>{item.pay}</Text>
            </TouchableOpacity>
  		)
  	})

	return(
		<ScrollView style={styles.container}>
			<View style={styles.inner}>
				<Text style={styles.desc}>Điểm tải là đơn vị tiền tệ trong phần mềm, dùng để tải nhanh ebook, tài liệu có trong phần mềm mà không cần xem quảng cáo.</Text>
				
				<Text style={styles.title}>Nhận điểm tải miễn phí</Text>
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
				</View>

				<Text style={styles.title}>Mua thêm điểm tải</Text>
				<View style={styles.btnContainer}>
					<Text style={styles.desc}>Chọn 1 trong các gói dưới đây</Text>
					<View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 10, justifyContent: 'center', alignItems: 'center'}}>
						{goiContent}
					</View>
				</View>

				{choice !== 0 ?
					<View>
						<Text style={styles.title}>Hướng dẫn mua thêm điểm tải</Text>
						<View style={styles.btnContainer}>
							<Text style={styles.desc}>Bước 1:</Text>
							<Text>Chuyển tiền vào tài khoản</Text>
							<Text style={{marginTop: 15, fontWeight: 'bold'}}>1. Ngân hàng Sacombank</Text>
							<Text>Số tài khoản: 050089283911</Text>
							<Text>Chủ tài khoản: Đào Văn Quang</Text>

							<Text style={{marginTop: 15, fontWeight: 'bold'}}>2. Ví điện tử MOMO</Text>
							<Text>Số tài khoản: 0328323686</Text>
							<Text>Chủ tài khoản: Đào Văn Quang</Text>

							<Text style={{marginTop: 15, fontWeight: 'bold'}}>Nội dung: Nạp {choice} điểm tải, email {email}</Text>

							<Text style={{...styles.desc, marginTop: 20}}>Bước 2:</Text>
							<Text>Chụp hình và gửi lên bằng chứng thanh toán thành công</Text>
							{image && <Image source={{ uri: image }} style={{ width: 200, height: 400, marginVertical: 10 }} />}

							<TouchableOpacity
								onPress={pickImage}
								style={{paddingVertical: 5, paddingHorizontal: 20, backgroundColor: '#1abc9c', width: '50%', marginTop: 20}}>
								<Text style={{color: 'white'}}>Chọn hình ảnh</Text>
							</TouchableOpacity>

							<Text style={{...styles.desc, marginTop: 20}}>Bước 3:</Text>
							<Text style={styles.desc}>Gửi yêu cầu nạp tiền</Text>

							<View style={{justifyContent: 'center', alignItems: 'center'}}>
								<TouchableOpacity 
									onPress={() => guiyeucau()}
									style={{backgroundColor: '#1abc9c', paddingVertical: 10, paddingHorizontal: 20, marginVertical: 10, justifyContent: 'center', borderRadius: 10}}>
									<Text style={{color: 'white'}}>Gửi yêu cầu nạp tiền</Text>
								</TouchableOpacity>
							</View>
							
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