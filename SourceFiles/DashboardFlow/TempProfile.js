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
import {DrawerActions} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import {CommonActions} from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';

export default class TempProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      userData: {},
      user: {},
      profileData: null,
      isTemp: 0,

      SocialData: [],
      MusicData: [],
      CompanyData: [],
      PaymentData: [],
      ExternalLinkData: [],

      SocialSwitch: 0,
      MusicSwitch: 0,
      PaymentSwitch: 0,
      ExLinkSwitch: 0,
    };
  }

  componentDidMount() {
    this.getData();
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

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA);
      if (value !== null) {
        // value previously stored
        console.log('User Data: ' + value);
        var userData = JSON.parse(value);

        await this.setState({userData: userData, user: userData.user});

        this.API_USERDETAILS(true);
      } else {
        console.log('User Data: null ' + value);
      }
    } catch (e) {
      console.log('Error : ' + e);
    }
  };

  // API Get Country
  API_USERDETAILS(isload) {
    this.setState({isloading: isload});

    Webservice.post(APIURL.getTempProfile, {
      user_id: this.state.user.user_id,
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
        console.log('Get User Detail Response : ' + JSON.stringify(response));

        if (response.data.status == true) {
          var userData = response.data.data;
          var user = response.data.data.user;
          this.setState({profileData: user, isTemp: user.is_temp});

          console.log('is Temp : ' + JSON.stringify(user.is_temp));
          var social_data = userData.user.social_data;

          var social = [];
          var music = [];
          var payment = [];
          var externalLink = [];
          var company = userData.user.company_data;

          for (var i = 0; i < social_data.length; i++) {
            var item = social_data[i];

            if (item.media_value != '') {
              if (item.media_type == 'music') {
                music.push(item);
              } else if (item.media_type == 'payment') {
                payment.push(item);
              } else if (item.media_type == 'externalLink') {
                externalLink.push(item);
              } else if (
                item.media_type != 'externalLink' &&
                item.media_type != 'payment' &&
                item.media_type != 'music'
              ) {
                social.push(item);
              } else {
              }
            } else {
            }
          }

          this.setState({
            SocialData: social,
            MusicData: music,
            CompanyData: company,
            PaymentData: payment,
            ExternalLinkData: externalLink,
          });

          // For Manage Header Section Switches

          let socialSwitch = social.filter((item) => item.status == 0);

          console.log('Social Music : ' + JSON.stringify(socialSwitch.length));

          if (socialSwitch.length == 0) {
            this.setState({SocialSwitch: 1});
          } else {
            this.setState({SocialSwitch: 0});
          }

          let musicSwitch = music.filter((item) => item.status == 0);

          console.log('Filter Music : ' + JSON.stringify(musicSwitch.length));

          if (musicSwitch.length == 0) {
            this.setState({MusicSwitch: 1});
          } else {
            this.setState({MusicSwitch: 0});
          }

          let paymentSwitch = payment.filter((item) => item.status == 0);

          console.log(
            'Filter payment : ' + JSON.stringify(paymentSwitch.length),
          );

          if (paymentSwitch.length == 0) {
            this.setState({PaymentSwitch: 1});
          } else {
            this.setState({PaymentSwitch: 0});
          }

          let ExSwitch = externalLink.filter((item) => item.status == 0);

          console.log('Filter payment : ' + JSON.stringify(ExSwitch.length));

          if (ExSwitch.length == 0) {
            this.setState({ExLinkSwitch: 1});
          } else {
            this.setState({ExLinkSwitch: 0});
          }
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
                this.API_USERDETAILS(true);
              },
            },
          ],
          {cancelable: false},
        );
      });
  }

  API_TEMP_ACTIVEINACTIVE(isload) {
    this.setState({isloading: isload});

    Webservice.post(APIURL.tempActiveInactive, {
      user_id: this.state.profileData.user_id,
      is_temp: this.state.isTemp,
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
          'Get Temp Profile Active Inactive Response : ' +
            JSON.stringify(response),
        );

        if (response.data.status == true) {
          this.setState({isloading: false});

          var userData = this.state.userData;
          var user = userData.user;
          user.is_temp = this.state.isTemp;

          userData.user = user;

          console.log('Final USer Update : ' + JSON.stringify(userData));

          this.storeData(JSON.stringify(userData));

          this.showAlert(response.data.message);
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

  API_UPDATE_TEMP_PROFILE(isload, params) {
    this.setState({isloading: isload});

    Webservice.post(APIURL.tempProfileUpdate, {
      user_id: this.state.profileData.user_id,
      resume_file: '',
      privacy: '',
      avatar: '',
      bio: '',
      current_lat: '',
      current_long: '',
      socialdata: JSON.stringify(params),
      resume_file_status: '1',
      resume_link: '',
      resume_link_status: '1',
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
          'Get Temp Profile Update Response : ' + JSON.stringify(response),
        );

        if (response.data.status == true) {
          this.setState({isloading: false});
          Alert.alert('Sucess', 'Profile update successfully!', [
            {
              text: 'Ok',
              onPress: () => {
                this.props.navigation.goBack();
              },
            },
          ]);
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

  btnDoneTap = () => {
    requestAnimationFrame(() => {
      // console.log("Social Data : "+JSON.stringify(this.state.SocialData))

      let websiteLinks = this.state.SocialData.filter(
        (el) => el.media_type == 'website',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('Website Link : ' + JSON.stringify(websiteLinks));

      let socialMailLinks = this.state.SocialData.filter(
        (el) => el.media_type === 'socialMail',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('socialMail Link : ' + JSON.stringify(socialMailLinks));

      let instagramLinks = this.state.SocialData.filter(
        (el) => el.media_type === 'instagram',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('instagram Link : ' + JSON.stringify(instagramLinks));

      let facebookLinks = this.state.SocialData.filter(
        (el) => el.media_type === 'facebook',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('facebook Link : ' + JSON.stringify(facebookLinks));

      let twitterLinks = this.state.SocialData.filter(
        (el) => el.media_type === 'twitter',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('twitter Link : ' + JSON.stringify(twitterLinks));

      let youtubeLinks = this.state.SocialData.filter(
        (el) => el.media_type === 'youtube',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('youtube Link : ' + JSON.stringify(youtubeLinks));

      let linkdinLinks = this.state.SocialData.filter(
        (el) => el.media_type === 'linkdin',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('linkdin Link : ' + JSON.stringify(linkdinLinks));

      let homeNumberLinks = this.state.SocialData.filter(
        (el) => el.media_type === 'homeNumber',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('homeNumber Link : ' + JSON.stringify(homeNumberLinks));

      let workNumberLinks = this.state.SocialData.filter(
        (el) => el.media_type === 'workNumber',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('workNumber Link : ' + JSON.stringify(workNumberLinks));

      let otherNumberLinks = this.state.SocialData.filter(
        (el) => el.media_type === 'otherNumber',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('otherNumber Link : ' + JSON.stringify(otherNumberLinks));

      let musicLinks = this.state.MusicData.filter(
        (el) => el.media_type === 'music',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('music Link : ' + JSON.stringify(musicLinks));

      let paymentLinks = this.state.PaymentData.filter(
        (el) => el.media_type === 'payment',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('payment Link : ' + JSON.stringify(paymentLinks));

      let externalLinks = this.state.ExternalLinkData.filter(
        (el) => el.media_type === 'externalLink',
      ).map(function ({id, media_value, status}) {
        return {id, mediaValue: media_value, status};
      });

      console.log('externalLink Link : ' + JSON.stringify(externalLinks));

      var dict = {};
      dict.website = websiteLinks;
      dict.socialMail = socialMailLinks;
      dict.instagram = instagramLinks;
      dict.facebook = facebookLinks;
      dict.twitter = twitterLinks;
      dict.youtube = youtubeLinks;
      dict.linkdin = linkdinLinks;
      dict.homeNumber = homeNumberLinks;
      dict.workNumber = workNumberLinks;
      dict.otherNumber = otherNumberLinks;
      dict.music = musicLinks;
      dict.payment = paymentLinks;
      dict.externalLink = externalLinks;

      console.log('Final Param : ' + JSON.stringify(dict));

      this.API_UPDATE_TEMP_PROFILE(true, dict);
    });
  };

  switchTempProfileUpdate = async (value) => {
    console.log('Switch Value : ' + value);
    if (value) {
      await this.setState({isTemp: 1});
    } else {
      await this.setState({isTemp: 0});
    }

    this.API_TEMP_ACTIVEINACTIVE(true);
  };

  // Manage Social Switches
  switchSocialUpdate = async (value) => {
    console.log('Social Switch Value : ' + value);
    if (value) {
      const newStatus = this.state.SocialData.map((data) => {
        return {...data, status: 1};
      });

      await this.setState({SocialSwitch: 1, SocialData: newStatus});
    } else {
      const newStatus = this.state.SocialData.map((data) => {
        return {...data, status: 0};
      });

      await this.setState({SocialSwitch: 0, SocialData: newStatus});
    }
  };

  switchSocialItemUpdate = async (value, index) => {
    console.log('Social Item Switch Value : ' + value);

    if (value) {
      // For Switch On
      var data = this.state.SocialData[index];
      let newMarkers = this.state.SocialData.map((el) =>
        el.id === data.id ? {...el, status: 1} : el,
      );

      await this.setState({SocialData: newMarkers});

      let socialSwitch = this.state.SocialData.filter(
        (item) => item.status == 0,
      );

      console.log('Social Filter : ' + JSON.stringify(socialSwitch.length));

      if (socialSwitch.length == 0) {
        this.setState({SocialSwitch: 1});
      } else {
        this.setState({SocialSwitch: 0});
      }
    } else {
      // For Switch Off
      var data = this.state.SocialData[index];
      let newMarkers = this.state.SocialData.map((el) =>
        el.id === data.id ? {...el, status: 0} : el,
      );

      await this.setState({SocialData: newMarkers});

      let socialSwitch = this.state.SocialData.filter(
        (item) => item.status == 0,
      );

      console.log('Social Filter : ' + JSON.stringify(socialSwitch.length));

      if (socialSwitch.length == 0) {
        this.setState({SocialSwitch: 1});
      } else {
        this.setState({SocialSwitch: 0});
      }
    }
  };

  // Manage Music Switches
  switchMusicUpdate = async (value) => {
    console.log('Music Switch Value : ' + value);
    if (value) {
      const newStatus = this.state.MusicData.map((data) => {
        return {...data, status: 1};
      });

      await this.setState({MusicSwitch: 1, MusicData: newStatus});
    } else {
      const newStatus = this.state.MusicData.map((data) => {
        return {...data, status: 0};
      });

      await this.setState({MusicSwitch: 0, MusicData: newStatus});
    }
  };

  switchMusicItemUpdate = async (value, index) => {
    console.log('Music Item Switch Value : ' + value);

    if (value) {
      // For Switch On
      var data = this.state.MusicData[index];
      let newMarkers = this.state.MusicData.map((el) =>
        el.id === data.id ? {...el, status: 1} : el,
      );

      await this.setState({MusicData: newMarkers});

      let MusicSwitch = this.state.MusicData.filter((item) => item.status == 0);

      console.log('Music Filter : ' + JSON.stringify(MusicSwitch.length));

      if (MusicSwitch.length == 0) {
        this.setState({MusicSwitch: 1});
      } else {
        this.setState({MusicSwitch: 0});
      }
    } else {
      // For Switch Off
      var data = this.state.MusicData[index];
      let newMarkers = this.state.MusicData.map((el) =>
        el.id === data.id ? {...el, status: 0} : el,
      );

      await this.setState({MusicData: newMarkers});

      let MusicSwitch = this.state.MusicData.filter((item) => item.status == 0);

      console.log('Music Filter : ' + JSON.stringify(MusicSwitch.length));

      if (MusicSwitch.length == 0) {
        this.setState({MusicSwitch: 1});
      } else {
        this.setState({MusicSwitch: 0});
      }
    }
  };

  // Manage Payment Switches
  switchPaymentUpdate = async (value) => {
    console.log('Payment Switch Value : ' + value);
    if (value) {
      const newStatus = this.state.PaymentData.map((data) => {
        return {...data, status: 1};
      });

      await this.setState({PaymentSwitch: 1, PaymentData: newStatus});
    } else {
      const newStatus = this.state.PaymentData.map((data) => {
        return {...data, status: 0};
      });

      await this.setState({PaymentSwitch: 0, PaymentData: newStatus});
    }
  };

  switchPaymentItemUpdate = async (value, index) => {
    console.log('Payment Item Switch Value : ' + value);

    if (value) {
      // For Switch On
      var data = this.state.PaymentData[index];
      let newMarkers = this.state.PaymentData.map((el) =>
        el.id === data.id ? {...el, status: 1} : el,
      );

      await this.setState({PaymentData: newMarkers});

      let paymentSwitch = this.state.PaymentData.filter(
        (item) => item.status == 0,
      );

      console.log('Payment Filter : ' + JSON.stringify(paymentSwitch.length));

      if (paymentSwitch.length == 0) {
        this.setState({PaymentSwitch: 1});
      } else {
        this.setState({PaymentSwitch: 0});
      }
    } else {
      // For Switch Off
      var data = this.state.PaymentData[index];
      let newMarkers = this.state.PaymentData.map((el) =>
        el.id === data.id ? {...el, status: 0} : el,
      );

      await this.setState({PaymentData: newMarkers});

      let paymentSwitch = this.state.PaymentData.filter(
        (item) => item.status == 0,
      );

      console.log('Payment Filter : ' + JSON.stringify(paymentSwitch.length));

      if (paymentSwitch.length == 0) {
        this.setState({PaymentSwitch: 1});
      } else {
        this.setState({PaymentSwitch: 0});
      }
    }
  };

  // Manage ExLink Switches
  switchExLinksUpdate = async (value) => {
    console.log('ExLink Switch Value : ' + value);
    if (value) {
      const newStatus = this.state.ExternalLinkData.map((data) => {
        return {...data, status: 1};
      });

      await this.setState({ExLinkSwitch: 1, ExternalLinkData: newStatus});
    } else {
      const newStatus = this.state.ExternalLinkData.map((data) => {
        return {...data, status: 0};
      });

      await this.setState({ExLinkSwitch: 0, ExternalLinkData: newStatus});
    }
  };

  switchExLinkItemUpdate = async (value, index) => {
    console.log('ExLink Item Switch Value : ' + value);

    if (value) {
      // For Switch On
      var data = this.state.ExternalLinkData[index];
      let newMarkers = this.state.ExternalLinkData.map((el) =>
        el.id === data.id ? {...el, status: 1} : el,
      );

      await this.setState({ExternalLinkData: newMarkers});

      let exLinkSwitch = this.state.ExternalLinkData.filter(
        (item) => item.status == 0,
      );

      console.log('ExLink Filter : ' + JSON.stringify(exLinkSwitch.length));

      if (exLinkSwitch.length == 0) {
        this.setState({ExLinkSwitch: 1});
      } else {
        this.setState({ExLinkSwitch: 0});
      }
    } else {
      // For Switch Off
      var data = this.state.ExternalLinkData[index];
      let newMarkers = this.state.ExternalLinkData.map((el) =>
        el.id === data.id ? {...el, status: 0} : el,
      );

      await this.setState({ExternalLinkData: newMarkers});

      let exLinkSwitch = this.state.ExternalLinkData.filter(
        (item) => item.status == 0,
      );

      console.log('ExLink Filter : ' + JSON.stringify(exLinkSwitch.length));

      if (exLinkSwitch.length == 0) {
        this.setState({ExLinkSwitch: 1});
      } else {
        this.setState({ExLinkSwitch: 0});
      }
    }
  };

  renderImage(item) {
    if (item.media_type == 'website') {
      return IMG.OtherFlow.WebIcon;
    } else if (item.media_type == 'socialMail') {
      return IMG.OtherFlow.SocialMailIcon;
    } else if (item.media_type == 'instagram') {
      return IMG.OtherFlow.InstaIcon;
    } else if (item.media_type == 'facebook') {
      return IMG.OtherFlow.FacebookIcon;
    } else if (item.media_type == 'twitter') {
      return IMG.OtherFlow.TwitterIcon;
    } else if (item.media_type == 'youtube') {
      return IMG.OtherFlow.YoutubeIcon;
    } else if (item.media_type == 'linkdin') {
      return IMG.OtherFlow.LinkdInIcon;
    } else {
      return IMG.OtherFlow.CallIcon;
    }
  }

  render() {
    let BusinessIcon = IMG.OtherFlow.BusinessIcon;
    let SocialIcon = IMG.OtherFlow.SocialIcon;
    let MusicIcon = IMG.OtherFlow.MusicIcon;
    let PaymentIcon = IMG.OtherFlow.PaymentIcon;
    let ExternalLinkIcon = IMG.OtherFlow.ExternalLinkIcon;
    let BackIcon = IMG.OtherFlow.BackIcon;
    let TickIcon = IMG.OtherFlow.TickIcon;

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

              <Text style={styles.headerText}>Temporary Profile</Text>

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
                    width: 25,
                    height: 25,
                    resizeMode: 'contain',
                    tintColor: CommonColors.arrowColor,
                  }}
                  source={TickIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={{flex: 1}}>
              {this.state.profileData != null ? (
                <ScrollView style={{flex: 1}} bounces={false}>
                  <View style={{width: '100%', height: 250}}>
                    <FastImage
                      source={{
                        uri: String(
                          this.state.userData.asset_url +
                            this.state.profileData.avatar,
                        ),
                      }}
                      style={{flex: 1}}
                      resizeMode={FastImage.resizeMode.cover}
                    />

                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: CommonColors.transprentDark,
                        bottom: 0,
                        width: '100%',
                      }}>
                      <Text
                        style={{
                          marginLeft: 20,
                          marginRight: 20,
                          textAlign: 'left',
                          marginTop: 15,
                          fontSize: SetFontSize.ts25,
                          color: CommonColors.whiteColor,
                          fontFamily: ConstantKeys.Averta_BOLD,
                        }}>
                        {this.state.profileData.name}
                      </Text>

                      {this.state.profileData.bio != '' ? (
                        <Text
                          style={{
                            marginLeft: 20,
                            marginRight: 20,
                            textAlign: 'left',
                            marginTop: 5,
                            fontSize: SetFontSize.ts14,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                            marginBottom: 10,
                          }}>
                          {this.state.profileData.bio}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  <View
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontSize: SetFontSize.ts18,
                        marginRight: 5,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_BOLD,
                      }}>
                      Temporary Profile Deactivate
                    </Text>

                    <Switch
                      onValueChange={(value) =>
                        this.switchTempProfileUpdate(value)
                      }
                      value={this.state.isTemp == 1 ? true : false}
                    />
                  </View>

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 10,
                      height: 50,
                      backgroundColor: CommonColors.appBarColor,
                      flexDirection: 'row',
                      borderRadius: 10,
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      Linking.openURL(`tel:${this.state.profileData.mobile}`)
                    }>
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
                      {this.state.profileData.mobile}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 10,
                      height: 50,
                      backgroundColor: CommonColors.appBarColor,
                      flexDirection: 'row',
                      borderRadius: 10,
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      Linking.openURL(`mailto:${this.state.profileData.email}`)
                    }>
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
                      {this.state.profileData.email}
                    </Text>
                  </TouchableOpacity>

                  {this.state.CompanyData.length != 0 ? (
                    <View
                      style={{
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                          marginLeft: 15,
                          marginRight: 15,
                        }}>
                        <Image source={BusinessIcon} />
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize: SetFontSize.ts16,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          Business
                        </Text>
                      </View>

                      <View style={{marginTop: 5}}>
                        <FlatList
                          data={this.state.CompanyData}
                          keyExtractor={(item) => item.itemId}
                          renderItem={({item, index}) =>
                            item.job_position != '' ? (
                              <TouchableOpacity
                                style={{
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  paddingBottom: 10,
                                  paddingTop: 10,
                                  marginTop: 10,
                                  backgroundColor: CommonColors.appBarColor,
                                  borderRadius: 10,
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                }}
                                onPress={() =>
                                  this.props.navigation.navigate('JobDetail', {
                                    data: JSON.stringify(item),
                                  })
                                }>
                                <Image
                                  style={{
                                    height: 50,
                                    width: 50,
                                    borderRadius: 25,
                                  }}
                                  source={{
                                    uri: String(
                                      this.state.userData.asset_url + item.logo,
                                    ),
                                  }}
                                />

                                <View
                                  style={{flex: 1, justifyContent: 'center'}}>
                                  <Text
                                    style={{
                                      flex: 1,
                                      marginLeft: 10,
                                      fontSize: SetFontSize.ts16,
                                      color: CommonColors.whiteColor,
                                      fontFamily: ConstantKeys.Averta_REGULAR,
                                    }}
                                    numberOfLines={1}>
                                    {item.job_position}
                                  </Text>
                                  <Text
                                    style={{
                                      flex: 1,
                                      marginLeft: 10,
                                      fontSize: SetFontSize.ts14,
                                      color: CommonColors.whiteColor,
                                      fontFamily: ConstantKeys.Averta_REGULAR,
                                    }}
                                    numberOfLines={1}>
                                    {item.name}
                                  </Text>
                                </View>

                                <Image
                                  style={{
                                    height: 15,
                                    width: 15,
                                    resizeMode: 'contain',
                                    tintColor: CommonColors.whiteColor,
                                  }}
                                  source={RightArrowIcon}
                                />
                              </TouchableOpacity>
                            ) : null
                          }
                        />
                      </View>
                    </View>
                  ) : null}

                  {this.state.SocialData.length != 0 ? (
                    <View
                      style={{
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                          marginLeft: 15,
                        }}>
                        <Image source={SocialIcon} />
                        <Text
                          style={{
                            flex: 1,
                            marginLeft: 10,
                            fontSize: SetFontSize.ts16,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          Social Networks
                        </Text>
                        <Switch
                          onValueChange={(value) =>
                            this.switchSocialUpdate(value)
                          }
                          value={this.state.SocialSwitch == 1 ? true : false}
                        />
                      </View>

                      <View style={{marginTop: 5}}>
                        <FlatList
                          data={this.state.SocialData}
                          keyExtractor={(item) => item.itemId}
                          scrollEnabled={false}
                          extraData={this.state}
                          renderItem={({item, index}) =>
                            item.media_value != '' ? (
                              <TouchableOpacity
                                style={{
                                  height: 50,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  backgroundColor: CommonColors.appBarColor,
                                  borderRadius: 10,
                                  marginTop: 10,
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                }}>
                                <Image
                                  style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    resizeMode: 'contain',
                                  }}
                                  source={this.renderImage(item)}
                                />

                                <Text
                                  style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    fontSize: SetFontSize.ts16,
                                    color: CommonColors.whiteColor,
                                    fontFamily: ConstantKeys.Averta_REGULAR,
                                  }}>
                                  {item.media_value}
                                </Text>

                                <Switch
                                  onValueChange={(value) =>
                                    this.switchSocialItemUpdate(value, index)
                                  }
                                  value={item.status == 0 ? false : true}
                                />
                              </TouchableOpacity>
                            ) : null
                          }
                        />
                      </View>
                    </View>
                  ) : null}

                  {this.state.MusicData.length != 0 ? (
                    <View
                      style={{
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                          marginLeft: 15,
                        }}>
                        <Image source={MusicIcon} />
                        <Text
                          style={{
                            flex: 1,
                            marginLeft: 10,
                            fontSize: SetFontSize.ts16,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          Music
                        </Text>
                        <Switch
                          onValueChange={(value) =>
                            this.switchMusicUpdate(value)
                          }
                          value={this.state.MusicSwitch == 1 ? true : false}
                        />
                      </View>

                      <View style={{marginTop: 5}}>
                        <FlatList
                          data={this.state.MusicData}
                          keyExtractor={(item) => item.itemId}
                          scrollEnabled={false}
                          extraData={this.state}
                          renderItem={({item, index}) =>
                            item.media_value != '' ? (
                              <TouchableOpacity
                                style={{
                                  height: 50,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  backgroundColor: CommonColors.appBarColor,
                                  borderRadius: 10,
                                  marginTop: 10,
                                  paddingRight: 10,
                                  paddingLeft: 10,
                                }}>
                                <Image
                                  style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    resizeMode: 'contain',
                                  }}
                                  source={SpotifyIcon}
                                />

                                <Text
                                  style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    fontSize: SetFontSize.ts16,
                                    color: CommonColors.whiteColor,
                                    fontFamily: ConstantKeys.Averta_REGULAR,
                                  }}>
                                  {item.media_value}
                                </Text>

                                <Switch
                                  onValueChange={(value) =>
                                    this.switchMusicItemUpdate(value, index)
                                  }
                                  value={item.status == 0 ? false : true}
                                />
                              </TouchableOpacity>
                            ) : null
                          }
                        />
                      </View>
                    </View>
                  ) : null}

                  {this.state.PaymentData.length != 0 ? (
                    <View
                      style={{
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                          marginLeft: 15,
                        }}>
                        <Image source={PaymentIcon} />
                        <Text
                          style={{
                            flex: 1,
                            marginLeft: 10,
                            fontSize: SetFontSize.ts16,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          Payment
                        </Text>
                        <Switch
                          onValueChange={(value) =>
                            this.switchPaymentUpdate(value)
                          }
                          value={this.state.PaymentSwitch == 1 ? true : false}
                        />
                      </View>

                      <View style={{marginTop: 5}}>
                        <FlatList
                          data={this.state.PaymentData}
                          keyExtractor={(item) => item.itemId}
                          scrollEnabled={false}
                          extraData={this.state}
                          renderItem={({item, index}) =>
                            item.media_value != '' ? (
                              <TouchableOpacity
                                style={{
                                  height: 50,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  backgroundColor: CommonColors.appBarColor,
                                  borderRadius: 10,
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                  marginTop: 10,
                                }}>
                                <Image
                                  style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    resizeMode: 'contain',
                                  }}
                                  source={PayIcon}
                                />

                                <Text
                                  style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    fontSize: SetFontSize.ts16,
                                    color: CommonColors.whiteColor,
                                    fontFamily: ConstantKeys.Averta_REGULAR,
                                  }}>
                                  {item.media_value}
                                </Text>

                                <Switch
                                  onValueChange={(value) =>
                                    this.switchPaymentItemUpdate(value, index)
                                  }
                                  value={item.status == 0 ? false : true}
                                />
                              </TouchableOpacity>
                            ) : null
                          }
                        />
                      </View>
                    </View>
                  ) : null}

                  {this.state.ExternalLinkData.length != 0 ? (
                    <View
                      style={{
                        marginLeft: 20,
                        marginRight: 20,
                        borderRadius: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                          marginLeft: 15,
                        }}>
                        <Image source={ExternalLinkIcon} />
                        <Text
                          style={{
                            flex: 1,
                            marginLeft: 10,
                            fontSize: SetFontSize.ts16,
                            color: CommonColors.whiteColor,
                            fontFamily: ConstantKeys.Averta_REGULAR,
                          }}>
                          External Links
                        </Text>
                        <Switch
                          onValueChange={(value) =>
                            this.switchExLinksUpdate(value)
                          }
                          value={this.state.ExLinkSwitch == 1 ? true : false}
                        />
                      </View>

                      <View style={{marginTop: 5}}>
                        <FlatList
                          data={this.state.ExternalLinkData}
                          keyExtractor={(item) => item.itemId}
                          scrollEnabled={false}
                          extraData={this.state}
                          renderItem={({item, index}) =>
                            item.media_value != '' ? (
                              <TouchableOpacity
                                style={{
                                  height: 50,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  backgroundColor: CommonColors.appBarColor,
                                  borderRadius: 10,
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                  marginTop: 10,
                                }}>
                                <Image
                                  style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    resizeMode: 'contain',
                                  }}
                                  source={LinkIcon}
                                />

                                <Text
                                  style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    fontSize: SetFontSize.ts16,
                                    color: CommonColors.whiteColor,
                                    fontFamily: ConstantKeys.Averta_REGULAR,
                                  }}>
                                  {item.media_value}
                                </Text>

                                <Switch
                                  onValueChange={(value) =>
                                    this.switchExLinkItemUpdate(value, index)
                                  }
                                  value={item.status == 0 ? false : true}
                                />
                              </TouchableOpacity>
                            ) : null
                          }
                        />
                      </View>
                    </View>
                  ) : null}
                </ScrollView>
              ) : null}
              {this.state.isloading ? <LoadingView /> : null}
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
});
