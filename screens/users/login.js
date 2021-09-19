import React, {useState} from 'react'
import {
	View, Text, TouchableOpacity, StyleSheet, Image, TextInput,
	TouchableWithoutFeedback, Keyboard, ToastAndroid
}from 'react-native'

import {firebaseApp} from '../../firebaseConfig'
import { FontAwesome } from '@expo/vector-icons'; 

export default function LoginScreen({navigation}){

	const [email, setEmail] = useState('')
	const [pass, setPass] = useState('')

	function login(){
		if (email === '') {
			alert('Bạn chưa nhập email')
		}else if (pass === '') {
			alert('Bạn chưa nhập mật khẩu hoặc Mật khẩu không đúng')
		}else{
			firebaseApp.auth().signInWithEmailAndPassword(email, pass)
			.then((userCredential) => {

				var user = userCredential.user

				ToastAndroid.show('Chào mừng ' + user.displayName, ToastAndroid.SHORT)
				navigation.navigate('Trang chủ')
			}).catch((error) => {
				alert(error)
			});
		}
	}

	return(
		<View style={styles.container}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.inner}>
					<Text style={{fontWeight: 'bold', fontSize: 24, color: '#34495e'}}>ĐĂNG NHẬP</Text>
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
					<View style={{marginVertical: 20, justifyContent: 'flex-end', width: '100%'}}>
						<TouchableOpacity>
							<Text style={{fontStyle: 'italic', color: '#2980b9'}}>Quên mật khẩu</Text>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						onPress={() => login()}
						style={{backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 50, borderRadius: 3}}>
						<Text style={{color: 'white'}}>Đăng nhập</Text>
					</TouchableOpacity>

					<View style={{flexDirection: 'row' , marginTop: 20}}>
						<Text style={{color: '#34495e', fontStyle: 'italic'}}>Bạn chưa có tài khoản? </Text>
						<TouchableOpacity><Text style={{color: '#2980b9'}} onPress={() => navigation.navigate('Đăng ký')}>Đăng ký</Text></TouchableOpacity>
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