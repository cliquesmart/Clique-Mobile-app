// import React, {Component} from 'react';
// import {
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   ImageBackground,
//   SafeAreaView,
//   Image,
// } from 'react-native';

// //Constant Files
// import {CommonColors} from '../../Constants/ColorConstant';
// import {SetFontSize} from '../../Constants/FontSize';
// import {ConstantKeys} from '../../Constants/ConstantKey';
// import LoadingView from '../../Constants/LoadingView';
// import Snackbar from 'react-native-snackbar';
// import LinearGradient from 'react-native-linear-gradient';
// import {images} from '../../Assets/Images/images';
// import {Block, Button, ImageComponent, Input, Text} from '../../components';
// import {hp, wp} from '../../components/responsive';
// import {Neomorph} from 'react-native-neomorph-shadows';
// import NeoInputField from '../../components/neo-input';

// export default class ForgotPassword extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isloading: false,
//       txtMobileNo: '',
//       MobileBorderColor: CommonColors.GhostColor,
//       ShowPassword: true,
//       isDisable: true,
//       countryCode: '91',
//     };
//   }

//   showAlert(text) {
//     Snackbar.show({
//       text: text,
//       backgroundColor: CommonColors.errorColor,
//       textColor: CommonColors.whiteColor,
//       // fontFamily: ConstantKeys.Averta_BOLD,
//       duration: Snackbar.LENGTH_LONG,
//     });
//   }

//   validateEmail = (email) => {
//     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(email);
//   };

//   // Action Methods
//   btnBackTap = () => {
//     requestAnimationFrame(() => {
//       this.props.navigation.navigate('Login', {isFromTutorial: false});
//     });
//   };

//   // Action Methods
//   btnResetTap = () => {
//     requestAnimationFrame(() => {
//       this.props.navigation.navigate('ForgotMail', {
//         isFromTutorial: false,
//       });
//     });
//   };

//   //Helper Methods For TextInput
//   onFocus() {
//     this.setState({
//       MobileBorderColor: CommonColors.SlateBlueColor,
//     });
//   }

//   onBlur() {
//     this.setState({
//       MobileBorderColor: CommonColors.GhostColor,
//     });
//   }

//   render() {
//     return (
//       <Block linear>
//         <SafeAreaView />

//         <Block flex={false} center>
//           <ImageComponent
//             resizeMode="contain"
//             height={140}
//             width={140}
//             name={'nameBg'}
//           />
//         </Block>
//         <Block
//           color={'#F2EDFA'}
//           borderTopRightRadius={30}
//           borderTopLeftRadius={30}
//           padding={[0, wp(3)]}>
//           <ScrollView
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{flexGrow: 1}}
//             bounces={false}>
//             <Text center size={30} purple semibold margin={[hp(4), 0]}>
//               Forgot Password
//             </Text>

//             <Block center flex={false}>
//               <NeoInputField
//                 placeholder={'Email'}
//                 fontColor="#707070"
//                 icon="MinEmailIcon"
//               />
//             </Block>

//             {/* <Block middle padding={[0, wp(3)]}>
//               <Image
//                 style={{
//                   alignSelf: 'flex-end',
//                   marginTop: 10,
//                   marginRight: 20,
//                   height: hp(15),
//                   width: wp(18),
//                   resizeMode: 'contain',
//                 }}
//                 source={images.spotify}
//               />

//               <Image
//                 style={{
//                   marginLeft: 20,
//                   height: hp(15),
//                   width: wp(20),
//                   resizeMode: 'contain',
//                 }}
//                 source={images.applePay}
//               />
//             </Block> */}
//           </ScrollView>
//           <Button onPress={() => this.btnResetTap()} linear color="primary">
//             Reset Password
//           </Button>

//           <Text
//             style={styles.txtAlreadyAccount}
//             onPress={() => this.btnBackTap()}>
//             Back to signin screen
//           </Text>
//         </Block>

