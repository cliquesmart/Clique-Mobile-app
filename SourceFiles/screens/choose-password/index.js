import React, {useState} from 'react';
import {
  ScrollView,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

//Constant Files
import {Block, Button, ImageComponent, Input, Text} from '../../components';
import {hp, wp} from '../../components/responsive';
import LinearGradient from 'react-native-linear-gradient';
import HeaderPreLogin from '../../common/header';
import {useNavigation} from '@react-navigation/core';
import NeoInputField from '../../components/neo-input';
import {useRoute} from '@react-navigation/native';
import * as yup from 'yup';
import {Formik} from 'formik';
import {t1} from '../../components/theme/fontsize';
import {checkColor} from '../../utils/mobile-utils';
import {renderValidationText} from '../../utils/constants';
import NeuView from '../../common/neu-element/lib/NeuView';

const ChoosePassword = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  console.log(params, 'params');
  const [state, setState] = useState({
    password: null,
    confirm_pass: null,
  });

  const onSubmit = (values) => {
    navigation.navigate('RegisterProfilePic', {
      name: params.name,
      email: params.email,
      gender: params.gender,
      dob: params.dob,
      password: values.password,
    });
  };
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
          password: yup
            .string()
            .required('Please Enter your password')
            .min(8, 'Password must be at least 8 characters')
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
            <Block padding={[hp(2), 0, 0]} space="between" flex={false} row>
              <TouchableOpacity onPress={() => navigation.goBack()}>
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
              flex={1}
              color={'#F2EDFA'}
              borderTopRightRadius={30}
              borderTopLeftRadius={30}
              padding={[0, wp(3), hp(2), wp(3)]}>
              <ScrollView>
                <HeaderPreLogin
                  title="Create Account"
                  subtitle="Choose your Password"
                />
                <Block flex={false} center>
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
                  {/* {errors.confirm_password &&
                    errorText(errors.confirm_password)} */}
                </Block>
                <Block row margin={[hp(1.5), wp(2)]} flex={false}>
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
                  disabled={!isValid || !dirty}
                  onPress={handleSubmit}
                  linear
                  color="primary">
                  Next
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
    // backgroundColor: '#4BE351',
  },
  container: {flexGrow: 1},
  shadow: {
    shadowOpacity: 0.1, // <- and this or yours opacity
    shadowRadius: 15,
    borderRadius: 50,
  },
  linear: {
    marginLeft: 20,
  },
  customButton: {
    height: 40,
    width: 40,
  },
});
export default ChoosePassword;
