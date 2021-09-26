import React, {useState} from 'react'
import { Text, View, StyleSheet, Image, FlatList, ScrollView,TouchableOpacity, SafeAreaView, Alert, TextInput,
		useWindowDimensions, StatusBar, ToastAndroid
	} from 'react-native'
import { AntDesign, Entypo, Feather, Ionicons } from '@expo/vector-icons';
import {firebaseApp} from '../firebaseConfig'
import * as StoreReview from 'expo-store-review'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Linking from 'expo-linking';
import NetInfo from '@react-native-community/netinfo';

export default function SliderScreen({navigation}){
	const [net, setNet] = useState(true)

	var SLIDERS = []
	var CATs = []
	var TOPDOWNLOAD = []

	const getNewBook = async() => {
		await firebaseApp.database().ref('Ebooks').orderByChild('type').equalTo('Slider').limitToLast(10).on('value', (snapshot) => {
			snapshot.forEach(item => {
				if (item.val().type === 'Slider') {
					var sliders = {}
			  		sliders = item.val()
			  		sliders.key = item.key
			  		SLIDERS.unshift(sliders)
				}
		  	})
		})
	}
	getNewBook()

	const getCats = async () => {
		await firebaseApp.database().ref('chuyenMuc').limitToFirst(10).on('value', snapcat => {
			snapcat.forEach(itemcat => {
				var cat = {}
				cat = itemcat.val()
		  		cat.key = itemcat.key
		  		CATs.push(cat)		
		  	})
		})
	}

	getCats()

	const getTopDown = async () => {
		await firebaseApp.database().ref('Ebooks').orderByChild('type').equalTo('Slider').on('value', snap => {
			var i = 0
			snap.forEach(item => {
				if (item.val().type === 'Slider') {
					if (i < 12) {
						var ebook = {}
				  		ebook = item.val()
				  		ebook.key = item.key

				  		TOPDOWNLOAD.push(ebook)
					}
				}
				i++
		  		
		  	})
		})
	}

	getTopDown()

	const [load, setLoad] = useState(false)
	const [uid, setUid] = useState()

	firebaseApp.auth().onAuthStateChanged((user) => {
		if (user) {
			setUid(user.uid)
		}
	})

	var dataUser = {}	
	const loadDataUser = async() => {
		await firebaseApp.database().ref('Users').child(uid).on('value', snapuser => {
			dataUser = snapuser.val()
			dataUser.key = uid
		})
	}

	if (dataUser) {
		loadDataUser()
	}

	var download = []
	TOPDOWNLOAD.forEach(item => {
		download.push(
			<TouchableOpacity key={item.key}
				style={{margin: 10}}
				onPress = {() => navigation.navigate('BookSingle', {bookId: item.key, title: item.title, uid: uid})}>
				<Image style={{width: 150, height: 100, borderRadius: 5}} source={{uri: item.image}} />
            </TouchableOpacity>
		)
	})

  	NetInfo.fetch().then(state => {
	  	setNet(state.isConnected)

	  	if (state.isConnected) {
	  		setTimeout(() => {
	  			setLoad(true)
	  		}, 2000)

	  		if (CATs.length == 0) {
	  			setLoad(false)
	  		}
	  	}

	});

	return (

		<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
			{
				net == false ?
				<View>
					<Text>Lỗi kết nối</Text>
				</View>

				: 

				SLIDERS.length == 0 ?

				<View>
					<Text>Loadding...</Text>
				</View>

				: 

				<ScrollView style={styles.container}>
					<StatusBar
				        animated={true}
				        hidden={true}
				        backgroundColor='white'
			        />

			        <View style={styles.titleContainer}>
			        	<Text style={styles.title}>Mới nhất</Text>
			        	<TouchableOpacity onPress={() => navigation.navigate('Chuyên Mục', {title: 'New', name: 'Chuyên mục'})}>
			        		<Text style={styles.seemore}>Xem thêm</Text>
			        	</TouchableOpacity>
			        </View>

			        <View style={styles.bookContainerHorizontal}>
			        	<FlatList
				  			data={SLIDERS} 
				  			renderItem={({ item }) => (
				                <TouchableOpacity
				                	style={{paddingHorizontal: 10}}
				                   	onPress = {() => navigation.navigate('BookSingle', {bookId: item.key, title:item.title, uid: uid})}>
					            	<Image style={styles.sliderImg} source={{uri: item.image}}/>
				                </TouchableOpacity>
					        )}
							horizontal={true}
				  	 		keyExtractor={item => item.key}
			  	 		/>
			        </View>

			        <View style={styles.titleContainer}>
			        	<Text style={styles.title}>Chuyên mục</Text>
			        	<TouchableOpacity onPress={() => navigation.navigate('Chuyên Mục', {title: 'Chuyên mục', name: 'Chuyên mục'})}>
			        		<Text style={styles.seemore}>Xem thêm</Text>
			        	</TouchableOpacity>
			        </View>
			        <View style={styles.bookContainerHorizontal}>
			        	<FlatList
				  			data={CATs} 
				  			renderItem={({ item }) => (
				                <TouchableOpacity style={styles.btnCat} 
				                	onPress={() => navigation.navigate('Chuyên mục sách', {title: item.title, id: item.key, fill: 'Slider'})}>
				                	{
				                		item.img !== '' ?
											<Image style={styles.catImg} source={{uri: item.img}}/>
				                		: <AntDesign name="tagso" size={50} color="#3498db" style={styles.catImg} />
				                	}
					            	<Text numberOfLines={1} style={styles.catTitle}>{item.title}</Text>
				                </TouchableOpacity>
					        )}
							horizontal={true}
				  	 		keyExtractor={item => item.key}
			  	 		/>
			        </View>

			        <View style={{marginVertical: 20, paddingHorizontal: 10, flexDirection: 'row'}}>
			        	<TouchableOpacity style={styles.btnTag}>
			        		<Text style={{...styles.title, color: '#2c3e50'}}>Tải nhiều</Text>
			        	</TouchableOpacity>
			        </View>
			        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
			        	{download}
			        </View>
				</ScrollView>
			}
		</View>

		
	);
}

const styles = StyleSheet.create({

	container:{
		flex: 1,
		backgroundColor: '#f9f9f9',
		paddingHorizontal: 10
	},

	titleContainer:{
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},

	title:{
		flex: 1,
		color: '#414141',
		fontSize: 18,
		fontWeight: 'bold'
	},

	seemore:{
		color: '#676767',
		fontStyle: 'italic',
		padding: 5
	},

	bookContainerHorizontal:{
		padding: 10
	},

	btnCat:{
		width: 100,
		height: 100,
		marginRight: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},

	catImg:{
		width: 50,
		height: 50,
		marginBottom: 10
	},

	btnTag:{
		paddingRight: 20
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

	sliderImg:{
		width: 200,
		height: 130,
		marginBottom: 8,
		borderWidth: 0,
		borderRadius: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 16,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16,
	},

	bookImgVer:{
		width: 100,
		height: 150,
		marginRight: 20
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
	},

	ngonnguContainer:{
		justifyContent: 'center',
		flexDirection: 'row'
	}

})