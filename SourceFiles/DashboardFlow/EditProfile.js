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
import DocumentPicker from 'react-native-document-picker';
import Geolocation from '@react-native-community/geolocation';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CountryPicker from '../components/country-picker/CountryPicker';

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      userData: {},
      user: {},

      ProfileImgData: null,

      longitude: 0.0,
      latitude: 0.0,
      switchPrivateProfile: 1,

      txtFullName: '',
      txtBio: '',

      txtResumeURL: '',
      switchResumeURL: 1,

      txtResumeFile: null,
      switchResumeFile: 1,

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

      ArrMusic: [],
      ArrCompany: [],
      ArrPayment: [],
      ArrExternalLink: [],
    };
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

  componentWillUnmount() {}

  getData = async () => {
    this.setState({isloading: true});

    try {
      const value = await AsyncStorage.getItem(ConstantKeys.USERDATA);
      if (value !== null) {
        // value previously stored
        console.log('User Data: ' + JSON.stringify(value));
        var userData = JSON.parse(value);
        var user = userData.user;
        var social_data = user.social_data;

        // For Home Number
        var ArrHome = [];
        var homeDict = {};

        let homenumber = social_data.filter(function (item) {
          return item.media_type == 'homeNumber';
        });
        console.log('Home No : ------- ' + JSON.stringify(homenumber));

        if (homenumber.length != 0) {
          if (homenumber[0].media_value == '') {
            homeDict.media_type = 'homeNumber';
            homeDict.country_code = '91';
            homeDict.media_value = '';
            homeDict.status = 1;
            homeDict.id = homenumber[0].id;
          } else {
            var mobileHome = homenumber[0].media_value;
            var HomeMobile = mobileHome.split('-');

            console.log('Full Home Mobile: ' + JSON.stringify(HomeMobile));

            homeDict.media_type = homenumber[0].media_type;
            homeDict.country_code = HomeMobile[0];
            homeDict.media_value = HomeMobile[1];
            homeDict.status = homenumber[0].status;
            homeDict.id = homenumber[0].id;
          }

          ArrHome.push(homeDict);
        }

        // For Work Number
        var ArrWork = [];
        var workDict = {};

        let worknumber = social_data.filter(function (item) {
          return item.media_type == 'workNumber';
        });
        console.log('work No : ------- ' + JSON.stringify(worknumber));

        if (worknumber.length != 0) {
          if (worknumber[0].media_value == '') {
            workDict.media_type = 'workNumber';
            workDict.country_code = '91';
            workDict.media_value = '';
            workDict.status = 1;
            workDict.id = worknumber[0].id;
          } else {
            var mobilework = worknumber[0].media_value;
            var workMobile = mobilework.split('-');

            console.log('Full work Mobile: ' + JSON.stringify(workMobile));

            workDict.media_type = worknumber[0].media_type;
            workDict.country_code = workMobile[0];
            workDict.media_value = workMobile[1];
            workDict.status = worknumber[0].status;
            workDict.id = worknumber[0].id;
          }

          ArrWork.push(workDict);
        }

        // For Other Number
        var ArrOther = [];
        var otherDict = {};

        let Othernumber = social_data.filter(function (item) {
          return item.media_type == 'otherNumber';
        });
        console.log('Other No : ------- ' + JSON.stringify(Othernumber));

        if (Othernumber.length != 0) {
          if (Othernumber[0].media_value == '') {
            otherDict.media_type = 'otherNumber';
            otherDict.country_code = '91';
            otherDict.media_value = '';
            otherDict.status = 1;
            otherDict.id = Othernumber[0].id;
          } else {
            var mobileOther = Othernumber[0].media_value;
            var OtherMobile = mobileOther.split('-');

            console.log('Full Other Mobile: ' + JSON.stringify(OtherMobile));

            otherDict.media_type = Othernumber[0].media_type;
            otherDict.country_code = OtherMobile[0];
            otherDict.media_value = OtherMobile[1];
            otherDict.status = Othernumber[0].status;
            otherDict.id = Othernumber[0].id;
          }

          console.log('Other Nuber : ' + JSON.stringify(Othernumber));

          ArrOther.push(otherDict);
        }

        var dictResume = {};
        if (user.resume_file != null) {
          dictResume.name = user.resume_file;
          dictResume.uri = '';
        }

        if (user.avatar != null) {
          var dict = {};
          dict.uri = userData.asset_url + user.avatar;
          dict.type = 'image/png';
          dict.base64 = null;

          console.log(' Profile Image get ' + JSON.stringify(dict));

          this.setState({ProfileImgData: dict});
        } else {
          this.setState({ProfileImgData: null});
        }

        this.setState({
          userData: userData,
          user: userData.user,
          is_temp: user.is_temp,

          switchPrivateProfile: user.privacy,

          txtFullName: user.name,
          txtBio: user.bio,

          txtResumeURL: user.resume_link == null ? '' : user.resume_link,
          switchResumeURL:
            user.resume_link_status != null ? user.resume_link_status : 0,

          txtResumeFile: user.resume_file != null ? dictResume : null,
          switchResumeFile:
            user.resume_file_status != null ? user.resume_file_status : 0,

          ArrHomeNo: ArrHome,
          ArrWorkNo: ArrWork,
          ArrOtherNo: ArrOther,
        });

        var website = social_data.filter(function (item) {
          return item.media_type == 'website';
        });

        if (website.length == 0) {
          var dict = {};
          dict.media_type = 'website';
          dict.media_value = '';
          dict.status = 1;
          dict.id = 0;

          website.push(dict);
        } else {
        }

        var emails = social_data.filter(function (item) {
          return item.media_type == 'socialMail';
        });

        if (emails.length == 0) {
          var dict = {};
          dict.media_type = 'socialMail';
          dict.media_value = '';
          dict.status = 1;
          dict.id = 0;

          emails.push(dict);
        } else {
        }

        var instagram = social_data.filter(function (item) {
          return item.media_type == 'instagram';
        });

        if (instagram.length == 0) {
          var dict = {};
          dict.media_type = 'instagram';
          dict.media_value = '';
          dict.status = 1;
          dict.id = 0;

          instagram.push(dict);
        } else {
        }

        var facebook = social_data.filter(function (item) {
          return item.media_type == 'facebook';
        });

        if (facebook.length == 0) {
          var dict = {};
          dict.media_type = 'facebook';
          dict.media_value = '';
          dict.status = 1;
          dict.id = 0;

          facebook.push(dict);
        } else {
        }

        var twitter = social_data.filter(function (item) {
          return item.media_type == 'twitter';
        });

        if (twitter.length == 0) {
          var dict = {};
          dict.media_type = 'twitter';
          dict.media_value = '';
          dict.status = 1;
          dict.id = 0;

          twitter.push(dict);
        } else {
        }

        var youtube = social_data.filter(function (item) {
          return item.media_type == 'youtube';
        });

        if (youtube.length == 0) {
          var dict = {};
          dict.media_type = 'youtube';
          dict.media_value = '';
          dict.status = 1;
          dict.id = 0;

          youtube.push(dict);
        } else {
        }

        var linkdin = social_data.filter(function (item) {
          return item.media_type == 'linkdin';
        });

        if (linkdin.length == 0) {
          var dict = {};
          dict.media_type = 'linkdin';
          dict.media_value = '';
          dict.status = 1;
          dict.id = 0;

          linkdin.push(dict);
        } else {
        }

        var music = social_data.filter(function (item) {
          return item.media_type == 'music';
        });

        if (music.length == 0) {
          var dict = {};
          dict.media_type = 'music';
          dict.media_value = '';
          dict.status = 1;
          dict.id = 0;

          music.push(dict);
        } else {
        }

        var payment = social_data.filter(function (item) {
          return item.media_type == 'payment';
        });

        if (payment.length == 0) {
          var dict = {};
          dict.media_type = 'payment';
          dict.media_value = '';
          dict.status = 1;
          dict.id = 0;

          payment.push(dict);
        } else {
        }

        var externalLink = social_data.filter(function (item) {
          return item.media_type == 'externalLink';
        });

        if (externalLink.length == 0) {
          var dict = {};
          dict.media_type = 'externalLink';
          dict.media_value = '';
          dict.status = 1;
          dict.id = 0;

          externalLink.push(dict);
        } else {
        }

        var company = userData.user.company_data;

        this.setState({
          SocialData: social_data,

          ArrWebsite: website,
          ArrSocialMails: emails,
          ArrInstagram: instagram,
          ArrFacebook: facebook,
          ArrTwitter: twitter,
          ArrYoutube: youtube,
          ArrLinkdIn: linkdin,
          ArrMusic: music,
          ArrCompany: company,
          ArrPayment: payment,
          ArrExternalLink: externalLink,
          isloading: false,
        });
      } else {
        console.log('User Data: null ' + value);
        this.setState({isloading: false});
      }
    } catch (e) {
      this.setState({isloading: false});
      console.log('Error : ' + e);
    }
  };

  // API Edit Profile
  API_EDIT_PROFILE(isload, social_data) {
    this.setState({isloading: isload});

    var body = new FormData();
    if (this.state.txtResumeFile != null) {
      if (this.state.txtResumeFile.uri != '') {
        body.append('resume_file', this.state.txtResumeFile);
      } else {
        body.append('resume_file', '');
      }
    } else {
      body.append('resume_file', '');
    }

    body.append('user_id', this.state.user.user_id);
    body.append('privacy', this.state.switchPrivateProfile);

    if (this.state.ProfileImgData != null) {
      if (this.state.ProfileImgData.base64 != null) {
        console.log(' Profile Base64 get');
        body.append('avatar', this.state.ProfileImgData.base64);
      } else {
        console.log(' Profile Base64 Not get');
        body.append('avatar', '');
      }
    } else {
      console.log(' Profile Base64 Not get');
      body.append('avatar', '');
    }

    body.append('bio', this.state.txtBio);
    body.append('current_lat', this.state.latitude);
    body.append('current_long', this.state.longitude);
    body.append('socialdata', JSON.stringify(social_data));
    body.append('resume_file_status', this.state.switchResumeFile);
    body.append('resume_link', this.state.txtResumeURL);
    body.append('resume_link_status', this.state.switchResumeURL);

    console.log(' Final Body : ' + JSON.stringify(body));
    Webservice.setHeaders({
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    });
    Webservice.post(APIURL.loginProfileUpdate, body)
      .then((response) => {
        if (response.data == null) {
          this.setState({isloading: false});
          // alert('error');
          alert(response.originalError.message);
          return;
        }
        //   console.log(response);
        this.setState({isloading: false});
        console.log('Get Edit Profile Response : ' + JSON.stringify(response));

        if (response.data.status == true) {
          var UserData = response.data.data;

          this.showAlert(response.data.message);
          this.storeData(JSON.stringify(UserData));
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
                this.API_EDIT_PROFILE(true, social_data);
              },
            },
          ],
          {cancelable: false},
        );
      });
  }

  //API Delete Social Data
  API_SOCIAL_DELETE(isload, item, index) {
    this.setState({isloading: isload});
    Webservice.post(APIURL.socialDelete, {
      user_id: this.state.user.user_id,
      social_id: item.id,
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
          'Get Social Delete Response : ' + JSON.stringify(response.data),
        );

        if (response.data.status) {
          this.setState({isloading: false});

          //Delete single record from array
          if (item.media_type == 'website') {
            var newData = this.state.ArrWebsite;
            newData.splice(index, 1);
            this.setState({ArrWebsite: newData});
          } else if (item.media_type == 'socialMail') {
            var newData = this.state.ArrSocialMails;
            newData.splice(index, 1);
            this.setState({ArrSocialMails: newData});
          } else if (item.media_type == 'instagram') {
            var newData = this.state.ArrInstagram;
            newData.splice(index, 1);
            this.setState({ArrInstagram: newData});
          } else if (item.media_type == 'facebook') {
            var newData = this.state.ArrFacebook;
            newData.splice(index, 1);
            this.setState({ArrFacebook: newData});
          } else if (item.media_type == 'twitter') {
            var newData = this.state.ArrTwitter;
            newData.splice(index, 1);
            this.setState({ArrTwitter: newData});
          } else if (item.media_type == 'youtube') {
            var newData = this.state.ArrYoutube;
            newData.splice(index, 1);
            this.setState({ArrYoutube: newData});
          } else if (item.media_type == 'music') {
            var newData = this.state.ArrMusic;
            newData.splice(index, 1);
            this.setState({ArrMusic: newData});
          } else if (item.media_type == 'externalLink') {
            var newData = this.state.ArrExternalLink;
            newData.splice(index, 1);
            this.setState({ArrExternalLink: newData});
          } else {
            //payment
            var newData = this.state.ArrPayment;
            newData.splice(index, 1);
            this.setState({ArrPayment: newData});
          }
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

      this.props.navigation.goBack();
    } catch (e) {
      // saving error
    }
  };

  // Action Methods
  btnBackTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  btnDoneTap = () => {
    requestAnimationFrame(() => {
      Alert.alert('Alert', 'Are you sure you want to edit profile?', [
        {
          text: 'No',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: 'Yes',
          onPress: () => {
            this.createData();
          },
        },
      ]);
    });
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
      return {id, mediaValue: country_code + '-' + media_value, status};
    });

    console.log('homeNumber Link : ' + JSON.stringify(homeNumberLinks));

    let workNumberLinks = this.state.ArrWorkNo.filter(
      (el) => el.media_type === 'workNumber',
    ).map(function ({id, media_value, country_code, status}) {
      return {id, mediaValue: country_code + '-' + media_value, status};
    });

    console.log('workNumber Link : ' + JSON.stringify(workNumberLinks));

    let otherNumberLinks = this.state.ArrOtherNo.filter(
      (el) => el.media_type === 'otherNumber',
    ).map(function ({id, media_value, country_code, status}) {
      return {id, mediaValue: country_code + '-' + media_value, status};
    });

    console.log('otherNumber Link : ' + JSON.stringify(otherNumberLinks));

    let musicLinks = this.state.ArrMusic.filter(
      (el) => el.media_type === 'music',
    ).map(function ({id, media_value, status}) {
      return {id, mediaValue: media_value, status};
    });

    console.log('music Link : ' + JSON.stringify(musicLinks));

    let paymentLinks = this.state.ArrPayment.filter(
      (el) => el.media_type === 'payment',
    ).map(function ({id, media_value, status}) {
      return {id, mediaValue: media_value, status};
    });

    console.log('payment Link : ' + JSON.stringify(paymentLinks));

    let externalLinks = this.state.ArrExternalLink.filter(
      (el) => el.media_type === 'externalLink',
    ).map(function ({id, media_value, status}) {
      return {id, mediaValue: media_value, status};
    });

    console.log('externalLink Link : ' + JSON.stringify(externalLinks));

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
      music: musicLinks,
      payment: paymentLinks,
      externalLink: externalLinks,
    };

    console.log('Final Params : ' + JSON.stringify(params));

    this.API_EDIT_PROFILE(true, params);
  }

  btnChooseResumeFile = async () => {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      this.setState({txtResumeFile: res});

      console.log(
        'Selected File : ' + res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  btnDeleteWebsite = (item, index) => {
    requestAnimationFrame(() => {
      if (item.id == 0) {
        var newData = this.state.ArrWebsite;

        newData.splice(index, 1);

        this.setState({ArrWebsite: newData});
      } else {
        // alert(item.id)
        this.API_SOCIAL_DELETE(true, item, index);
      }
    });
  };

  btnDeleteEmail = (item, index) => {
    requestAnimationFrame(() => {
      if (item.id == 0) {
        var newData = this.state.ArrSocialMails;

        newData.splice(index, 1);

        this.setState({ArrSocialMails: newData});
      } else {
        this.API_SOCIAL_DELETE(true, item, index);
      }
    });
  };

  btnDeleteInstagram = (item, index) => {
    requestAnimationFrame(() => {
      if (item.id == 0) {
        var newData = this.state.ArrInstagram;

        newData.splice(index, 1);

        this.setState({ArrInstagram: newData});
      } else {
        this.API_SOCIAL_DELETE(true, item, index);
      }
    });
  };

  btnDeleteFacebook = (item, index) => {
    requestAnimationFrame(() => {
      if (item.id == 0) {
        var newData = this.state.ArrFacebook;

        newData.splice(index, 1);

        this.setState({ArrFacebook: newData});
      } else {
        this.API_SOCIAL_DELETE(true, item, index);
      }
    });
  };

  btnDeleteTwitter = (item, index) => {
    requestAnimationFrame(() => {
      if (item.id == 0) {
        var newData = this.state.ArrTwitter;

        newData.splice(index, 1);

        this.setState({ArrTwitter: newData});
      } else {
        this.API_SOCIAL_DELETE(true, item, index);
      }
    });
  };

  btnDeleteYoutube = (item, index) => {
    requestAnimationFrame(() => {
      if (item.id == 0) {
        var newData = this.state.ArrYoutube;

        newData.splice(index, 1);

        this.setState({ArrYoutube: newData});
      } else {
        this.API_SOCIAL_DELETE(true, item, index);
      }
    });
  };

  btnDeleteMusic = (item, index) => {
    requestAnimationFrame(() => {
      if (item.id == 0) {
        var newData = this.state.ArrMusic;

        newData.splice(index, 1);

        this.setState({ArrMusic: newData});
      } else {
        this.API_SOCIAL_DELETE(true, item, index);
      }
    });
  };

  btnDeletePayment = (item, index) => {
    requestAnimationFrame(() => {
      if (item.id == 0) {
        var newData = this.state.ArrPayment;

        newData.splice(index, 1);

        this.setState({ArrPayment: newData});
      } else {
        this.API_SOCIAL_DELETE(true, item, index);
      }
    });
  };

  btnDeleteExLinks = (item, index) => {
    requestAnimationFrame(() => {
      if (item.id == 0) {
        var newData = this.state.ArrExternalLink;

        newData.splice(index, 1);

        this.setState({ArrExternalLink: newData});
      } else {
        this.API_SOCIAL_DELETE(true, item, index);
      }
    });
  };

  btnSelectImage = () => {
    this.setState({isloading: true});

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
                this.setState({isloading: false});

                console.log(JSON.stringify(response));

                if (response.didCancel) {
                  console.log('User cancelled photo picker');

                  this.setState({loading: false});
                } else if (response.errorCode) {
                  console.log('ImagePicker Error: ', response.errorCode);
                  this.setState({loading: false});

                  if (response.errorCode == 'permission') {
                    this.setState({isloading: false});
                    alert('Please allow Camera permission from Setting');
                  }
                } else if (response.customButton) {
                  console.log(
                    'User tapped custom button: ',
                    response.customButton,
                  );
                } else {
                  this.setState({ProfileImgData: response, isloading: false});
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

                this.setState({isloading: false});

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
                  this.setState({ProfileImgData: response, isloading: false});
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

  updateData = (data) => {
    console.log('Selected data', data);

    var CompanyData = JSON.parse(data);

    // var compData = this.state.ArrCompany

    this.setState({ArrCompany: CompanyData.company});
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
    let PrivacyIcon = IMG.OtherFlow.PrivacyIcon;
    let AddIcon = IMG.OtherFlow.AddIcon;
    let RemoveIcon = IMG.OtherFlow.RemoveIcon;

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

              <Text style={styles.headerText}>Edit Profile</Text>

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
              {this.state.userData != null ? (
                <ScrollView style={{flex: 1}} bounces={false}>
                  {this.state.ProfileImgData != null ? (
                    <View
                      style={{
                        marginTop: 20,
                        alignSelf: 'center',
                        width: 150,
                        height: 150,
                        borderRadius: 75,
                        backgroundColor: CommonColors.whiteColor,
                        shadowColor: CommonColors.blackColor,
                        shadowOpacity: 0.2,
                        shadowRadius: 3,
                        elevation: 3,
                        shadowOffset: {
                          height: 3,
                          width: 0,
                        },
                      }}>
                      <FastImage
                        style={{width: 150, height: 150, borderRadius: 75}}
                        source={{uri: this.state.ProfileImgData.uri}}
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
                  ) : null}

                  <Text
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 20,
                      fontSize: SetFontSize.ts16,
                      color: CommonColors.whiteColor,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                    }}>
                    Privacy
                  </Text>
                  <View
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 15,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        marginRight: 15,
                        height: 50,
                        flexDirection: 'row',
                        borderRadius: 15,
                        alignItems: 'center',
                        backgroundColor: CommonColors.appBarColor,
                      }}>
                      <Image
                        style={{
                          marginLeft: 10,
                          height: 30,
                          width: 30,
                          resizeMode: 'contain',
                        }}
                        source={PrivacyIcon}
                      />
                      <Text
                        style={{
                          marginLeft: 10,
                          color: CommonColors.whiteColor,
                          fontSize: SetFontSize.ts16,
                          fontFamily: ConstantKeys.Averta_REGULAR,
                        }}>
                        Private Profile
                      </Text>
                    </View>

                    <Switch
                      thumbColor={CommonColors.whiteColor}
                      onValueChange={(value) =>
                        this.setState({
                          switchPrivateProfile: value == true ? 1 : 0,
                        })
                      }
                      value={
                        this.state.switchPrivateProfile == 1 ? true : false
                      }
                    />
                  </View>

                  <Text
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 5,
                      fontSize: SetFontSize.ts16,
                      color: CommonColors.whiteColor,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                    }}>
                    Your Mobile Number
                  </Text>
                  <View
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 15,
                      height: 50,
                      backgroundColor: CommonColors.appBarColor,
                      flexDirection: 'row',
                      borderRadius: 15,
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

                  <Text
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 20,
                      fontSize: SetFontSize.ts16,
                      color: CommonColors.whiteColor,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                    }}>
                    Your E-mail
                  </Text>
                  <View
                    style={{
                      marginBottom: 20,
                      marginLeft: 20,
                      marginRight: 20,
                      marginTop: 10,
                      height: 50,
                      backgroundColor: CommonColors.appBarColor,
                      flexDirection: 'row',
                      borderRadius: 15,
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

                  <Text
                    style={{
                      marginLeft: 20,
                      color: CommonColors.whiteColor,
                      fontSize: SetFontSize.ts16,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                    }}>
                    Your Name
                  </Text>

                  <TextInput
                    placeholder={'Full Name'}
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
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginTop: 10,
                    }}
                    value={this.state.txtFullName}
                    returnKeyType={'done'}
                    onChangeText={async (txtFullName) => {
                      await this.setState({
                        txtFullName: txtFullName.replace(
                          /[^a-z,^A-Z,^\s]/g,
                          '',
                        ),
                      });
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 20,
                      color: CommonColors.whiteColor,
                      fontSize: SetFontSize.ts16,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                      marginTop: 20,
                    }}>
                    Bio
                  </Text>

                  <TextInput
                    placeholder={'Delivery Address'}
                    keyboardType={'default'}
                    multiline={true}
                    placeholderTextColor={CommonColors.whiteColor}
                    maxLength={280}
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      flex: 1,
                      marginTop: 10,
                      color: CommonColors.whiteColor,
                      fontSize: SetFontSize.ts16,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                      backgroundColor: CommonColors.appBarColor,
                      borderRadius: 10,
                      padding: 10,
                      minHeight: 100,
                    }}
                    value={this.state.txtBio}
                    onChangeText={(txtBio) => {
                      this.setState({txtBio: txtBio});
                    }}
                  />

                  <Text
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      color: CommonColors.whiteColor,
                      fontSize: SetFontSize.ts14,
                      fontFamily: ConstantKeys.Averta_REGULAR,
                      marginTop: 5,
                      textAlign: 'right',
                    }}>
                    {this.state.txtBio.length}/280
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 15,
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

                  {this.state.ArrCompany.length != 0 ? (
                    <View>
                      <View style={{marginTop: 10}}>
                        <FlatList
                          data={this.state.ArrCompany}
                          keyExtractor={(item) => item.itemId}
                          renderItem={({item, index}) =>
                            item.job_position != '' ? (
                              <TouchableOpacity
                                style={{
                                  marginTop: 5,
                                  marginBottom: 10,
                                  marginLeft: 20,
                                  marginRight: 20,
                                  borderRadius: 15,
                                  padding: 15,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  backgroundColor: CommonColors.appBarColor,
                                }}
                                onPress={() =>
                                  this.props.navigation.navigate('AddJob', {
                                    company_data: JSON.stringify(item),
                                    updateData: this.updateData.bind(this),
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
                                      fontFamily: ConstantKeys.Averta_BOLD,
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

                  <TouchableOpacity
                    style={{
                      marginTop: 5,
                      marginLeft: 20,
                      marginRight: 20,
                      flexDirection: 'row',
                      height: 50,
                      borderRadius: 15,
                      backgroundColor: CommonColors.appBarColor,
                      alignItems: 'center',
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('AddJob', {
                        company_data: null,
                        updateData: this.updateData.bind(this),
                      })
                    }>
                    <Image
                      style={{
                        height: 25,
                        width: 25,
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
                      Add New
                    </Text>
                  </TouchableOpacity>

                  {/************  Resume View  ***************/}

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
                      Resume
                    </Text>
                  </View>

                  <View
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      marginTop: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 15,
                    }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        marginRight: 10,
                        height: 50,
                        backgroundColor: CommonColors.appBarColor,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 10,
                      }}
                      onPress={() => this.btnChooseResumeFile()}>
                      <Image
                        style={{
                          marginLeft: 10,
                          height: 30,
                          width: 30,
                          tintColor: CommonColors.arrowColor,
                        }}
                        source={AddIcon}
                      />
                      <Text
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          color: CommonColors.whiteColor,
                          fontSize: SetFontSize.ts16,
                          fontFamily: ConstantKeys.Averta_REGULAR,
                        }}
                        numberOfLines={1}>
                        {this.state.txtResumeFile == null
                          ? 'Choose File'
                          : this.state.txtResumeFile.name}
                      </Text>
                    </TouchableOpacity>

                    <Switch
                      onValueChange={(value) =>
                        this.setState({switchResumeFile: value == true ? 1 : 0})
                      }
                      value={this.state.switchResumeFile == 1 ? true : false}
                    />
                  </View>

                  <View
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        marginRight: 10,
                        height: 50,
                        backgroundColor: CommonColors.appBarColor,
                        flexDirection: 'row',
                        borderRadius: 10,
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{marginLeft: 10, height: 30, width: 30}}
                        source={EditIcon}
                      />

                      <TextInput
                        placeholder={'Tap to edit URL'}
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
                        value={this.state.txtResumeURL}
                        returnKeyType={'done'}
                        onChangeText={(text) => {
                          this.setState({txtResumeURL: text});
                        }}
                      />
                    </View>

                    <Switch
                      onValueChange={(value) =>
                        this.setState({switchResumeURL: value == true ? 1 : 0})
                      }
                      value={this.state.switchResumeURL == 1 ? true : false}
                    />
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

                                  var newData = this.state.ArrHomeNo;
                                  newData[0].country_code = index;

                                  this.setState({ArrHomeNo: newData});
                                }}
                              />

                              <TextInput
                                placeholder={'Home number'}
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
                                style={{marginLeft: 10, height: 30, width: 30}}
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
                                borderRadius: 15,
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
                                style={{width: 30, height: 30, marginLeft: 5}}
                                onPress={() =>
                                  this.btnDeleteWebsite(item, index)
                                }>
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
                      backgroundColor: CommonColors.appBarColor,
                      borderRadius: 10,
                      height: 50,
                      borderRadius: 15,
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

                  {/**********  Social Mails **********/}
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
                                  borderRadius: 20,
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
                                onPress={() =>
                                  this.btnDeleteEmail(item, index)
                                }>
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
                      alignItems: 'center',
                      backgroundColor: CommonColors.appBarColor,
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

                  {/**********  Instagram Mails **********/}
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
                                onPress={() =>
                                  this.btnDeleteInstagram(item, index)
                                }>
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

                  {/**********  Facebook Mails **********/}
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
                                borderRadius: 15,
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
                                onPress={() =>
                                  this.btnDeleteFacebook(item, index)
                                }>
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
                                backgroundColor: CommonColors.whiteColor,
                                borderRadius: 10,
                                marginBottom: 10,
                                backgroundColor: CommonColors.appBarColor,
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
                                backgroundColor: CommonColors.whiteColor,
                                borderRadius: 10,
                                marginBottom: 10,
                                backgroundColor: CommonColors.appBarColor,
                              }}>
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 20,
                                  marginLeft: 10,
                                  resizeMode: 'contain',
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
                                onPress={() =>
                                  this.btnDeleteTwitter(item, index)
                                }>
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
                                backgroundColor: CommonColors.whiteColor,
                                borderRadius: 15,
                                marginBottom: 10,
                                backgroundColor: CommonColors.appBarColor,
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
                                onPress={() =>
                                  this.btnDeleteYoutube(item, index)
                                }>
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

                  {/**************  Music View  ****************/}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginLeft: 20,
                      marginRight: 20,
                    }}>
                    <Image source={MusicIcon} />
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Music
                    </Text>
                  </View>

                  {this.state.ArrMusic.length != 0 ? (
                    <View
                      style={{marginTop: 15, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrMusic}
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
                                backgroundColor: CommonColors.whiteColor,
                                borderRadius: 10,
                                marginBottom: 10,
                                backgroundColor: CommonColors.appBarColor,
                              }}>
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 20,
                                  marginLeft: 10,
                                  resizeMode: 'contain',
                                }}
                                source={SpotifyIcon}
                              />

                              <TextInput
                                placeholder={'Music'}
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
                                  var newData = this.state.ArrMusic;
                                  newData[index].media_value = text;

                                  this.setState({ArrMusic: newData});
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
                                var newData = this.state.ArrMusic;
                                newData[index].status = switchStatus;

                                this.setState({ArrMusic: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />

                            {this.state.ArrMusic.length != 1 ? (
                              <TouchableOpacity
                                style={{width: 30, height: 30, marginLeft: 5}}
                                onPress={() =>
                                  this.btnDeleteMusic(item, index)
                                }>
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
                      var MusicData = this.state.ArrMusic;
                      var dict = {};
                      (dict.id = 0),
                        (dict.media_type = 'music'),
                        (dict.media_value = ''),
                        (dict.status = 1);

                      MusicData.push(dict);

                      this.setState({ArrMusic: MusicData});
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
                      Add Music
                    </Text>
                  </TouchableOpacity>

                  {/**************  Payment View  ****************/}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginLeft: 20,
                      marginRight: 20,
                    }}>
                    <Image source={PaymentIcon} />
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      Payment
                    </Text>
                  </View>

                  {this.state.ArrPayment.length != 0 ? (
                    <View
                      style={{marginTop: 15, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrPayment}
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
                                backgroundColor: CommonColors.whiteColor,
                                borderRadius: 10,
                                marginBottom: 10,
                                backgroundColor: CommonColors.appBarColor,
                              }}>
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 20,
                                  marginLeft: 10,
                                  resizeMode: 'contain',
                                }}
                                source={PayIcon}
                              />

                              <TextInput
                                placeholder={'Payment'}
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
                                  var newData = this.state.ArrPayment;
                                  newData[index].media_value = text;

                                  this.setState({ArrPayment: newData});
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
                                var newData = this.state.ArrPayment;
                                newData[index].status = switchStatus;

                                this.setState({ArrPayment: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />

                            {this.state.ArrPayment.length != 1 ? (
                              <TouchableOpacity
                                style={{width: 30, height: 30, marginLeft: 5}}
                                onPress={() =>
                                  this.btnDeletePayment(item, index)
                                }>
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
                      var PaymentData = this.state.ArrPayment;
                      var dict = {};
                      (dict.id = 0),
                        (dict.media_type = 'payment'),
                        (dict.media_value = ''),
                        (dict.status = 1);

                      PaymentData.push(dict);

                      this.setState({ArrPayment: PaymentData});
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
                      Add Payment
                    </Text>
                  </TouchableOpacity>

                  {/**************  External Link View  ****************/}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 20,
                      marginLeft: 20,
                      marginRight: 20,
                    }}>
                    <Image source={PaymentIcon} />
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: SetFontSize.ts16,
                        color: CommonColors.whiteColor,
                        fontFamily: ConstantKeys.Averta_REGULAR,
                      }}>
                      External Links
                    </Text>
                  </View>

                  {this.state.ArrExternalLink.length != 0 ? (
                    <View
                      style={{marginTop: 15, marginLeft: 20, marginRight: 20}}>
                      <FlatList
                        data={this.state.ArrExternalLink}
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
                                backgroundColor: CommonColors.whiteColor,
                                borderRadius: 10,
                                marginBottom: 10,
                                backgroundColor: CommonColors.appBarColor,
                              }}>
                              <Image
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: 20,
                                  marginLeft: 10,
                                  resizeMode: 'contain',
                                }}
                                source={LinkIcon}
                              />

                              <TextInput
                                placeholder={'External Link'}
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
                                value={item.media_value}
                                returnKeyType={'done'}
                                onChangeText={(text) => {
                                  var newData = this.state.ArrExternalLink;
                                  newData[index].media_value = text;

                                  this.setState({ArrExternalLink: newData});
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
                                var newData = this.state.ArrExternalLink;
                                newData[index].status = switchStatus;

                                this.setState({ArrExternalLink: newData});
                              }}
                              value={item.status == 1 ? true : false}
                            />

                            {this.state.ArrExternalLink.length != 1 ? (
                              <TouchableOpacity
                                style={{width: 30, height: 30, marginLeft: 5}}
                                onPress={() =>
                                  this.btnDeleteExLinks(item, index)
                                }>
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
                      borderRadius: 15,
                      backgroundColor: CommonColors.appBarColor,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      var ExternalLinkData = this.state.ArrExternalLink;
                      var dict = {};
                      (dict.id = 0),
                        (dict.media_type = 'externalLink'),
                        (dict.media_value = ''),
                        (dict.status = 1);

                      ExternalLinkData.push(dict);

                      this.setState({ArrExternalLink: ExternalLinkData});
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
                      Add External Link
                    </Text>
                  </TouchableOpacity>
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
