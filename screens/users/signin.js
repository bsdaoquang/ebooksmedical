import React, {useState} from 'react'
import {
	View, Text, TouchableOpacity, StyleSheet, Image, TextInput,
	TouchableWithoutFeedback, Keyboard, ToastAndroid
}from 'react-native'

import {firebaseApp} from '../../firebaseConfig'
import { FontAwesome } from '@expo/vector-icons'; 

export default function SigninScreen({navigation}){

	const [email, setEmail] = useState('')
	const [pass, setPass] = useState('')
	const [rePass, setRePass] = useState('')

	function login(){
		if (email === '') {
			alert('Bạn chưa nhập email')
		}else if (pass === '') {
			alert('Bạn chưa nhập mật khẩu hoặc Mật khẩu không đúng')
		}else if(rePass !== pass){
			alert('Mật khẩu bạn nhập không trùng nhau')
		}else{
			firebaseApp.auth().createUserWithEmailAndPassword(email, pass)
			.then((userCredential) => {
		    // Signed in 
			    var user = userCredential.user;
			    var uid = user.uid
			    var displayName = email.split('@')[0]
			    var photoURL = "https://img.icons8.com/ios-filled/100/000000/user-male-circle.png"

			    var d = new Date()
			    var day = d.getDate()
			    var month = d.getMonth() + 1
			    var year = d.getFullYear()

			    var dateRegis = day + '/' + month + '/' + year

			    user.updateProfile({
			    	displayName: displayName,
			    	photoURL: photoURL
			    })

				firebaseApp.database().ref('Users').child(user.uid).update({
					email: email,
					displayName: displayName,
					photoURL: photoURL,
					phoneNumber: '',
					medCoin: 0,
					follower: 0,
					likes: '',
					dislike: '',
					follow: '',
					dateRegis: dateRegis,
					mota: '',
					history: '',
					xacMinh: 'false',
					taiKhoan: 'false',
					categories: ''
				}).then(() => {
					ToastAndroid.show('Đăng ký tài khoản thành công', ToastAndroid.SHORT)

					navigation.navigate('Trang chủ')
				})
			  	
			}).catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;

				alert(errorMessage)
			});
		}
	}

	return(
		<View style={styles.container}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.inner}>
					<Text style={{fontWeight: 'bold', fontSize: 24, color: '#34495e'}}>ĐĂNG KÝ</Text>
					<View style={styles.inputContainer}>
						<FontAwesome name="user-circle-o" size={20} color="#34495e" style={styles.inputIcont} />
						<TextInput 
							style={styles.input}
							placeholder = 'Email'
							autoCapitalize='none'
							keyboardType = 'email-address'
							onChangeText={email => setEmail(email)}
						/>
					</View>

					<View style={styles.inputContainer}>
						<FontAwesome name="unlock-alt" size={20} color="#34495e" style={styles.inputIcont} />
						<TextInput 
							style={styles.input}
							placeholder = 'Mật khẩu'
							secureTextEntry = {true}
							onChangeText={pass => setPass(pass)}
						/>
					</View>

					<View style={styles.inputContainer}>
						<FontAwesome name="unlock-alt" size={20} color="#34495e" style={styles.inputIcont} />
						<TextInput 
							style={styles.input}
							placeholder = 'Nhập lại mật khẩu'
							secureTextEntry = {true}
							onChangeText={rePass => setRePass(rePass)}
						/>
					</View>

					<TouchableOpacity
						onPress={() => login()}
						style={{backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 50, borderRadius: 3, marginTop: 20}}>
						<Text style={{color: 'white'}}>Đăng ký</Text>
					</TouchableOpacity>

					<View style={{flexDirection: 'row' , marginTop: 20}}>
						<Text style={{color: '#34495e', fontStyle: 'italic'}}>Bạn đã có tài khoản? </Text>
						<TouchableOpacity><Text style={{color: '#2980b9'}} onPress={() => navigation.navigate('Đăng nhập')}>Đăng nhập</Text></TouchableOpacity>
					</View>
					
				</View>
			</TouchableWithoutFeedback>
		</View>	
	)
}

const styles = StyleSheet.create({
	container:{
		flex: 1,
		backgroundColor: '#fafafa'
	},

	inner:{
		flex: 1,
		paddingHorizontal: 20,
		justifyContent: 'center',
		alignItems: 'center'
	},

	inputContainer:{
		flexDirection: 'row', 
		marginVertical: 8, 
		borderBottomColor: '#e0e0e0',
		borderBottomWidth: 1,
		padding: 8,
		justifyContent: 'center',
		alignItems: 'center'
	},

	input:{
		flex: 1,
		width: '100%',
		paddingHorizontal: 10
	}
})