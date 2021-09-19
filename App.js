import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View , TouchableOpacity, Image, ImageBackground, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator  } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { firebaseApp } from './firebaseConfig'
import * as Localization from 'expo-localization'

import HomeScreen from './screens/home'
import SlidersScreen from './screens/sliders'
import VideosScreen from './screens/videos'

import BookSingle from './screens/books/bookSingle'
import CategoryScreen from './screens/books/category'
import BookByKey from './screens/books/bookbykey'

import SliderSinger from './screens/sliders/sliderSinger'
import SearchSlider from './screens/sliders/searchslider'

import DrawerCustom from './screens/drawerCustom.js'

// phần quản lý thành viên
import LoginScreen from './screens/users/login'
import SigninScreen from './screens/users/signin'
import UserScreen from './screens/users/thanhvien'

//phần tìm kiếm
import SearchScreen from './screens/search'

//thông tin
import AboutScreen from './screens/about'
import DonateScreen from './screens/about'

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator()

const StackEbooks = createStackNavigator();
function EbookStackScreen(){
    return(
        <StackEbooks.Navigator>
            <StackEbooks.Screen name="Trang chủ" component={HomeScreen}/>
            <StackEbooks.Screen name="BookSingle" component={BookSingle}/>
            <StackEbooks.Screen name="Chuyên mục sách" component={CategoryScreen}/>
            <StackEbooks.Screen name="BookByKey" component={BookByKey}/>
            <StackEbooks.Screen name="Tìm kiếm" component={SearchScreen}/>
            <StackEbooks.Screen name="Thông tin" component={AboutScreen}/>
            <StackEbooks.Screen name="Ủng hộ" component={DonateScreen}/>
        </StackEbooks.Navigator>
    )
}

const StackSliders = createStackNavigator();
function SliderStackScreen(){
    return(
        <StackSliders.Navigator>
            <StackSliders.Screen name='Bài giảng' component={SlidersScreen} />
            <StackSliders.Screen name='SliderSinger' component={SliderSinger}/>
            <StackSliders.Screen name='SearchSlider' component={SearchSlider}/>
        </StackSliders.Navigator>
    )
}

const StackVideos = createStackNavigator();
function VideoStackScreen(){
    return(
        <StackVideos.Navigator>
            <StackVideos.Screen name="Khóa học" component={VideosScreen} />
        </StackVideos.Navigator>
    )
}

const StackUsers = createStackNavigator();
function UserStackScreen() {
  return (
      <StackUsers.Navigator>
        <StackUsers.Screen name="Tài khoản" component={UserScreen}/>
        <StackUsers.Screen name="Đăng nhập" component={LoginScreen}/>
        <StackUsers.Screen name="Đăng ký" component={SigninScreen}/>
      </StackUsers.Navigator>

  );
}

function TabNavigator({navigation}) {
  return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Ebooks') {
                  iconName = focused ? 'file-pdf': 'file-pdf-outline';
                }else if (route.name === 'Bài giảng') {
                  iconName = focused ? 'file-powerpoint' : 'file-powerpoint-outline';
                }else if (route.name === 'Khóa học') {
                  iconName = focused ? 'file-video' : 'file-video-outline';
                }else if (route.name === 'Tài khoản') {
                  iconName = focused ? 'card-account-details' : 'card-account-details-outline';
                }
                return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: '#34495e',
              inactiveTintColor: 'gray',
            }}
          >
          <Tab.Screen name='Ebooks' component={EbookStackScreen}/>
          <Tab.Screen name='Bài giảng' component={SliderStackScreen}/>
          <Tab.Screen name='Khóa học' component={VideoStackScreen}/>
          <Tab.Screen name='Tài khoản' component={UserStackScreen}/>
        </Tab.Navigator>
  );
}

export default function App(){
  return(
     <NavigationContainer>
        <Drawer.Navigator drawerContent = {(props) => <DrawerCustom {...props} />}>
          <Drawer.Screen name='Ebooks' component={TabNavigator}/>
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
