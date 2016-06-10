/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
    TabBarIOS,
    NavigatorIOS,
    Image,
    TextInput,
    StatusBar,
    ScrollView,
    TouchableHighlight,
    ActivityIndicatorIOS,
    AlertIOS,
    AsyncStorage,
} from 'react-native';
var AdSupportIOS=require("AdSupportIOS");
var Home=require("./views/home");
//var About=require("./views/about");
//var Manager=require("./views/manager");
//var Message=require("./views/message");
var Util=require("./views/util");
var Service=require("./views/service");

StatusBar.setBarStyle("light-content");
var Addressbook=React.createClass({
    statics:{
        title:'主页',
        description:'选项卡',
    },
    getInitialState:function () {
        return{
            selectedTab:'home',
            showIndex:{
                height:0,
                opacity:0,
            },
            showLogin:{
                flex:1,
                opacity:1,
            },
            isloadingShow:false,
        }
    },
    componentDidMount:function () {
        var that=this;
        AsyncStorage.getItem('token',function (err,token) {
            if(!err&&token){
                var path=Service.host+Service.loginByToken;
                Util.post(path,{
                    token:token
                },function (data) {
                    if(data.status){
                        that.setState({
                            showLogin:{
                                flex:0,
                                height:0,
                                width:0
                            },
                            showIndex:{
                                flex:1,
                                opacity:1
                            },
                            isloadingShow:false
                        })
                    }else{
                        that.setState({
                            showIndex:{
                                height:0,
                                opacity:0
                            },
                            showLogin:{
                                flex:1,
                                opacity:1
                            },
                            isloadingShow:false
                        })
                    }
                });
                var path=Service.host+Service.getMessage;
                Util.post(path,{key:Util.key},function (data) {
                    that.setState({
                        data:data
                    })
                })
            }
        })
    },
    _selectTab:function (tabName) {
        this.setState({
            selectedTab:tabName
        })
    },
    _addNavigator:function (component,title) {
        var data=null;
        if(title==='公告'){
            data=this.state.data;
        }
        return <NavigatorIOS
            style={{flex:1}}
            barTintColor="#007AFF"
            titleTextColor="#fff"
            tintColor="#fff"
            translucent={false}
            initialRoute={{component:component,
            title:title,
            passProps:{
            data:data,
            }
            }}
        />
    },
    _login:function () {
        var email=this.state.email;
        var password=this.state.password;
        var path=Service.host+Service.login;
        var that=this;
        that.setState({
            showLogin:{
                height:0,
                opacity:0,
                width:0
            },
            isloadingShow:true
        });
        AdSupportIOS.getAdvertisingTrackingEnabled(function () {
            AdSupportIOS.getAdvertisingId(function (deviceId) {

                Util.post(path,{
                    email:email,
                    password:password,
                    deviceId:deviceId
                },function (data) {alert(JSON.stringify(data));
                    if(data.status){
                        var user=data.data;
                        AsyncStorage.multiSet([
                            ['username',user.username],
                            ['token',user.token],
                            ['userid',user.userid],
                            ['email',user.email],
                            ['tel',user.tel],
                            ['partment',user.partment],
                            ['tag',user.tag]
                        ],function (err) {
                            if(!err){
                                that.setState({
                                    showLogin:{
                                        height:0,
                                        width:0,
                                        opacity:0
                                    },
                                    showIndex:{
                                        flex:1,
                                        opacity:1
                                    },
                                    isloadingShow:false
                                })
                            }else{
                                AlertIOS.alert('登录','未知错误');
                            }
                        })
                    }else{
                        AlertIOS.alert('登录','用户名或密码错误');
                        that.setState({
                            showLogin:{
                                flex:1,
                                opacity:1
                            },
                            showIndex:{
                                height:0,
                                width:0,
                                opacity:0
                            },
                            isloadingShow:false
                        })
                    }
                })
            },function () {
                AlertIOS.alert('设置','无法获取设备唯一标识');
            })
        },function () {
            AlertIOS.alert('设置','无法设置设备唯一标识，请关闭设置－>隐私->广告->限制广告跟踪');
        })
    },
    _getEmail:function (val) {
        var email=val;
        this.setState({
            email:email,
        })
    },
    _getPassword:function (val) {
        var password=val;
        this.setState({
            password:password
        })
    },
    render:function () {
        return (
            <View style={{flex:1}}>
                {this.state.isloadingShow?
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        <ActivityIndicatorIOS size="small" color="#268dff"></ActivityIndicatorIOS>
                    </View>:null
                }
                {!this.state.isloadingShow?
                    <View style={this.state.showIndex}>
                        <TabBarIOS barTintColor="#fff">
                            <TabBarIOS.Item
                                icon={require('./image/phone_s.png')}
                                title="首页"
                                selected={this.state.selectedTab==='home'}
                                onPress={this._selectTab.bind(this,'home')}
                            >
                                {this._addNavigator(Home,'主页')}
                            </TabBarIOS.Item>
                            <TabBarIOS.Item
                                icon={require('./image/gonggao.png')}
                                title="公告"
                                selected={this.state.selectedTab==='message'}
                                onPress={this._selectTab.bind(this,'message')}
                            ></TabBarIOS.Item>
                            <TabBarIOS.Item
                                icon={require('./image/manager.png')}
                                title="管理"
                                selected={this.state.selectedTab==='manager'}
                                onPress={this._selectTab.bind(this,'manager')}
                            ></TabBarIOS.Item>
                            <TabBarIOS.Item
                                icon={require('./image/about.png')}
                                title="关于"
                                selected={this.state.selectedTab==='about'}
                                onPress={this._selectTab.bind(this,'about')}
                            ></TabBarIOS.Item>
                        </TabBarIOS>
                    </View>:null
                }
                <ScrollView style={[this.state.showLogin]}>
                    <View style={styles.container}>
                            <View>
                                <Image style={styles.logo} source={require("./image/logo.png")}></Image>
                            </View>
                        <View style={styles.inputRow}>
                            <Text>邮箱</Text><TextInput style={styles.input} onChangeText={this._getEmail} placeholder="请输入邮箱"/>
                        </View>
                        <View style={styles.inputRow}>
                            <Text>密码</Text><TextInput style={styles.input} onChangeText={this._getPassword} password={true} placeholder="请输入密码"/>
                        </View>
                        <View><TouchableHighlight underlayColor="#fff" onPress={this._login} style={styles.btn}><Text style={{color:"#fff"}}>登录</Text></TouchableHighlight></View>
                    </View>
                </ScrollView>
            </View>
        );
    }
})


const styles = StyleSheet.create({
  container: {

    marginTop: 50,
    alignItems: 'center',

  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: Image.resizeMode.contain,
  },
    inputRow:{
      marginTop:10,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
    },
  input:{
      marginLeft:10,
      borderWidth:Util.pixel,
      borderColor:"#ccc",
      width:200,
      height:35,
      borderRadius:5,
      paddingLeft:8
  },
    btn:{
        marginTop:10,
        backgroundColor:"#3BC1FF",
        width:80,
        height:35,
        justifyContent:"center",
        alignItems:"center",
        borderRadius:5
    }
});

AppRegistry.registerComponent('Addressbook', () => Addressbook);
