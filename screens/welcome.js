import React, {useState} from 'react'
import {
	View, Text, Loading, StatusBar
} from 'react-native'
import NetInfo from '@react-native-community/netinfo';
import {firebaseApp} from '../firebaseConfig'

export default function Welcome({navigation}){
	//tại đây sẽ kiểm tra mạng
	const [net, setNet] = useState(true)

	NetInfo.fetch().then(state => {
	  	setNet(state.isConnected)
	  	if (state.isConnected) {
	  		firebaseApp.database().ref('Ebooks').on('value', snap => {
	  			if (snap.val()) {
	  				firebaseApp.auth().onAuthStateChanged((user) => {
	  					if (user) {
	  						navigation.navigate('Trang chủ')
	  					}
	  				})
	  			}
	  		})
	  	}
	});

	return(
		<View style={{
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			padding: 20
		}}>
		<StatusBar
	        animated={true}
	        hidden={true}
	        backgroundColor='white'
        />

        <View>
        	{net === true ? 
        		<Text>Loading...</Text>

        		: <Text>Lỗi kết nối, vui lòng kiểm tra lại đường truyền và thử lại</Text>
        	}
        </View>
		</View>
	)
}