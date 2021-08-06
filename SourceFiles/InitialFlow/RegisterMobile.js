import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  Dimensions,
  Alert,
} from 'react-native';

//Constant Files
import {CommonColors} from '../Constants/ColorConstant';
import {IMG} from '../Constants/ImageConstant';
import {SetFontSize} from '../Constants/FontSize';
import {ConstantKeys} from '../Constants/ConstantKey';
import ValidationMsg from '../Constants/ValidationMsg';
import LoadingView from '../Constants/LoadingView';
import Webservice from '../Constants/API';
import {APIURL} from '../Constants/APIURL';

//Third Party
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import {Neomorph, Shadow, NeomorphFlex} from 'react-native-neomorph-shadows';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import CountryPicker from '../components/country-picker/CountryPicker';

export default class RegisterMobile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      txtMobileNo: '',
      MobileBorderColor: CommonColors.GhostColor,
      ShowPassword: true,
      isDisable: true,
      countryCode: '91',
      longitude: 0.0,
      latitude: 0.0,
      RegisterData: JSON.parse(props.route.params.dict),
    };
  }

  componentDidMount() {
    console.log(
      'Register Data in Register Mobile : ' +
        JSON.stringify(this.state.RegisterData),
    );
  }

  showAlert(text) {
    Snackbar.show({
      text: text,
      backgroundColor: CommonColors.errorColor,
      textColor: CommonColors.whiteColor,
      // fontFamily: ConstantKeys.Averta_BOLD,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  API_REGISTER(isload) {
    this.setState({isloading: isload});

    Webservice.post(APIURL.register, {
      mobile: this.state.countryCode + '-' + this.state.txtMobileNo,
      current_lat: this.state.latitude,
      current_long: this.state.longitude,
    })
      .then((response) => {
        if (response.data == null) {
          this.setState({isloading: false});
          // alert('error');
          alert(response.originalError.message);
          return;
        }
        //   console.log(response);

        console.log('Get Register User Response : ' + JSON.stringify(response));

        if (response.data.status == true) {
          this.setState({isloading: false});

          var OTP = response.data.otp;

          var dict = this.state.RegisterData;
          dict.mobile_no = this.state.txtMobileNo;
          dict.country_code = this.state.countryCode;
          this.props.navigation.navigate('RegisterOTPView', {
            dict: JSON.stringify(dict),
            otp: OTP,
          });
        } else {
          this.setState({isloading: false});
          this.showAlert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({isloading: false});
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'Try Again',
              onPress: () => {
                this.API_REGISTER(true);
              },
            },
          ],
          {cancelable: false},
        );
      });
  }

  //Action Methods
  btnBackTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  btnNextTap = () => {
    requestAnimationFrame(() => {
      Keyboard.dismiss();

      if (this.state.txtMobileNo == '') {
        this.showAlert('Please Enter Mobile Number');
      } else {
        // var dict = {}
        // dict['mobile_no'] = this.state.txtMobileNo
        //     dict['country_code'] = this.state.countryCode
        // this.props.navigation.navigate('RegisterOTPView', { dict: JSON.stringify(dict), otp: 1234 })

        this.API_REGISTER(true);
      }
    });
  };

  _selectedCountry = (index) => {
    this.setState({countryCode: index});
  };

  //Helper Methods For TextInput
  onFocus() {
    this.setState({
      MobileBorderColor: CommonColors.SlateBlueColor,
    });
  }

  onBlur() {
    this.setState({
      MobileBorderColor: CommonColors.GhostColor,
    });
  }

  render() {
    let BackIcon = IMG.OtherFlow.BackIcon;
    let Background = IMG.OtherFlow.Background;
    return (
      <>
        <SafeAreaView
          style={{flex: 0, backgroundColor: CommonColors.primaryColor}}
        />

        <StatusBar
          barStyle={'light-content'}
          backgroundColor={CommonColors.primaryColor}
        />
        <SafeAreaView style={styles.container}>
          <View style={{flex: 1, backgroundColor: CommonColors.primaryColor}}>
            <FastImage
              source={Background}
              resizeMode={FastImage.resizeMode.cover}
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
              }}
            />

            <View style={{width: '100%', height: '100%', position: 'absolute'}}>
              <View style={styles.viewClique}>
                <TouchableOpacity
                  style={{
                    marginLeft: 20,
                    marginTop: 20,
                    height: 40,
                    width: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                  }}
                  onPress={() => this.btnBackTap()}>
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      tintColor: CommonColors.whiteColor,
                    }}
                    source={BackIcon}
                  />
                </TouchableOpacity>

                <View style={{marginRight: 60, flex: 1, alignItems: 'center'}}>
                  <Image
                    source={IMG.InitialFlow.Clique}
                    style={{
                      width: 130,
                      height: 65,
                      resizeMode: 'contain',
                      marginTop: 40,
                    }}
                  />
                </View>
              </View>

              <View style={{flex: 1}}>
                <ScrollView style={{width: '100%'}} bounces={false}>
                  <View style={{marginTop: 10, marginBottom: 20}}>
                    <Text
                      style={{
                        marginTop: 20,
                        marginLeft: 20,
                        marginRight: 20,
                        textAlign: 'center',
                        fontSize: SetFontSize.ts16,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                        color: CommonColors.whiteColor,
                      }}>
                      Create Account
                    </Text>
                    <Text
                      style={{
                        marginLeft: 20,
                        marginRight: 20,
                        textAlign: 'center',
                        fontSize: SetFontSize.ts30,
                        marginTop: 15,
                        fontFamily: ConstantKeys.Averta_BOLD,
                        color: CommonColors.whiteColor,
                      }}>
                      {'Your Mobile Number'}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        height: 50,
                        marginLeft: 20,
                        marginRight: 20,
                        marginTop: 50,
                        backgroundColor: CommonColors.appBarColor,
                        borderRadius: 10,
                      }}>
                      <CountryPicker
                        disable={false}
                        animationType={'slide'}
                        containerStyle={styles.viewCountrystyle}
                        pickerTitleStyle={styles.pickerTitleStyle}
                        selectedCountryTextStyle={
                          styles.selectedCountryTextStyle
                        }
                        countryNameTextStyle={styles.countryNameTextStyle}
                        searchBarPlaceHolder={'Search...'}
                        hideCountryFlag={true}
                        hideCountryCode={false}
                        searchBarStyle={styles.searchBarStyle}
                        countryCode={this.state.countryCode}
                        selectedValue={this._selectedCountry}
                      />

                      <TextInput
                        placeholder={'Mobile number'}
                        maxLength={15}
                        placeholderTextColor={CommonColors.whiteColor}
                        keyboardType={'number-pad'}
                        onBlur={() => this.onBlur()}
                        onFocus={() => this.onFocus()}
                        style={{
                          flex: 1,
                          height: 50,
                          color: CommonColors.whiteColor,
                          fontSize: SetFontSize.ts14,
                          fontFamily: ConstantKeys.Averta_REGULAR,
                          marginLeft: 5,
                        }}
                        value={this.state.txtMobileNo}
                        returnKeyType={'done'}
                        onChangeText={async (txtMobileNo) => {
                          await this.setState({
                            txtMobileNo: txtMobileNo.replace(/[^0-9]/g, ''),
                          });

                          if (this.state.txtMobileNo == '') {
                            this.setState({isDisable: true});
                          } else {
                            this.setState({isDisable: false});
                          }
                        }}
                      />
                    </View>
                  </View>
                </ScrollView>

                <LinearGradient
                  colors={[
                    CommonColors.gradientStart,
                    CommonColors.gradientEnd,
                  ]}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    height: 50,
                    marginLeft: 20,
                    marginRight: 20,
                    borderRadius: 10,
                    marginBottom: 30,
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    disabled={this.state.isDisable}
                    onPress={() => this.btnNextTap()}>
                    <Text
                      style={{
                        color: CommonColors.whiteColor,
                        fontSize: SetFontSize.ts16,
                        fontFamily: ConstantKeys.Averta_BOLD,
                      }}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </View>

          {this.state.isloading ? <LoadingView /> : null}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CommonColors.primaryColor,
  },
  viewClique: {
    flexDirection: 'row',
  },
  btnNextDisable: {
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
    height: 50,
    backgroundColor: CommonColors.SlateBlueColor,
    shadowColor: CommonColors.btnShadowColor,
    shadowOffset: {width: 7, height: 5},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnNextEnable: {
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
    height: 50,
    backgroundColor: CommonColors.PurpleColor,
    shadowColor: CommonColors.btnShadowColor,
    shadowOffset: {width: 7, height: 5},
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtNext: {
    color: CommonColors.whiteColor,
    fontSize: SetFontSize.ts16,
    fontFamily: ConstantKeys.Averta_REGULAR,
  },
  viewCountrystyle: {
    flexDirection: 'row',
    height: 50,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    color: CommonColors.MortarColor,
    fontSize: SetFontSize.ts14,
    fontFamily: ConstantKeys.Averta_REGULAR,
  },
  pickerTitleStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
    fontSize: SetFontSize.ts18,
    color: CommonColors.blackColor,
  },
  selectedCountryTextStyle: {
    paddingLeft: 5,
    paddingRight: 5,
    color: CommonColors.whiteColor,
    fontSize: SetFontSize.ts14,
    fontFamily: ConstantKeys.Averta_REGULAR,
    textAlign: 'center',
  },
  countryNameTextStyle: {
    paddingLeft: 10,
    color: CommonColors.blackColor,
    textAlign: 'right',
  },
  searchBarStyle: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 8,
    marginRight: 10,
  },
});
