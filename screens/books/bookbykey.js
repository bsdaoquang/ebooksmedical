import React, {useEffect, useState} from 'react'
import {
	View, Text, TouchableOpacity, FlatList, StyleSheet, Image, StatusBar, ToastAndroid
} from 'react-native'

import {firebaseApp} from '../../firebaseConfig'
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';

export default function BookByKey({navigation, route}) {

	const {key, by} = route.params

	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	headerTitle: key,
	    });
  	}, [navigation]);

	var EBOOKS = []
	firebaseApp.database().ref('Ebooks').orderByChild(by).equalTo(key).on('value', snap => {
		snap.forEach(item => {
			var ebook = {}
			ebook = item.val()
			ebook.key = item.key

			EBOOKS.push(ebook)
		})
	})

	const [load, setLoad] = useState(false)

	setTimeout(() => {
		setLoad(true)
	}, 1000)


	return(
		<View style={styles.container}>
		<FlatList style={styles.containerBook}
		data={EBOOKS} 
		renderItem={({ item }) => (
			<View style={styles.bookContain}>
				<TouchableOpacity
				onPress = {() => navigation.navigate('BookSingle', {bookId: item.key, title: item.title})}>
					<Image style={styles.bookImg} source={{uri: item.image}}/>
					<Text numberOfLines={1} style={styles.bookTitle}>{item.title}</Text>
					<Text numberOfLines={1} style={styles.bookAuthor}><AntDesign name="download" size={16} color="#34495e"/> {item.countDown}</Text>
				</TouchableOpacity>
			</View>
			)}
  			//inverted={true}
  			numColumns={3}
  			keyExtractor={item => item.key}
  			/>
		</View>	
	)
}

const styles = StyleSheet.create({

	container:{
		flex: 1,
	},

	containerBook:{
		padding: 8,
		flexDirection: 'column',
	},

	bookContain:{
		margin: 8,
		width: 100,
		height: 'auto'

	},

	bookImg:{
		width: 100,
		height: 150,
		marginBottom: 8,
		borderWidth: 0,
		borderRadius: 5,
	},

	bookTitle:{

		fontWeight: '200',
	},

	bookAuthor:{

		fontSize: 14,
		color: '#707070'
	},

	catList:{
		paddingVertical: 15,
		marginHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		flexDirection: 'row'
	}

})