import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Dimensions,
  Platform,
  Alert,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';

//Constants
import {CommonColors} from '../Constants/ColorConstant';
import {IMG} from '../Constants/ImageConstant';
import {ConstantKeys} from '../Constants/ConstantKey';
import {SetFontSize} from '../Constants/FontSize';
import LoadingView from '../Constants/LoadingView';
import Webservice from '../Constants/API';
import {APIURL} from '../Constants/APIURL';
import ValidationMsg from '../Constants/ValidationMsg';

//Third Party
import {DrawerActions} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {CommonActions} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Neomorph, Shadow, NeomorphFlex} from 'react-native-neomorph-shadows';
import LinearGradient from 'react-native-linear-gradient';
import CountryPicker from '../components/country-picker/CountryPicker';

export default class PurchaseCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      user: {},
      userData: {},
      txtFullName: '',
      txtEmail: '',
      txtMobileNo: '',
      countryCode: '91',
      txtQuantity: '',
      txtAddress: '',
      ArrCountry: [],
      selectedCountry: {id: 100, code: 'IN', name: 'India'},
      txtState: '',
      txtZipCode: '',
    };
  }

  async componentDidMount() {
    await this.getData();
  }

  showAlert(text) {
    Snackbar.show({
      text: text,
      backgroundColor: CommonColors.errorColor,
      textColor: CommonColors.whiteColor,
      //   fontFamily: ConstantKeys.Averta_BOLD,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA);
      if (value !== null) {
        // value previously stored
        console.log('User Data: ' + value);
        var userData = JSON.parse(value);
        var user = userData.user;

        var mobile = user.mobile;

        var Fullmobile = mobile.split('-');

        console.log('Full Mobile: ' + Fullmobile[1]);

        this.setState({
          userData: userData,
          user: userData.user,
          txtFullName: user.name,
          txtEmail: user.email,
          txtMobileNo: Fullmobile[1],
          countryCode: Fullmobile[0],
        });

        this.API_GET_COUNTRY(true);
      } else {
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      console.log('Error : ' + e);
    }
  };

  // API Get Country
  API_GET_COUNTRY(isload) {
    this.setState({isloading: isload});

    Webservice.post(APIURL.countryList)
      .then((response) => {
        if (response.data == null) {
          this.setState({isloading: false});
          // alert('error');
          alert(response.originalError.message);
          return;
        }
        //   console.log(response);
        this.setState({isloading: false});
        console.log('Get Country List Response : ' + JSON.stringify(response));

        if (response.data.status == true) {
          var CountryData = response.data.data.countrylist;

          this.setState({ArrCountry: CountryData});
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
                this.API_GET_COUNTRY(true);
              },
            },
          ],
          {cancelable: false},
        );
      });
  }

  // API Get Country
  API_PUT_ORDER(isload) {
    this.setState({isloading: isload});

    Webservice.post(APIURL.putOrder, {
      user_id: this.state.user.user_id,
      firstname: this.state.txtFullName,
      lastname: '',
      email: this.state.txtEmail,
      phone: String(this.state.countryCode + '-' + this.state.txtMobileNo),
      address1: this.state.txtAddress,
      address2: '',
      qty: this.state.txtQuantity,
      amount: '100',
      country: this.state.selectedCountry.id,
      state: this.state.txtState,
      postcode: this.state.txtZipCode,
    })
      .then((response) => {
        if (response.data == null) {
          this.setState({isloading: false});
          // alert('error');
          alert(response.originalError.message);
          return;
        }
        //   console.log(response);
        this.setState({isloading: false});
        console.log('Get Put Order Response : ' + JSON.stringify(response));

        if (response.data.status == true) {
          ValidationMsg.AppName,
            response.data.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.navigation.goBack();
                },
              },
            ],
            {cancelable: false};
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
                this.API_PUT_ORDER(true);
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

  selectCountry = (item) => {
    requestAnimationFrame(() => {
      this.setState({selectedCountry: item});
      this.RBSheet.close();
    });
  };

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  btnPurchaseTap = () => {
    requestAnimationFrame(() => {
      if (this.state.txtFullName == '') {
        this.showAlert('Please Enter Full Name');
      } else if (!this.validateEmail(this.state.txtEmail)) {
        this.showAlert('Please Valid Email Address');
      } else if (this.state.txtMobileNo == '') {
        this.showAlert('Please Enter Mobile Number');
      } else if (this.state.txtQuantity == '') {
        this.showAlert('Please Enter Quantity');
      } else if (this.state.txtAddress == '') {
        this.showAlert('Please Enter Delivery Address');
      } else if (this.state.txtState == '') {
        this.showAlert('Please Enter State');
      } else if (this.state.txtZipCode == '') {
        this.showAlert('Please Enter Zip Code');
      } else {
        this.API_PUT_ORDER(true);
      }
    });
  };

  render() {
    let BackIcon = IMG.OtherFlow.BackIcon;
    let DownArrowIcon = IMG.OtherFlow.DownArrowIcon;
    return (
      <>
        <SafeAreaView
          style={{flex: 0, backgroundColor: CommonColors.appBarColor}}
        />

        <StatusBar
          barStyle={'light-content'}
          backgroundColor={CommonColors.appBarColor}
        />
        <SafeAreaView style={styles.container}>
          <View style={{flex: 1, backgroundColor: CommonColors.primaryColor}}>
            <View style={styles.headerView}>
              <TouchableOpacity
                style={{
                  marginLeft: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  width: 40,
                }}
                onPress={() => this.btnBackTap()}>
                <Image
                  style={{width: 20, height: 20, resizeMode: 'contain'}}
                  source={BackIcon}
                />
              </TouchableOpacity>

              <Text style={styles.headerText}>Purchase Card</Text>

              <TouchableOpacity
                style={{
                  marginLeft: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  width: 40,
                }}
              />
            </View>

            <View style={{flex: 1}}>
              <ScrollView style={{flex: 1}}>
                <Text
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  Full Name
                </Text>

                <TextInput
                  placeholder={'Full Name'}
                  keyboardType={
                    Platform.OS === 'android'
                      ? 'visible-password'
                      : 'ascii-capable'
                  }
                  placeholderTextColor={CommonColors.whiteColor}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 10,
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    backgroundColor: CommonColors.appBarColor,
                    borderRadius: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                  value={this.state.txtFullName}
                  returnKeyType={'done'}
                  onChangeText={async (txtFullName) => {
                    await this.setState({
                      txtFullName: txtFullName.replace(/[^a-z,^A-Z,^\s]/g, ''),
                    });
                  }}
                />

                <Text
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  Email
                </Text>

                <TextInput
                  placeholder={'Email ID'}
                  placeholderTextColor={CommonColors.whiteColor}
                  keyboardType={'email-address'}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 10,
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    backgroundColor: CommonColors.appBarColor,
                    borderRadius: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}
                  value={this.state.txtEmail}
                  returnKeyType={'done'}
                  onChangeText={async (txtEmail) => {
                    await this.setState({txtEmail: txtEmail});
                  }}
                />

                <Text
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  Phone Number
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    marginLeft: 20,
                    marginRight: 20,
                    height: 50,
                    backgroundColor: CommonColors.appBarColor,
                    borderRadius: 10,
                  }}>
                  <CountryPicker
                    disable={false}
                    animationType={'slide'}
                    containerStyle={styles.viewCountrystyle}
                    pickerTitleStyle={styles.pickerTitleStyle}
                    selectedCountryTextStyle={styles.selectedCountryTextStyle}
                    countryNameTextStyle={styles.countryNameTextStyle}
                    searchBarPlaceHolder={'Search...'}
                    hideCountryFlag={true}
                    hideCountryCode={false}
                    searchBarStyle={styles.searchBarStyle}
                    countryCode={this.state.countryCode}
                    selectedValue={this.selectCountry}
                  />

                  <TextInput
                    placeholder={'Mobile number'}
                    keyboardType={'number-pad'}
                    maxLength={15}
                    placeholderTextColor={CommonColors.whiteColor}
                    style={{
                      flex: 1,
                      height: 50,
                      color: CommonColors.whiteColor,
                      fontSize: SetFontSize.ts16,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                      marginLeft: 5,
                    }}
                    value={this.state.txtMobileNo}
                    returnKeyType={'done'}
                    onChangeText={async (txtMobileNo) => {
                      await this.setState({
                        txtMobileNo: txtMobileNo.replace(/[^0-9]/g, ''),
                      });
                    }}
                  />
                </View>

                <Text
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  Quantity
                </Text>
                <TextInput
                  placeholder={'Quantity'}
                  keyboardType={'number-pad'}
                  maxLength={5}
                  placeholderTextColor={CommonColors.whiteColor}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    paddingLeft: 10,
                    paddingRight: 10,
                    backgroundColor: CommonColors.appBarColor,
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                  value={this.state.txtQuantity}
                  returnKeyType={'done'}
                  onChangeText={async (txtQuantity) => {
                    await this.setState({
                      txtQuantity: txtQuantity.replace(/[^0-9]/g, ''),
                    });
                  }}
                />

                <Text
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  Delivery Address
                </Text>

                <TextInput
                  placeholder={'Delivery Address'}
                  keyboardType={'default'}
                  placeholderTextColor={CommonColors.whiteColor}
                  multiline={true}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    flex: 1,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    minHeight: 100,
                    padding: 10,
                    backgroundColor: CommonColors.appBarColor,
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                  value={this.state.txtAddress}
                  onChangeText={async (txtAddress) => {
                    await this.setState({txtAddress: txtAddress});
                  }}
                />

                <Text
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  Country
                </Text>

                <TouchableOpacity
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    flex: 1,
                    alignItems: 'center',
                    height: 50,
                    backgroundColor: CommonColors.appBarColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    flexDirection: 'row',
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                  onPress={() => this.RBSheet.open()}>
                  <Text
                    style={{
                      marginLeft: 10,
                      marginRight: 5,
                      flex: 1,
                      color: CommonColors.whiteColor,
                      fontSize: SetFontSize.ts16,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                    }}>
                    {this.state.selectedCountry.name}
                  </Text>

                  <Image
                    source={DownArrowIcon}
                    style={{
                      height: 10,
                      width: 10,
                      resizeMode: 'contain',
                      marginRight: 10,
                      tintColor: CommonColors.whiteColor,
                    }}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  State
                </Text>

                <TextInput
                  placeholder={'State'}
                  keyboardType={
                    Platform.OS === 'android'
                      ? 'visible-password'
                      : 'ascii-capable'
                  }
                  placeholderTextColor={CommonColors.whiteColor}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    paddingLeft: 10,
                    paddingRight: 10,
                    backgroundColor: CommonColors.appBarColor,
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                  value={this.state.txtState}
                  onChangeText={async (txtState) => {
                    await this.setState({
                      txtState: txtState.replace(/[^a-z,^A-Z,^\s]/g, ''),
                    });
                  }}
                />

                <Text
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  Zip Code
                </Text>

                <TextInput
                  placeholder={'Zip Code'}
                  maxLength={8}
                  keyboardType={'number-pad'}
                  placeholderTextColor={CommonColors.whiteColor}
                  style={{
                    marginLeft: 20,
                    marginRight: 20,
                    marginBottom: 20,
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    paddingLeft: 10,
                    paddingRight: 10,
                    backgroundColor: CommonColors.appBarColor,
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                  value={this.state.txtZipCode}
                  onChangeText={async (txtZipCode) => {
                    await this.setState({
                      txtZipCode: txtZipCode.replace(/[^0-9]/g, ''),
                    });
                  }}
                />
              </ScrollView>

              <LinearGradient
                colors={[CommonColors.gradientStart, CommonColors.gradientEnd]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  height: 50,
                  marginBottom: 20,
                  marginLeft: 20,
                  marginTop: 5,
                  marginRight: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <TouchableOpacity
                  style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => this.btnPurchaseTap()}>
                  <Text
                    style={{
                      color: CommonColors.whiteColor,
                      fontSize: SetFontSize.ts16,
                      fontFamily: ConstantKeys.Averta_BOLD,
                    }}>
                    Purchase
                  </Text>
                </TouchableOpacity>
              </LinearGradient>

              {this.state.isloading ? <LoadingView /> : null}
            </View>

            <RBSheet
              ref={(ref) => {
                this.RBSheet = ref;
              }}
              animationType={'fade'}
              height={400}
              closeOnDragDown={true}
              openDuration={250}
              customStyles={{
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                draggableIcon: {
                  backgroundColor: CommonColors.primaryColor,
                },
                wrapper: {
                  backgroundColor: 'rgba(37, 30, 84, 0.8)',
                },
              }}>
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: CommonColors.whiteColor,
                }}>
                <FlatList
                  style={{marginTop: 5}}
                  data={this.state.ArrCountry}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={{
                        marginLeft: 20,
                        marginRight: 20,
                        height: 50,
                        borderBottomColor: CommonColors.inActiveColor,
                        borderBottomWidth: 1,
                      }}
                      onPress={() => this.selectCountry(item)}>
                      <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text
                          style={{
                            fontSize: SetFontSize.ts16,
                            color: CommonColors.MortarColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </RBSheet>
          </View>
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
    backgroundColor: CommonColors.PurpleColor,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerView: {
    height: 74,
    width: '100%',
    backgroundColor: CommonColors.appBarColor,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: ConstantKeys.Averta_BOLD,
    fontSize: SetFontSize.ts16,
    color: CommonColors.whiteColor,
    textAlign: 'center',
    flex: 1,
  },
  viewCountrystyle: {
    flexDirection: 'row',
    height: 50,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    color: CommonColors.whiteColor,
    fontSize: SetFontSize.ts16,
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
    fontSize: SetFontSize.ts16,
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
  btnPurchase: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
    marginBottom: 20,
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
  txtPurchase: {
    color: CommonColors.whiteColor,
    fontSize: SetFontSize.ts16,
    fontFamily: ConstantKeys.Averta_REGULAR,
  },
});
