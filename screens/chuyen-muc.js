import React, {useState} from 'react'
import { Text, View, StyleSheet, Image, FlatList, ScrollView,TouchableOpacity, SafeAreaView, Alert, TextInput,
		useWindowDimensions, StatusBar, ToastAndroid
	} from 'react-native'
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import {firebaseApp} from '../firebaseConfig'
import * as StoreReview from 'expo-store-review'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Linking from 'expo-linking';

function NewBook({navigation}){
	const [load, setLoad] = useState(false)
	var EBOOKS = []
	const getNewBook = async() => {
		await firebaseApp.database().ref('Ebooks').orderByChild('dateUpdate').limitToLast(100).on('value', (snapshot) => {
			snapshot.forEach(item => {
				if (item.val().status !== 'Bản nháp') {
					var ebook = {}
			  		ebook = item.val()
			  		ebook.key = item.key
			  		EBOOKS.unshift(ebook)
				}
		  	})
		})
	}
	getNewBook()

	setTimeout(() => {
		setLoad(true)
	}, 2000)
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
	);
}

function TopDownload({navigation}){

	const [load, setLoad] = useState(false)

	var TOPDOWNLOAD = []
	const getTopDown = async() => {

		await firebaseApp.database().ref('Ebooks').orderByChild('countDown').limitToLast(100).on('value', (snapshot) => {
			snapshot.forEach(item => {
		  		var ebook = {}
		  		ebook = item.val()
		  		ebook.key = item.key
		  		TOPDOWNLOAD.unshift(ebook)
		  	})
		})
	}

	getTopDown()

	setTimeout(() => {
		setLoad(true)
	}, 2000)

	return(
		<View style={styles.container}>
		<FlatList style={styles.containerBook}
		data={TOPDOWNLOAD} 
		renderItem={({ item }) => (
			<View style={styles.bookContain}>
				<TouchableOpacity onPress = {() => navigation.navigate('BookSingle', {bookId: item.key, title: item.title})}>
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

function Categories({navigation}){
	const [load, setLoad] = useState(false)

	var CATs = []

	const getCats = async() => {
		await firebaseApp.database().ref('chuyenMuc').orderByChild('title').on('value', (snapshot) => {
			snapshot.forEach(item => {
				var cat = {}
		  		cat = item.val()
		  		cat.key = item.key
		  		CATs.push(cat)
		  	})
		})
	}

	getCats()

	setTimeout(() => {
		setLoad(true)
	}, 2000)

	return(
		<View style={styles.container}>
			<FlatList style={styles.containerBook}
				data={CATs} 
				renderItem={({ item }) => (
					<TouchableOpacity style={styles.catList} onPress={() => navigation.navigate('Chuyên mục sách', {title: item.title, id: item.key})}>
						<AntDesign name="tags" size={24} color="#34495e" style={{marginRight: 15}}/>
						<Text>{item.title}</Text>
					</TouchableOpacity>
				)}
	  			//inverted={true}
	  			keyExtractor={item => item.key}
	  		/>
		</View>
	)
}

const Tab = createMaterialTopTabNavigator();
export default function ChuyenMuc({navigation, route}){

	const {title, name} = route.params

	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	title: title,
	    });
  	}, [navigation]);
	//vùng hiển thị sách

	return (
		<Tab.Navigator>
      		<Tab.Screen name="Mới nhất" component={NewBook} />
      		<Tab.Screen name="Tải nhiều" component={TopDownload} />
      		<Tab.Screen name="Chuyên mục" component={Categories} />
    	</Tab.Navigator>
	);
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