//         {this.state.isloading ? <LoadingView /> : null}
//       </Block>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   btnLogin: {
//     marginLeft: 20,
//     marginRight: 20,
//     marginTop: 50,
//     height: 50,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   txtLogin: {
//     color: CommonColors.whiteColor,
//     fontSize: SetFontSize.ts16,
//     fontFamily: ConstantKeys.Averta_BOLD,
//   },
//   viewCountrystyle: {
//     flexDirection: 'row',
//     height: 50,
//     width: '30%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: CommonColors.MortarColor,
//     fontSize: SetFontSize.ts16,
//     fontFamily: ConstantKeys.Averta_REGULAR,
//   },
//   pickerTitleStyle: {
//     justifyContent: 'center',
//     flexDirection: 'row',
//     alignSelf: 'center',
//     fontWeight: 'bold',
//     flex: 1,
//     marginLeft: 10,
//     fontSize: SetFontSize.ts18,
//     color: CommonColors.blackColor,
//   },
//   selectedCountryTextStyle: {
//     paddingLeft: 5,
//     paddingRight: 5,
//     color: CommonColors.whiteColor,
//     fontSize: SetFontSize.ts16,
//     fontFamily: ConstantKeys.Averta_REGULAR,
//     textAlign: 'center',
//   },
//   countryNameTextStyle: {
//     paddingLeft: 10,
//     color: CommonColors.blackColor,
//     textAlign: 'right',
//   },
//   searchBarStyle: {
//     flex: 1,
//     justifyContent: 'center',
//     flexDirection: 'row',
//     marginLeft: 8,
//     marginRight: 10,
//   },

//   btnSignUp: {
//     marginLeft: 20,
//     marginRight: 20,
//     height: 50,
//     backgroundColor: CommonColors.PurpleColor,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   txtSignUp: {
//     color: CommonColors.whiteColor,
//     fontSize: SetFontSize.ts16,
//     fontFamily: ConstantKeys.Averta_REGULAR,
//   },

//   txtAlreadyAccount: {
//     marginLeft: 20,
//     marginRight: 20,
//     marginTop: 15,
//     textAlign: 'center',
//     flexDirection: 'row',
//     marginBottom: 25,
//     fontFamily: ConstantKeys.Averta_REGULAR,
//     fontSize: SetFontSize.ts14,
//     color: CommonColors.secondaryText,
//     textDecorationLine: 'underline',
//   },
// });

import React, {Component, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  Image,
} from 'react-native';

//Constant Files
import {CommonColors} from '../../Constants/ColorConstant';
import {SetFontSize} from '../../Constants/FontSize';
import {ConstantKeys} from '../../Constants/ConstantKey';
import LoadingView from '../../Constants/LoadingView';
import Snackbar from 'react-native-snackbar';
import LinearGradient from 'react-native-linear-gradient';
import {images} from '../../Assets/Images/images';
import {Block, Button, ImageComponent, Input, Text} from '../../components';
import {hp, wp} from '../../components/responsive';
import {Neomorph} from 'react-native-neomorph-shadows';
import NeoInputField from '../../components/neo-input';
import Webservice from '../../Constants/API';
import {APIURL} from '../../Constants/APIURL';
import {showAlert} from '../../utils/mobile-utils';
import {useNavigation} from '@react-navigation/core';
import * as yup from 'yup';
import {Formik} from 'formik';

const Forgot = () => {
  const [isloading, setloading] = useState(false);
  const {navigate, goBack} = useNavigation();
  const onSubmit = (values) => {
    setloading(true);
    Webservice.post(APIURL.forgetPassword, {
      email: values.email,
    })
      .then(async (response) => {
        if (response.data == null) {
          setloading(false);
          // alert('error');
          showAlert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          // setloading(false);
          navigate('ForgotMail', {
            email: values.email,
          });
          showAlert(response.data.message);
        } else {
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setloading(false);
        showAlert(error.message);
      });
  };
  return (
    <Block linear>
      <SafeAreaView />
      <Formik
        initialValues={{
          password: '',
          confirm_password: '',
        }}
        onSubmit={onSubmit}
        validationSchema={yup.object().shape({
          email: yup.string().email().required('Please Enter your password'),
        })}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          setFieldValue,
          handleSubmit,
          dirty,
          isValid,
        }) => (
          <>
            <Block flex={false} center>
              <ImageComponent
                resizeMode="contain"
                height={140}
                width={140}
                name={'nameBg'}
              />
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
                <Text center size={30} purple semibold margin={[hp(4), 0]}>
                  Forgot Password
                </Text>

                <Block center flex={false}>
                  <NeoInputField
                    placeholder={'Email'}
                    fontColor="#707070"
                    icon="MinEmailIcon"
                    onChangeText={handleChange('email')}
                    value={values.email}
                  />
                </Block>
              </ScrollView>
              <Button
                disabled={!dirty || !isValid}
                onPress={handleSubmit}
                linear
                color="primary">
                Reset Password
              </Button>

              <Text style={txtAlreadyAccount} onPress={() => goBack()}>
                Back to signin screen
              </Text>
            </Block>
          </>
        )}
      </Formik>
      {isloading ? <LoadingView /> : null}
    </Block>
  );
};
const txtAlreadyAccount = {
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
};
export default Forgot;
