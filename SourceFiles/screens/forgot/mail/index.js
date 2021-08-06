import React, {Component} from 'react';
import {StyleSheet, ScrollView, SafeAreaView, Image} from 'react-native';

//Constant Files
import {CommonColors} from '../../../Constants/ColorConstant';

import {SetFontSize} from '../../../Constants/FontSize';
import {ConstantKeys} from '../../../Constants/ConstantKey';
import LoadingView from '../../../Constants/LoadingView';
import Snackbar from 'react-native-snackbar';
import {images} from '../../../Assets/Images/images';
import {Block, ImageComponent, Text} from '../../../components';
import {hp, wp} from '../../../components/responsive';

export default class ForgotPasswordTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading: false,
      txtMobileNo: '',
      MobileBorderColor: CommonColors.GhostColor,
      ShowPassword: true,
      isDisable: true,
      countryCode: '91',
    };
  }

  componentDidMount() {}

  showAlert(text) {
    Snackbar.show({
      text: text,
      backgroundColor: CommonColors.errorColor,
      textColor: CommonColors.whiteColor,
      // fontFamily: ConstantKeys.Averta_BOLD,
      duration: Snackbar.LENGTH_LONG,
    });
  }

  validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  // Action Methods
  btnSignUpTap = () => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate('RegisterName', {isFromTutorial: false});
    });
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

  setNewPwdClick = () => {
    //    alert('aaa')
    // requestAnimationFrame(() => {
    this.props.navigation.navigate('RecoverPassword', {
      isFromTutorial: false,
    });
    // });
    //  this.props.navigation.navigate('ForgotPasswordThree', { isFromTutorial: false });
  };
  render() {
    return (
      <Block linear>
        <SafeAreaView />
        <ScrollView contentContainerStyle={{flexGrow: 1}} bounces={false}>
          <Block flex={false} center>
            <ImageComponent
              resizeMode="contain"
              height={140}
              width={140}
              name={'nameBg'}
            />
          </Block>
          <Block
            backgroundColor={'#FDFFFF'}
            borderTopRightRadius={30}
            borderTopLeftRadius={30}
            middle
            padding={[0, wp(3)]}>
            <Text
              style={{
                color: CommonColors.PurpleColor,
                fontSize: SetFontSize.ts25,
              }}
              center
              size={30}
              color={CommonColors.PurpleColor}
              semibold
              white
              margin={[hp(4), 0]}>
              {"We've sent you \n an email"}
            </Text>

            <Image
              style={{
                alignSelf: 'center',
                height: hp(40),
                width: wp(80),
                resizeMode: 'contain',
              }}
              source={images.resetBell}
            />

            <Text style={styles.txtSignUp}>
              To activate your account you {'\n'}need to click on the link we've
              {'\n'} sent to te**@clique.com
            </Text>

            <Text
              style={styles.txtAlreadyAccount}
              onPress={() => this.setNewPwdClick()}>
              Set a new password
            </Text>
          </Block>
        </ScrollView>

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
    color: '#707070',
    fontSize: SetFontSize.ts16,
    fontFamily: ConstantKeys.Averta_REGULAR,
    textAlign: 'center',
    marginTop: 10,
  },

  txtAlreadyAccount: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    textAlign: 'center',
    flexDirection: 'row',
    marginBottom: 25,
    fontFamily: ConstantKeys.Averta_REGULAR,
    fontSize: SetFontSize.ts14,
    color: CommonColors.PurpleColor,
    textDecorationLine: 'underline',
  },
});
