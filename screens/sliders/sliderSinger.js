import React from 'react'
import {View, Text, ToastAndroid} from 'react-native'
import {firebaseApp} from '../../firebaseConfig'
import {showAdInter} from '../../admobConfig'
import {AdMobInterstitial} from 'expo-ads-admob';

export default function SliderSinger({navigation, route}){

	showAdInter()

	const {key, uid} = route.params;

	//thêm vào đã xem cho người dùng
	if (uid) {
		var slidersviewed = []
		firebaseApp.database().ref('Users').child(uid).once('value', snap => {
			if (snap.val().slidersviewed !== undefined) {
				if (snap.val().slidersviewed.includes(key)) {
					//Nếu đã có thì bỏ qua, không push thêm vào
				}else{
					slidersviewed = snap.val().slidersviewed
					slidersviewed.push(key)

					firebaseApp.database().ref('Users').child(uid).update({
						slidersviewed: slidersviewed
					})
				}
			}else{
				//nếu chưa tồn tại
				slidersviewed.push(key)
				firebaseApp.database().ref('Users').child(uid).update({
					slidersviewed: slidersviewed
				})
			}
		})
	}

	var link = ''
	var title = ''

	firebaseApp.database().ref('Sliders').child(key).once('value', snap => {
		title = snap.val().title
		link = snap.val().downloadlink

		firebaseApp.database().ref('Sliders').child(key).update({
			countView: snap.val().countView + 1
		})
	})

	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	title: title,
	    });
	}, [navigation]);

	return(
		<WebView
	        source={{uri: link}}
      	/>
	)
}