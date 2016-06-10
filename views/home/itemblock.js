import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native';

var Util=require("../util");
var Service=require("../service");
var Address=require("./address");

var ItemBlock = React.createClass({

    render:function () {
        var size={
            width:parseInt(this.props.width),
            height:parseInt(this.props.width),
            backgroundColor:this.props.color,
        }

        return(
            <TouchableHighlight underlayColor="#fff" onPress={this._loadPage}>
                <View style={[styles.itemblock,size]}>
                    <View><Text style={styles.font_18}>{this.props.title}</Text></View>
                    <View><Text style={styles.font_18}>{this.props.partment}</Text></View>
                </View>
            </TouchableHighlight>
        )
    },
    _loadPage:function(e){
        var nav=this.props.nav;
        var key=Util.key;
        var partment=this.props.partment;
        var path=Service.host+Service.getUser;
        Util.post(path,{
          key:key,
          partment:partment,
        },function(data){
            nav.push({
                title:this.props.title,
                component:Address,
                passProps:{
                  data:data,
                }
            })
        }.bind(this));
    }
})

var styles=StyleSheet.create({
    itemblock:{
        justifyContent:"center",
        marginLeft:10,
        borderRadius:5,
        alignItems:"center",
    },
    font_18:{
        fontSize:10,
    }
})

module.exports=ItemBlock;
