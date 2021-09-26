import React from 'react'
import {
	View, Text, TouchableOpacity, Image, StyleSheet, FlatList
} from 'react-native'
import * as Linking from 'expo-linking';

export default function MoreAppScreen({navigation}){

	var myapps = [
		{
			id: '1', 
			title: 'Medical Calculator Tiếng Việt', 
			description: 'Công cụ hỗ trợ ra quyết định lâm sàng', 
			link: 'https://play.google.com/store/apps/details?id=com.bsdaoquang.medicalcalculator', 
			icon: 'https://play-lh.googleusercontent.com/iYsYpRPejHLU7Jmq3UGUM704GK0Xai9mqJAEAy_KWOoYTuxcvJbzfWG5htG4ZlWIj_M=s180-rw'
		},

		{
			id: '2', 
			title: 'Trợ Lý Điều Dưỡng', 
			description: 'Công cụ hỗ trợ tính toán bỏ túi dành cho Điều Dưỡng', 
			link: 'https://play.google.com/store/apps/details?id=com.bsdaoquang.trolydieuduong', 
			icon: 'https://play-lh.googleusercontent.com/viaW6JWpd-hSouAQONtH36WNHMQe6iiZPmcpyE_ZDKOy-AN3hULr6DQ2K3x1XAfUa8Lt=s180-rw'
		},
	]

	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	headerTitle: 'Ứng dụng khác',
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

	return(
		<View style={styles.container}>
			<View style={styles.inner}>
				<FlatList
		  			data={myapps} 
		  			renderItem={({ item }) => (
		                <View
		                	style={styles.list}>
			            	<Image style={styles.icon} source={{uri: item.icon}}/>
			            	<View style={{paddingHorizontal: 10, flex: 1}}>
			            		<Text style={styles.title}>{item.title}</Text>
			            		<Text>{item.description}</Text>
			            		<TouchableOpacity
			            			onPress={() => Linking.openURL(item.link)}
			            			style={styles.btnDownload}>
			            			<Text style={styles.btnText}>Tải ngay</Text>
			            		</TouchableOpacity>
			            	</View>
		                </View>
			        )}
		  	 		keyExtractor={item => item.id}
	  	 		/>
			</View>		
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

	icon:{
		width: 70,
		height: 70,
		borderRadius: 10
	},

	list:{
		paddingVertical: 10,
		borderBottomColor: '#e0e0e0',
		borderBottomWidth: 1,
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},

	btnDownload:{
		backgroundColor: '#1abc9c',
		width: '50%',
		padding: 5,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 5
	},

	btnText:{
		color: 'white'
	},

	title:{
		fontWeight: 'bold',
		color: '#34495e'
	}
})