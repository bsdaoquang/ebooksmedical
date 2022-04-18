import React, {useState} from 'react'
import {
	View, Text, StyleSheet, TouchableOpacity, ToastAndroid, FlatList, Modal, Image
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'; 
import {firebaseApp} from '../firebaseConfig'
import i18n from '../i18n'
import { FontAwesome } from '@expo/vector-icons'; 


export default function MyAlerts({navigation, route}){

	var {uid} = route.params;

	const [load, setLoad] = useState(false)
	const [modalVisible, setModalVisible] = useState(false);
	const [giaodich, setGiaoDich] = useState({})

	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	title: i18n.t('tinnhan'),
	    	headerStyle:{
    			backgroundColor: '#fafafa',
    			shadowColor: 'transparent',
		        shadowRadius: 0,
		        shadowOffset: {
		            height: 0,
		        },
		        elevation:0
    		},

    		headerRight: () => (
    			<TouchableOpacity style={{paddingHorizontal: 20}}
    				onPress={() => readAllCheck()}>
    				<Ionicons name="checkmark-done-sharp" size={24} color="#34495e" />
    			</TouchableOpacity>	
    		)
	    });
  	}, [navigation]);

  	function readAllCheck(){
  		//Chuyển tất cả thông báo thành đã đọc

  		firebaseApp.database().ref('Users').child(uid).child('alerts').once('value', snap => {
  			snap.forEach(item => {
  				firebaseApp.database().ref('Users').child(uid).child('alerts').child(item.key).update({
  					read: true
  				})
  			})
  		})

  		ToastAndroid.show('Đánh dấu tất cả là đã đọc', ToastAndroid.SHORT)
  	}

	var alerts = []

	if (uid) {
		firebaseApp.database().ref('Users').child(uid).child('alerts').orderByChild('time').on('value', snap => {
			if (snap.val()) {
				//console.log(snap.val())
				snap.forEach(item => {
					var items = {}
					items = item.val()
					items.alertkey = item.key

					var d = new Date(item.val().time)
					var date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' - ' + d.getHours() + ':' + d.getMinutes()

					items.date = date

					if (item.val().title === 'Bình luận mới') {
						firebaseApp.database().ref('Users').child(item.val().uid).on('value', snapuser => {
							items.displayName = snapuser.val().displayName
						})
					}

					alerts.unshift(items)
				})
			}
		})
	}

	function readAlert(title, key, alertkey, item) {
		firebaseApp.database().ref('Users').child(uid).child('alerts').child(alertkey).update({
			read: true
		})
		if (title === 'Bình luận mới') {
			navigation.navigate('BookSingle', {bookId: key, title:'sách', uid: uid})
		}else{
			setModalVisible(true)

			firebaseApp.database().ref('Users').child(item.uid).child('giaodich').child(item.magiaodich).on('value', snap => {
				var items = {}

				items = snap.val()
				items.uid = item.uid 
				items.magiaodich = item.magiaodich

				setGiaoDich(items)
			})
		}
	}

	function getGiaoDich(id, ma, sotien, fill){
		if (fill === 'huy') {

			//chuyển trạng thái thành hủy bỏ

			firebaseApp.database().ref('Users').child(id).child('giaodich').child(ma).update({
				trangthai: 'Hủy bỏ'
			})

			//gửi thông báo cho người dùng
			firebaseApp.database().ref('Users').child(id).child('alerts').push({
				title: 'Giao dịch bị hủy bỏ',
				time: new Date().getTime(),
				from: 'system',
				content: 'Giao dịch mua '+ sotien +' điểm tải của bạn không thành công do chúng tôi không nhận được khoản thanh toán nào từ bạn. Để kiểm tra lại hãy gửi lại thông tin xác minh thanh toán hoặc liên hệ với chúng tôi qua https://m.me/yhocso. Thân',
				read: false
			})

			setModalVisible(false)

		}else{
			//chuyển trạng thái thành hoàn thành

			firebaseApp.database().ref('Users').child(id).child('giaodich').child(ma).update({
				trangthai: 'Hoàn thành'
			})

			//gửi thông báo cho người dùng
			firebaseApp.database().ref('Users').child(id).child('alerts').push({
				title: 'Giao dịch hoàn thành',
				time: new Date().getTime(),
				from: 'system',
				content: 'Giao dịch mua '+ sotien +' điểm tải của bạn đã được hoàn thành, cám ơn bạn đã sử dụng dịch vụ. Thân',
				read: false
			})

			var coin = 0

			firebaseApp.database().ref('Users').child(id).on('value', snap => {
				coin = snap.val().medCoin * 1
			})
			
			firebaseApp.database().ref('Users').child(id).update({
				medCoin: coin + sotien
			})


			setModalVisible(false)

		}
	}

	setTimeout(() => {
		setLoad(true)
	}, 1000)

	function deleteAlert(key){
		firebaseApp.database().ref('Users').child(uid).child('alerts').child(key).remove().then(() => {
			ToastAndroid.show('Đã xóa', ToastAndroid.SHORT)
			setLoad(false)
		})
	}

	return(
		<View style={styles.container}>
			<View style={styles.inner}>
				<FlatList
		  			data={alerts} 
		  			renderItem={({ item }) => (
		  				<View style={{...styles.btnAlert, flexDirection: 'row'}}>
		  					<TouchableOpacity style={{flex: 1}}
			                	onPress={() => readAlert(item.title, item.key, item.alertkey, item)}
			                >
			                	<Text style={{...styles.text, fontWeight: item.read === false ? 'bold' : 'normal'}}>{item.title}</Text>
			                   	<Text style={styles.text}>{item.title === 'Bình luận mới' ? item.displayName : ''} {item.content} {item.title === 'Bình luận mới' ? 'bạn.' : ''}</Text>
			                   	<Text style={styles.text}>{item.date}</Text>
			                   	<Text style={{color: '#676767'}}>{item.read == true ? 'Đã đọc' : 'Chưa đọc'}</Text>
			                </TouchableOpacity>
			                <TouchableOpacity onPress={() => deleteAlert(item.alertkey)}>
			                	<FontAwesome name="trash" size={20} color="#676767" />
			                </TouchableOpacity>
		  				</View>
		                
			        )}
		  	 		keyExtractor={item => item.alertkey}
	  	 		/>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<TouchableOpacity 
							style={{flexDirection: 'row'}}
							onPress={() => setModalVisible(false)}>
							<Text style={{flex: 1}}></Text>
							<Text style={{fontSize: 20}}>X</Text>
						</TouchableOpacity>
						
						<Text style={{...styles.text, fontWeight: 'bold'}}>Giao dịch mới</Text>
						<View>
							<View style={{flexDirection: 'row'}}>
								<Text style={styles.text}>Mã giao dịch: </Text>
								<Text style={styles.text}>{giaodich.loaigiaodich}</Text>
							</View>

							<View style={{flexDirection: 'row'}}>
								<Text style={styles.text}>Nội dung: </Text>
								<Text style={{...styles.text, flex: 1}}>{giaodich.noidung}</Text>
							</View>

							<View style={{flexDirection: 'row'}}>
								<Text style={styles.text}>Thời gian: </Text>
								<Text style={styles.text}>{giaodich.trangthai}</Text>
							</View>

							<View style={{flexDirection: 'row'}}>
								<Text style={styles.text}>Số điểm: </Text>
								<Text style={styles.text}>{giaodich.sotien}</Text>
							</View>
							<Text style={styles.text}>Hình ảnh</Text>

							{
								giaodich.imgLink ? 

								<Image 
									style={{width: 150, height: 300}}
									source={{uri: giaodich.imgLink}}
								/>
								: null
							}
							

							<View style={{flexDirection: 'row', marginTop: 20}}>
								<TouchableOpacity
									onPress={() => getGiaoDich(giaodich.uid, giaodich.magiaodich, giaodich.sotien, 'huy')} 
									style={{...styles.btnXacnhan, backgroundColor: '#3498db'}}>
									<Text style={{color: 'white'}}>Hủy bỏ</Text>
								</TouchableOpacity>

								<TouchableOpacity
									onPress={() => getGiaoDich(giaodich.uid, giaodich.magiaodich, giaodich.sotien, 'dongy')} 
									style={{...styles.btnXacnhan, backgroundColor: '#e74c3c'}}>
									<Text style={{color: 'white'}}>Xác nhận</Text>
								</TouchableOpacity>
							</View>
							
						</View>
					</View>
				</View>
			</Modal>
		</View>
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

	btnAlert:{
		flex: 1,
		paddingVertical: 10,
		borderBottomColor: '#e0e0e0',
		borderBottomWidth: 1
	},

	text:{
		color: '#2c3e50',
		paddingVertical: 5
	},

	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 40,

	},
	modalView: {
		width: '100%',
		height: '100%',
		margin: 20,
		backgroundColor: 'white',
		padding: 35,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton: {
		backgroundColor: '#F194FF',
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},

	btnXacnhan:{
		padding: 8,
		borderRadius: 5,
		marginHorizontal: 5,
		width: '50%',
		justifyContent: 'center',
		alignItems: 'center'
	}
})