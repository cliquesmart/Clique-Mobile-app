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
  Platform,
  Alert,
  Switch,
  PermissionsAndroid,
  FlatList,
  Dimensions,
} from 'react-native';

//Constant Files
import {CommonColors} from '../Constants/ColorConstant';
import {IMG} from '../Constants/ImageConstant';
import {SetFontSize} from '../Constants/FontSize';
import {ConstantKeys} from '../Constants/ConstantKey';
import ValidationMsg from '../Constants/ValidationMsg';
import LoadingView from '../Constants/LoadingView';
import {APIURL} from '../Constants/APIURL';
import Webservice from '../Constants/API';

//Third Party
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import {EventRegister} from 'react-native-event-listeners';
import Geolocation from '@react-native-community/geolocation';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import CountryPicker from '../components/country-picker/CountryPicker';

export default class RegisterSocialMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      userData: {},
      user: {},

      longitude: 0.0,
      latitude: 0.0,

      RegisterData: JSON.parse(props.route.params.data),

      ArrHomeNo: [],
      ArrWorkNo: [],
      ArrOtherNo: [],

      SocialData: [],

      ArrWebsite: [],
      ArrSocialMails: [],
      ArrInstagram: [],
      ArrFacebook: [],
      ArrTwitter: [],
      ArrYoutube: [],
      ArrLinkdIn: [],
    };
  }

  async componentDidMount() {
    await this.requestLocationPermission();
    await this.getData();
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
        latitude = String(position.coords.latitude);
        longitude = String(position.coords.longitude);

        this.setState({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
        });

        console.log('Longitude : ' + position.coords.longitude);
        console.log('Latitude : ' + position.coords.latitude);
      },
      (error) => {
        console.log(error.message);
        this.getOneTimeLocation();
      },
      {
        enableHighAccuracy: false,
        timeout: 100000,
        maximumAge: 3600000,
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

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA);
      if (value !== null) {
        // value previously stored
        console.log('User Data: ' + value);
        var userData = JSON.parse(value);
        var user = userData.user;

        this.setState({
          userData: userData,
          user: user,
        });

        // ------- For Mobile Numbers Add ------ //
        var ArrHomeNo = [];
        var ArrWorkNo = [];
        var ArrOtherNo = [];

        var homeDict = {};
        homeDict.media_type = 'homeNumber';
        homeDict.country_code = '91';
        homeDict.media_value = '';
        homeDict.status = 1;
        homeDict.id = 0;

        var workDict = {};
        workDict.media_type = 'workNumber';
        workDict.country_code = '91';
        workDict.media_value = '';
        workDict.status = 1;
        workDict.id = 0;

        var otherDict = {};
        otherDict.media_type = 'otherNumber';
        otherDict.country_code = '91';
        otherDict.media_value = '';
        otherDict.status = 1;
        otherDict.id = 0;

        ArrHomeNo.push(homeDict);
        ArrWorkNo.push(workDict);
        ArrOtherNo.push(otherDict);

        this.setState({
          ArrHomeNo: ArrHomeNo,
          ArrWorkNo: ArrWorkNo,
          ArrOtherNo: ArrOtherNo,
        });
        //-----------------//

        // ----------  Social Arrays  ----------//

        var website = [];
        var socialMails = [];
        var instagram = [];
        var facebook = [];
        var twitter = [];
        var youtube = [];
        var linkdin = [];

        var websiteDict = {};
        websiteDict.media_type = 'website';
        websiteDict.media_value = '';
        websiteDict.status = 1;
        websiteDict.id = 0;
        website.push(websiteDict);

        var emailDict = {};
        emailDict.media_type = 'socialMail';
        emailDict.media_value = '';
        emailDict.status = 1;
        emailDict.id = 0;
        socialMails.push(emailDict);

        var instagramDict = {};
        instagramDict.media_type = 'instagram';
        instagramDict.media_value = '';
        instagramDict.status = 1;
        instagramDict.id = 0;
        instagram.push(instagramDict);

        var facebookDict = {};
        facebookDict.media_type = 'facebook';
        facebookDict.media_value = '';
        facebookDict.status = 1;
        facebookDict.id = 0;
        facebook.push(facebookDict);

        var twitterDict = {};
        twitterDict.media_type = 'twitter';
        twitterDict.media_value = '';
        twitterDict.status = 1;
        twitterDict.id = 0;
        twitter.push(twitterDict);

        var youtubeDict = {};
        youtubeDict.media_type = 'youtube';
        youtubeDict.media_value = '';
        youtubeDict.status = 1;
        youtubeDict.id = 0;
        youtube.push(youtubeDict);

        var linkdinDict = {};
        linkdinDict.media_type = 'linkdin';
        linkdinDict.media_value = '';
        linkdinDict.status = 1;
        linkdinDict.id = 0;
        linkdin.push(linkdinDict);

        this.setState({
          ArrWebsite: website,
          ArrSocialMails: socialMails,
          ArrInstagram: instagram,
          ArrFacebook: facebook,
          ArrTwitter: twitter,
          ArrYoutube: youtube,
          ArrLinkdIn: linkdin,
        });
      } else {
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      console.log('Error : ' + e);
    }
  };

  createData() {
    let websiteLinks = this.state.ArrWebsite.filter(
      (el) => el.media_type == 'website',
    ).map(function ({id, media_value, status}) {
      return {id, mediaValue: media_value, status};
    });

    console.log('Website Link : ' + JSON.stringify(websiteLinks));

    let socialMailLinks = this.state.ArrSocialMails.filter(
      (el) => el.media_type === 'socialMail',
    ).map(function ({id, media_value, status}) {
      return {id, mediaValue: media_value, status};
    });

    console.log('socialMail Link : ' + JSON.stringify(socialMailLinks));

    let instagramLinks = this.state.ArrInstagram.filter(
      (el) => el.media_type === 'instagram',
    ).map(function ({id, media_value, status}) {
      return {id, mediaValue: media_value, status};
    });

    console.log('instagram Link : ' + JSON.stringify(instagramLinks));

    let facebookLinks = this.state.ArrFacebook.filter(
      (el) => el.media_type === 'facebook',
    ).map(function ({id, media_value, status}) {
      return {id, mediaValue: media_value, status};
    });

    console.log('facebook Link : ' + JSON.stringify(facebookLinks));

    let twitterLinks = this.state.ArrTwitter.filter(
      (el) => el.media_type === 'twitter',
    ).map(function ({id, media_value, status}) {
      return {id, mediaValue: media_value, status};
    });

    console.log('twitter Link : ' + JSON.stringify(twitterLinks));

    let youtubeLinks = this.state.ArrYoutube.filter(
      (el) => el.media_type === 'youtube',
    ).map(function ({id, media_value, status}) {
      return {id, mediaValue: media_value, status};
    });

    console.log('youtube Link : ' + JSON.stringify(youtubeLinks));

    let linkdinLinks = this.state.ArrLinkdIn.filter(
      (el) => el.media_type === 'linkdin',
    ).map(function ({id, media_value, status}) {
      return {id, mediaValue: media_value, status};
    });

    console.log('linkdin Link : ' + JSON.stringify(linkdinLinks));

    let homeNumberLinks = this.state.ArrHomeNo.filter(
      (el) => el.media_type === 'homeNumber',
    ).map(function ({id, media_value, country_code, status}) {
      return {
        id,
        mediaValue: media_value == '' ? '' : country_code + '-' + media_value,
        status,
      };
    });

    console.log('homeNumber Link : ' + JSON.stringify(homeNumberLinks));

    let workNumberLinks = this.state.ArrWorkNo.filter(
      (el) => el.media_type === 'workNumber',
    ).map(function ({id, media_value, country_code, status}) {
      return {
        id,
        mediaValue: media_value == '' ? '' : country_code + '-' + media_value,
        status,
      };
    });

    console.log('workNumber Link : ' + JSON.stringify(workNumberLinks));

    let otherNumberLinks = this.state.ArrOtherNo.filter(
      (el) => el.media_type === 'otherNumber',
    ).map(function ({id, media_value, country_code, status}) {
      return {
        id,
        mediaValue: media_value == '' ? '' : country_code + '-' + media_value,
        status,
      };
    });

    console.log('otherNumber Link : ' + JSON.stringify(otherNumberLinks));

    var params = {
      website: websiteLinks,
      socialMail: socialMailLinks,
      instagram: instagramLinks,
      facebook: facebookLinks,
      twitter: twitterLinks,
      youtube: youtubeLinks,
      linkdin: linkdinLinks,
      homeNumber: homeNumberLinks,
      workNumber: workNumberLinks,
      otherNumber: otherNumberLinks,
    };

    console.log('Final Params : ' + JSON.stringify(params));

    this.API_PROFILE_UPDATE(true, params);
  }

  API_PROFILE_UPDATE(isload, params) {
    this.setState({isloading: isload});

    Webservice.post(APIURL.profileUpdate, {
      user_id: this.state.user.user_id,
      email: this.state.RegisterData.email,
      privacy: '0',
      avatar:
        this.state.RegisterData.imgBase64 == null
          ? ''
          : this.state.RegisterData.imgBase64,
      bio: this.state.RegisterData.bio,
      current_lat: this.state.latitude,
      current_long: this.state.longitude,
      socialdata: JSON.stringify(params),
    })
      .then((response) => {
        if (response.data == null) {
          this.setState({isloading: false});
          // alert('error');
          alert(response.originalError.message);
          return;
        }
        //   console.log(response);

        console.log(
          'Get Profile Update Response : ' + JSON.stringify(response),
        );

        if (response.data.status == true) {
          this.storeData(JSON.stringify(response.data.data));
          this.setState({isloading: false});
        } else {
          this.setState({isloading: false});
          this.showAlert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        this.setState({isloading: false});
      });
  }

  //Helper Methods
  storeData = async (value) => {
    try {
      await AsyncStorage.setItem(ConstantKeys.USERDATA, value);

      this.props.navigation.navigate('Congratulation');

      // const props = this.props
      // props.navigation.dispatch(
      //     CommonActions.reset({
      //         index: 0,
      //         routes: [
      //             { name: 'Dashboard' },
      //         ],
      //     })
      // );
    } catch (e) {
      // saving error
    }
  };

  //Action Methods
  btnBackTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  btnNextTap = () => {
    requestAnimationFrame(() => {
      this.createData();
      // this.props.navigation.navigate('Congratulation')
      // console.log(" Final Register Data : "+JSON.stringify(this.state.RegisterData))
    });
  };

  render() {
    let BackIcon = IMG.OtherFlow.BackIcon;
    let BusinessIcon = IMG.OtherFlow.BusinessIcon;
    let SocialIcon = IMG.OtherFlow.SocialIcon;
    let MusicIcon = IMG.OtherFlow.MusicIcon;
    let PaymentIcon = IMG.OtherFlow.PaymentIcon;
    let ExternalLinkIcon = IMG.OtherFlow.ExternalLinkIcon;

    let Background = IMG.OtherFlow.Background;

    let CallIcon = IMG.OtherFlow.CallIcon;
    let SocialMailIcon = IMG.OtherFlow.SocialMailIcon;
    let RightArrowIcon = IMG.OtherFlow.RightArrowIcon;
    let SpotifyIcon = IMG.OtherFlow.SpotifyIcon;
    let PayIcon = IMG.OtherFlow.PayIcon;
    let LinkIcon = IMG.OtherFlow.LinkIcon;
    let WebIcon = IMG.OtherFlow.WebIcon;
    let InstaIcon = IMG.OtherFlow.InstaIcon;
    let FacebookIcon = IMG.OtherFlow.FacebookIcon;
    let TwitterIcon = IMG.OtherFlow.TwitterIcon;
    let YoutubeIcon = IMG.OtherFlow.YoutubeIcon;
    let LinkdInIcon = IMG.OtherFlow.LinkdInIcon;
    let EditIcon = IMG.OtherFlow.EditIcon;
    let RemoveIcon = IMG.OtherFlow.RemoveIcon;
    let AddIcon = IMG.OtherFlow.AddIcon;

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
              <ScrollView style={{height: '100%', width: '100%'}}>
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

                  <View style={{flex: 1, alignItems: 'center'}}>
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

                  <TouchableOpacity
                    style={{
                      marginRight: 20,
                      marginTop: 20,
                      height: 40,
                      width: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 20,
                    }}
                  />
                </View>

                <View style={{marginTop: 10}}>
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
                    Create Profile
                  </Text>

                  <Text
                    style={{
                      marginTop: 15,
                      marginLeft: 20,
                      marginRight: 20,
                      textAlign: 'center',
                      fontSize: SetFontSize.ts30,
                      fontFamily: ConstantKeys.Averta_BOLD,
                      color: CommonColors.whiteColor,
                    }}>
                    {'Your Social Media Accounts'}
                  </Text>

                  <View
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 20,
                      height: 50,
                      backgroundColor: CommonColors.appBarColor,
                      flexDirection: 'row',
                      borderRadius: 10,
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        marginLeft: 10,
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                      }}
                      source={CallIcon}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        color: CommonColors.whiteColor,
                        fontSize: SetFontSize.ts16,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      {this.state.user.mobile}
                    </Text>
                  </View>

                  <View
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 10,
                      height: 50,
                      backgroundColor: CommonColors.appBarColor,
                      flexDirection: 'row',
                      borderRadius: 10,
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        marginLeft: 10,
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                      }}
                      source={SocialMailIcon}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        color: CommonColors.whiteColor,
                        fontSize: SetFontSize.ts16,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      {this.state.user.email}
                    </Text>
                  </View>

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

                  {this.state.ArrHomeNo.length != 0 ? (
                    <View
                      style={{marginTop: 5, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrHomeNo}
                        keyExtractor={(item) => item.itemId}
                        scrollEnabled={false}
                        extraData={this.state}
                        renderItem={({item, index}) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 10,
                            }}>
                            <View
                              style={{
                                flex: 1,
                                backgroundColor: CommonColors.appBarColor,
                                borderRadius: 10,
                                alignItems: 'center',
                                marginRight: 10,
                                height: 50,
                                fontFamily: ConstantKeys.Averta_REGULAR,
                                fontSize: SetFontSize.ts16,
                                flexDirection: 'row',
                              }}>
                              <Image
                                style={{
                                  marginLeft: 10,
                                  height: 30,
                                  width: 30,
                                  resizeMode: 'contain',
                                }}
                                source={CallIcon}
                              />

                              <CountryPicker
                                disable={false}
                                animationType={'slide'}
                                containerStyle={styles.viewCountrystyle}
                                pickerTitleStyle={styles.pickerTitleStyle}
                                selectedCountryTextStyle={
                                  styles.selectedCountryTextStyle
                                }
                                countryNameTextStyle={
                                  styles.countryNameTextStyle
                                }
                                searchBarPlaceHolder={'Search...'}
                                hideCountryFlag={true}
                                hideCountryCode={false}
                                searchBarStyle={styles.searchBarStyle}
                                countryCode={item.country_code}
                                selectedValue={(index) => {
                                  console.log('Country : ' + index);

                                  var newData = this.state.ArrHomeNo;
                                  newData[0].country_code = index;

                                  this.setState({ArrHomeNo: newData});
                                }}
                              />

                              <TextInput
                                placeholder={'Home number'}
                                placeholderTextColor={CommonColors.whiteColor}
                                maxLength={15}
                                keyboardType={'number-pad'}
                                style={{
                                  flex: 1,
                                  height: 50,
                                  color: CommonColors.whiteColor,
                                  fontSize: SetFontSize.ts16,
                                  fontFamily: ConstantKeys.Averta_REGULAR,
                                  marginLeft: 5,
                                }}
                                value={item.media_value}
                                returnKeyType={'done'}
                                onChangeText={(text) => {
                                  var newData = this.state.ArrHomeNo;
                                  newData[index].media_value = text.replace(
                                    /[^0-9]/g,
                                    '',
                                  );

                                  this.setState({ArrHomeNo: newData});
                                }}
                              />
                            </View>

                            <Switch
                              onValueChange={(value) => {
                                var switchStatus = 0;
                                if (value) {
                                  switchStatus = 1;
                                } else {
                                  switchStatus = 0;
                                }
                                var newData = this.state.ArrHomeNo;
                                newData[index].status = switchStatus;

                                this.setState({ArrHomeNo: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />
                          </View>
                        )}
                      />
                    </View>
                  ) : null}

                  {this.state.ArrWorkNo.length != 0 ? (
                    <View
                      style={{marginTop: 5, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrWorkNo}
                        keyExtractor={(item) => item.itemId}
                        scrollEnabled={false}
                        extraData={this.state}
                        renderItem={({item, index}) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 5,
                            }}>
                            <View
                              style={{
                                flex: 1,
                                backgroundColor: CommonColors.appBarColor,
                                borderRadius: 15,
                                alignItems: 'center',
                                marginRight: 10,
                                height: 50,
                                fontFamily: ConstantKeys.Averta_REGULAR,
                                fontSize: SetFontSize.ts16,
                                flexDirection: 'row',
                              }}>
                              <Image
                                style={{
                                  marginLeft: 10,
                                  height: 30,
                                  width: 30,
                                  resizeMode: 'contain',
                                }}
                                source={CallIcon}
                              />

                              <CountryPicker
                                disable={false}
                                animationType={'slide'}
                                containerStyle={styles.viewCountrystyle}
                                pickerTitleStyle={styles.pickerTitleStyle}
                                selectedCountryTextStyle={
                                  styles.selectedCountryTextStyle
                                }
                                countryNameTextStyle={
                                  styles.countryNameTextStyle
                                }
                                searchBarPlaceHolder={'Search...'}
                                hideCountryFlag={true}
                                hideCountryCode={false}
                                searchBarStyle={styles.searchBarStyle}
                                countryCode={item.country_code}
                                selectedValue={(index) => {
                                  console.log('Country : ' + index);

                                  var newData = this.state.ArrWorkNo;
                                  newData[0].country_code = index;

                                  this.setState({ArrWorkNo: newData});
                                }}
                              />

                              <TextInput
                                placeholder={'Work number'}
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
                                value={item.media_value}
                                returnKeyType={'done'}
                                onChangeText={(text) => {
                                  var newData = this.state.ArrWorkNo;
                                  newData[index].media_value = text.replace(
                                    /[^0-9]/g,
                                    '',
                                  );

                                  this.setState({ArrWorkNo: newData});
                                }}
                              />
                            </View>

                            <Switch
                              onValueChange={(value) => {
                                var switchStatus = 0;
                                if (value) {
                                  switchStatus = 1;
                                } else {
                                  switchStatus = 0;
                                }
                                var newData = this.state.ArrWorkNo;
                                newData[index].status = switchStatus;

                                this.setState({ArrWorkNo: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />
                          </View>
                        )}
                      />
                    </View>
                  ) : null}

                  {this.state.ArrOtherNo.length != 0 ? (
                    <View
                      style={{marginTop: 5, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrOtherNo}
                        keyExtractor={(item) => item.itemId}
                        scrollEnabled={false}
                        extraData={this.state}
                        renderItem={({item, index}) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginTop: 5,
                            }}>
                            <View
                              style={{
                                flex: 1,
                                backgroundColor: CommonColors.appBarColor,
                                borderRadius: 15,
                                alignItems: 'center',
                                marginRight: 10,
                                height: 50,
                                fontFamily: ConstantKeys.Averta_REGULAR,
                                fontSize: SetFontSize.ts16,
                                flexDirection: 'row',
                              }}>
                              <Image
                                style={{
                                  marginLeft: 10,
                                  height: 30,
                                  width: 30,
                                  resizeMode: 'contain',
                                }}
                                source={CallIcon}
                              />

                              <CountryPicker
                                disable={false}
                                animationType={'slide'}
                                containerStyle={styles.viewCountrystyle}
                                pickerTitleStyle={styles.pickerTitleStyle}
                                selectedCountryTextStyle={
                                  styles.selectedCountryTextStyle
                                }
                                countryNameTextStyle={
                                  styles.countryNameTextStyle
                                }
                                searchBarPlaceHolder={'Search...'}
                                hideCountryFlag={true}
                                hideCountryCode={false}
                                searchBarStyle={styles.searchBarStyle}
                                countryCode={item.country_code}
                                selectedValue={(index) => {
                                  console.log('Country : ' + index);

                                  var newData = this.state.ArrOtherNo;
                                  newData[0].country_code = index;

                                  this.setState({ArrOtherNo: newData});
                                }}
                              />

                              <TextInput
                                placeholder={'Other number'}
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
                                value={item.media_value}
                                returnKeyType={'done'}
                                onChangeText={(text) => {
                                  var newData = this.state.ArrOtherNo;
                                  newData[index].media_value = text.replace(
                                    /[^0-9]/g,
                                    '',
                                  );

                                  this.setState({ArrOtherNo: newData});
                                }}
                              />
                            </View>

                            <Switch
                              onValueChange={(value) => {
                                var switchStatus = 0;
                                if (value) {
                                  switchStatus = 1;
                                } else {
                                  switchStatus = 0;
                                }
                                var newData = this.state.ArrOtherNo;
                                newData[index].status = switchStatus;

                                this.setState({ArrOtherNo: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />
                          </View>
                        )}
                      />
                    </View>
                  ) : null}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginLeft: 20,
                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Website
                    </Text>
                  </View>

                  {/**********  Website View ***********/}
                  {this.state.ArrWebsite.length != 0 ? (
                    <View
                      style={{marginTop: 15, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrWebsite}
                        keyExtractor={(item) => item.itemId}
                        scrollEnabled={false}
                        extraData={this.state}
                        renderItem={({item, index}) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                height: 50,
                                alignItems: 'center',
                                flexDirection: 'row',
                                flex: 1,
                                marginRight: 10,
                                backgroundColor: CommonColors.appBarColor,
                                borderRadius: 10,
                                marginBottom: 10,
                              }}>
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 15,
                                  marginLeft: 10,
                                  resizeMode: 'contain',
                                }}
                                source={WebIcon}
                              />

                              <TextInput
                                placeholder={'https://google.com'}
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
                                value={item.media_value}
                                returnKeyType={'done'}
                                onChangeText={(text) => {
                                  var newData = this.state.ArrWebsite;
                                  newData[index].media_value = text;

                                  this.setState({ArrWebsite: newData});
                                }}
                              />
                            </View>
                            <Switch
                              onValueChange={(value) => {
                                var switchStatus = 0;
                                if (value) {
                                  switchStatus = 1;
                                } else {
                                  switchStatus = 0;
                                }
                                var newData = this.state.ArrWebsite;
                                newData[index].status = switchStatus;

                                this.setState({ArrWebsite: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />

                            {this.state.ArrWebsite.length != 1 ? (
                              <TouchableOpacity
                                style={{
                                  width: 30,
                                  height: 30,
                                  marginLeft: 5,
                                  resizeMode: 'contain',
                                }}
                                onPress={() => {
                                  var newData = this.state.ArrWebsite;
                                  newData.splice(index, 1);
                                  this.setState({ArrWebsite: newData});
                                }}>
                                <Image
                                  style={{
                                    width: 30,
                                    height: 30,
                                    resizeMode: 'contain',
                                  }}
                                  source={RemoveIcon}
                                />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        )}
                      />
                    </View>
                  ) : null}

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      flexDirection: 'row',
                      height: 50,
                      borderRadius: 10,
                      backgroundColor: CommonColors.appBarColor,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      var WebsiteData = this.state.ArrWebsite;
                      var dict = {};
                      (dict.id = 0),
                        (dict.media_type = 'website'),
                        (dict.media_value = ''),
                        (dict.status = 1);

                      WebsiteData.push(dict);

                      this.setState({ArrWebsite: WebsiteData});
                    }}>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={AddIcon}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Add Website
                    </Text>
                  </TouchableOpacity>

                  {/**********  Emails View ***********/}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginLeft: 20,
                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Emails
                    </Text>
                  </View>

                  {this.state.ArrSocialMails.length != 0 ? (
                    <View
                      style={{marginTop: 15, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrSocialMails}
                        keyExtractor={(item) => item.itemId}
                        scrollEnabled={false}
                        extraData={this.state}
                        renderItem={({item, index}) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                height: 50,
                                alignItems: 'center',
                                flexDirection: 'row',
                                flex: 1,
                                marginRight: 10,
                                backgroundColor: CommonColors.appBarColor,
                                borderRadius: 10,
                                marginBottom: 10,
                              }}>
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 15,
                                  marginLeft: 10,
                                  resizeMode: 'contain',
                                }}
                                source={SocialMailIcon}
                              />

                              <TextInput
                                placeholder={'example@example.com'}
                                placeholderTextColor={CommonColors.whiteColor}
                                style={{
                                  flex: 1,
                                  height: 50,
                                  color: CommonColors.whiteColor,
                                  fontSize: SetFontSize.ts16,
                                  fontFamily: ConstantKeys.Averta_REGULAR,
                                  marginLeft: 5,
                                }}
                                value={item.media_value}
                                returnKeyType={'done'}
                                onChangeText={(text) => {
                                  var newData = this.state.ArrSocialMails;
                                  newData[index].media_value = text;

                                  this.setState({ArrSocialMails: newData});
                                }}
                              />
                            </View>
                            <Switch
                              onValueChange={(value) => {
                                var switchStatus = 0;
                                if (value) {
                                  switchStatus = 1;
                                } else {
                                  switchStatus = 0;
                                }
                                var newData = this.state.ArrSocialMails;
                                newData[index].status = switchStatus;

                                this.setState({ArrSocialMails: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />

                            {this.state.ArrSocialMails.length != 1 ? (
                              <TouchableOpacity
                                style={{width: 30, height: 30, marginLeft: 5}}
                                onPress={() => {
                                  var newData = this.state.ArrSocialMails;
                                  newData.splice(index, 1);
                                  this.setState({ArrSocialMails: newData});
                                }}>
                                <Image
                                  style={{
                                    width: 30,
                                    height: 30,
                                    resizeMode: 'contain',
                                  }}
                                  source={RemoveIcon}
                                />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        )}
                      />
                    </View>
                  ) : null}

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      flexDirection: 'row',
                      height: 50,
                      borderRadius: 10,
                      backgroundColor: CommonColors.appBarColor,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      var SocialMailsData = this.state.ArrSocialMails;
                      var dict = {};
                      (dict.id = 0),
                        (dict.media_type = 'socialMail'),
                        (dict.media_value = ''),
                        (dict.status = 1);

                      SocialMailsData.push(dict);

                      this.setState({ArrSocialMails: SocialMailsData});
                    }}>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={AddIcon}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Add E-Mail
                    </Text>
                  </TouchableOpacity>

                  {/**********  Instagram View ***********/}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginLeft: 20,
                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Instagram
                    </Text>
                  </View>

                  {this.state.ArrInstagram.length != 0 ? (
                    <View
                      style={{marginTop: 15, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrInstagram}
                        keyExtractor={(item) => item.itemId}
                        scrollEnabled={false}
                        extraData={this.state}
                        renderItem={({item, index}) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                height: 50,
                                alignItems: 'center',
                                flexDirection: 'row',
                                flex: 1,
                                marginRight: 10,
                                backgroundColor: CommonColors.appBarColor,
                                borderRadius: 10,
                                marginBottom: 10,
                              }}>
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 15,
                                  marginLeft: 10,
                                  resizeMode: 'contain',
                                }}
                                source={InstaIcon}
                              />

                              <TextInput
                                placeholder={'instagram'}
                                placeholderTextColor={CommonColors.whiteColor}
                                style={{
                                  flex: 1,
                                  height: 50,
                                  color: CommonColors.whiteColor,
                                  fontSize: SetFontSize.ts16,
                                  fontFamily: ConstantKeys.Averta_REGULAR,
                                  marginLeft: 5,
                                }}
                                value={item.media_value}
                                returnKeyType={'done'}
                                onChangeText={(text) => {
                                  var newData = this.state.ArrInstagram;
                                  newData[index].media_value = text;

                                  this.setState({ArrInstagram: newData});
                                }}
                              />
                            </View>
                            <Switch
                              onValueChange={(value) => {
                                var switchStatus = 0;
                                if (value) {
                                  switchStatus = 1;
                                } else {
                                  switchStatus = 0;
                                }
                                var newData = this.state.ArrInstagram;
                                newData[index].status = switchStatus;

                                this.setState({ArrInstagram: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />

                            {this.state.ArrInstagram.length != 1 ? (
                              <TouchableOpacity
                                style={{width: 30, height: 30, marginLeft: 5}}
                                onPress={() => {
                                  var newData = this.state.ArrInstagram;
                                  newData.splice(index, 1);
                                  this.setState({ArrInstagram: newData});
                                }}>
                                <Image
                                  style={{
                                    width: 30,
                                    height: 30,
                                    resizeMode: 'contain',
                                  }}
                                  source={RemoveIcon}
                                />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        )}
                      />
                    </View>
                  ) : null}

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      flexDirection: 'row',
                      height: 50,
                      borderRadius: 10,
                      backgroundColor: CommonColors.appBarColor,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      var InstagramData = this.state.ArrInstagram;
                      var dict = {};
                      (dict.id = 0),
                        (dict.media_type = 'instagram'),
                        (dict.media_value = ''),
                        (dict.status = 1);

                      InstagramData.push(dict);

                      this.setState({ArrInstagram: InstagramData});
                    }}>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={AddIcon}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Add Instagram
                    </Text>
                  </TouchableOpacity>

                  {/**********  Instagram View ***********/}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginLeft: 20,
                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Facebook
                    </Text>
                  </View>

                  {this.state.ArrFacebook.length != 0 ? (
                    <View
                      style={{marginTop: 15, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrFacebook}
                        keyExtractor={(item) => item.itemId}
                        scrollEnabled={false}
                        extraData={this.state}
                        renderItem={({item, index}) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                height: 50,
                                alignItems: 'center',
                                flexDirection: 'row',
                                flex: 1,
                                marginRight: 10,
                                backgroundColor: CommonColors.appBarColor,
                                borderRadius: 10,
                                marginBottom: 10,
                              }}>
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 15,
                                  marginLeft: 10,
                                  resizeMode: 'contain',
                                }}
                                source={FacebookIcon}
                              />

                              <TextInput
                                placeholder={'facebook'}
                                placeholderTextColor={CommonColors.whiteColor}
                                style={{
                                  flex: 1,
                                  height: 50,
                                  color: CommonColors.whiteColor,
                                  fontSize: SetFontSize.ts16,
                                  fontFamily: ConstantKeys.Averta_REGULAR,
                                  marginLeft: 5,
                                }}
                                value={item.media_value}
                                returnKeyType={'done'}
                                onChangeText={(text) => {
                                  var newData = this.state.ArrFacebook;
                                  newData[index].media_value = text;

                                  this.setState({ArrFacebook: newData});
                                }}
                              />
                            </View>
                            <Switch
                              onValueChange={(value) => {
                                var switchStatus = 0;
                                if (value) {
                                  switchStatus = 1;
                                } else {
                                  switchStatus = 0;
                                }
                                var newData = this.state.ArrFacebook;
                                newData[index].status = switchStatus;

                                this.setState({ArrFacebook: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />

                            {this.state.ArrFacebook.length != 1 ? (
                              <TouchableOpacity
                                style={{width: 30, height: 30, marginLeft: 5}}
                                onPress={() => {
                                  var newData = this.state.ArrFacebook;
                                  newData.splice(index, 1);
                                  this.setState({ArrFacebook: newData});
                                }}>
                                <Image
                                  style={{
                                    width: 30,
                                    height: 30,
                                    resizeMode: 'contain',
                                  }}
                                  source={RemoveIcon}
                                />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        )}
                      />
                    </View>
                  ) : null}

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      flexDirection: 'row',
                      height: 50,
                      borderRadius: 10,
                      backgroundColor: CommonColors.appBarColor,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      var FacebookData = this.state.ArrFacebook;
                      var dict = {};
                      (dict.id = 0),
                        (dict.media_type = 'facebook'),
                        (dict.media_value = ''),
                        (dict.status = 1);

                      FacebookData.push(dict);

                      this.setState({ArrFacebook: FacebookData});
                    }}>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={AddIcon}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Add Facebook
                    </Text>
                  </TouchableOpacity>

                  {/**********  Youtube View **********/}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginLeft: 20,
                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      LinkdIn
                    </Text>
                  </View>

                  {this.state.ArrLinkdIn.length != 0 ? (
                    <View
                      style={{marginTop: 15, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrLinkdIn}
                        keyExtractor={(item) => item.itemId}
                        scrollEnabled={false}
                        extraData={this.state}
                        renderItem={({item, index}) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                height: 50,
                                alignItems: 'center',
                                flexDirection: 'row',
                                flex: 1,
                                marginRight: 10,
                                backgroundColor: CommonColors.appBarColor,
                                borderRadius: 10,
                                marginBottom: 10,
                              }}>
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 20,
                                  marginLeft: 10,
                                  resizeMode: 'contain',
                                }}
                                source={LinkdInIcon}
                              />

                              <TextInput
                                placeholder={'LinkdIn'}
                                placeholderTextColor={CommonColors.whiteColor}
                                style={{
                                  flex: 1,
                                  height: 50,
                                  color: CommonColors.whiteColor,
                                  fontSize: SetFontSize.ts16,
                                  fontFamily: ConstantKeys.Averta_REGULAR,
                                  marginLeft: 5,
                                }}
                                value={item.media_value}
                                returnKeyType={'done'}
                                onChangeText={(text) => {
                                  var newData = this.state.ArrLinkdIn;
                                  newData[index].media_value = text;

                                  this.setState({ArrLinkdIn: newData});
                                }}
                              />
                            </View>
                            <Switch
                              onValueChange={(value) => {
                                var switchStatus = 0;
                                if (value) {
                                  switchStatus = 1;
                                } else {
                                  switchStatus = 0;
                                }
                                var newData = this.state.ArrLinkdIn;
                                newData[index].status = switchStatus;

                                this.setState({ArrLinkdIn: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />
                          </View>
                        )}
                      />
                    </View>
                  ) : null}

                  {/**********  Twitter Mails **********/}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                      marginLeft: 20,
                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Twitter
                    </Text>
                  </View>

                  {this.state.ArrTwitter.length != 0 ? (
                    <View
                      style={{marginTop: 15, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrTwitter}
                        keyExtractor={(item) => item.itemId}
                        scrollEnabled={false}
                        extraData={this.state}
                        renderItem={({item, index}) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                height: 50,
                                alignItems: 'center',
                                flexDirection: 'row',
                                flex: 1,
                                marginRight: 10,
                                backgroundColor: CommonColors.appBarColor,
                                borderRadius: 10,
                                marginBottom: 10,
                              }}>
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 20,
                                  marginLeft: 10,
                                  resizeMode: 'center',
                                }}
                                source={TwitterIcon}
                              />

                              <TextInput
                                placeholder={'Twitter'}
                                placeholderTextColor={CommonColors.whiteColor}
                                style={{
                                  flex: 1,
                                  height: 50,
                                  color: CommonColors.whiteColor,
                                  fontSize: SetFontSize.ts16,
                                  fontFamily: ConstantKeys.Averta_REGULAR,
                                  marginLeft: 5,
                                }}
                                value={item.media_value}
                                returnKeyType={'done'}
                                onChangeText={(text) => {
                                  var newData = this.state.ArrTwitter;
                                  newData[index].media_value = text;

                                  this.setState({ArrTwitter: newData});
                                }}
                              />
                            </View>
                            <Switch
                              onValueChange={(value) => {
                                var switchStatus = 0;
                                if (value) {
                                  switchStatus = 1;
                                } else {
                                  switchStatus = 0;
                                }
                                var newData = this.state.ArrTwitter;
                                newData[index].status = switchStatus;

                                this.setState({ArrTwitter: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />

                            {this.state.ArrTwitter.length != 1 ? (
                              <TouchableOpacity
                                style={{width: 30, height: 30, marginLeft: 5}}
                                onPress={() => {
                                  var newData = this.state.ArrTwitter;
                                  newData.splice(index, 1);
                                  this.setState({ArrTwitter: newData});
                                }}>
                                <Image
                                  style={{
                                    width: 30,
                                    height: 30,
                                    resizeMode: 'contain',
                                  }}
                                  source={RemoveIcon}
                                />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        )}
                      />
                    </View>
                  ) : null}

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      flexDirection: 'row',
                      height: 50,
                      borderRadius: 10,
                      backgroundColor: CommonColors.appBarColor,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      var TwitterData = this.state.ArrTwitter;
                      var dict = {};
                      (dict.id = 0),
                        (dict.media_type = 'twitter'),
                        (dict.media_value = ''),
                        (dict.status = 1);

                      TwitterData.push(dict);

                      this.setState({ArrTwitter: TwitterData});
                    }}>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={AddIcon}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Add Twitter
                    </Text>
                  </TouchableOpacity>

                  {/**********  Youtube Mails **********/}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginLeft: 20,
                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Youtube
                    </Text>
                  </View>

                  {this.state.ArrYoutube.length != 0 ? (
                    <View
                      style={{marginTop: 15, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrYoutube}
                        keyExtractor={(item) => item.itemId}
                        scrollEnabled={false}
                        extraData={this.state}
                        renderItem={({item, index}) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                height: 50,
                                alignItems: 'center',
                                flexDirection: 'row',
                                flex: 1,
                                marginRight: 10,
                                backgroundColor: CommonColors.appBarColor,
                                borderRadius: 10,
                                marginBottom: 10,
                              }}>
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 15,
                                  marginLeft: 10,
                                  resizeMode: 'contain',
                                }}
                                source={YoutubeIcon}
                              />

                              <TextInput
                                placeholder={'Youtube'}
                                placeholderTextColor={CommonColors.whiteColor}
                                style={{
                                  flex: 1,
                                  height: 50,
                                  color: CommonColors.whiteColor,
                                  fontSize: SetFontSize.ts16,
                                  fontFamily: ConstantKeys.Averta_REGULAR,
                                  marginLeft: 5,
                                }}
                                value={item.media_value}
                                returnKeyType={'done'}
                                onChangeText={(text) => {
                                  var newData = this.state.ArrYoutube;
                                  newData[index].media_value = text;

                                  this.setState({ArrYoutube: newData});
                                }}
                              />
                            </View>
                            <Switch
                              onValueChange={(value) => {
                                var switchStatus = 0;
                                if (value) {
                                  switchStatus = 1;
                                } else {
                                  switchStatus = 0;
                                }
                                var newData = this.state.ArrYoutube;
                                newData[index].status = switchStatus;

                                this.setState({ArrYoutube: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />

                            {this.state.ArrYoutube.length != 1 ? (
                              <TouchableOpacity
                                style={{width: 30, height: 30, marginLeft: 5}}
                                onPress={() => {
                                  var newData = this.state.ArrYoutube;
                                  newData.splice(index, 1);
                                  this.setState({ArrYoutube: newData});
                                }}>
                                <Image
                                  style={{
                                    width: 30,
                                    height: 30,
                                    resizeMode: 'contain',
                                  }}
                                  source={RemoveIcon}
                                />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        )}
                      />
                    </View>
                  ) : null}

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginBottom: 20,
                      flexDirection: 'row',
                      height: 50,
                      borderRadius: 10,
                      backgroundColor: CommonColors.appBarColor,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      var YoutubeData = this.state.ArrYoutube;
                      var dict = {};
                      (dict.id = 0),
                        (dict.media_type = 'youtube'),
                        (dict.media_value = ''),
                        (dict.status = 1);

                      YoutubeData.push(dict);

                      this.setState({ArrYoutube: YoutubeData});
                    }}>
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                      source={AddIcon}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Add Youtube
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* <TouchableOpacity style={this.state.isDisable ? styles.btnNextDisable : styles.btnNextEnable}
                                disabled={this.state.isDisable}
                                onPress={() => this.btnNextTap()}>
                                <Text style={styles.txtNext}>
                                    Next
                                </Text>
                            </TouchableOpacity> */}

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
                    // disabled={this.state.isDisable}
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
              </ScrollView>
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
  btnNextDisable: {
    marginBottom: 20,
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
    marginBottom: 20,
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
    fontFamily: 'Averta-Regular',
  },
});
