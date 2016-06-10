/**
 * Created by zhouhong on 16/5/11.
 */
import React, { Component } from 'react';
var Util=require("./util");
var ItemBlock=require("./home/itemblock");

import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';

var Home=React.createClass({
    getInitialState:function(){
        var width=Math.floor(((Util.size.width-20)-50)/4);
        var items=[
            {
                title:'研发',
                partment:'框架研发',
                color:'#126AFF',
            },
            {
                title:'研发',
                partment:'BU研发',
                color:'#ffd600'
            },
            {
                title:'产品',
                partment:'公共产品',
                color:'#ffd690'
            },
            {
                title:'产品',
                partment:'BU产品',
                color:'#f80728',
            },
            {
                title:'产品',
                partment:'启明星',
                color:'#ff4eb9'
            },
            {
                title:'项目',
                partment:'项目管理',
                color:'#ee810d'
            }
        ];
        return{
            items:items,
            width:width,
        }  
    },
    render:function () {
        var items=this.state.items;
        var item1=[];
        var item2=[];
        for(var i=0 ;i<4 ;i++){
            item1.push(<ItemBlock 
                title={items[i].title}
                partment={items[i].partment}
                color={items[i].color}
                width={this.state.width}
                nav={this.props.navigator}
            />)
        }
        for(var i=4 ;i<items.length ;i++){
            item2.push(<ItemBlock 
                title={items[i].title}
                partment={items[i].partment}
                color={items[i].color}
                width={this.state.width}
                nav={this.props.navigator}
            />)
        }
        return(
            <ScrollView style={styles.container}>
                <View style={styles.listRow}>{item1}</View>
                <View style={styles.listRow}>{item2}</View>
                
            </ScrollView>
        )
    }
})

var styles=StyleSheet.create({
    container:{
        flex:1,
        padding:10
    },
    listRow:{
        flexDirection:"row",
        marginBottom:20
    }
})


module.exports=Home;