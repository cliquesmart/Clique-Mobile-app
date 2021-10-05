import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
//Constant Files
import {CommonColors} from '../Constants/ColorConstant';
import {SetFontSize} from '../Constants/FontSize';
import {ConstantKeys} from '../Constants/ConstantKey';
import LoadingView from '../Constants/LoadingView';
import Webservice from '../Constants/API';
import {APIURL} from '../Constants/APIURL';
import Snackbar from 'react-native-snackbar';
import {Block, Button, ImageComponent, Input, Text} from '../components';
import {hp, wp} from '../components/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {connect} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {useNavigation} from '@react-navigation/native';
let authCredentialListener = null;
const Login = ({location}) => {
  console.log(location, 'location');
  const [isloading, setisloading] = useState(false);
  const {navigate} = useNavigation();

  const showAlert = (text) => {
    Snackbar.show({
      text: text,
      backgroundColor: CommonColors.errorColor,
      textColor: CommonColors.whiteColor,
      // fontFamily: ConstantKeys.Averta_BOLD,
      duration: Snackbar.LENGTH_LONG,
    });
  };

  // Action Methods
  const btnForgotPasswordTap = () => {
    navigate('ForgotPassword', {isFromTutorial: false});
  };

  // Action Methods
  const btnSignUpTap = () => {
    navigate('RegisterName', {isFromTutorial: false});
  };

  const onSubmit = async (values, formikHelpers) => {
    console.log(formikHelpers, 'formikHelpers');
    const fcmToken = await messaging().getToken();
    setisloading(true);

    Webservice.post(APIURL.userLogin, {
      email: values.email,
      password: values.password,
      social_type: 'N',
      current_lat: location.latitude,
      current_long: location.longitude,
      device_token: fcmToken,
    })
      .then(async (response) => {
        if (response.data == null) {
          setisloading(false);
          // alert('error');
          Alert.alert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          setisloading(false);
          await AsyncStorage.setItem(
            'user_id',
            JSON.stringify(response.data.data.user.user_id),
          );
          await AsyncStorage.setItem('token', response.data.data.access_token);
          await AsyncStorage.setItem(
            'custom_id',
            response.data.data.user.custom_id,
          );
          navigate('Dashboard');
        } else {
          setisloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setisloading(false);
        Alert.alert(
          error.message,
          '',
          [
            {
              text: 'Try Again',
              onPress: () => {
                onSubmit(true);
              },
            },
          ],
          {cancelable: false},
        );
      });
  };

  useEffect(() => {
    authCredentialListener = appleAuth.onCredentialRevoked(async () => {
      //user credentials have been revoked. Sign out of account
    });
    return () => {
      if (authCredentialListener.remove !== undefined) {
        authCredentialListener.remove();
      }
    };
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '917108325882-necf07egskm154tngl8a0o2qg6n81ae7.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  const googleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      return true;
    } catch (error) {
      return false;
    }
  };

  const signIn = async () => {
    const fcmToken = await messaging().getToken();
    setisloading(true);
    try {
      GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {email, name, id, photo} = userInfo.user;
      const data = {
        social_type: 'G',
        social_token: id,
        name: name || '',
        email: email,
        avatar: photo || null,
        password: '12345678',
        current_lat: location.latitude,
        current_long: location.longitude,
        device_token: fcmToken,
      };
      setisloading(true);
      Webservice.post(APIURL.userLogin, data)
        .then(async (response) => {
          if (response.data == null) {
            setisloading(false);
            // alert('error');
            Alert.alert(response.originalError.message);

            return;
          }

          if (response.data.status === true) {
            setisloading(false);

            await AsyncStorage.setItem(
              'user_id',
              JSON.stringify(response.data.data.user.user_id),
            );
            await AsyncStorage.setItem(
              'token',
              response.data.data.access_token,
            );
            await AsyncStorage.setItem(
              'custom_id',
              response.data.data.user.custom_id,
            );
            navigate('Dashboard');
            await googleSignOut();
          } else {
            setisloading(false);
            showAlert(response.data.message);
          }
        })
        .catch((error) => {
          setisloading(false);
          Alert.alert(
            error.message,
            '',
            [
              {
                text: 'Try Again',
                onPress: () => {
                  signIn();
                },
              },
            ],
            {cancelable: false},
          );
        });
      // dispatch(registerRequest(data));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
        setisloading(false);

        //Alert.alert('cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        setisloading(false);

        Alert.alert('in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setisloading(false);

        Alert.alert('play services not available or outdated');
      } else {
        setisloading(false);

        Alert.alert('Something went wrong', error.toString());
      }
    }
  };

  const fbLogin = async () => {
    const fcmToken = await messaging().getToken();
    setisloading(true);
    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('web_only');
    }
    // LoginManager.logOut();
    LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_friends',
    ]).then(
      function (result) {
        if (result.isCancelled) {
          setisloading(false);
        } else {
          const _responseInfoCallback = (error, result) => {
            if (error) {
              setisloading(false);
            } else {
              setisloading(false);
              const data = {
                social_type: 'F',
                social_token: result.id,
                name: result.name || '',
                email: result.email || `${result.id}@facebook.com`,
                password: '12345678',
                avatar: result.picture.data.url || null,
                current_lat: location.latitude,
                current_long: location.longitude,
                device_token: fcmToken,
              };
              Webservice.post(APIURL.userLogin, data)
                .then(async (response) => {
                  if (response.data == null) {
                    // alert('error');
                    Alert.alert(response.originalError.message);
                    setisloading(false);
                    return;
                  }

                  if (response.data.status === true) {
                    setisloading(false);
                    await AsyncStorage.setItem(
                      'user_id',
                      JSON.stringify(response.data.data.user.user_id),
                    );
                    await AsyncStorage.setItem(
                      'token',
                      response.data.data.access_token,
                    );
                    await AsyncStorage.setItem(
                      'custom_id',
                      response.data.data.user.custom_id,
                    );
                    navigate('Dashboard');
                    await LoginManager.logOut();
                  } else {
                    //
                    showAlert(response.data.message);
                  }
                })
                .catch((err) => {
                  setisloading(false);
                  Alert.alert(
                    err.message,
                    '',
                    [
                      {
                        text: 'Try Again',
                        onPress: () => {
                          fbLogin(true);
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                });
            }
          };
          // Create a graph request asking for user information with a callback to handle the response.
          const infoRequest = new GraphRequest(
            '/me',
            {
              parameters: {
                fields: {
                  string:
                    'email,name,first_name,middle_name,last_name,picture.type(large)',
                },
              },
            },
            _responseInfoCallback,
          );
          // Start the graph request.
          const res = new GraphRequestManager().addRequest(infoRequest).start();
          setisloading(false);
        }
      },
      function (error) {
        setisloading(false);
      },
    );
  };

  const onAppleButtonPress = async () => {
    const fcmToken = await messaging().getToken();
    // performs login request
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      appleAuth.onCredentialRevoked(async () => {
        console.log(
          'If this function executes, User Credentials have been Revoked',
        );
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const response = appleAuthRequestResponse;
        // you may also want to send the device's ID to your server to link a device with the account
        // identityToken generated

        if (response) {
          if (response.identityToken) {
            // let device_identifier = DeviceInfo.getUniqueId();
            let data = {
              social_type: 'I',
              social_token: response.identityToken,
              name: response.fullName ? response.fullName.givenName : '-',
              email: response.email ? response.email : '-',
              password: '12345678',
              current_lat: location.latitude,
              current_long: location.longitude,
              device_token: fcmToken,
            };
            Webservice.post(APIURL.userLogin, data)
              .then(async (response) => {
                if (response.data == null) {
                  // alert('error');
                  Alert.alert(response.originalError.message);
                  setisloading(false);
                  return;
                }

                if (response.data.status === true) {
                  setisloading(false);
                  await AsyncStorage.setItem(
                    'user_id',
                    JSON.stringify(response.data.data.user.user_id),
                  );
                  await AsyncStorage.setItem(
                    'token',
                    response.data.data.access_token,
                  );
                  await AsyncStorage.setItem(
                    'custom_id',
                    response.data.data.user.custom_id,
                  );
                  // authCredentialListener.remove();
                  appleAuth.onCredentialRevoked(async () => {
                    console.log(
                      'If this function executes, User Credentials have been Revoked',
                    );
                  });

                  navigate('Dashboard');
                } else {
                  //
                  Alert.alert(
                    'Please revoke the Apple account access from the password and accounts in Apple settings',
                  );
                  showAlert(response.data.message);
                }
              })
              .catch((err) => {
                setisloading(false);
                Alert.alert(
                  err.message,
                  '',
                  [
                    {
                      text: 'Try Again',
                      onPress: () => {
                        fbLogin(true);
                      },
                    },
                  ],
                  {cancelable: false},
                );
              });
            // props.appleLogin({values: details});
          }
        }
        // user is authenticated
      }
    } catch (error) {
      if (appleAuth.Error.CANCELED === error.code) {
        console.log('apple-error-CANCELED', JSON.stringify(error));
      } else if (appleAuth.Error.FAILED === error.code) {
        console.log('apple-error-FAILED', error);
      } else if (appleAuth.Error.NOT_HANDLED === error.code) {
        console.log('apple-error-NOT_HANDLED', error);
      } else {
        console.log('apple-error', error);
      }
    }
  };
  return (
    <LinearGradient colors={['#6961FF', '#E866B6']} style={styles.container}>
      <SafeAreaView />
      <Block padding={[hp(2), 0, 0]} flex={false} center>
        <ImageComponent height={64} width={128} name={'nameBg'} />
      </Block>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={onSubmit}
        validationSchema={yup.object().shape({
          email: yup
            .string()
            .email('must be a valid email address')
            .required('Email is required'),
          password: yup.string().min(8).required('Password is required'),
        })}>
        {({
          values,
          handleChange,
          errors,
          setFieldTouched,
          touched,
          setFieldValue,
          handleSubmit,
          isValid,
          dirty,
        }) => (
          <ScrollView
            contentContainerStyle={styles.mainContainer}
            bounces={false}>
            <Block flex={false} middle padding={[0, wp(3)]}>
              <Text center size={30} semibold white margin={[hp(4), 0]}>
                {'Login Into\nYour Account'}
              </Text>
              <Input
                placeholder="Enter Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={() => setFieldTouched('email')}
                error={touched.email && errors.email}
                errorText={touched.email && errors.email}
                email
              />
              <Input
                value={values.password}
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={() => setFieldTouched('password')}
                error={touched.password && errors.password}
                errorText={touched.password && errors.password}
                secureTextEntry={true}
              />

              <Button
                // disabled={!isValid || !dirty}
                onPress={handleSubmit}
                style={{marginTop: hp(2)}}
                color="primary">
                Login
              </Button>
              <Text
                margin={[hp(1), 0]}
                size={14}
                white
                regular
                right
                onPress={() => btnForgotPasswordTap()}>
                Forgot Password ?
              </Text>
              <Block flex={false} margin={[hp(1), 0]} />
              <Button
                onPress={() => fbLogin()}
                iconStyle={{marginTop: hp(0.5)}}
                icon="facebook_icon"
                iconWithText
                color="secondary">
                Sign in with Facebook
              </Button>
              <Button
                onPress={() => signIn()}
                iconStyle={{marginTop: hp(0.5), marginRight: wp(2)}}
                icon="google"
                iconWithText
                color="secondary">
                Sign in with Google
              </Button>
              {Platform.OS === 'ios' && (
                <Button
                  onPress={() => onAppleButtonPress()}
                  iconStyle={{marginRight: wp(2), marginVertical: hp(0.2)}}
                  iconColor="#fff"
                  icon="apple_icon"
                  iconWithText
                  color="secondary">
                  Sign in with Apple
                </Button>
              )}
            </Block>
          </ScrollView>
        )}
      </Formik>
      <Text style={styles.dontacc}>
        Don't have an account yet?{' '}
        <Text style={styles.signup} onPress={() => btnSignUpTap()}>
          Sign Up{' '}
        </Text>
      </Text>
      {isloading ? <LoadingView /> : null}
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
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
  dontacc: {
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: ConstantKeys.Averta_REGULAR,
    fontSize: SetFontSize.ts14,
    color: CommonColors.whiteColor,
  },
  signup: {
    fontFamily: ConstantKeys.Averta_BOLD,
    fontSize: SetFontSize.ts14,
    color: CommonColors.whiteColor,
    textDecorationLine: 'underline',
  },
});
const mapStateToProps = (state) => {
  return {
    location: state.location.data,
  };
};
export default connect(mapStateToProps, null)(Login);
