import React from 'react'
import {
	View, Text, StyleSheet
} from 'react-native'

export default function MyAlerts({navigation, route}){

	var {uid} = route.params

	console.log(uid)

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
	    });
  	}, [navigation]);


	return(
		<View>
			<Text>Trang thông báo</Text>
		</View>
	)
}