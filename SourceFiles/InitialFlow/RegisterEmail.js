import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  BackHandler,
  Alert,
} from 'react-native';

//Constant Files
import {CommonColors} from '../Constants/ColorConstant';
import {SetFontSize} from '../Constants/FontSize';
import {ConstantKeys} from '../Constants/ConstantKey';
import LoadingView from '../Constants/LoadingView';
import Snackbar from 'react-native-snackbar';
import LinearGradient from 'react-native-linear-gradient';
import {Block, Button, ImageComponent, Input} from '../components';
import {hp, wp} from '../components/responsive';
import {IMG} from '../Constants/ImageConstant';
import ValidationMsg from '../Constants/ValidationMsg';

//Constant Files
import {APIURL} from '../Constants/APIURL';
import Webservice from '../Constants/API';
import HeaderPreLogin from '../common/header';
import NeoInputField from '../components/neo-input';
import NeuView from '../common/neu-element/lib/NeuView';

export default class RegisterEmail extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'props');
    this.state = {
      isloading: false,
      txtEmail: '',
      isDisable: true,
      NameBorderColor: CommonColors.GhostColor,
      isFromAutoLogin: props.route.params.is_from_autoLogin,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    if (this.state.isFromAutoLogin === false) {
      this.props.navigation.pop(1);
      return false;
    } else {
      return true;
    }
  };

  showAlert(text) {
    Snackbar.show({
      text: text,
      backgroundColor: CommonColors.errorColor,
      textColor: CommonColors.whiteColor,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  API_EMAIL_CHECK(isload) {
    this.setState({isloading: isload});

    Webservice.post(APIURL.emailCheck, {
      email: this.state.txtEmail,
    })
      .then((response) => {
        if (response.data == null) {
          this.setState({isloading: false});
          // alert('error');
          return;
        }
        //   console.log(response);
        this.setState({isloading: false});
        console.log('Get Email Check Response : ' + JSON.stringify(response));

        if (response.data.status === true) {
          var dict = {};
          dict.email = this.state.txtEmail;

          this.props.navigation.navigate('ChoosePassword', {
            name: this.props.route.params.name,
            dob: this.props.route.params.dob,
            gender: this.props.route.params.gender,
            email: this.state.txtEmail,
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
                this.API_EMAIL_CHECK(true);
              },
            },
          ],
          {cancelable: false},
        );
      });
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  btnBackTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.goBack();
    });
  };

  btnNextTap = () => {
    requestAnimationFrame(() => {
      if (!this.validateEmail(this.state.txtEmail)) {
        this.showAlert(ValidationMsg.ValidEmail);
      } else {
        this.API_EMAIL_CHECK(true);
      }
    });
  };

  //Helper Methods For TextInput
  onFocus() {
    this.setState({
      NameBorderColor: CommonColors.SlateBlueColor,
    });
  }

  onBlur() {
    this.setState({
      NameBorderColor: CommonColors.GhostColor,
    });
  }

  render() {
    let LinkdInIcon = IMG.OtherFlow.LinkdInIcon;
    let TwitterIcon = IMG.OtherFlow.TwitterIcon;

    return (
      <Block linear>
        <SafeAreaView />

        <Block padding={[hp(2), 0, 0]} space="between" flex={false} row>
          <TouchableOpacity onPress={() => this.btnBackTap()}>
            <NeuView
              style={styles.linear}
              concave
              color={'#775DF2'}
              width={40}
              height={40}
              borderRadius={20}
              customGradient={['#5542B6', '#7653DB']}>
              <ImageComponent
                resizeMode="contain"
                height={14}
                width={14}
                name={'BackIcon'}
              />
            </NeuView>
          </TouchableOpacity>

          <ImageComponent
            resizeMode="contain"
            height={140}
            width={140}
            name={'nameBg'}
          />
          <TouchableOpacity activeOpacity={1} style={styles.customButton} />
        </Block>
        <Block
          color={'#F2EDFA'}
          borderTopRightRadius={30}
          borderTopLeftRadius={30}
          padding={[0, wp(3)]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}
            bounces={false}>
            <HeaderPreLogin title={'Create Account'} subtitle={'Your Email'} />
            <Block center flex={false} margin={[hp(1), 0, 0]}>
              <NeoInputField
                keyboardType="email-address"
                value={this.state.txtEmail}
                placeholder={'Enter Email ID'}
                onChangeText={async (txtEmail) => {
                  await this.setState({txtEmail: txtEmail});

                  if (this.state.txtEmail.length < 2) {
                    this.setState({isDisable: true});
                  } else {
                    this.setState({isDisable: false});
                  }
                }}
                fontColor="#707070"
                icon="MinEmailIcon"
              />
            </Block>
          </ScrollView>
          <Block flex={false} margin={[0, wp(3), hp(3)]}>
            <Button
              disabled={!this.state.txtEmail}
              onPress={() => this.btnNextTap()}
              linear
              color="primary">
              Next
            </Button>
          </Block>
        </Block>

        {this.state.isloading ? <LoadingView /> : null}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnLogin: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  txtLogin: {
    color: CommonColors.whiteColor,
    fontSize: SetFontSize.ts16,
    fontFamily: ConstantKeys.Averta_BOLD,
  },
  viewCountrystyle: {
    flexDirection: 'row',
    height: 50,
    width: '30%',
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

  btnSignUp: {
    marginLeft: 20,
    marginRight: 20,
    height: 50,
    backgroundColor: CommonColors.PurpleColor,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtSignUp: {
    color: CommonColors.whiteColor,
    fontSize: SetFontSize.ts16,
    fontFamily: ConstantKeys.Averta_REGULAR,
  },

  txtAlreadyAccount: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    textAlign: 'center',
    flexDirection: 'row',
    marginBottom: 25,
    fontFamily: ConstantKeys.Averta_REGULAR,
    fontSize: SetFontSize.ts14,
    color: CommonColors.secondaryText,
    textDecorationLine: 'underline',
  },
  linear: {
    marginLeft: 20,
  },
  rightIcon: {
    alignSelf: 'flex-end',
    marginRight: 20,
    height: hp(10),
    width: wp(15),
    resizeMode: 'contain',
  },
  leftIcon: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 20,
    height: hp(15),
    width: wp(18),
    resizeMode: 'contain',
  },
  customButton: {
    height: 40,
    width: 40,
  },
});
