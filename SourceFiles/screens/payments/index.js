import {useNavigation, useRoute} from '@react-navigation/native';
import {Formik} from 'formik';
import React, {useRef, useState} from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HeaderPreLogin from '../../common/header';
import {Block, Button, ImageComponent, Text} from '../../components';
import IAPButton from '../../components/iap';
import NeoInputField from '../../components/neo-input';
import {hp, wp} from '../../components/responsive';
import {
  strictValidString,
  strictValidStringWithMinLength,
} from '../../utils/commonUtils';
import * as yup from 'yup';
import {
  cc_expires_format,
  cc_format,
  getCardColor,
  getCardType,
  showAlert,
} from '../../utils/mobile-utils';
import {t1} from '../../components/theme/fontsize';
import Webservice from '../../Constants/API';
import {APIURL} from '../../Constants/APIURL';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingView from '../../Constants/LoadingView';
import NeuView from '../../common/neu-element/lib/NeuView';

const Payment = () => {
  const {params} = useRoute();
  const {title, type, price, sku} = params;
  const {goBack, navigate} = useNavigation();
  const formikRef = useRef();
  const [loading, setloading] = useState(false);

  const onSubmit = async (values) => {
    const {cc_number, cc_expiry, cc_cvv} = values;
    const splittedExpiry = cc_expiry.split('/');
    const user_id = await AsyncStorage.getItem('user_id');
    setloading(true);
    const data = {
      user_id: user_id,
      card_no: cc_number.toString().split(' ').join(''),
      exp_month: splittedExpiry[0],
      exp_year: splittedExpiry[1],
      cvc: cc_cvv,
      amount: price,
      name: values.cc_holder,
    };
    console.log(data);
    Webservice.post(APIURL.makePayment, {
      user_id: user_id,
      card_no: cc_number.toString().split(' ').join(''),
      exp_month: splittedExpiry[0],
      exp_year: splittedExpiry[1],
      cvc: cc_cvv,
      amount: price,
      name: values.cc_holder,
      payment_type: 'S',
      subscription: type,
    })
      .then(async (response) => {
        if (response.data == null) {
          setloading(false);
          // alert('error');
          showAlert(response.originalError.message);

          return;
        }

        if (response.data.status === true) {
          setloading(false);
          navigate('ActivatedCard', {
            header: 'Success !',
            subtitle: `Your ${type} Subscription has been successfully purchased `,
          });
        } else {
          setloading(false);
          showAlert(response.data.message);
        }
      })
      .catch((error) => {
        setloading(false);
      });
  };
  const errorText = (err) => {
    return (
      <Text margin={[t1, wp(3), 0]} size={14} red>
        {err}
      </Text>
    );
  };
  return (
    <Block linear>
      <SafeAreaView />
      <Block padding={[hp(2), wp(3), 0]} space="between" flex={false} row>
        <TouchableOpacity onPress={() => goBack()}>
          <NeuView
            concave
            color={'#775DF2'}
            width={40}
            height={40}
            borderRadius={20}
            customGradient={['#775DF2', '#5A28AE']}>
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
        <TouchableOpacity
          style={styles.linear}
          onPress={() => this.btnSkipTap()}
        />
      </Block>
      <Block
        color={'#F2EDFA'}
        borderTopRightRadius={30}
        borderTopLeftRadius={30}
        padding={[0, wp(3)]}>
        <HeaderPreLogin title={title} subtitle={'Payment Information'} />
        <Formik
          innerRef={formikRef}
          enableReinitialize
          initialValues={{
            cc_number: '',
            cc_holder: '',
            cc_expiry: '',
            cc_cvv: '',
          }}
          onSubmit={onSubmit}
          validationSchema={yup.object().shape({
            cc_number: yup
              .string()
              .test('wrong card', (value) => {
                const formattedValue =
                  (value && value.toString().split(' ').join('')) || '';
                return strictValidString(getCardType(formattedValue));
              })
              .required('Card Number is required field'),
            cc_holder: yup.string().required('Card Holder Name is required'),
            cc_expiry: yup
              .string()
              .max(5)
              .matches(
                /([0-9]{2})\/([0-9]{2})/,
                'Not a valid expiration date. Example: MM/YY',
              )
              .required('Expiration date is required'),
            cc_cvv: yup.string('').min(3).max(4).required('CVV is required'),
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
          }) => {
            const formattedValue =
              (strictValidString(values.cc_number) &&
                values.cc_number.toString().split(' ').join('')) ||
              '';
            const cardType = getCardType(formattedValue);
            const cardImage = getCardColor(cardType);
            const buttonTitle =
              Platform.OS === 'ios'
                ? 'Pay with Apple Pay'
                : 'Pay with Google Pay';
            return (
              <>
                <ScrollView contentContainerStyle={{flexGrow: 1}}>
                  <Block center flex={false} margin={[hp(1), 0, 0]}>
                    <NeoInputField
                      value={values.cc_holder}
                      placeholder="Card Holder Name"
                      onChangeText={handleChange('cc_holder')}
                      fontColor="#707070"
                      error={touched.cc_holder && errors.cc_holder}
                      errorText={touched.cc_holder && errors.cc_holder}
                    />
                  </Block>
                  <Block center margin={[hp(2), 0, 0]} flex={false}>
                    <NeoInputField
                      // width={70}
                      placeholder="Card number"
                      value={values.cc_number}
                      number
                      selectTextOnFocus={
                        !strictValidStringWithMinLength(values.id)
                      }
                      onChangeText={(e) => {
                        const CCFormatted = cc_format(e);
                        setFieldValue('cc_number', CCFormatted);
                      }}
                      maxLength={19}
                      onBlur={() => setFieldTouched('cc_number')}
                      error={touched.cc_number && errors.cc_number}
                      icon={cardImage}
                      keyboardType="number-pad"
                    />
                  </Block>
                  <Block
                    center
                    margin={[hp(2), 0, 0]}
                    row
                    space={'around'}
                    flex={false}>
                    <NeoInputField
                      width={43}
                      maxLength={5}
                      placeholder="Expiry Date"
                      number
                      value={values.cc_expiry}
                      onChangeText={(e) => {
                        const CCFormatted = cc_expires_format(e);
                        setFieldValue('cc_expiry', CCFormatted);
                      }}
                      onBlur={() => {
                        setFieldTouched('cc_expiry');
                      }}
                      error={touched.cc_expiry && errors.cc_expiry}
                      icon=""
                      keyboardType="number-pad"
                    />
                    <NeoInputField
                      style={{width: wp(12)}}
                      maxLength={3}
                      width={43}
                      placeholder="CVV"
                      type="number"
                      number
                      secureTextEntry
                      icon=""
                      value={values.cc_cvv}
                      onChangeText={handleChange('cc_cvv')}
                      onBlur={() => setFieldTouched('cc_cvv')}
                      error={touched.cc_expiry && errors.cc_expiry}
                      keyboardType="number-pad"
                    />
                  </Block>
                  <Block flex={false} margin={[hp(1), 0, 0]}>
                    {errors.cc_holder &&
                      errorText('Card Holder Name is required')}
                    {errors.cc_number && errorText('Card Number is Invalid')}
                    {errors.cc_expiry && errorText('Expiry Date is Invalid')}
                    {errors.cc_cvv && errorText('CVV is Invalid')}
                  </Block>
                </ScrollView>
                <Block flex={false} margin={[0, 0, hp(4), 0]}>
                  <Text margin={[hp(1), 0]} purple semibold>
                    Total Payment : ${price}
                  </Text>
                  <Button
                    disabled={!dirty || !isValid}
                    onPress={handleSubmit}
                    linear
                    color="primary">
                    Make Payment
                  </Button>
                  <Text center margin={[hp(1), 0]} purple semibold>
                    Or
                  </Text>
                  <IAPButton title={buttonTitle} sku={sku} details={params} />
                </Block>
              </>
            );
          }}
        </Formik>
      </Block>
      {loading ? <LoadingView /> : null}
    </Block>
  );
};
const styles = StyleSheet.create({
  linear: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

export default Payment;
