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

export default function HomeScreen({navigation}){
	const [net, setNet] = useState(true)

	var EBOOKS = []
	var CATs = []
	var TOPDOWNLOAD = []
	var TOPVIEW = []

	const getNewBook = async() => {
		await firebaseApp.database().ref('Ebooks').orderByChild('dateUpdate').limitToLast(10).on('value', (snapshot) => {
			snapshot.forEach(item => {
				if (item.val().status !== 'Bản nháp' && item.val().type === 'Ebook') {
					var ebook = {}
			  		ebook = item.val()
			  		ebook.key = item.key
			  		EBOOKS.unshift(ebook)
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
		await firebaseApp.database().ref('Ebooks').orderByChild('countDown').limitToLast(5).on('value', snap => {
			snap.forEach(item => {
				if (item.val().status !== 'Bản nháp' && item.val().type === 'Ebook') {
					var ebook = {}
			  		ebook = item.val()
			  		ebook.key = item.key
			  		TOPDOWNLOAD.unshift(ebook)
				}
		  		
		  	})
		})
	}

	getTopDown()

	const getTopView = async () => {
		await firebaseApp.database().ref('Ebooks').orderByChild('countView').limitToLast(5).on('value', snapview => {
			snapview.forEach(itemview => {
				if (itemview.val().status !== 'Bản nháp' && itemview.val().type === 'Ebook') {
					var ebook = {}
			  		ebook = itemview.val()
			  		ebook.key = itemview.key
			  		TOPVIEW.unshift(ebook)
				}
		  		
		  	})
		})
	}

	getTopView()

	const [load, setLoad] = useState(false)
	const [uid, setUid] = useState()
	const [top, settop] = useState(1)

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

		var catTitle = ''
		item.category.forEach(itemcat => {
			firebaseApp.database().ref('chuyenMuc').child(itemcat).on('value', snapcat => {
				catTitle = snapcat.val().title + ', '
			})
		})
		
		download.push(
			<View key={item.key} style={{flexDirection: 'row', justifyContents: 'center', marginVertical: 10}}>
				<TouchableOpacity style={{flex: 1, flexDirection: 'row'}} 
					onPress = {() => navigation.navigate('BookSingle', {bookId: item.key, title: item.title, uid: uid})}>
					<Image style={{width: 100, height: 150, borderRadius: 5}} source={{uri: item.image}} />
	            	<View style={{flex: 1, paddingHorizontal: 10}}>
	            		<Text style={{fontWeight: 'bold'}}>{item.title}</Text>
	            		<Text style={{color: '#676767'}}>{item.author}</Text>
	            		<View style={{position: 'absolute', bottom: 0, left: 10}}>
	            			<View style={styles.ngonnguContainer}>
	            				<Text style={styles.seemore}><AntDesign name="download" size={16} color="#414141" /> {item.countDown}</Text>
	            				<Text style={styles.seemore}><Ionicons name="language" size={16} color="#414141" /> {item.ngonngu}</Text>
	            			</View>
	            			<Text>{catTitle}</Text>	
	            		</View>
	            	</View>
	            </TouchableOpacity>
	            <TouchableOpacity>
	            	<Feather name="bookmark" size={20} color="#616161"/>
	            </TouchableOpacity>
			</View>
		)
	})

	var viewbook = []
	TOPVIEW.forEach(item => {

		var catTitle = ''
		item.category.forEach(itemcat => {
			firebaseApp.database().ref('chuyenMuc').child(itemcat).on('value', snapcat => {
				catTitle = snapcat.val().title + ', '
			})
		})

		viewbook.push(
			<View key={item.key} style={{flexDirection: 'row', justifyContents: 'center', marginVertical: 10}}>
				<TouchableOpacity style={{flex: 1, flexDirection: 'row'}} 
					onPress = {() => navigation.navigate('BookSingle', {bookId: item.key, title:item.title, uid: uid})}>
					<Image style={{width: 100, height: 150, borderRadius: 5}} source={{uri: item.image}} />
	            	<View style={{flex: 1, paddingHorizontal: 10}}>
	            		<Text style={{fontWeight: 'bold'}}>{item.title}</Text>
	            		<Text style={{color: '#676767'}}>{item.author}</Text>
	            		<View style={{position: 'absolute', bottom: 0, left: 10}}>
	            			<View style={styles.ngonnguContainer}>
	            				<Text style={styles.seemore}><AntDesign name="eye" size={16} color="#616161" /> {item.countView}</Text>
	            				<Text style={styles.seemore}><Ionicons name="language" size={16} color="#414141" /> {item.ngonngu}</Text>
	            			</View>
	            			<Text>{catTitle}</Text>	
	            		</View>
	            	</View>
	            </TouchableOpacity>
	            <TouchableOpacity>
	            	<Feather name="bookmark" size={20} color="#616161"/>
	            </TouchableOpacity>
			</View>
		)
	})

	//Đây là mã giúp hiện phần đánh giá
	if (StoreReview.hasAction()) {
	    StoreReview.storeUrl('https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc')
	    StoreReview.requestReview()
  	}

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

				EBOOKS.length == 0 ?

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

			        {
			        	dataUser ? 
				        	dataUser.displayName !== undefined ?
				        		<TouchableOpacity
				        			onPress={() => navigation.navigate('ProfileScreen', {userData: dataUser})}
				        			style={{flexDirection: 'row', backgroundColor: '#ecf0f1', padding: 10, borderRadius: 10, margin: 10}}>
				        			<View style={{flex: 1}}>
							        	<Text style={{...styles.title, fontWeight: 'normal'}}>Chào mừng bạn!</Text>
							        	<Text style={{fontWeight: 'bold', fontSize: 24}}>{dataUser.displayName}</Text>
						        	</View>
						        	<View style={{
						        		borderRadius: 50, 
						        		backgroundColor: 'coral', 
						        		justifyContents: 'center',
						        		padding: 5,
						        		width: 60,
						        		height: 60}}>
						        		<View style={{flex: 1, alignItems: 'center'}}>
						        			<Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>{dataUser.medCoin}</Text>
											<Text style={{color: 'white'}}>điểm</Text>	
						        		</View>
						        	</View>
				        		</TouchableOpacity>
								
				        	: null
				        : null
			        }
			        <View style={{flexDirection: 'row', alignItems: 'center'}}>
			        	<TouchableOpacity style={{paddingHorizontal: 10}} onPress={() => navigation.openDrawer()}>
			        		<AntDesign name="menuunfold" size={28} color="#34495e" />
			        	</TouchableOpacity>

			        	<TouchableOpacity style={{
				        	borderRadius: 20,
				        	borderWidth: 1,
				        	borderColor: '#212121',
				        	padding: 5,
				        	marginVertical: 10,
				        	flexDirection: 'row',
				        	alignItems: 'center',
				        	flex: 1
				        }}
				        	onPress={() => navigation.navigate('Tìm kiếm')}>
				        	<Text style={{...styles.seemore, flex: 1}}>Bạn muốn tìm gì hôm nay?</Text>
				        	<AntDesign name="search1" size={20} color="#34495e" />
				        </TouchableOpacity>	
			        </View>
			        

			        <View style={styles.titleContainer}>
			        	<Text style={styles.title}>The Latest</Text>
			        	<TouchableOpacity onPress={() => navigation.navigate('Chuyên Mục', {title: 'New', name: 'Chuyên mục'})}>
			        		<Text style={styles.seemore}>see more</Text>
			        	</TouchableOpacity>
			        </View>

			        <View style={styles.bookContainerHorizontal}>
			        	<FlatList
				  			data={EBOOKS} 
				  			renderItem={({ item }) => (
				                <TouchableOpacity
				                   	onPress = {() => navigation.navigate('BookSingle', {bookId: item.key, title:item.title, uid: uid})}>
					            	<Image style={styles.bookImg} source={{uri: item.image}}/>
				                </TouchableOpacity>
					        )}
							horizontal={true}
				  	 		keyExtractor={item => item.key}
			  	 		/>
			        </View>

			        <View style={styles.titleContainer}>
			        	<Text style={styles.title}>Categories</Text>
			        	<TouchableOpacity onPress={() => navigation.navigate('Chuyên Mục', {title: 'Chuyên mục', name: 'Chuyên mục'})}>
			        		<Text style={styles.seemore}>see more</Text>
			        	</TouchableOpacity>
			        </View>

			        <View style={styles.bookContainerHorizontal}>
			        	<FlatList
				  			data={CATs} 
				  			renderItem={({ item }) => (
				                <TouchableOpacity style={styles.btnCat} 
				                	onPress={() => navigation.navigate('Chuyên mục sách', {title: item.title, id: item.key})}>
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
			        	<TouchableOpacity style={styles.btnTag} onPress={() => settop(1)}>
			        		<Text style={{...styles.title, color: top === 1 ? '#2c3e50' : '#95a5a6', borderBottomWidth: top === 1 ? 1 : null, borderBottomColor: '#2c3e50', paddingBottom: 5}}>Top Download</Text>
			        	</TouchableOpacity>
			        	<TouchableOpacity style={styles.btnTag} onPress={() => settop(2)}>
			        		<Text style={{...styles.title, color: top === 2 ? '#2c3e50' : '#95a5a6', borderBottomWidth: top === 2 ? 1 : null, borderBottomColor: '#2c3e50', paddingBottom: 5}}>Top Read</Text>
			        	</TouchableOpacity>
			        </View>
			        <View style={{paddingHorizontal: 10, flex: 1}}>
			        	{
			        		top === 1 ? download : viewbook
			        	}
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

	bookImg:{
		width: 130,
		height: 200,
		marginBottom: 8,
		borderWidth: 0,
		borderRadius: 5,
		marginRight: 15,
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