import React, {useState} from 'react'
import {
	View, Text, StyleSheet, TouchableOpacity, Image
} from 'react-native'
import { AntDesign, Feather, Fontisto, Ionicons } from '@expo/vector-icons';
import {firebaseApp} from '../../firebaseConfig'

export default function ProfileScreen({navigation, route}){

	var userData = route.params.userData

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

    		headerRight: () => (
    			<TouchableOpacity>
    				<AntDesign name="edit" size={28} color="#2c3e50" style={{paddingHorizontal: 20}} />
    			</TouchableOpacity>
    		)
	    });
  	}, [navigation]);

  	var countBook = 0

  	firebaseApp.database().ref('Ebooks').on('value', snap => {
  		snap.forEach(item => {
  			if (item.val().uploadBy === userData.key) {
  				countBook += 1
  			}
  		})
  	})

	return(
		<View style={styles.container}>
			<View style={styles.infoContainer}>
				<View style={styles.imageContainer}>
					<Image
						source={{uri: userData.photoURL !== '' ? userData.photoURL : 'https://thuvien.yhocso.net/images/icons8-male-user-color-100.png'}}
						style={styles.image}
					/>

					<View style={{flex: 1, justifyContent: 'center'}}>
						<Text style={{...styles.title, fontWeight: 'bold', fontSize: 24}}>{userData.displayName}</Text>
						<Text style={styles.desc}>Bác sĩ</Text>
					</View>
				</View>

				<View style={{paddingVertical: 20}}>
					<View style={styles.iconContainer}>
						<Feather name="phone" size={24} style={styles.icon}/>
						<Text style={styles.desc}>{userData.phoneNumber}</Text>
					</View>

					<View style={styles.iconContainer}>
						<Ionicons name="mail-outline" size={24} style={styles.icon}/>
						<Text style={styles.desc}>{userData.email}</Text>
					</View>
					
				</View>
			</View>

			<View style={{...styles.infoContainer, flexDirection: 'row', justifyContent: 'space-around'}}>
				<View style={{alignItems: 'center'}}>
					<Text style={{...styles.title, fontWeight: 'bold', fontSize: 24}}>{userData.medCoin}</Text>
					<Text style={styles.desc}>Điểm</Text>
				</View>

				<View style={{alignItems: 'center'}}>
					<Text style={{...styles.title, fontWeight: 'bold', fontSize: 24}}>{countBook}</Text>
					<Text style={styles.desc}>Ebooks</Text>
				</View>
			</View>

			<View style={{...styles.infoContainer}}>
				<TouchableOpacity style={styles.buttonContainer}>
					<Ionicons name="bookmark" size={24} style={styles.iconButton}/>
					<Text style={styles.title}>Sách yêu thích</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonContainer}>
					<AntDesign name="wallet" size={24} style={styles.iconButton}/>
					<Text style={styles.title}>Thanh toán</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonContainer}>
					<Ionicons name="bookmark" size={24} style={styles.iconButton}/>
					<Text style={styles.title}>Sách yêu thích</Text>
				</TouchableOpacity>
			</View>

			<View style={{...styles.infoContainer, borderBottomWidth: 0}}>
				<View style={styles.iconContainer}>
					<Ionicons name="power-outline" size={24} style={{...styles.icon, color: 'red'}} />
					<Text style={{color: 'red'}}>Đăng xuất</Text>
				</View>
			</View>

		</View>
	)
}

const styles = StyleSheet.create({
	container:{
		backgroundColor: '#fafafa',
		flex: 1
	},

	infoContainer:{
		padding: 20,
		borderBottomColor: '#e0e0e0',
		borderBottomWidth: 1,
		justifyContent: 'center',
	},

	imageContainer:{
		flexDirection: 'row',
	},

	title:{
		color: '#34495e'
	},

	desc:{
		color: '#78909c',
		paddingVertical: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},

	icon:{
		color: '#78909c',
		marginRight: 20
	},

	iconButton:{
		color: '#2980b9',
		marginRight: 20
	},

	iconContainer:{
		alignItems: 'center',
		flexDirection: 'row',
	},

	buttonContainer:{
		paddingVertical: 15,
		flexDirection: 'row',
		alignItems: 'center',
	},

	image:{
		width: 80,
		height: 80,
		borderRadius: 50,
		marginRight: 20
	},
})