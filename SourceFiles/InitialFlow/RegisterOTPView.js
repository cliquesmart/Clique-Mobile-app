import React, { Component } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, Keyboard, Alert, PermissionsAndroid, Dimensions } from 'react-native';

//Constant Files
import { CommonColors } from '../Constants/ColorConstant'
import { IMG } from '../Constants/ImageConstant'
import { SetFontSize } from '../Constants/FontSize'
import { ConstantKeys } from '../Constants/ConstantKey'
import ValidationMsg from '../Constants/ValidationMsg';
import LoadingView from '../Constants/LoadingView'
import Webservice from '../Constants/API'
import { APIURL } from '../Constants/APIURL'

//Third Party
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { EventRegister } from 'react-native-event-listeners'
import Geolocation from '@react-native-community/geolocation';
import { Neomorph, Shadow, NeomorphFlex } from 'react-native-neomorph-shadows';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';


export default class RegisterOTPView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            OTP: JSON.stringify(props.route.params.otp),
            isloading: false,
            longitude: 0.0,
            latitude: 0.0,
            RegisterData: JSON.parse(props.route.params.dict),

        };
    }

    componentDidMount() {
        console.log(" OTP is : " + this.state.OTP)
        // optcode = this.state.OTP
        this.requestLocationPermission()
    }

    requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            this.getOneTimeLocation();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    //To Check, If Permission is granted
                    this.getOneTimeLocation();
                } else {
                    console.log('Permission Denied');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    getOneTimeLocation = async () => {
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {

                latitude = String(position.coords.latitude)
                longitude = String(position.coords.longitude)

                this.setState({ longitude: position.coords.longitude, latitude: position.coords.latitude })

                console.log("Longitude : " + position.coords.longitude)
                console.log("Latitude : " + position.coords.latitude)

            },
            (error) => {
                console.log(error.message);
                this.getOneTimeLocation()
            },
            {
                enableHighAccuracy: false,
                timeout: 100000,
                maximumAge: 3600000
            },
        );
    };


    showAlert(text) {
        Snackbar.show({
            text: text,
            backgroundColor: CommonColors.errorColor,
            textColor: CommonColors.whiteColor,
            // fontFamily: ConstantKeys.Averta_BOLD,
            duration: Snackbar.LENGTH_LONG,
        });
    }


    // API REGISTER USER CALL
    API_REGISTER_OTP(isload) {

        this.setState({ isloading: isload })

        Webservice.post(APIURL.ragisterwithotp, {
            mobile: this.state.RegisterData.country_code + "-" + this.state.RegisterData.mobile_no,
            name: this.state.RegisterData.name,
            otp: this.state.OTP,
            current_lat: this.state.latitude,
            current_long: this.state.longitude
        })
            .then(response => {
                if (response.data == null) {
                    this.setState({ isloading: false });
                    // alert('error');
                    alert(response.originalError.message);
                    return
                }
                
                this.setState({ isloading: false });
                console.log('Get Register OTP Response : ' + JSON.stringify(response))

                if (response.data.status == true) {

                    var userData = response.data.data

                    this.setState({ ArrLoginData: userData })
                    this.storeData(JSON.stringify(userData))

                } else {
                    this.setState({ isloading: false })
                    this.showAlert(response.data.message)

                }
            })
            .catch((error) => {
                console.log(error.message)
                this.setState({ isloading: false, });
                Alert.alert(error.message, "", [
                    {
                        text: 'Try Again',
                        onPress: () => {
                            this.API_REGISTER_OTP(true)
                        }
                    },
                ],
                    { cancelable: false })
            })
    }


    //Helper Methods
    storeData = async (value) => {
        try {
            await AsyncStorage.setItem(ConstantKeys.USERDATA, value)

            this.props.navigation.navigate('RegisterEmail', { is_from_autoLogin: false })

        } catch (e) {
            // saving error
        }
    }


    //Action Methods
    btnBackTap = () => {
        requestAnimationFrame(() => {
            this.props.navigation.goBack()
        })
    }


    btnSignUpTap = () => {
        requestAnimationFrame(() => {

            Keyboard.dismiss()

            if (this.state.OTP.length == 4) {

                this.API_REGISTER_OTP(true)
                // this.props.navigation.navigate('RegisterEmail', { is_from_autoLogin: false })

            } else {
                this.showAlert("Please Enter Valid OTP")
            }

        })
    }


    render() {
        let BackIcon = IMG.OtherFlow.BackIcon
        let Background = IMG.OtherFlow.Background

        return (
            <>
                <SafeAreaView style={{ flex: 0, backgroundColor: CommonColors.primaryColor }} />

                <StatusBar barStyle={'light-content'}
                    backgroundColor={CommonColors.primaryColor}
                />
                <SafeAreaView style={styles.container}>

                    <View style={{ flex: 1, backgroundColor: CommonColors.primaryColor }}>

                        <FastImage source={Background}
                            resizeMode={FastImage.resizeMode.cover}
                            style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
                        />

                        <View style={{ width: '100%', height: '100%', position: 'absolute' }}>

                            <View style={styles.viewClique}>


                                <TouchableOpacity style={{
                                    marginLeft: 20, marginTop: 20, height: 40, width: 40, alignItems: 'center',
                                    justifyContent: 'center', borderRadius: 20,
                                }}
                                    onPress={() => this.btnBackTap()}>
                                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: CommonColors.whiteColor }}
                                        source={BackIcon} />
                                </TouchableOpacity>


                                <View style={{ marginRight: 60, flex: 1, alignItems: 'center' }}>
                                    <Image source={IMG.InitialFlow.Clique}
                                        style={{ width: 130, height: 65, resizeMode: 'contain', marginTop: 40 }}
                                    />
                                </View>

                            </View>


                            <View style={{ flex: 1, }}>

                                <ScrollView style={{ flex: 1 }} bounces={false}>

                                    <Text style={{
                                        marginTop: 30, marginLeft: 20, marginRight: 20, textAlign: 'center', fontSize: SetFontSize.ts16,
                                        fontFamily: ConstantKeys.Averta_REGULAR, color: CommonColors.whiteColor
                                    }}>
                                        Create Account

                                    </Text>
                                    <Text style={{
                                        marginLeft: 20, marginRight: 20, textAlign: 'center', fontSize: SetFontSize.ts30, marginTop: 15,
                                        fontFamily: ConstantKeys.Averta_BOLD, color: CommonColors.whiteColor
                                    }}>
                                        {"Your OTP"}</Text>

                                    <Text style={{
                                        marginLeft: 20, marginRight: 20, marginTop: 30,
                                        fontSize: SetFontSize.ts16, fontFamily: ConstantKeys.Averta_REGULAR, color: CommonColors.whiteColor
                                    }}>
                                        Enter 6 digit code send to you at
                                </Text>

                                    <Text style={{
                                        marginLeft: 20, marginRight: 20, marginTop: 5,
                                        fontSize: SetFontSize.ts16, fontFamily: ConstantKeys.Averta_BOLD, color: CommonColors.whiteColor
                                    }}>
                                        {this.state.RegisterData.country_code + "-" + this.state.RegisterData.mobile_no}
                                    </Text>


                                    <OTPInputView
                                        style={{ marginLeft: 20, marginRight: 30, height: 50, marginTop: 25, }}
                                        pinCount={4}
                                        code={this.state.OTP}
                                        onCodeChanged={code => { this.setState({ OTP: code }) }}
                                        autoFocusOnLoad={false}
                                        codeInputFieldStyle={styles.borderStyleBase}
                                        codeInputHighlightStyle={styles.borderStyleHighLighted}
                                        onCodeFilled={(code) => {

                                            this.setState({ OTP: code })
                                            optcode = code
                                            console.log(`Code is ${code}, you are good to go!`)
                                        }}
                                    />

                                    <Text style={{
                                        fontSize: SetFontSize.ts14, fontFamily: ConstantKeys.Averta_REGULAR,
                                        color: CommonColors.whiteColor, textAlign: 'center', marginTop: 15
                                    }}>
                                        Don't receive verification code?
                                </Text>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 5, paddingBottom: 5 }}>
                                        <TouchableOpacity style={{ flex: 0.5, }}
                                            onPress={() => this.btnBackTap()}>
                                            <Text style={{
                                                fontSize: SetFontSize.ts14, fontFamily: ConstantKeys.Averta_REGULAR, textAlign: 'center',
                                                color: CommonColors.whiteColor,
                                            }}>
                                                Change number
                                        </Text>

                                        </TouchableOpacity>

                                    </View>

                                </ScrollView>


                                <LinearGradient colors={[CommonColors.gradientStart, CommonColors.gradientEnd]}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                    style={{ height: 50, marginBottom: 30, marginLeft: 20, marginRight: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 10, }}>
                                    <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                                        onPress={() => this.btnSignUpTap()}>
                                        <Text style={{ color: CommonColors.whiteColor, fontSize: SetFontSize.ts16, fontFamily: ConstantKeys.Averta_BOLD }}>
                                            Sign Up
                                            </Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>

                            {this.state.isloading ?
                                <LoadingView />
                                : null
                            }

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
        flexDirection: 'row',
    },
    borderStyleBase: {
        height: 45, borderWidth: 2, borderColor: CommonColors.whiteColor,
        borderRadius: 6, fontSize: SetFontSize.ts15, fontFamily: ConstantKeys.Averta_BOLD,
        color: CommonColors.whiteColor
    },
    borderStyleHighLighted: {
        borderColor: CommonColors.PurpleColor, fontSize: SetFontSize.ts15,
        fontFamily: ConstantKeys.Averta_BOLD, color: CommonColors.PurpleColor
    },
    btnSignUp: {
        marginBottom: 30, marginLeft: 20, marginRight: 20, height: 50, backgroundColor: CommonColors.PurpleColor,
        shadowColor: CommonColors.btnShadowColor,
        shadowOffset: { width: 7, height: 5 },
        shadowOpacity: 1, shadowRadius: 5, elevation: 5,
        borderBottomLeftRadius: 20, borderTopRightRadius: 20, alignItems: 'center', justifyContent: 'center'
    },
    txtSignUp: {
        color: CommonColors.whiteColor, fontSize: SetFontSize.ts16, fontFamily: 'Averta-Regular'
    },
})