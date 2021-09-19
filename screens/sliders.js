import React, {useEffect, useState} from 'react'
import { Text, View, StyleSheet, Image, FlatList, ScrollView,TouchableOpacity, SafeAreaView, Alert, TextInput,
		useWindowDimensions, StatusBar, ToastAndroid, Share
	} from 'react-native'
import { AntDesign, Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import {firebaseApp} from '../firebaseConfig'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {styles} from '../styles'
import * as Linking from 'expo-linking';
import AdMob, {showAdInter} from '../admobConfig'
import {AdMobInterstitial} from 'expo-ads-admob';

function NewSlider({navigation}){

	const [uid, setUid] = useState()
	firebaseApp.auth().onAuthStateChanged((user) => {
		if (user) {
			setUid(user.uid)
		}
	})

	const [load, setLoad] = useState(false)

	var SLIDER = []
	const getSliders = async() => {
		await firebaseApp.database().ref('Sliders').on('value', (snapshot) => {
			snapshot.forEach(item => {
				var slider = {}
		  		slider = item.val()
		  		slider.key = item.key

		  		if (uid) {
		  			firebaseApp.database().ref('Users').child(uid).on('value', snap => {
		  				if (snap.val().sliderslike !== undefined) {
		  					if (snap.val().sliderslike.includes(item.key)) {
		  						slider.like = true
		  					}else{
		  						slider.like = false
		  					}
		  				}else{
		  					slider.like = false
		  				}
		  			})
		  		}else{
		  			slider.like = false
		  		}

		  		SLIDER.push(slider)
		  	})


		})
	}

	getSliders()

	setTimeout (() => {
		setLoad(true)
	}, 3000)

	function likesliderset(key, like, countLike){
		setlikeslider(key, uid, like, countLike)

		setLoad(!load)
	}

  	return(
  		<View style={styles.container}>
  			<StatusBar style='auto' />
  			<FlatList
	  			data={SLIDER} 
	  			renderItem={({ item }) => (
		            <View style={styles.itemContainer}>
		                <TouchableOpacity onPress={() => navigation.navigate('SliderSinger', {key: item.key, uid: uid})}>
			            	<Image style={styles.itemImage} source={{uri: item.imglink}}/>
		                </TouchableOpacity>
		                <View style={styles.buttonContainer}>
		                	<TouchableOpacity onPress={() => likesliderset(item.key, item.like, item.countLike)}>
		                		<Text style={styles.countText}><AntDesign name={item.like === true ? 'heart' : 'hearto'} size={18} color="white" /> {item.countLike}</Text>
		                	</TouchableOpacity>
		                	<TouchableOpacity onPress={() => navigation.navigate('SliderSinger', {key: item.key, uid: uid})}>
		                		<Text style={styles.countText}><AntDesign name="eye" size={20} color="white" /> {item.countView}</Text>
		                	</TouchableOpacity>
		                	<TouchableOpacity onPress={() => onShare(item.key, item.countShare)}>
		                		<Text style={styles.countText}><AntDesign name="sharealt" size={20} color="white" /> {item.countShare}</Text>
		                	</TouchableOpacity>
		                	
		                </View>
		            </View>
		        )}
	  	 		keyExtractor={item => item.key}
  	 		/>
		</View>
	);
}

function Viewed({navigation}){
    const [load, setLoad] = useState(false)

	const [uid, setUid] = useState()
	firebaseApp.auth().onAuthStateChanged((user) => {
		if (user) {
			setUid(user.uid)
		}
	})

	var slidersviewed = []

	const getViewed = async() => {
		await firebaseApp.database().ref('Users').child(uid).on('value', snap => {
			var viewed = snap.val().slidersviewed
			
			if (viewed !== undefined) {
				viewed.forEach(item => {
					firebaseApp.database().ref('Sliders').child(item).once('value', snapitem => {
						var slider = {}

						slider = snapitem.val()
						slider.key = item

						slidersviewed.push(slider)
					})
				})
			}
		})
	}

	if (uid) {
		getViewed()
	}
	
	setTimeout (() => {
		setLoad(true)
	}, 3000)

	return(
		<View style={styles.container}>
  			<StatusBar style='auto' />
			<FlatList
  			data={slidersviewed} 
  			renderItem={({ item }) => (
	            <View style={styles.itemContainer}>
	                <TouchableOpacity onPress={() => navigation.navigate('SliderSinger', {key: item.key, uid: uid})}>
		            	<Image style={styles.itemImage} source={{uri: item.imglink}}/>
	                </TouchableOpacity>
	                <View style={styles.buttonContainer}>
	                	<TouchableOpacity onPress={() => likesliderset(item.key, item.like, item.countLike)}>
	                		<Text style={styles.countText}><AntDesign name={item.like === true ? 'heart' : 'hearto'} size={18} color="white" /> {item.countLike}</Text>
	                	</TouchableOpacity>
	                	<TouchableOpacity onPress={() => navigation.navigate('SliderSinger', {key: item.key, uid: uid})}>
	                		<Text style={styles.countText}><AntDesign name="eye" size={20} color="white" /> {item.countView}</Text>
	                	</TouchableOpacity>
	                	<TouchableOpacity onPress={() => onShare(item.key, item.countShare)}>
	                		<Text style={styles.countText}><AntDesign name="sharealt" size={20} color="white" /> {item.countShare}</Text>
	                	</TouchableOpacity>
	                </View>
	            </View>
	        )}
  	 		keyExtractor={item => item.key}
 			/>
		</View>
	)
}

function Categories({navigation}){
	const [load, setLoad] = useState(false)

	//hiển thị những chuyên mục có slider
	//vậy cứ hiển thị các chuyên mục ra xem đã

	var catSlider = []
	var cats = []
	const getCatslider = async() => {
		await firebaseApp.database().ref('Sliders').on('value', snap => {
			snap.forEach(item => {
				//kiểm tra từng phần tử trong mảng item có trong catslider chưa
				//nếu chưa có thì push vào, có rồi thì bỏ qua

				item.val().categories.forEach(itemcat => {
					if (cats.includes(itemcat)) {
						//có rồi thì bỏ qua
					}else{
						cats.push(itemcat)
					}
				})
			})

			cats.forEach(keycat => {
				firebaseApp.database().ref('chuyenMuc').child(keycat).once('value', snapcat => {

					var keys = {}
					keys = snapcat.val()
					keys.key = keycat

					catSlider.push(keys)
				})
			})
		})
	}

	getCatslider()

	setTimeout(() => {
		setLoad(true)
	}, 3000)

	return(
		<View style={styles.container}>
			<FlatList
				data={catSlider} 
				renderItem={({ item }) => (
					<TouchableOpacity style={styles.listContainer}>
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

function setlikeslider(id, uid, like, countLike){
    if (like === false) {
        //người dùng chưa like bao giờ
        //lưu vào thông tin người dùng và chuyển ngôi sao thành màu vàng
        firebaseApp.database().ref('Users').child(uid).once('value', snapuser => {
            var likes = []
            if (snapuser.val().sliderslike !== undefined) {
                //đã có

                likes = snapuser.val().sliderslike

                likes.push(id)
            }else{
                //chưa có biến này
                likes.push(id)
            }

            firebaseApp.database().ref('Users').child(uid).update({
                sliderslike: likes
            })

            ToastAndroid.show('Đã thêm vào yêu thích', ToastAndroid.SHORT)
        })

        firebaseApp.database().ref('Sliders').child(id).update({
            countLike: countLike + 1
        })
    }else{
        //người dùng đã like, giờ muốn bỏ đi
        firebaseApp.database().ref('Users').child(uid).once('value', snapuser => {

            var likes = [] 
            likes = snapuser.val().sliderslike

            var index = likes.indexOf(id)

            likes.splice(index, 1)
           
            firebaseApp.database().ref('Users').child(uid).update({
                sliderslike: likes
            })

            ToastAndroid.show('Đã xóa khỏi yêu thích')
        })

        firebaseApp.database().ref('Calculators').child(id).update({
            countLike: countLike - 1
        })
    }			

}

const onShare = async (id, countShare) => {

	firebaseApp.database().ref('Sliders').child(''+id).update({
		countShare: countShare + 1
	})

    const result = await Share.share({
      	title: 'Thư viện y học miễn phí - Ebook, bài giảng, video khóa học',
        message: `Thư viện y học miễn phí - Ebook, bài giảng, video khóa học \n\n Tải không giới hạn, không yêu cầu đăng ký thành viên, hoàn toàn miễn phí, cập nhật liên tục`,
        url: 'https://play.google.com/store/apps/details?id=com.bsdaoquang.thuvienyhoc',
    });
}

const Tab = createMaterialTopTabNavigator();

export default function SlidersScreen({navigation}){
	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	title: 'Bài giảng',
	    	headerRight: () => (
		      	<View style={{flexDirection: 'row', justifyContents: 'center', alignItems: 'center'}}>
		      		<TouchableOpacity style={{paddingHorizontal: 10}} onPress={() => navigation.navigate('SearchSlider')}>
			        	<AntDesign name="search1" size={24} color="#34495e" />
		        	</TouchableOpacity>
		      	</View>
	        
	      	),
	    });
  	}, [navigation]);
	return (
		<Tab.Navigator>
			<Tab.Screen name="Mới nhất" component={NewSlider} />
      		<Tab.Screen name="Đã xem" component={Viewed} />
      		<Tab.Screen name="Chuyên mục" component={Categories} />
    	</Tab.Navigator>
	);
}