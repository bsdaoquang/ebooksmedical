import React, {useState} from 'react'
import {
	View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, ToastAndroid, Modal
} from 'react-native'
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {firebaseApp} from '../../firebaseConfig'

export default function ManaUserList({navigation, route}){

	var {data} = route.params
	const [modalVisible, setModalVisible] = useState(false);
	const [coin, setCoin] = useState('')
	const [item, setItem] = useState({})

	function deleteUser(item){
		if (item.block !== true) {
			Alert.alert('Chặn người dùng', 'Bạn muốn chặn người dùng này đăng nhập', [
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ text: 'OK', onPress: () => removeUser(item.key)},
			]);
		}else{
			Alert.alert('Bỏ chặn người dùng', 'Bạn muốn bỏ chặn người dùng này đăng nhập', [
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ text: 'OK', onPress: () => unremoveUser(item.key)},
			]);
		}
		
	}

	function removeUser(uid){
		//Không xóa được người dùng, chỉ có thể chặn người dùng thôi
		//chuyển người dùng về trạng thái chặn

		firebaseApp.database().ref('Users').child(uid).update({
			block: true
		}).then(() => {
			ToastAndroid.show('Đã chặn người dùng đăng nhập', ToastAndroid.SHORT)
		})
	}

	function unremoveUser(uid){
		firebaseApp.database().ref('Users').child(uid).update({
			block: false
		}).then(() => {
			ToastAndroid.show('Bỏ chặn đăng nhập thành công', ToastAndroid.SHORT)
		})
	}

	//Hàm này giúp gọi ra modal và gán giá trị cho modal
	function showModal(item){
		setModalVisible(true)
		setItem(item)
	}

	//Đây là phần cộng thêm tiền cho người dùng
	function addMedCoin(){

		Alert.alert('Thêm điểm', 'Thêm '+ coin +' điểm cho' + item.email, [
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ text: 'OK', onPress: () => firebaseApp.database().ref('Users').child(item.key).update({
					medCoin: item.medCoin + coin*1
				}).then(() => {
					//gửi thông báo cho người dùng

					firebaseApp.database().ref('Users').child(item.key).child('alerts').push({
						title: 'Giao dịch thành công',
						time: new Date().getTime(),
						from: 'system',
						content: 'Giao dịch mua '+ coin +' điểm tải của bạn đã được thực hiện thành công, chúc bạn có những phút giây vui vẻ.',
						read: false
					})

					setItem({})
					ToastAndroid.show('Đã thêm', ToastAndroid.SHORT)
				})},
			])

		setModalVisible(false)
	}

	function removeAccents(str) {
  		return str.normalize('NFD')
    	.replace(/[\u0300-\u036f]/g, '')
    	.replace(/đ/g, 'd').replace(/Đ/g, 'D');
	}

	const [key, setKey] = useState('')

	function ListUser(){
		return(
			<View>
				<FlatList
					style={{marginBottom: 70}}
	  				data={data} 
	  				renderItem={({ item }) => (
	  					<View style={{paddingVertical: 8, 
	  						borderBottomColor: '#e0e0e0', 
	  						borderBottomWidth: 1, 
	  						flexDirection: 'row'}}>
	  						<TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', {userData: item})}>
	  							<Text>{item.displayName}</Text>
	  						</TouchableOpacity>
	  						
	  						<View style={{
	  							flexDirection: 'row',
	  							flex: 1,
	  							justifyContent: 'flex-end'
	  						}}>
	  							<Text style={styles.icon}>{item.medCoin} <FontAwesome5 name="coins" color="#f1c40f" size={16} /></Text>
	  							<TouchableOpacity onPress={() => showModal(item)}>
	  								<MaterialCommunityIcons name="database-plus" size={20} style={{...styles.icon, color:'#f39c12'}}/>
	  							</TouchableOpacity>
	  							
	  							<TouchableOpacity onPress={() => deleteUser(item)}>
	  								<MaterialIcons name="block" size={20} color={item.block == true ? "#e74c3c" : "#676767"} />
	  							</TouchableOpacity>
	  						</View>
	  					</View>
	  					)}
		  			keyExtractor={item => item.key}
	  			/>
			</View>
		)
	}

	const [dataSearch, setDataSearch] = useState([])

	function timkiem(){
		var keysr = removeAccents(key).toLowerCase().replace(/ /g, "-")
		var items = []
		firebaseApp.database().ref('Users').once('value', snap => {
			snap.forEach(item => {
				if (item.val().email.includes(keysr)) {
					var userDetail = {}
					userDetail = item.val()
					userDetail.key = item.key

					items.push(userDetail)
				}
			})
			setDataSearch(items)
		})
	}

	function SearchScreen(){
		return(
			<View>
				<FlatList
					style={{marginBottom: 70}}
	  				data={dataSearch} 
	  				renderItem={({ item }) => (
	  					<View style={{paddingVertical: 8, 
	  						borderBottomColor: '#e0e0e0', 
	  						borderBottomWidth: 1, 
	  						flexDirection: 'row'}}>
	  						<TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', {userData: item})}>
	  							<Text>{item.displayName}</Text>
	  						</TouchableOpacity>
	  						<View style={{
	  							flexDirection: 'row',
	  							flex: 1,
	  							justifyContent: 'flex-end'
	  						}}>
	  							<Text style={styles.icon}>{item.medCoin} <FontAwesome5 name="coins" color="#f1c40f" size={16} /></Text>
	  							<TouchableOpacity onPress={() => showModal(item)}>
	  								<MaterialCommunityIcons name="database-plus" size={20} style={{...styles.icon, color:'#f39c12'}}/>
	  							</TouchableOpacity>
	  							
	  							<TouchableOpacity onPress={() => deleteUser(item)}>
	  								<MaterialIcons name="block" size={20} color={item.block == true ? "#e74c3c" : "#676767"} />
	  							</TouchableOpacity>
	  						</View>
	  					</View>
	  					)}
		  			keyExtractor={item => item.key}
	  			/>
			</View>
		)
	}
	return(
		<View style={{backgroundColor: '#fafafa', padding: 10, flex: 1}}>
			<View style={{
				paddingVertical: 10,
				marginBottom: 10,
				borderBottomColor: '#e0e0e0',
				borderBottomWidth: 1,
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<TextInput 
					style={{
						flex: 1,
						padding: 5,
						borderColor: '#e0e0e0',
						borderWidth: 1,
						backgroundColor: '#fff',
						borderRadius: 5
					}}
					placeholder='Tìm kiếm người dùng'
					onChangeText={k => setKey(k)}
				/>

				<TouchableOpacity onPress={() => timkiem()}>
					<FontAwesome5 name="search" size={20} color="#676767" style={{paddingHorizontal: 8}} />
				</TouchableOpacity>
			</View>
			{
				dataSearch.length > 0 ? <SearchScreen /> : <ListUser />
			}

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}>
				<View style={{
					flex: 1,
					marginTop: 20,
					padding: 20,
				}}>
					<View style={{
						width: '100%',
					    backgroundColor: 'white',
					    borderRadius: 5,
					    padding: 20,
					    alignItems: 'center',
					    shadowColor: '#000',
					    shadowOffset: {
					      width: 0,
					      height: 2,
					    },
					    shadowOpacity: 0.25,
					    shadowRadius: 4,
					    elevation: 5,
					}}>
						<Text>Số điểm muốn thêm:</Text>
						<TextInput
							style={{
								width: '100%',
								padding: 8,
								marginTop: 20,
								borderRadius: 5,
								borderColor: "#e0e0e0",
								borderWidth: 1
							}}
							placeholder='0'
							keyboardType='number-pad'
							onChangeText={c => setCoin(c)}
						/>

						<View style={{
							flexDirection: 'row',
							justifyContent: 'space-around'
						}}>
							<TouchableOpacity style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
								padding: 10,
								marginTop: 20
							}} onPress={() => setModalVisible(false)}>
								<Text>Hủy</Text>
							</TouchableOpacity>

							<TouchableOpacity style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
								padding: 8,
								marginTop: 20,
								borderRadius: 5,
								borderColor: "#676767",
								borderWidth: 1
							}} onPress={() => addMedCoin()}>
								<Text>Đồng ý</Text>
							</TouchableOpacity>
						</View>
					</View>
					
				</View>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	icon:{
		color: '#212121',
		paddingHorizontal: 10
	}
})