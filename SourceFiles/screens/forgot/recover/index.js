import React from 'react';
import {ScrollView, SafeAreaView, FlatList, StyleSheet} from 'react-native';

//Constant Files
import {CommonColors} from '../../../Constants/ColorConstant';
import {Block, Button, ImageComponent, Input, Text} from '../../../components';
import {hp, wp} from '../../../components/responsive';
import {Neomorph, Shadow} from 'react-native-neomorph-shadows';
import NeoInputField from '../../../components/neo-input';
import {renderValidationText} from '../../../utils/constants';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useNavigation, useRoute} from '@react-navigation/core';
import {APIURL} from '../../../Constants/APIURL';
import Webservice from '../../../Constants/API';
import {checkColor, showAlert} from '../../../utils/mobile-utils';
const RecoverPassword = () => {
  const [loading, setloading] = React.useState(false);
  const {goBack, navigate} = useNavigation();
  const {params} = useRoute();
  console.log(params.email);
  const onSubmit = (values) => {
    setloading(true);
    Webservice.post(APIURL.VerifyForgotDetails, {
      otp: values.otp,
      email: params.email,
      new_password: values.confirm_password,
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
          navigate('Login');
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
          otp: yup.string().required(),
          password: yup
            .string()
            .required('Please Enter your password')
            .min(8, 'Password must be at least 6 characters')
            .matches(
              // eslint-disable-next-line prettier/prettier
              '^(?=.*[a-z])(?=.*[0-9])(?=.{8,})',
              'Password should be at least one letter and one number:',
            ),
          confirm_password: yup
            .string()
            .when('password', {
              is: (val) => (val && val.length > 0 ? true : false),
              then: yup
                .string()
                .oneOf(
                  [yup.ref('password')],
                  'Both password need to be the same',
                ),
            })
            .required('Please Enter your confirm password'),
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
          <ScrollView contentContainerStyle={styles.container} bounces={false}>
            <Block flex={false} center>
              <ImageComponent
                resizeMode="contain"
                height={140}
                width={140}
                name={'nameBg'}
              />
            </Block>
            <Block
              flex={1}
              color={'#F2EDFA'}
              borderTopRightRadius={30}
              borderTopLeftRadius={30}
              padding={[0, wp(3), hp(2), wp(3)]}>
              <ScrollView>
                <Text
                  purple
                  center
                  size={25}
                  color={CommonColors.PurpleColor}
                  semibold
                  margin={[hp(4), 0]}>
                  Recover Password
                </Text>
                <Block margin={[0, 0, hp(1)]} flex={false} center>
                  <NeoInputField
                    placeholder={'Enter OTP'}
                    fontColor="#707070"
                    icon=""
                    onChangeText={handleChange('otp')}
                    value={values.otp}
                    // secure
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                  <Block flex={false} margin={[hp(1), 0]} />
                  <NeoInputField
                    placeholder={'Password'}
                    fontColor="#707070"
                    icon="eye"
                    onChangeText={handleChange('password')}
                    value={values.password}
                    secure
                  />
                  <Block flex={false} margin={[hp(1), 0]} />
                  <NeoInputField
                    placeholder={'Confirm Password'}
                    fontColor="#707070"
                    icon="eye"
                    secure
                    onChangeText={handleChange('confirm_password')}
                    value={values.confirm_password}
                  />
                </Block>
                <Block row margin={[hp(1), wp(2)]} flex={false}>
                  <Text grey size={14}>
                    You’re almost there!
                  </Text>
                  <FlatList
                    data={[1, 2, 3, 4, 5, 6]}
                    horizontal
                    contentContainerStyle={styles.flatlist}
                    scrollEnabled={false}
                    renderItem={({item}) => {
                      return (
                        <Block
                          flex={false}
                          borderRadius={10}
                          margin={[0, wp(0.7)]}
                          style={[
                            styles.dot,
                            {
                              backgroundColor: checkColor(
                                values.password.length,
                              ),
                            },
                          ]}
                        />
                      );
                    }}
                  />
                </Block>

                {renderValidationText()}
              </ScrollView>
              <Block flex={false} padding={[0, wp(3)]}>
                <Button
                  disabled={!dirty || !isValid}
                  onPress={handleSubmit}
                  isLoading={loading}
                  linear
                  color="primary">
                  Reset Password
                </Button>
              </Block>
            </Block>
          </ScrollView>
        )}
      </Formik>
    </Block>
  );
};

const styles = StyleSheet.create({
  input: {
    shadowColor: '#BBC3CE',
    backgroundColor: 'white',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
  },
  flatlist: {
    alignSelf: 'flex-end',
    flexGrow: 1,
    flexDirection: 'row-reverse',
  },
  dot: {
    height: 10,
    width: 10,
    backgroundColor: '#4BE351',
  },
  container: {flexGrow: 1},
  shadow: {
    shadowOpacity: 0.1, // <- and this or yours opacity
    shadowRadius: 15,
    borderRadius: 50,
  },
});
export default RecoverPassword;
