import React, {useEffect , useState} from 'react'
import {
	View, Text, TouchableOpacity, StyleSheet, Image, ToastAndroid, FlatList, useWindowDimensions, StatusBar
} from 'react-native'
import {firebaseApp} from '../../firebaseConfig'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function MyBooksScreen({navigation, route}) {
	var {uid} = route.params;

	console.log(uid)

	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	headerTitle: 'Sách của tôi',
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
    			<TouchableOpacity style={{paddingHorizontal: 15}}>
    				<MaterialCommunityIcons name='upload' size={28} color="#34495e" />
    			</TouchableOpacity>
	      	),
	    });
  	}, [navigation]);

  	var EBOOKS = []
	const getNewBook = async() => {
		await firebaseApp.database().ref('Ebooks').orderByChild('title').on('value', (snapshot) => {
			snapshot.forEach(item => {
				if (item.val().uploadBy === uid) {
					var ebook = {}
			  		ebook = item.val()
			  		ebook.key = item.key
			  		EBOOKS.unshift(ebook)
				}
		  	})
		})
	}
	getNewBook()

	const [load, setLoad] = useState(false)
	setTimeout(() => {
		setLoad(true)	
	}, 1000)

	return(
		<View style={styles.container}>
  			<StatusBar style='auto' />
    		<FlatList style={styles.containerBook}
	  			data={EBOOKS} 
	  			renderItem={({ item }) => (
		            <View style={styles.bookContain}>
		                <TouchableOpacity
		                   	onPress = {() => navigation.navigate('BookSingle', {bookId: item.key, title:item.title})}>
			            	<Image style={styles.bookImg} source={{uri: item.image}}/>
			              	<Text numberOfLines={1} style={styles.bookTitle}>{item.title}</Text>
			              	<Text numberOfLines={1} style={styles.bookAuthor}>{item.author}</Text>
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
		backgroundColor: '#fafafa'
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