import React, {useEffect , useState} from 'react'
import {
	View, Text, TouchableOpacity, StyleSheet, Image, ToastAndroid, FlatList, useWindowDimensions, StatusBar
} from 'react-native'
import {firebaseApp} from '../../firebaseConfig'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function CategoryScreen({navigation, route}) {
	var {title, id} = route.params;

	const [iconname, setIconname] = useState('playlist-plus')

	var category = {}
	firebaseApp.database().ref('chuyenMuc').child(''+id).on('value', snap => {
		category = snap.val()
		category.key = snap.key
	})
	
	//cài đặt icon cho nút thích
	firebaseApp.auth().onAuthStateChanged((user) => {
		if (user) {
			firebaseApp.database().ref('Users').child(user.uid).child('categories').once('value', snap => {
				var cats = snap.val()
				
				if (cats.includes(''+id)) {
					setIconname('playlist-remove')
				}else{
					setIconname('playlist-plus')
				}
			})
		}
	})

	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	headerTitle: title,
	    	headerRight: () => (
	    		<View>
	    			<TouchableOpacity style={{paddingHorizontal: 15}} onPress={() => addPivared()}>
	    				<MaterialCommunityIcons name={iconname} size={28} color="#34495e" />
	    			</TouchableOpacity>
	    		</View>
	      	),
	    });
  	}, [navigation]);

  	function addPivared(){
  		firebaseApp.auth().onAuthStateChanged((user) => {
	  		if (user) {
	  		  	//thêm hoặc xóa khỏi yêu thích
	  			//trường hợp đã có trong mục yêu thích -> xóa
	  			firebaseApp.database().ref('Users').child(user.uid).child('categories').once('value', snap => {
	  				if (snap.val().includes(id)) {
	  					
	  					var catsLike = snap.val()
	  					var indexof = catsLike.indexOf(id)

	  					catsLike.splice(indexof, 1)
	  					ToastAndroid.show('Đã xóa khỏi yêu thích', ToastAndroid.SHORT)
	  				}else{
	  					var catsLike = snap.val()
	  					catsLike.push(id)	
	  					ToastAndroid.show('Đã thêm vào yêu thích', ToastAndroid.SHORT)
	  				}

	  				firebaseApp.database().ref('Users').child(user.uid).update({
  						categories: catsLike
  					})

	  			})
	  		}else{
	  			ToastAndroid.show('Bạn cần phải đăng nhập trước', ToastAndroid.SHORT)
	  			navigation.navigate('Đăng nhập')
	  		}

  		})
  	}

  	//phần này tạm thời bỏ qua đi

  	var EBOOKS = []
	const getNewBook = async() => {
		await firebaseApp.database().ref('Ebooks').orderByChild('title').on('value', (snapshot) => {
			snapshot.forEach(item => {
				if (item.val().category.includes(id)) {
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
	}, 3000)

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