import React, {useEffect, useState} from 'react'
import { 
	Text, View, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView, Alert, TextInput, ToastAndroid, StatusBar
} from 'react-native'

import { AntDesign, Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import {firebaseApp} from '../../firebaseConfig'

import {styles} from '../../styles'

export default function SearchSlider({navigation}){
	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	headerTitle: () => (
		      	<View style={{flexDirection: 'row', justifyContents: 'center', alignItems: 'center', backgroundColor: '#e0e0e0', borderRadius: 5}}>
		      		<AntDesign name="search1" size={20} color="#34495e" />
		      		<TextInput
		      			style={{flex: 1, padding: 5}}
		      			placeholder = 'Tìm trong bài giảng'
		      			autoCapitalize = 'none'
		      			onChangeText = {key => goSearch(key)}
		      		/>
		      	</View>
	      	),
	    });
  	}, [navigation]);
	//vùng hiển thị sách
	const [keysearch, setKeysearch] = useState('')
	
	function goSearch(key){
		//cài đặt nút tìm kiếm để đổi màn hình
		setKeysearch(key)
		//Chạy hàm tìm kiếm
	}

	function removeAccents(str) {
  		return str.normalize('NFD')
    	.replace(/[\u0300-\u036f]/g, '')
    	.replace(/đ/g, 'd').replace(/Đ/g, 'D');
	}

	var keysq = removeAccents(keysearch).toLowerCase().replace(/ /g, "-")

	function SearchResult(){

		const [loadResult, setLoadResult] = useState(false)

		setTimeout(() => {
			setLoadResult(true)
		}, 1000)

		//bắt đầu tìm kiếm
		var slugBook = []

		//lấy về các slug book
		firebaseApp.database().ref('Sliders').on('value', snap => {
			snap.forEach(item => {
				if (item.val().slug.includes(keysq)) {
					var slugs = {}
					slugs = item.val()
					slugs.key = item.key

					slugBook.push(slugs)
				}
			})
		})

		return(
			<View style={styles.container}>
  			<StatusBar style='auto' />
  			<FlatList
	  			data={slugBook} 
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

	return(
		<View style={styles.container}>
			<SearchResult />
		</View>
	)
}


