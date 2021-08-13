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
  LogBox,
  Platform,
  TextInput,
  Alert,
  PermissionsAndroid,
  ScrollView,
  Linking,
  Switch,
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
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {CommonActions} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CountryPicker from '../components/country-picker/CountryPicker';

export default class AddJob extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      userData: {},
      user: {},
      CompanyData: props.route.params.company_data,

      ProfileImgData: null,

      txtCompanyName: '',
      txtAddress: '',
      txtJobPosition: '',

      countryCode: '91',
      txtMobileNo: '',
      txtWebsite: '',
      txtEmail: '',
      txtInstagram: '',
      txtFacebook: '',
      txtLinkdIn: '',
      txtTwitter: '',
    };
  }

  async componentDidMount() {
    await this.getData();

    if (this.state.CompanyData != null) {
      this.setData(JSON.parse(this.state.CompanyData));
    } else {
    }
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA);
      if (value !== null) {
        // value previously stored
        var userData = JSON.parse(value);
        var user = userData.user;

        this.setState({userData: userData, user: user});
      } else {
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      console.log('Error : ' + e);
    }
  };

  setData(data) {
    var mobile = data.number;

    var Fullmobile = [];
    if (mobile == null) {
      Fullmobile[0] = '91';
      Fullmobile[1] = '';
    } else {
      Fullmobile = mobile.split('-');

      console.log('Full Mobile: ' + Fullmobile[0] + '  ' + Fullmobile[1]);
    }

    if (data.logo != null) {
      var dict = {};
      dict.uri = this.state.userData.asset_url + data.logo;
      dict.type = 'image/png';
      dict.base64 = null;

      this.setState({ProfileImgData: dict});
    } else {
      this.setState({ProfileImgData: null});
    }

    this.setState({
      txtCompanyName: data.name,
      txtAddress: data.address,
      txtJobPosition: data.job_position,
      countryCode: Fullmobile[0],
      txtMobileNo: Fullmobile[1],
      txtWebsite: data.website,
      txtEmail: data.email,
      txtInstagram: data.instagram,
      txtFacebook: data.facebook,
      txtLinkdIn: data.linkedin,
      txtTwitter: data.twitter,
    });
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

  // API Add Company CALL
  API_ADD_COMPANY(isload) {
    this.setState({isloading: isload});

    var companyId = '';
    if (this.state.CompanyData != null) {
      var data = JSON.parse(this.state.CompanyData);
      console.log(data.id);
      companyId = data.id;
    }

    Webservice.post(APIURL.companyAdd, {
      user_id: this.state.user.user_id,
      company_id: companyId,
      logo:
        this.state.ProfileImgData != null
          ? this.state.ProfileImgData.base64
          : '',
      name: this.state.txtCompanyName,
      address: this.state.txtAddress,
      jobPosition: this.state.txtJobPosition,
      email: this.state.txtEmail,
      website: this.state.txtWebsite,
      number:
        this.state.txtMobileNo != ''
          ? this.state.countryCode + '-' + this.state.txtMobileNo
          : '',
      facebook: this.state.txtFacebook,
      instagram: this.state.txtInstagram,
      linkedin: this.state.txtLinkdIn,
      twitter: this.state.txtTwitter,
    })
      .then((response) => {
        if (response.data == null) {
          this.setState({isloading: false});
          alert(response.originalError.message);
          return;
        }
        //   console.log(response);
        this.setState({isloading: false});
        console.log('Get Add Company Response : ' + JSON.stringify(response));

        if (response.data.status == true) {
          var companyData = response.data.data;

          this.props.route.params.updateData(JSON.stringify(companyData));
          this.props.navigation.goBack();
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
                this.API_ADD_COMPANY(true);
              },
            },
          ],
          {cancelable: false},
        );
      });
  }

  // Action Methods
  btnBackTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  btnDoneTap = () => {
    requestAnimationFrame(() => {
      if (this.state.txtCompanyName == '') {
        this.showAlert('Please enter company name');
      } else if (this.state.txtAddress == '') {
        this.showAlert('Please enter company address');
      } else if (this.state.txtJobPosition == '') {
        this.showAlert('Please enter job position');
      }
      // else if(this.state.txtEmail == ''){
      //     this.showAlert("Please enter email id")
      // }else if(this.state.txtWebsite == ''){
      //     this.showAlert("Please enter website")
      // }else if(this.state.txtMobileNo == ''){
      //     this.showAlert("Please enter mobile no")
      // }else if(this.state.txtFacebook == ''){
      //     this.showAlert("Please enter facebook id")
      // }else if(this.state.txtInstagram == ''){
      //     this.showAlert("Please enter instagram id")
      // }else if(this.state.txtLinkdIn == ''){
      //     this.showAlert("Please enter linkdIn id")
      // }else if(this.state.txtTwitter == ''){
      //     this.showAlert("Please enter twitter id")
      // }
      else {
        this.API_ADD_COMPANY(true);
      }
    });
  };

  btnSelectImage = () => {
    Alert.alert(
      ValidationMsg.AppName,
      'Choose your Suitable Option',
      [
        {
          text: 'Camera',
          onPress: () => {
            launchCamera(
              {
                mediaType: 'photo',
                includeBase64: true,
                quality: 0.7,
              },
              (response) => {
                console.log(JSON.stringify(response));
                if (response.didCancel) {
                  console.log('User cancelled photo picker');

                  this.setState({loading: false});
                } else if (response.errorCode) {
                  console.log('ImagePicker Error: ', response.errorCode);
                  this.setState({loading: false});

                  if (response.errorCode == 'permission') {
                    alert('Please allow Camera permission from Setting');
                  }
                } else if (response.customButton) {
                  console.log(
                    'User tapped custom button: ',
                    response.customButton,
                  );
                } else {
                  this.setState({ProfileImgData: response});
                }
              },
            );
          },
        },
        {
          text: 'Gallary',
          onPress: () => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                includeBase64: true,
                quality: 0.7,
              },
              (response) => {
                console.log(JSON.stringify(response));

                if (response.didCancel) {
                  this.setState({isLoading: false});
                  console.log('User cancelled photo picker');
                } else if (response.errorCode) {
                  console.log('ImagePicker Error: ', response.error);
                  this.setState({isLoading: false});
                  if (response.errorCode == 'permission') {
                    alert('Please allow Camera permission from Setting');
                  }
                } else if (response.customButton) {
                  this.setState({isLoading: false});
                  console.log(
                    'User tapped custom button: ',
                    response.customButton,
                  );
                } else {
                  this.setState({ProfileImgData: response});
                }
              },
            );
          },
        },
        {
          text: 'Cancel',
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  render() {
    let BusinessIcon = IMG.OtherFlow.BusinessIcon;
    let SocialIcon = IMG.OtherFlow.SocialIcon;
    let MusicIcon = IMG.OtherFlow.MusicIcon;
    let PaymentIcon = IMG.OtherFlow.PaymentIcon;
    let ExternalLinkIcon = IMG.OtherFlow.ExternalLinkIcon;
    let BackIcon = IMG.OtherFlow.BackIcon;
    let TickIcon = IMG.OtherFlow.TickIcon;
    let PencilIcon = IMG.OtherFlow.PencilIcon;
    let AddressIcon = IMG.OtherFlow.AddressIcon;

    let CallIcon = IMG.OtherFlow.CallIcon;
    let SocialMailIcon = IMG.OtherFlow.SocialMailIcon;
    let RightArrowIcon = IMG.OtherFlow.RightArrowIcon;
    let SpotifyIcon = IMG.OtherFlow.SpotifyIcon;
    let PayIcon = IMG.OtherFlow.PayIcon;
    let LinkIcon = IMG.OtherFlow.LinkIcon;
    let QRIcon = IMG.OtherFlow.QRIcon;
    let WebIcon = IMG.OtherFlow.WebIcon;
    let InstaIcon = IMG.OtherFlow.InstaIcon;
    let FacebookIcon = IMG.OtherFlow.FacebookIcon;
    let TwitterIcon = IMG.OtherFlow.TwitterIcon;
    let YoutubeIcon = IMG.OtherFlow.YoutubeIcon;
    let LinkdInIcon = IMG.OtherFlow.LinkdInIcon;
    let EditIcon = IMG.OtherFlow.EditIcon;

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

              <Text style={styles.headerText}>Add Job Position</Text>

              <TouchableOpacity
                style={{
                  marginRight: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 40,
                  width: 40,
                }}
                onPress={() => this.btnDoneTap()}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                    tintColor: CommonColors.arrowColor,
                  }}
                  source={TickIcon}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={{flex: 1}}>
              <View
                style={{
                  marginTop: 20,
                  alignSelf: 'center',
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  backgroundColor: CommonColors.whiteColor,
                }}>
                <FastImage
                  style={{width: 150, height: 150, borderRadius: 75}}
                  source={
                    this.state.ProfileImgData != null
                      ? {uri: this.state.ProfileImgData.uri}
                      : {uri: 'https://i.stack.imgur.com/y9DpT.jpg'}
                  }
                  resizeMode={FastImage.resizeMode.cover}
                />

                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    height: 40,
                    width: 40,
                    backgroundColor: CommonColors.whiteColor,
                    borderRadius: 20,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => this.btnSelectImage()}>
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      tintColor: CommonColors.primaryColor,
                    }}
                    source={PencilIcon}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  marginLeft: 20,
                  marginRight: 20,
                }}>
                <Image source={BusinessIcon} />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  Company Name
                </Text>
              </View>

              <TextInput
                placeholder={'Company Name'}
                placeholderTextColor={CommonColors.whiteColor}
                keyboardType={
                  Platform.OS === 'android'
                    ? 'visible-password'
                    : 'ascii-capable'
                }
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  flex: 1,
                  height: 50,
                  color: CommonColors.whiteColor,
                  fontSize: SetFontSize.ts16,
                  fontFamily: ConstantKeys.Averta_REGULAR,
                  backgroundColor: CommonColors.appBarColor,
                  borderRadius: 10,
                  marginTop: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
                value={this.state.txtCompanyName}
                returnKeyType={'done'}
                onChangeText={async (txtCompanyName) => {
                  await this.setState({
                    txtCompanyName: txtCompanyName.replace(
                      /[^a-z,^A-Z,^\s]/g,
                      '',
                    ),
                  });
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  marginLeft: 20,
                  marginRight: 20,
                }}>
                <Image source={AddressIcon} />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  Company Address
                </Text>
              </View>

              <TextInput
                placeholder={'Address'}
                placeholderTextColor={CommonColors.whiteColor}
                keyboardType={'default'}
                multiline={true}
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  flex: 1,
                  marginTop: 5,
                  color: CommonColors.whiteColor,
                  fontSize: SetFontSize.ts16,
                  fontFamily: ConstantKeys.Averta_REGULAR,
                  padding: 10,
                  minHeight: 100,
                  backgroundColor: CommonColors.appBarColor,
                  borderRadius: 10,
                  marginTop: 10,
                }}
                value={this.state.txtAddress}
                onChangeText={(txtAddress) => {
                  this.setState({txtAddress: txtAddress});
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  marginLeft: 20,
                  marginRight: 20,
                }}>
                <Image source={BusinessIcon} />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  Job Position
                </Text>
              </View>

              <TextInput
                placeholder={'Position'}
                placeholderTextColor={CommonColors.whiteColor}
                keyboardType={
                  Platform.OS === 'android'
                    ? 'visible-password'
                    : 'ascii-capable'
                }
                style={{
                  marginLeft: 20,
                  marginRight: 20,
                  flex: 1,
                  height: 50,
                  color: CommonColors.whiteColor,
                  fontSize: SetFontSize.ts16,
                  fontFamily: ConstantKeys.Averta_REGULAR,
                  backgroundColor: CommonColors.appBarColor,
                  borderRadius: 10,
                  marginTop: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
                value={this.state.txtJobPosition}
                returnKeyType={'done'}
                onChangeText={async (txtJobPosition) => {
                  await this.setState({
                    txtJobPosition: txtJobPosition.replace(
                      /[^a-z,^A-Z,^\s]/g,
                      '',
                    ),
                  });
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  marginLeft: 20,
                  marginRight: 20,
                }}>
                <Image source={SocialIcon} />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: SetFontSize.ts16,
                    color: CommonColors.whiteColor,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                  }}>
                  Social Networks
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 10,
                  height: 50,
                  backgroundColor: CommonColors.appBarColor,
                  flexDirection: 'row',
                }}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                  source={CallIcon}
                />

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
                  selectedValue={(index) => {
                    console.log('Country : ' + index);

                    this.setState({countryCode: index});
                  }}
                />

                <TextInput
                  placeholder={'Contact number'}
                  maxLength={15}
                  placeholderTextColor={CommonColors.whiteColor}
                  keyboardType={'number-pad'}
                  style={{
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    marginLeft: 5,
                  }}
                  value={this.state.txtMobileNo}
                  returnKeyType={'next'}
                  onChangeText={(text) => {
                    this.setState({txtMobileNo: text.replace(/[^0-9]/g, '')});
                  }}
                />
              </View>

              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  flexDirection: 'row',
                  flex: 1,
                  marginRight: 20,
                  marginLeft: 20,
                  borderRadius: 10,
                  marginTop: 5,
                  backgroundColor: CommonColors.appBarColor,
                }}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                  source={WebIcon}
                />

                <TextInput
                  placeholder={'https://google.com'}
                  placeholderTextColor={CommonColors.whiteColor}
                  autoCapitalize={false}
                  keyboardType={'url'}
                  style={{
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    marginLeft: 5,
                  }}
                  value={this.state.txtWebsite}
                  returnKeyType={'next'}
                  onChangeText={(text) => {
                    this.setState({txtWebsite: text});
                  }}
                />
              </View>

              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  flexDirection: 'row',
                  flex: 1,
                  marginRight: 20,
                  marginLeft: 20,
                  borderRadius: 10,
                  marginTop: 5,
                  backgroundColor: CommonColors.appBarColor,
                }}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                  source={SocialMailIcon}
                />

                <TextInput
                  placeholder={'example@example.com'}
                  placeholderTextColor={CommonColors.whiteColor}
                  autoCapitalize={false}
                  keyboardType={'email-address'}
                  style={{
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    marginLeft: 5,
                  }}
                  value={this.state.txtEmail}
                  returnKeyType={'next'}
                  onChangeText={(text) => {
                    this.setState({txtEmail: text});
                  }}
                />
              </View>

              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  flexDirection: 'row',
                  flex: 1,
                  marginRight: 20,
                  marginLeft: 20,
                  borderRadius: 10,
                  marginTop: 5,
                  backgroundColor: CommonColors.appBarColor,
                }}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                  source={InstaIcon}
                />

                <TextInput
                  placeholder={'instagram'}
                  autoCapitalize={false}
                  placeholderTextColor={CommonColors.whiteColor}
                  keyboardType={'default'}
                  style={{
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    marginLeft: 5,
                  }}
                  value={this.state.txtInstagram}
                  returnKeyType={'next'}
                  onChangeText={(text) => {
                    this.setState({txtInstagram: text});
                  }}
                />
              </View>

              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  flexDirection: 'row',
                  flex: 1,
                  marginRight: 20,
                  marginLeft: 20,
                  borderRadius: 10,
                  marginTop: 5,
                  backgroundColor: CommonColors.appBarColor,
                }}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                  source={FacebookIcon}
                />

                <TextInput
                  placeholder={'Faebook'}
                  placeholderTextColor={CommonColors.whiteColor}
                  autoCapitalize={false}
                  style={{
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    marginLeft: 5,
                  }}
                  value={this.state.txtFacebook}
                  returnKeyType={'next'}
                  onChangeText={(text) => {
                    this.setState({txtFacebook: text});
                  }}
                />
              </View>

              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  flexDirection: 'row',
                  flex: 1,
                  marginRight: 20,
                  marginLeft: 20,
                  borderRadius: 15,
                  marginTop: 5,
                  backgroundColor: CommonColors.appBarColor,
                }}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                  source={LinkdInIcon}
                />

                <TextInput
                  placeholder={'LinkdIn'}
                  placeholderTextColor={CommonColors.whiteColor}
                  autoCapitalize={false}
                  style={{
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    marginLeft: 5,
                  }}
                  value={this.state.txtLinkdIn}
                  returnKeyType={'next'}
                  onChangeText={(text) => {
                    this.setState({txtLinkdIn: text});
                  }}
                />
              </View>

              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  flexDirection: 'row',
                  flex: 1,
                  marginRight: 20,
                  marginLeft: 20,
                  marginBottom: 20,
                  borderRadius: 10,
                  marginTop: 5,
                  backgroundColor: CommonColors.appBarColor,
                }}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                  source={TwitterIcon}
                />

                <TextInput
                  placeholder={'Twitter'}
                  autoCapitalize={false}
                  placeholderTextColor={CommonColors.whiteColor}
                  style={{
                    flex: 1,
                    height: 50,
                    color: CommonColors.whiteColor,
                    fontSize: SetFontSize.ts16,
                    fontFamily: ConstantKeys.Averta_REGULAR,
                    marginLeft: 5,
                  }}
                  value={this.state.txtTwitter}
                  returnKeyType={'done'}
                  onChangeText={(text) => {
                    this.setState({txtTwitter: text});
                  }}
                />
              </View>
            </ScrollView>

            {this.state.isloading ? <LoadingView /> : null}
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
  headerView: {
    height: 74,
    width: '100%',
    backgroundColor: CommonColors.appBarColor,
    alignItems: 'center',
    flexDirection: 'row',
  },

  headerText: {
    flex: 1,
    fontFamily: ConstantKeys.Averta_BOLD,
    fontSize: SetFontSize.ts16,
    color: CommonColors.whiteColor,
    textAlign: 'center',
  },
  viewCountrystyle: {
    flexDirection: 'row',
    height: 50,
    // width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    color: CommonColors.MortarColor,
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
});
