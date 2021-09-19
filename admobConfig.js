import React from 'react'
import {View} from 'react-native'

import {
  AdMobBanner,
  AdMobInterstitial,
} from 'expo-ads-admob';


export default function AdMob(){
	return(
		<View>
			<AdMobBanner
			  	bannerSize="banner"
			  	//adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
			  	adUnitID="ca-app-pub-6209888091137615/2956962875" // True
		  		serverPersonallizedAds = {true}
        	onDidFailToReceiveAdwithError = {(e) => bannerError(e)}
			/>

		</View>
	);
}

export const showAdInter = async() => {
	//await AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712');//Quảng cáo thử nghiệm
	await AdMobInterstitial.setAdUnitID('ca-app-pub-6209888091137615/7113312880');//Ads True
	await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
	await AdMobInterstitial.showAdAsync();
}