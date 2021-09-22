import React, { useState } from 'react'
import {
	View, Text, Image, TouchableOpacity, StyleSheet,Button,
	 ScrollView, ImageBackground, FlatList, useWindowDimensions,
	 Alert, Share, ToastAndroid
}from 'react-native'

import * as Linking from 'expo-linking';
import { AntDesign, MaterialIcons, FontAwesome, Entypo, FontAwesome5 } from '@expo/vector-icons';
import {firebaseApp} from '../../firebaseConfig'
import * as Localization from 'expo-localization';
import {showAdInter} from '../../admobConfig'
import {AdMobInterstitial} from 'expo-ads-admob';

var database = firebaseApp.database();

export default function BookSingle({ route, navigation }){	
	var {bookId, title } = route.params;

	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	headerTitle: 'Book Detail',
    		headerTransparent: true,
	    });
  	}, [navigation]);

	const [readMore, setReadMore] = useState('down')
	const [readLine, setReadLine] = useState(5)

	var ebook = {}
	firebaseApp.database().ref('Ebooks').child(bookId).on('value', (snapshot) => {
	  	ebook = snapshot.val()
	  	ebook.key = snapshot.key

	  	firebaseApp.database().ref('Users').child(snapshot.val().uploadBy).on('value', snap => {
	  		ebook.displayName = snap.val().displayName
	  	})
	});

	var categories = ''

	ebook.category.forEach(item => {
		firebaseApp.database().ref('chuyenMuc').child(item).on('value', snap => {
			categories += snap.val().title + ', '
		})
	})

	var down = ebook.countDown
	var view = ebook.countView
	var countComments = 0
	var countShare = ebook.countShare

	firebaseApp.database().ref('Ebooks').child(bookId).child('comments').on('value', snap => {
		snap.forEach(item => {
			countComments += 1
		})
	})

	firebaseApp.database().ref('Ebooks').child(bookId).update({
		countView: view + 1
	})


	function readMoreFunction(){
		setReadMore(readMore == 'up' ? 'down' : 'up')
		setReadLine(readLine == null ? 5 : null)
	}

	const [loadAds, setLoadAds] = useState(false)

	function downloadBook(bookURL, down){
		setLoadAds(true)

		ToastAndroid.show('Đang tải quảng cáo', ToastAndroid.SHORT)
		showAdInter()

		AdMobInterstitial.addEventListener('interstitialDidClose', () => {	
			setLoadAds(false)

			firebaseApp.database().ref('Ebooks').child(bookId).update({
				countDown: down + 1
			}).then(() => {
				 Linking.openURL('https://drive.google.com/uc?export=download&id=' + bookURL)
			})
		})
	}

	function downloadVIP(bookURL, down){
		//Kiêm tra xem có đăng nhập không
		firebaseApp.auth().onAuthStateChanged((user) => {
			if(user){
				firebaseApp.database().ref('Users').child(user.uid).on('value', snap => {
					var point = snap.val().medCoin
					console.log(point)
					if ((point * 1) > 0) {
						firebaseApp.database().ref('Ebooks').child(bookId).update({
							countDown: down + 1
						}).then(() => {
							 Linking.openURL('https://drive.google.com/uc?export=download&id=' + bookURL)
						})
					}else{
						alert('Số điểm còn lại không đủ, xin vui lòng nạp thêm')
					}
				})
			}else{
				alert('Bạn cần đăng nhập để thực hiện chức năng này')
			}
		})
	}

	const onShare = async (title, description) => {

		firebaseApp.database().ref('Ebooks').child(bookId).update({
			countShare: countShare + 1
		})

	    const result = await Share.share({
	      	title: title,
	        message: title + '\n\n' +
	        	description.split('\n')[0] + '\n\n' +

	        	'Phần mềm tải sách y học miễn phí cho điện thoại' +
	        	`
	        	https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc\n
	        	`,
	        url: 'https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc',
	    });
	}

	function removeReques(title, author){
		Alert.alert(
			"Yêu cầu gỡ bỏ",
			"Nếu bạn là tác giả của ebook này, Tôi vô cùng xin lỗi vì đã chia sẻ mà chưa được sự cho phép của Bạn. Hãy bấm đồng ý để gửi yêu cầu gỡ bỏ ebook này khỏi hệ thống, ngay khi xác minh chính xác yêu cầu, tôi cam kết sẽ gỡ bỏ Ebook này khỏi hệ thống ngay!",
			[
				{
					text: "Không",
					onPress: () => alert('Cám ơn bạn đã đồng ý chia sẻ ebook này đến mọi người. Tôi xin cam kết chia sẻ hoàn toàn miễn phí và giữ nguyên quyền tác giả của bạn'),
					style: "cancel"
				},
				{ text: "Đồng ý", onPress: () => Linking.openURL('mailto: bsdaoquangadmod@gmail.com?subject=Yêu cầu gỡ bỏ&body=Yêu cầu bạn gỡ bỏ quyển sách sau khỏi hệ thống vì liên quan đến quyền tác giả \n Tên sách:'+ title + '\n của Tác giả: ' + author + '') }
			]
		);
	}

	const [like, setLike] = useState(false)
	const [dislike, setDislike] = useState(false)
	//set màu cho nut like và dislike

	//phần này là để đổi màu
	firebaseApp.auth().onAuthStateChanged((user) => {
		if (user) {
			firebaseApp.database().ref('Users').child(user.uid).child('likes').once('value', snap => {
				if (snap.val() !== null) {
					if (snap.val().includes(bookId)) {
						setLike(true)
					}else{
						setLike(false)
					}
				}else{
					setLike(false)
				}
				
			})

			firebaseApp.database().ref('Users').child(user.uid).child('dislike').once('value', snap => {
				if (snap.val() !== null) {
					if (snap.val().includes(bookId)) {
						setDislike(true)
					}else{
						setDislike(false)
					}
				}else{
					setDislike(false)
				}
				
			})

		}
	})



	function btnLike(key){
		firebaseApp.auth().onAuthStateChanged((user) => {
			if (user) {

				var likes

				firebaseApp.database().ref('Users').child(user.uid).once('value', snap => {

					if (snap.val().likes !== '') {
						likes = snap.val().likes
					}else{
						likes = []
					}

					//like thì phải bỏ dislike
					if (like === true) {
						//người dùng đã thích
						
						//cộng đi 1 lần thích
						firebaseApp.database().ref('Ebooks').child(key).update({
							countLike: ebook.countLike - 1
						})

						setLike(false)
						// xóa khỏi database của người dùng
						var keyIndex = likes.indexOf(key)

						likes.splice(keyIndex, 1)

						firebaseApp.database().ref('Users').child(user.uid).update({
							likes: likes
						})

					}else{
			
						//cộng thêm 1 lần thích
						firebaseApp.database().ref('Ebooks').child(key).update({
							countLike: ebook.countLike + 1
						})

						setLike(true)

						// thêm vào database của người dùng
						likes.push(key)
						firebaseApp.database().ref('Users').child(user.uid).update({
							likes: likes
						})
					}
				})
			}else{
				alert('Bạn cần phải đăng nhập trước')
			}
		})
	}

	// function btnDislike(key){
	// 	firebaseApp.auth().onAuthStateChanged((user) => {
	// 		if (user) {

	// 			var dislikes

	// 			firebaseApp.database().ref('Users').child(user.uid).once('value', snap => {

	// 				if (snap.val().dislike !== '') {
	// 					dislikes = snap.val().dislike
	// 				}else{
	// 					dislikes = []
	// 				}

	// 				//like thì phải bỏ dislike
	// 				if (dislike === true) {
	// 					//người dùng đã thích
						
	// 					//cộng đi 1 lần thích
	// 					firebaseApp.database().ref('Ebooks').child(key).update({
	// 						countDislike: ebook.countDislike - 1
	// 					})

	// 					setLike(false)
	// 					// xóa khỏi database của người dùng
	// 					var keyIndex = dislikes.indexOf(key)

	// 					dislikes.splice(keyIndex, 1)

	// 					firebaseApp.database().ref('Users').child(user.uid).update({
	// 						dislike: dislikes
	// 					})

	// 				}else{
			
	// 					//cộng thêm 1 lần thích
	// 					firebaseApp.database().ref('Ebooks').child(key).update({
	// 						countDislike: ebook.countDislike + 1
	// 					})

	// 					setLike(true)

	// 					// thêm vào database của người dùng
	// 					dislikes.push(key)
	// 					firebaseApp.database().ref('Users').child(user.uid).update({
	// 						dislike: dislikes
	// 					})
	// 				}
	// 			})
	// 		}else{
	// 			alert('Bạn cần phải đăng nhập trước')
	// 		}
	// 	})
	// }

	var language = Localization.locale

	return (
		<View style={styles.container}>
			<ScrollView style={{bottom: 60}}>
				<ImageBackground
					source={ebook.image ? {uri: ebook.image} : ''}
					style={{backgroundColor: 'coral', opacity: 0.9}}>
					<View style={{backgroundColor:'transparent', opacity: 0.6}}></View>
					<View style={styles.headerContainer}>
						<Image 
							source={ebook.image ? {uri: ebook.image} : ''}
							style={styles.imgHeader}
						/>
						{/*<View style={{flexDirection: 'row', marginTop: 15, justifyContent: 'center'}}>
							<TouchableOpacity 
								onPress={() => btnLike(ebook.key)}
								style={{padding: 5}}>
								<Text><AntDesign name="like1" size={20} color={like === true ? '#3498db' : '#7f8b8b'}/> {ebook.countLike}</Text>
							</TouchableOpacity>

							<TouchableOpacity 
								onPress={() => btnDislike(ebook.key)}
								style={{padding: 5}}>
								<Text><AntDesign name="dislike1" size={20} color={dislike === true ? '#3498db' : '#7f8b8b'}/> {ebook.countDislike}</Text>
							</TouchableOpacity>
						</View>*/}

						<View style={styles.titleHeader}>
							<Text numberOfLines={1} style={styles.title}>{ebook.title}</Text>
							<Text numberOfLines={1} style={styles.author}>{ebook.author}</Text>

							{/*<View style={{...styles.bottomDownload, flexDirection: 'row'}}>
								{
									loadAds === true ? <Text>Đang tải...</Text>
									:
									<TouchableOpacity style={styles.btnDownload}
										onPress={() => downloadBook(ebook.downloadLink, ebook.countDown)}
									>
										<AntDesign name="download" size={18} color="white" />
										<Text style={{textTransform: 'uppercase', color: 'white', marginLeft: 5}}> Tải xuống</Text>
									</TouchableOpacity>
								}
								
							</View>*/}
						</View>

						<View style={{...styles.reviewContainer, backgroundColor: '#bdc3c7', borderRadius: 15, paddingVertical: 15, opacity: 0.6}}>
							{/*Phần like share comments*/}
							<View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly'}}>
								<View style={styles.iconTop}>
									<Text style={styles.titleIcon}>{ebook.countDown}</Text>
									<Text style={{color: '#34495e'}}>Downloaded</Text>
								</View>

								<View style={styles.iconTop}>
									<Text style={styles.titleIcon}>{ebook.countView}</Text>
									<Text style={{color: '#34495e'}}>View</Text>
								</View>

								<View style={styles.iconTop}>
									<Text style={styles.titleIcon}>{ebook.ngonngu === 'Tiếng Việt' ? 'Vie' : 'Eng'}</Text>
									<Text style={{color: '#34495e'}}>Language</Text>
								</View>
							</View>
						</View>


					</View>
				</ImageBackground>
				
				{/*<View style={{padding: 8, backgroundColor: '#fafafa'}}>
					<TouchableOpacity style={{flexDirection: 'row'}} onPress={() => Linking.openURL('https://m.me/yhocso')}>
						<FontAwesome name="warning" size={22} color="#f1c40f" />
						<Text style={{color: '#212121'}}> Báo lỗi tải</Text>
					</TouchableOpacity>
				</View>*/}

				{
					ebook.description !== '' ?
						<View style={styles.reviewContainer}>
							<Text style={{...styles.title, paddingVertical: 15}}>Description</Text>
							<Text numberOfLines={readLine} style={styles.tetxReview}>{ebook.description}</Text>
							<TouchableOpacity 
							style={styles.buttonReadmore}
							onPress = {() => readMoreFunction()}>
								<AntDesign name={readMore} size={24} color="#2ecc71" />
							</TouchableOpacity>
						</View>
					:null
				}
				
				<View style={styles.reviewContainer}>
					<Text style={{...styles.title, paddingVertical: 10}}>Product details</Text>
					<View style={styles.infoBook}>
						<View style={styles.titleInfo}>
							<Text style={styles.textTitleInfo}>Publisher: </Text>
							<TouchableOpacity
								onPress={() => navigation.navigate('BookByKey', {key: ebook.datePublish, by: 'datePublish'})}
							>
								<Text style={{...styles.textDescInfo, color: '#3498db'}}>{ebook.publish + ' ' + ebook.datePublish}</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.infoBook}>
						<View style={styles.titleInfo}>
							<Text style={styles.textTitleInfo}>Author: </Text>
							<TouchableOpacity
								onPress={() => navigation.navigate('BookByKey', {key: ebook.author, by: 'author'})}
							>
								<Text style={{...styles.textDescInfo, color: '#3498db'}}>{ebook.author}</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.infoBook}>
						<View style={styles.titleInfo}>
							<Text style={styles.textTitleInfo}>Category: </Text>
							<Text style={{...styles.textTitleInfo, flex: 1, fontWeight: 'normal'}}>{categories}</Text>
						</View>
					</View>

					<View style={styles.infoBook}>
						<View style={styles.titleInfo}>
							<Text style={styles.textTitleInfo}>Language: </Text>
							<TouchableOpacity
								onPress={() => navigation.navigate('BookByKey', {key: ebook.ngonngu, by: 'ngonngu'})}
							>
								<Text style={{...styles.textDescInfo, color: '#3498db'}}>{ebook.ngonngu}</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.infoBook}>
						<View style={styles.titleInfo}>
							<Text style={styles.textTitleInfo}>Upload: </Text>
							<Text style={{...styles.textDescInfo, color: '#3498db'}}>{ebook.displayName}</Text>
						</View>
					</View>
				</View>
				<View style={styles.reviewContainer}>
					<Text style={{...styles.title, paddingVertical: 8}}>Products related to this item</Text>
				</View>
			</ScrollView>
			<View style={styles.btnDownloadContainer}>
				<TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}}
					onPress={() => btnLike(ebook.key)}>
					<MaterialIcons name={like === true ? 'bookmark' : 'bookmark-outline'} size={24} color={like === true ? '#3498db' : '#7f8b8b'}/>
				</TouchableOpacity>

				<View style={{flexDirection: 'row', flex: 1}}>
					<TouchableOpacity style={{...styles.btnDown, backgroundColor: '#d35400'}}
						onPress={() => downloadVIP(ebook.downloadLink, ebook.countDown)}>
						<Text style={{color: 'white'}}>Download Now</Text>
					</TouchableOpacity>

					<TouchableOpacity style={{...styles.btnDown, backgroundColor: '#2980b9'}}
						onPress={() => downloadBook(ebook.downloadLink, ebook.countDown)}>
						<Text style={{color: 'white'}}>Watch Ads</Text>
					</TouchableOpacity>
				</View>
				
			</View>
		</View>
	);
}

