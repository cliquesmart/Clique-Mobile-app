import React, { Component } from 'react';
import { View, Text, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, Image, FlatList, Alert, PermissionsAndroid, ScrollView } from 'react-native';

//Constants
import { CommonColors } from '../Constants/ColorConstant';
import { IMG } from '../Constants/ImageConstant';
import { ConstantKeys } from '../Constants/ConstantKey'
import { SetFontSize } from '../Constants/FontSize'
import LoadingView from '../Constants/LoadingView'
import Webservice from '../Constants/API'
import { APIURL } from '../Constants/APIURL'
import ValidationMsg from '../Constants/ValidationMsg'

//Third Party
import { DrawerActions } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image'
import { CommonActions } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { Neomorph, Shadow, NeomorphFlex } from 'react-native-neomorph-shadows';
import LinearGradient from 'react-native-linear-gradient';


export default class QrCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading: false,
            upiId: props.route.params.upiId,
        };
    }


    //Action Methods
    btnBackTap = () => {
        requestAnimationFrame(() => {
            this.props.navigation.goBack()
        })
    }

    render() {
        let BackIcon = IMG.OtherFlow.BackIcon

        return (
            <>
                <SafeAreaView style={{ flex: 0, backgroundColor: CommonColors.appBarColor }} />

                <StatusBar barStyle={'light-content'}
                    backgroundColor={CommonColors.appBarColor}
                />
                <SafeAreaView style={styles.container}>

                    <View style={{ flex: 1, backgroundColor: CommonColors.primaryColor }}>

                        <View style={styles.headerView}>

                        <TouchableOpacity style={{ marginLeft: 15,alignItems: 'center', justifyContent: 'center', height: 40, width: 40,}}
                                onPress={() => this.btnBackTap()}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor : CommonColors.whiteColor }}
                                    source={BackIcon} />
                            </TouchableOpacity>

                            <Text style={styles.headerText}>QR Code</Text>

                            <TouchableOpacity style={{ marginLeft: 15, alignItems: 'center', justifyContent: 'center', height: 40, width: 40,}}>
                            </TouchableOpacity>
                        </View>


                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <QRCode
                                //QR code value
                                value={this.state.upiId}
                                //size of QR Code
                                size={250}
                                //Color of the QR Code (Optional)
                                color={CommonColors.blackColor}
                                //Background Color of the QR Code (Optional)
                                backgroundColor={CommonColors.whiteColor}
                            //Center Logo size  (Optional)
                            />
                        </View>

                    </View>
                </SafeAreaView>
            </>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CommonColors.primaryColor
    },
    viewClique: {
        backgroundColor: CommonColors.PurpleColor, flexDirection: 'row'
    },
    headerView: {
        height: 74, width: '100%', backgroundColor: CommonColors.appBarColor,
        alignItems: 'center', flexDirection: 'row',
    },
    headerText: {
        fontFamily: ConstantKeys.Averta_BOLD, fontSize: SetFontSize.ts16,
        color: CommonColors.whiteColor, flex: 1, textAlign: 'center'
    },

})