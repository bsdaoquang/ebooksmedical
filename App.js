import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View , TouchableOpacity, Image, ImageBackground, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator  } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons'
import { firebaseApp } from './firebaseConfig'
import * as Localization from 'expo-localization'

import HomeScreen from './screens/home'
import SlidersScreen from './screens/sliders'
import VideosScreen from './screens/videos'
import UploadScreen from './screens/upload'
import ShopScreen from './screens/shop'

import BookSingle from './screens/books/bookSingle'
import CategoryScreen from './screens/books/category'
import BookByKey from './screens/books/bookbykey'
import ChuyenMuc from './screens/chuyen-muc'

//import SliderSinger from './screens/sliders/sliderSinger'
//import SearchSlider from './screens/sliders/searchslider'

import DrawerCustom from './screens/drawerCustom.js'

// phần quản lý thành viên
import LoginScreen from './screens/users/login'
import SigninScreen from './screens/users/signin'
import ProfileScreen from './screens/users/userScreen'

//phần tìm kiếm
import SearchScreen from './screens/search'

//thông tin
import AboutScreen from './screens/about'
import DonateScreen from './screens/about'
import MoreAppScreen from './screens/more-app'
import PaymentsScreen from './screens/users/payments'
import MyAlerts from './screens/my-alerts'
import MyBooksScreen from './screens/books/my-books'

//import NotificationScreen from './screens/notification'


//console.disableYellowBox = true;

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator()

const StackEbooks = createStackNavigator();
function EbookStackScreen(){
    return(
        <StackEbooks.Navigator>
          <StackEbooks.Screen name="Trang chủ" component={HomeScreen}  options={{headerShown: false}}/>
          <StackEbooks.Screen name="BookSingle" component={BookSingle} />
          <StackEbooks.Screen name="Chuyên mục sách" component={CategoryScreen}/>
          <StackEbooks.Screen name="Chuyên Mục" component={ChuyenMuc}/>
          <StackEbooks.Screen name="BookByKey" component={BookByKey}/>
          <StackEbooks.Screen name="Tìm kiếm" component={SearchScreen}/>
          <StackEbooks.Screen name="Thông tin" component={AboutScreen}/>
          <StackEbooks.Screen name="Ủng hộ" component={DonateScreen}/>
          <StackEbooks.Screen name="ProfileScreen" component={ProfileScreen}/>
          <StackEbooks.Screen name="Đăng nhập" component={LoginScreen}/>
          <StackEbooks.Screen name="Đăng ký" component={SigninScreen}/>
          <StackEbooks.Screen name="Ứng dụng khác" component={MoreAppScreen}/>
          <StackEbooks.Screen name="Nhận điểm" component={PaymentsScreen}/>
          <StackEbooks.Screen name="Thông báo" component={MyAlerts}/>
          <StackEbooks.Screen name="Sách tải lên" component={MyBooksScreen}/>
        </StackEbooks.Navigator>
    )
}

function TabNavigator({navigation}) {
  return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Ebooks') {
                  iconName = focused ? 'book-open': 'book-medical';
                }else if (route.name === 'Upload') {
                  iconName = focused ? 'upload' : 'upload';
                }else if (route.name === 'SlidersScreen') {
                  iconName = focused ? 'file-powerpoint' : 'file-powerpoint';
                }else if (route.name === 'Video') {
                  iconName = focused ? 'photo-video' : 'photo-video';
                }else if (route.name === 'Shop') {
                  iconName = focused ? 'shopping-cart' : 'shopping-cart';
                }
                return <FontAwesome5 name={iconName} size={20} color={color}/>;
              },
            })}
            tabBarOptions={{
              activeTintColor: 'red',
              inactiveTintColor: 'gray',
              showLabel: false,
              style:{
                backgroundColor: 'white',
              }
            }}
            >
            <Tab.Screen name='Ebooks' component={EbookStackScreen}/>
            <Tab.Screen name='SlidersScreen' component={SlidersScreen}/>
            <Tab.Screen name='Video' component={VideosScreen}/>
            <Tab.Screen name='Upload' component={UploadScreen}/>
            <Tab.Screen name='Shop' component={ShopScreen}/>
        </Tab.Navigator>
  );
}

export default function App(){
  return(
     <NavigationContainer>
        <Drawer.Navigator drawerContent = {(props) => <DrawerCustom {...props} />}>
          <Drawer.Screen name='HomeScreen' component={TabNavigator}/>
        </Drawer.Navigator>
      </NavigationContainer>
    )
    
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imaLogo:{
    width: 150,
    height: 150,
    marginBottom: 10
  },
  titleWellcome:{
    fontSize: 18,
    color: 'white',
  },
  imageBackground:{
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  wellcomeContent:{
    backgroundColor: '#000000a0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  }
});
