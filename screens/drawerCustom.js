import React, {useState, useEffect, useRef } from 'react'
import {
	View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, Share, ToastAndroid
} from 'react-native'
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import i18n from '../i18n'

import {
	DrawerContentScrollView,
	DrawerItem
} from '@react-navigation/drawer'

import * as Linking from 'expo-linking';
//import firebase
import {firebaseApp} from '../firebaseConfig'

import { 
	MaterialIcons,FontAwesome, FontAwesome5, Ionicons, AntDesign, Octicons, EvilIcons, Entypo,
	MaterialCommunityIcons
} from '@expo/vector-icons';

const onShare = async () => {
    const result = await Share.share({
      	title: i18n.t('title'), 
        message: 'https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc',
        url: 'https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc',
    });
}

export default function DrawerCustom({navigation}){

	const [uid, setUid] = useState()
	const [login, setLogin] = useState(false)

	firebaseApp.auth().onAuthStateChanged((user) => {
		if (user) {
			setUid(user.uid)
			setLogin(true)
		}else{
			setLogin(false)
		}
	})

	function changePass(){
		alert(i18n.t('kiemtraemail'))
		firebaseApp.auth().sendPasswordResetEmail(user.email)
	}

	function logout(){
		firebaseApp.auth().signOut()
	}

	var userData = {}

	if (uid) {
		firebaseApp.database().ref('Users').child(uid).on('value', snap => {
			userData = snap.val()
			userData.key = uid
		})
	}

	//Kiểm tra thống báo chưa đọc
	var countAlerts = 0
	if (uid) {
		firebaseApp.database().ref('Users').child(uid).child('alerts').on('value', snap => {
			if (snap.val()) {
				snap.forEach(item => {
					if (item.val().read === false) {
						countAlerts += 1
					}
				})
			}
		})
	}
	
	function showToast(){
		ToastAndroid.show(local == 'vi-VN' ? 'Đang phát triển' : 'Developing', ToastAndroid.SHORT)
	}
	return(
		<ScrollView style={styles.drawerContain}>
			{
				login === true ?
				<View style={{flex: 1, padding: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0'}}>
					<Image 
						source={{uri: userData.photoURL !== '' ? userData.photoURL : 'https://thuvien.yhocso.net/images/icons8-male-user-color-100.png'}}
						style={{width: 70, height: 70, borderRadius: 50, marginVertical: 10}}
					/>
					<View style={{marginVertical: 10,}}>
						<View style={{flexDirection: 'row'}}>
							<MaterialCommunityIcons name="account-check" size={24} color={userData.xacMinh === true ? '#3498db' : '#95a5a6'}/>
							<Text style={{color: '#34495e', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 20, paddingHorizontal: 5}}>{userData.displayName}</Text>
						</View>
						
						<Text style={{fontStyle: 'italic', color: 'coral', textTransform: 'capitalize'}}>{userData.medCoin + ' ' + i18n.t('diem')}</Text>
					</View>
				</View>
				:
				<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0'}}>
					<Image 
						source={{uri: 'https://thuvien.yhocso.net/images/icons8-male-user-color-100.png'}}
						style={{width: 100, height: 100, borderRadius: 50, marginVertical: 10}}
					/>
				
					<View style={{color: 'white', marginVertical: 10}}>
						<TouchableOpacity onPress={() => navigation.navigate('Đăng nhập')}>
							<Text style={{color: '#34495e', fontWeight: 'bold'}}>{i18n.t('dangnhap')}</Text>
						</TouchableOpacity>
					</View>
				</View>
			}

			{
				login === true ?
				<View style={styles.copyRightContain}>
					<View style={styles.infoContaint}>

						<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProfileScreen', {userData: userData})}>
							<Ionicons name="person-circle" size={24} color="#34495e" style={styles.iconItems}/>
							<Text style={styles.items}>{i18n.t('taikhoan')}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Thông báo', {uid: uid})}>
							<FontAwesome name="bell" size={24} color="#34495e" style={styles.iconItems}/>
							<Text style={styles.items}>{i18n.t('tinnhan')} {countAlerts > 0 ? <Text style={{color: 'red'}}>({countAlerts})</Text> : null}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button} onPress={() => showToast()}>
							<FontAwesome name="upload" size={24} color="#34495e" style={styles.iconItems}/>
							<Text style={styles.items}>{i18n.t('tailen')}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Sách tải lên', {uid: userData.key})}>
							<FontAwesome name="book" size={24} color="#34495e" style={styles.iconItems}/>
							<Text style={styles.items}>{i18n.t('sachcuaban')}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Nhận điểm', {email: userData.email, uid: uid})}>
							<FontAwesome5 name="funnel-dollar" size={20} color="#34495e" style={styles.iconItems}/>
							<Text style={styles.items}>{i18n.t('nhandiem')}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={() => changePass()}
						>
							<FontAwesome name="unlock" size={24} color="#34495e" style={styles.iconItems}/>
							<Text style={styles.items}>{i18n.t('doimatkhau')}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={() => logout()}
						>
							<AntDesign name="poweroff" size={20} color="red" style={{...styles.iconItems, color: 'red'}}/>
							<Text style={{...styles.items, color: 'red'}}>{i18n.t('dangxuat')}</Text>
						</TouchableOpacity>
					</View>
				</View>
				: null
			}

		{/*Chỗ này sau này sẽ để thêm kênh đăng ký và chuyên mục yêu thích*/}

			<View style={styles.copyRightContain}>
				<View style={styles.infoContaint}>
					<TouchableOpacity style={styles.button}
						onPress={() => Linking.openURL('https://m.me/yhocso')}
					>
						<MaterialIcons name="book" size={24} color="#34495e" style={styles.iconItems}/>
						<Text style={styles.items}>{i18n.t('yeucausach')}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button}
						onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc')}
					>
						<FontAwesome5 name="facebook-messenger" size={20} color="#34495e" style={styles.iconItems} />
						<Text style={styles.items}>{i18n.t('baoloi')}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button}
						onPress={() => navigation.navigate('Thông tin')}
					>	
						<Ionicons name="information-circle-outline" size={24} color="#34495e"  style={styles.iconItems}/>
						<Text style={styles.items}>{i18n.t('thongtin')}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button}
						onPress={() => onShare()}
					>
						<MaterialIcons name="share" size={24} color="#34495e" style={styles.iconItems}/>
						<Text style={styles.items}>{i18n.t('chiase')}</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.button}
						onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc')}
					>
						<FontAwesome name="star" size={24} color="#34495e" style={styles.iconItems}/>
						<Text style={styles.items}>{i18n.t('danhgia')}</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.button}
						onPress={() => navigation.navigate('Ứng dụng khác')}
					>
						<Entypo name="grid" size={28} color="#34495e" style={styles.iconItems}/>
						<Text style={{...styles.items}}>{i18n.t('ungdungkhac')}</Text>
					</TouchableOpacity>
				</View>

				<View style={{justifyContent: 'center', flexDirection: 'row', paddingTop: 5, alignItems: 'center'}}>
					<MaterialIcons name="support-agent" size={26} color="#676776" />
					<Text> :</Text>

					<View style={{flexDirection: 'row'}}>
						<TouchableOpacity style={styles.iconContact} onPress={() => Linking.openURL('tel:+84328323686')}>
							<Ionicons name="call" size={24} color="#2ecc71"/>
						</TouchableOpacity>

						<TouchableOpacity style={styles.iconContact} onPress={() => Linking.openURL('https://m.me/yhocso')}>
							<FontAwesome5 name="facebook-messenger" size={24} color="#3498db" style={styles.iconContact} />
						</TouchableOpacity>

						<TouchableOpacity style={styles.iconContact}
							onPress={() => Linking.openURL('https://www.facebook.com/bsdaoquang.yhocso')}
						>
							<FontAwesome5 name="facebook-square" size={24} color="#3498db" />
						</TouchableOpacity>
						
						<TouchableOpacity style={styles.iconContact}
							onPress={() => Linking.openURL('https://www.youtube.com/channel/UCTubEPIkv0sG7R81Y7bCzUQ')}
						>
							<FontAwesome5 name="youtube" size={24} color="#e74c3c" />
						</TouchableOpacity>	
					</View>
				</View>
			</View>	
		</ScrollView>	
	)
}

const styles = StyleSheet.create({
	drawerContain:{
		flex: 1,
	},

	logoContaint:{
		justifyContent: 'center',
		alignItems: 'center',
	},

	title:{
		fontWeight: 'bold',
		color: '#34495e',
		paddingVertical: 10,
		fontSize: 20
	},

	catImg:{

		width: 24,
		height: 24,
		marginRight: 15
	},

	catTitle:{
		color: '#34495e',
	},

	button:{
		flexDirection: 'row',
		paddingVertical: 12,
		alignItems: 'center'
	},

	iconItems:{
		paddingLeft: 5,
		paddingRight: 20,
		color: '#34495e'
	},

	categoryContaint:{
		padding: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0'
	},

	copyRightContain:{
		bottom: 0,
		left: 0,
		right: 0,
		padding: 8
	},

	infoContaint:{
		paddingVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0'
	},

	items:{
		color: '#34495e',
	},

	iconContact:{
		paddingHorizontal: 5
	}
})