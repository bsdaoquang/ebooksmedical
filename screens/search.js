import React, {useState} from 'react'
import { 
	Text, View, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView, Alert, TextInput, ToastAndroid
} from 'react-native'
import { AntDesign, Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import {firebaseApp} from '../firebaseConfig'
import i18n from '../i18n'
import * as Linking from 'expo-linking'

export default function SearchScreen({navigation}){
	React.useLayoutEffect(() => {
	    navigation.setOptions({
	    	headerTitle: () => (
		      	<View style={{flexDirection: 'row',paddingHorizontal: 10, justifyContents: 'center', alignItems: 'center', backgroundColor: '#ecf0f1', borderRadius: 20}}>
		      		<AntDesign name="search1" size={20} color="#34495e" />
		      		<TextInput
		      			style={{flex: 1, padding: 5}}
		      			placeholder = {i18n.t('timkiemgi')}
		      			autoCapitalize = 'none'
		      			onChangeText = {key => goSearch(key)}
		      		/>
		      	</View>
	      	),
	      	headerStyle:{
    			backgroundColor: '#fafafa',
    			shadowColor: 'transparent',
		        shadowRadius: 0,
		        shadowOffset: {
		            height: 0,
		        },
		        elevation:0
    		}
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
		firebaseApp.database().ref('Ebooks').on('value', snap => {
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
			<View style={{flex: 1, backgroundColor: '#fafafa'}}>

				{
					slugBook.length == 0 ?

					<View style={{...styles.container, padding: 20, alignItems: 'center'}}>
						<Text>{i18n.t('khongtimthay')}</Text>
						<TouchableOpacity 
							onPress={() => Linking.openURL('https://m.me/yhocso')}
							style={{
								backgroundColor: '#1abc9c',
								padding: 8,
								width: '50%',
								marginTop: 20,
								borderRadius: 20,
								justifyContent: 'center',
								alignItems: 'center'
							}}>
							<Text style={{color: 'white'}}>{i18n.t('yeucausach')}</Text>
						</TouchableOpacity>
					</View>

					:

					<FlatList style={styles.containerBook}
			  			data={slugBook} 
			  			renderItem={({ item }) => (
				            <View style={{...styles.bookContain, marginVertical: 8}}>
				                <TouchableOpacity
				                	style={{flexDirection: 'row'}}
				                   	onPress = {() => navigation.navigate('BookSingle', {bookId: item.key, title:item.title})}>
					            	<Image style={{width: 75, height: 95, marginRight: 8, borderRadius: 3}} source={{uri: item.image}}/>
					            	<View style={{flex: 1}}>
					            		<Text style={{fontWeight: 'bold', width: '100%'}}>{item.title}</Text>
					              		<Text>{item.author}</Text>
					            	</View>
				                </TouchableOpacity>
				            </View>
				        )}
			  	 		keyExtractor={item => item.key}
		  	 		/>
				}

			</View>
		)
	}

	function TopSearch(){
		var keyTop = []
		firebaseApp.database().ref('searchKey').orderByChild('count').limitToLast(20).on('value', snap => {
			snap.forEach(item => {
				var keys = {}

				keys = item.val()
				keys.key = item.key

				keyTop.unshift(keys)
			})
		})

		const [load, setLoad] = useState(false)
		setTimeout(() => {
			setLoad(true)
		}, 1000)

		return(
			<View style={{flex: 1, padding: 20, backgroundColor: '#fafafa'}}>
				<Text style={{fontStyle: 'italic'}}>{i18n.t('timkiem')}</Text>
				<FlatList 
					style = {{flex: 1, marginTop: 20}}
					data={keyTop} 
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => goSearch(item.keyword)}
							style={{paddingVertical: 15, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e0e0e0'}}>
							<AntDesign name="search1" size={20} color="#34495e" />
							<Text style={{flex: 1, paddingHorizontal: 20}}>{item.keyword} <Text style={{fontStyle: 'italic', color: '#3498db'}}>{item.count}</Text></Text>
							<FontAwesome name="angle-right" size={24} color="#34495e" />
						</TouchableOpacity>
					)}
		  			//inverted={true}
		  			keyExtractor={item => item.key}
		  		/>
			</View>
		)
	}

	return(
		<View style={styles.container}>
			{
				keysearch === '' ?
				<TopSearch />
				:
				<SearchResult />
			}
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
	},

	catList:{
		paddingVertical: 15,
		marginHorizontal: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
		flexDirection: 'row'
	},
})