const styles = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: '#fafafa',
	},

	headerContainer:{
		flex: 1,
	    resizeMode: 'cover',
	    backgroundColor: 'white',
	    justifyContent: 'center',
	    alignItems: 'center',
	    paddingTop: 100,
	    paddingBottom: 40,
	    paddingHorizontal: 20
	},

	imgHeader:{
		width: 180,
		height: 260,
		borderRadius: 5,
	},

	titleHeader:{
		flex: 1,
		paddingVertical: 15,
		justifyContent: 'center',
		alignItems: 'center'

	},

	title:{
		fontWeight: 'bold',
		color: '#414141',
		fontSize: 18,
		justifyContent: 'center'
	},

	author:{
		fontSize: 16,
		color: '#676767',
		justifyContent: 'center'
	},

	ratingContainer:{
		marginTop: 5,
		backgroundColor: '#fafafa',
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},

	shareContainer:{
		width: '30%',
		alignItems: 'center',
		justifyContent: 'center'
	},

	textRating:{
		color: '#676767',
		fontSize: 14,
		marginTop: 5
	},

	downloadContainer:{
		width: '70%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},

	iconContainer:{
		alignItems: 'center',
		marginHorizontal: 15
	},

	reviewContainer:{
		backgroundColor: '#fafafa',
		padding: 10,
		marginTop: 5
	},
	tetxReview:{
		fontSize: 14,
		textAlign: 'justify',
		lineHeight: 18
	},

	buttonReadmore:{
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 5
	},

	infoBook:{
		borderTopWidth: 1,
		borderColor: '#eeeeee',
		flex: 1,
		paddingVertical: 10,
		justifyContent: 'flex-start',
	},

	titleInfo:{
		flex: 1,
		flexDirection: 'row',
		paddingVertical: 8
	},

	textTitleInfo: {
		color: '#676767',
		fontWeight: 'bold'
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

	bottomDownload:{
		position: 'absolute',
		bottom: 0,
		left: 15,
		right: 0,
		justifyContent: 'center',
		alignItems: 'center',
		//flexDirection: 'row'
	},

	btnDownload:{
		//width: '80%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#e74c3c',
		borderRadius: 5,
		paddingVertical: 8,
		paddingHorizontal: 10,
		flexDirection: 'row',
		marginTop: 15
	},

	youWillContain:{
	},

	newBooksContainer:{
	  	width: 100,
	  	marginLeft: 10,
	  	marginVertical: 15,
	},
	  
	newBooksImg:{
	  	width: 100,
	  	height: 150,
	},

	itemTitle:{
		fontWeight: 'bold'
	},

	bookAuthor:{
		color: '#676767'
	},

	iconTop:{
		justifyContent: 'center', 
		alignItems: 'center', 
		flex: 1,
		color: 'white'
	},

	titleIcon: {
		fontWeight: 'bold',
		color: '#34495e',
		fontSize: 20
	},

	btnDownloadContainer:{
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 11,
		flexDirection: 'row',
		alignItems: 'center'
	},

	btnDown:{
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center',
		marginRight: 5,
		borderRadius: 5,
		paddingVertical: 8
	}

})