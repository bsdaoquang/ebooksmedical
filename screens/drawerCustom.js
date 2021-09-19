import React, {useState} from 'react'
import {
	View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, Share, 
} from 'react-native'

import {
	DrawerContentScrollView,
	DrawerItem
} from '@react-navigation/drawer'

import * as Linking from 'expo-linking';
import * as Localization from 'expo-localization';

//import firebase
import {firebaseApp} from '../firebaseConfig'

import { MaterialIcons,FontAwesome, FontAwesome5, Ionicons, AntDesign, Octicons } from '@expo/vector-icons';

const onShare = async () => {
    const result = await Share.share({
      	title: 'Thư Viện Y Học',
        message: 'https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc',
        url: 'https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc',
    });
}

export default function DrawerCustom({navigation}){

	const [user, setUser] = useState({})
	const [login, setLogin] = useState(false)

	var language = Localization.locale

	firebaseApp.auth().onAuthStateChanged((user) => {
		if (user) {
			setUser(user)
			setLogin(true)
		}else{
			setLogin(false)
		}
	})

	function changePass(){
		alert('Một email hướng dẫn đổi mật khẩu đã được gửi cho bạn, hãy kiểm tra email và làm theo hướng dẫn')
		firebaseApp.auth().sendPasswordResetEmail(user.email)
	}

	function logout(){
		firebaseApp.auth().signOut()
	}

	return(
		<ScrollView style={styles.drawerContain}>
			{
				login === true ?
				<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0'}}>
					<Image 
						source={{uri: user.photoURL !== '' ? user.photoURL : 'https://thuvien.yhocso.net/images/icons8-male-user-color-100.png'}}
						style={{width: 100, height: 100, borderRadius: 50, marginVertical: 10}}
					/>
					<View style={{marginVertical: 10, justifyContent: 'center', alignItems: 'center'}}>
						<Text>Chào mừng bạn</Text>
						<Text style={{color: '#34495e', fontWeight: 'bold', textTransform: 'uppercase'}}>{user.displayName}</Text>
						<Text style={{fontStyle: 'italic'}}>{user.email}</Text>
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
							<Text style={{color: '#34495e', fontWeight: 'bold'}}>Đăng nhập</Text>
						</TouchableOpacity>
					</View>
				</View>
			}

			{
				login === true ?
				<View style={styles.copyRightContain}>
					<View style={styles.infoContaint}>
						<TouchableOpacity style={styles.button}>
							<FontAwesome name="bell" size={24} color="#34495e" style={styles.iconItems}/>
							<Text style={styles.items}>Thông báo</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}>
							<Ionicons name="person-circle" size={24} color="#34495e" style={styles.iconItems}/>
							<Text style={styles.items}>Thông tin tài khoản</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={() => changePass()}
						>
							<FontAwesome name="unlock" size={24} color="#34495e" style={styles.iconItems}/>
							<Text style={styles.items}>Đổi mật khẩu</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.button}
							onPress={() => logout()}
						>
							<AntDesign name="logout" size={24} color="#34495e" style={styles.iconItems}/>
							<Text style={styles.items}>Đăng xuất</Text>
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
						<Text style={styles.items}>Yêu cầu sách</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button}
						onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc')}
					>
						<Octicons name="report" size={24} color="#34495e" style={styles.iconItems}/>
						<Text style={styles.items}>Góp ý và Báo lỗi</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button}
						onPress={() => navigation.navigate('Thông tin')}
					>	
						<Ionicons name="information-circle-outline" size={24} color="#34495e"  style={styles.iconItems}/>
						<Text style={styles.items}>Thông tin ứng dụng</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button}
						onPress={() => onShare()}
					>
						<MaterialIcons name="share" size={24} color="#34495e" style={styles.iconItems}/>
						<Text style={styles.items}>Chia sẻ</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button}
						onPress={() => navigation.navigate('Ủng hộ')}
					>
						<FontAwesome5 name="donate" size={24} color="#e67e22" style={styles.iconItems}/>
						<Text style={{...styles.items, color: '#e67e22'}}>Ủng hộ</Text>
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
		paddingVertical: 8,
		alignItems: 'center'
	},

	iconItems:{

		paddingHorizontal: 5
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