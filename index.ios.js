/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    AlertIOS,
    TabBarIOS,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicatorIOS,
    AsyncStorage,
    NavigatorIOS,
} from 'react-native';

var Util=require("./views/util");
var Service=require("./views/service");
var AdSupportIOS=require("AdSupportIOS");
var Home=require("./views/home");


var  Addressbook = React.createClass({
    tatics:{
        title:'主页',
        description:'选项卡',
    },
    getInitialState:function () {
        return{
            selectedTab:'home',
            showIndex:{
                flex:1,
                opacity:1
            },
            showLogin:{
                height:0,
                opacity:0,
                flex:0
            },
            isloadingShow:false
        }
    },
    _login:function () {
        var email=this.state.email;
        var password=this.state.password;
        var path=Service.host+Service.login;
        var that=this;
        if(!email||!password){
            AlertIOS.alert('登录',"邮箱或密码必需填写");
        }else{
            that.setState({
                showLogin:{
                    opacity:0,
                    height:0,
                    flex:0
                },
                isloadingShow:true,
            })

            AdSupportIOS.getAdvertisingTrackingEnabled(function () {
                AdSupportIOS.getAdvertisingId(function (deviceID) {
                    //alert(email);
                    Util.post(path,{
                        email:email,
                        password:password,
                        deviceId:deviceID,
                    },function (data) {
                        if(data.status){
                            var user=data.data;
                            AsyncStorage.multiSet([
                                ['username',user.username],
                                ['token',user.token],
                                ['userid',user.userid],
                                ['email',user.email],
                                ['tel',user.tel],
                                ['partment',user.partment],
                                ['tag',user.tag],
                            ],function (err) {
                                if(!err){
                                    that.setState({
                                        showLogin:{
                                            flex:0,
                                            height:0,
                                            opacity:0,
                                            width:0
                                        },
                                        showIndex:{
                                            flex:1,
                                            opacity:1
                                        },
                                        isloadingShow:false,
                                    })
                                }
                            })
                        }else{
                            AlertIOS.alert('登录',"用户名密码错误");
                            that.setState({
                                showIndex:{
                                    opacity:0,
                                    height:0,
                                    flex:0,

                                },
                                showLogin:{
                                    opacity:1,
                                    flex:1
                                },
                                isloadingShow:false
                            })
                        }
                    })
                },function () {
                    AlertIOS.alert('设置',"无法获取设备唯一标识");
                })
            },function () {
                AlertIOS.alert('设置',"无法获取设备唯一标识，请关闭设置－>隐私->广告->限制广告跟踪");
            })
        }
    },
    _getEmail:function (val) {
        var email=val;
        this.setState({
            email:email,
        })
    },
    _addNavigator:function(component,title){
        var data=null;
        if(title=='公告'){
            data=this.state.data;
        }
        return  <NavigatorIOS
            style={{flex:1}}
            barTintColor="#007aff"
            titleTextColor="#fff"
            translucent={false}
            initialRoute={{
                component:component,
                title:title,
                passProps:{
                    data:data
                }
            }}
        ></NavigatorIOS>
    },
    _getPassword:function (val) {
        var password=val;
        this.setState({
            password:password,
        })
    },
    _selectTab:function (tabName) {
        this.setState({
            selectedTab:tabName,
        })

    },
    render:function () {
        //alert(this.state.selectedTab === "gonggao");
        return (
            <View style={styles.container}>
                {this.state.isloadingShow?<View style={{flex:1,justifyContent:"center",alignItems:"center"}} >
                    <ActivityIndicatorIOS size="small"></ActivityIndicatorIOS>
                </View>:null}
                {!this.state.isloadingShow?
                <View style={this.state.showIndex}>
                    <TabBarIOS barTintColor="#fff"

                    >
                        <TabBarIOS.Item
                            title="首页"
                            icon={require("./image/phone_s.png")}
                            onPress={this._selectTab.bind(this,'home')}
                            selected={this.state.selectedTab === "home"}
                        >{this._addNavigator(Home,'首页')}</TabBarIOS.Item>
                        <TabBarIOS.Item
                            title="公告"
                            icon={require("./image/gonggao.png")}
                            selected={this.state.selectedTab==='gonggao'}
                            onPress={this._selectTab.bind(this,'gonggao')}
                        ><View><Text>2222</Text></View></TabBarIOS.Item>
                        <TabBarIOS.Item
                            title="管理"
                            icon={require("./image/manager.png")}
                            selected={this.state.selectedTab==='manager'}
                            onPress={this._selectTab.bind(this,'manager')}
                        ><View><Text>3333</Text></View></TabBarIOS.Item>
                        <TabBarIOS.Item
                            title="关于"
                            icon={require("./image/about.png")}
                            selected={this.state.selectedTab==='about'}
                            onPress={this._selectTab.bind(this,'about')}
                        ><View><Text>4444</Text></View></TabBarIOS.Item>
                    </TabBarIOS>
                </View>

                    :null}
                <ScrollView style={this.state.showLogin}>
                    <View style={styles.logo_con}>
                        <View>
                            <Image style={styles.logo} source={require('./image/logo.png')}></Image>
                        </View>
                        <View style={styles.inputRow}>
                            <Text>邮箱：</Text><TextInput placeholder="请输入邮箱" onChangeText={this._getEmail} style={styles.input} autoCapitalize="none"></TextInput>
                        </View>
                        <View style={styles.inputRow}>
                            <Text>密码：</Text><TextInput placeholder="请输入密码" onChangeText={this._getPassword} style={styles.input} autoCapitalize="none" password={true}></TextInput>
                        </View>
                        <View><TouchableOpacity style={styles.btn} onPress={this._login}><Text style={{color:"green"}}>登录</Text></TouchableOpacity></View>
                    </View>
                </ScrollView>
            </View>
        );
    }
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logo_con:{
        marginTop:50,
        alignItems:"center",

    },
    logo:{
        width:50,
        height:30,
        resizeMode:Image.resizeMode.contain
    },
    inputRow:{
        flexDirection:"row",
        height:30,
        marginTop:10,
        justifyContent:"center",
        alignItems:"center"
    },
    input:{
        borderWidth:1,
        width:200,
        height:28,
        borderRadius:5,
        paddingLeft:5,
    },
    btn:{
        borderWidth:1,
        width:50,
        height:28,
        borderRadius:5,
        justifyContent:"center",
        alignItems:"center",
        marginTop:10,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('Addressbook', () => Addressbook);
