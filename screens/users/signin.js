import React, {useState} from 'react'
import {
	View, Text, TouchableOpacity, StyleSheet, Image, TextInput,
	TouchableWithoutFeedback, Keyboard, ToastAndroid
}from 'react-native'

import {firebaseApp} from '../../firebaseConfig'
import { FontAwesome } from '@expo/vector-icons';
import i18n from '../../i18n'

export default function SigninScreen({navigation}){

	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	headerTitle: '',
	      	headerStyle:{
    			backgroundColor: '#fafafa',
    			shadowColor: 'transparent',
		        shadowRadius: 0,
		        shadowOffset: {
		            height: 0,
		        },
		        elevation:0
    		}
	    });
  	}, [navigation]);

	const [email, setEmail] = useState('')
	const [pass, setPass] = useState('')
	const [rePass, setRePass] = useState('')

	function login(){
		if (email === '') {
			alert(i18n.t('nhapEmail'))
		}else if (pass === '') {
			alert(i18n.t('nhapmatkhau'))
		}else if(rePass !== pass){
			alert(i18n.t('matkhaukhongtrung'))
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
					<Text style={{fontWeight: 'bold', fontSize: 24, color: '#34495e', textTransform: 'uppercase'}}>{i18n.t('dangky')}</Text>
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
							placeholder = {i18n.t('matkhau')}
							secureTextEntry = {true}
							onChangeText={pass => setPass(pass)}
						/>
					</View>

					<View style={styles.inputContainer}>
						<FontAwesome name="unlock-alt" size={20} color="#34495e" style={styles.inputIcont} />
						<TextInput 
							style={styles.input}
							placeholder = {i18n.t('nhaplaimatkhau')}
							secureTextEntry = {true}
							onChangeText={rePass => setRePass(rePass)}
						/>
					</View>

					<TouchableOpacity
						onPress={() => login()}
						style={{backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 50, borderRadius: 3, marginTop: 20}}>
						<Text style={{color: 'white'}}>{i18n.t('dangky')}</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={() => navigation.navigate('Đăng nhập')}>
						<Text style={{color: '#2980b9', marginTop: 20}}>{i18n.t('cotaikhoan')} {i18n.t('dangnhap')}</Text>
					</TouchableOpacity>
					
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