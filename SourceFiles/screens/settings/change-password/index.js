import React from 'react';
import {FlatList, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import HeaderSettings from '../../../common/header-setting';
import {hp, wp} from '../../../components/responsive';
import {Block, Text, Button} from '../../../components';
import NeoInputField from '../../../components/neo-input';
import * as yup from 'yup';
import {Formik} from 'formik';
import {t1} from '../../../components/theme/fontsize';
import {checkColor, showAlert} from '../../../utils/mobile-utils';
import {renderValidationText} from '../../../utils/constants';
import {APIURL} from '../../../Constants/APIURL';
import Webservice from '../../../Constants/API';
import {useNavigation} from '@react-navigation/core';

const ChangePasswordSettings = () => {
  const [loading, setloading] = React.useState(false);

  const {goBack} = useNavigation();
  const errorText = (err) => {
    return (
      <Text
        style={{alignSelf: 'flex-start'}}
        margin={[t1, wp(3), 0]}
        size={14}
        red>
        {err}
      </Text>
    );
  };

  const onSubmit = (values) => {
    setloading(true);
    Webservice.post(APIURL.UpdatePassword, {
      new_password: values.password,
      confirm_password: values.confirm_password,
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
          goBack();
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
    <Block color="#F2EDFA">
      <SafeAreaView />
      <HeaderSettings title="Change Password" />
      <Formik
        initialValues={{
          password: '',
          confirm_password: '',
        }}
        onSubmit={onSubmit}
        validationSchema={yup.object().shape({
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
          <ScrollView contentContainerStyle={{paddingBottom: hp(2)}}>
            <Block padding={[hp(2), wp(3)]} flex={false} center>
              <NeoInputField
                placeholder={'Password'}
                fontColor="#707070"
                icon="eye"
                onChangeText={handleChange('password')}
                value={values.password}
                secure
              />
              {/* {errors.password && errorText(errors.password)} */}

              <Block flex={false} margin={[hp(1), 0]} />
              <NeoInputField
                placeholder={'Confirm Password'}
                fontColor="#707070"
                icon="eye"
                secure
                onChangeText={handleChange('confirm_password')}
                value={values.confirm_password}
              />
              {/* {errors.confirm_password && errorText(errors.confirm_password)} */}
            </Block>
            <Block row margin={[hp(1.5), wp(5)]} flex={false}>
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
                          backgroundColor: checkColor(values.password.length),
                        },
                      ]}
                    />
                  );
                }}
              />
            </Block>

            <Block padding={[0, wp(3)]}>{renderValidationText()}</Block>
            <Block flex={false} padding={[hp(7), wp(5)]}>
              <Button
                isLoading={loading}
                disabled={!isValid || !dirty}
                onPress={handleSubmit}
                linear
                color="primary">
                Change Password
              </Button>
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
  linear: {
    marginLeft: 20,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  customButton: {
    height: 40,
    width: 40,
  },
});
export default ChangePasswordSettings;
