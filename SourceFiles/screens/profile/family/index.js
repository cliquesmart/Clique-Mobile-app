import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Block, Text, ImageComponent, Button} from '../../../components';
import {hp, wp} from '../../../components/responsive';
import NeuView from '../../../common/neu-element/lib/NeuView';
import NeuButton from '../../../common/neu-element/lib/NeuButton';
import NeuInput from '../../../common/neu-element/lib/NeuInput';
import {useNavigation, useRoute} from '@react-navigation/core';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/commonUtils';
import * as yup from 'yup';
import {Formik} from 'formik';
import {APIURL} from '../../../Constants/APIURL';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ValidationMsg from '../../../Constants/ValidationMsg';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Webservice from '../../../Constants/API';
import {showAlert, UPLOAD} from '../../../utils/mobile-utils';
import LoadingView from '../../../Constants/LoadingView';
import moment from 'moment';
import {Modalize} from 'react-native-modalize';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker from 'react-native-document-picker';
import {light} from '../../../components/theme/colors';

const AddFamilyMember = () => {
  const {params} = useRoute();
  const {item} = params;
  const {goBack} = useNavigation();
  const [action, setAction] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const modalizeRef = useRef();
  const formikRef = useRef();
  const [profileImage, setProfileImage] = useState('');
  const [loading, setloading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(
    strictValidObjectWithKeys(item) &&
      strictValidArrayWithLength(item.uplod_file)
      ? item.uplod_file
      : [],
  );
  const [uploadededFiles, setUploadededFiles] = useState([]);

  useEffect(() => {
    let data = [];
    if (
      strictValidObjectWithKeys(item) &&
      strictValidArrayWithLength(item.uplod_file)
    ) {
      item.uplod_file.map((a) => {
        data.push(a.url);
      });
      setUploadededFiles(data);
    }
  }, [strictValidObjectWithKeys(item) && item.uplod_file]);
  const btnSelectImage = () => {
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
                console.log(JSON.stringify(response));

                if (response.didCancel) {
                  console.log('User cancelled photo picker');
                } else if (response.errorCode) {
                  console.log('ImagePicker Error: ', response.errorCode);

                  if (response.errorCode == 'permission') {
                    alert('Please allow Camera permission from Setting');
                  }
                } else if (response.customButton) {
                  console.log(
                    'User tapped custom button: ',
                    response.customButton,
                  );
                } else {
                  ImagePicker.openCropper({
                    compressImageQuality: 0.7,
                    path: response.uri,
                    width: 300,
                    includeBase64: true,
                    cropperCircleOverlay: true,
                    height: 300,
                  })
                    .then((image) => {
                      console.log(image);

                      var dict = {};
                      dict.base64 = image.data;
                      dict.uri = image.path;
                      dict.type = image.mime;
                      setProfileImage(dict);
                    })
                    .catch((e) => {
                      // alert(e);

                      console.log(' Error :=>  ' + e);
                    });
                }
              },
            );
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                includeBase64: true,
                quality: 0.7,
              },
              (response) => {
                console.log(JSON.stringify(response));

                if (response.didCancel) {
                  console.log('User cancelled photo picker');
                } else if (response.errorCode) {
                  console.log('ImagePicker Error: ', response.error);

                  if (response.errorCode == 'permission') {
                    alert('Please allow Camera permission from Setting');
                  }
                } else if (response.customButton) {
                  console.log(
                    'User tapped custom button: ',
                    response.customButton,
                  );
                } else {
                  ImagePicker.openCropper({
                    compressImageQuality: 0.7,
                    path: response.uri,
                    width: 300,
                    includeBase64: true,
                    cropperCircleOverlay: true,
                    height: 300,
                  })
                    .then((image) => {
                      console.log(image);

                      var dict = {};
                      dict.base64 = image.data;
                      dict.uri = image.path;
                      dict.type = image.mime;
                      setProfileImage(dict);
                    })
                    .catch((e) => {
                      // alert(e);

                      console.log(' Error :=>  ' + e);
                    });
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
  const renderHeader = () => {
    return (
      <Block center padding={[hp(2), wp(3)]} space="between" flex={false} row>
        <Text white semibold size={18}>
          {'      '}
        </Text>
        <Text white semibold size={18}>
          {'Add Family Member'}
        </Text>
        <TouchableOpacity onPress={() => goBack()}>
          <NeuView
            concave
            color="#E866B6"
            width={40}
            height={40}
            borderRadius={20}
            customGradient={['#BD64CE', '#AE28A1']}>
            <ImageComponent
              resizeMode="contain"
              height={14}
              width={14}
              name={'close_icon'}
              color="#fff"
            />
          </NeuView>
        </TouchableOpacity>
      </Block>
    );
  };

  const renderProfileImagePath = () => {
    if (profileImage.uri) {
      return profileImage.uri;
    }
    if (strictValidObjectWithKeys(item) && strictValidString(item.photo)) {
      return `${APIURL.ImageUrl}/${item.photo}`;
    }

    return 'default_profile';
  };
  const renderProfile = () => {
    return (
      <Block alignSelf="center" padding={[0, wp(3)]} flex={false}>
        <ImageComponent
          isURL={renderProfileImagePath() !== 'default_profile'}
          name={renderProfileImagePath()}
          height={80}
          width={80}
          radius={80}
        />
        <TouchableOpacity
          onPress={() => btnSelectImage()}
          style={{
            position: 'absolute',
            top: 0,
          }}>
          <NeuView color="#F2F0F7" height={30} width={30} borderRadius={30}>
            <ImageComponent
              resizeMode="contain"
              height={18}
              width={18}
              name={'edit_icon'}
              color="#6F3AC8"
            />
          </NeuView>
        </TouchableOpacity>
      </Block>
    );
  };
  const fomatDOB = (a) => {
    return moment(a).format('MM/DD/YYYY');
  };
  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    // setDob(fomatDOB(date));
    console.log(formikRef.current, 'formik');
    formikRef.current?.setFieldValue('dob', fomatDOB(date));
    console.log('A date has been picked: ', date);
    hideDatePicker();
  };

  const closeModal = (val) => {
    // setGender(val);
    modalizeRef.current?.close();
  };

  const typeOfAction = (v) => {
    Keyboard.dismiss();
    modalizeRef.current?.open();
    setAction(v);
  };

  const removeItemFromArray = (ele) => {
    const images = uploadedFiles.filter((prod, i) => i !== ele);
    setUploadedFiles(images);

    const savedImages = uploadededFiles.filter((prod, i) => i !== ele);
    setUploadededFiles(savedImages);
  };

  const btnChooseResumeFile = async () => {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.allFiles],
      });

      if (res.size > '5000000') {
        showAlert('you can upload file max 5 mb');
      } else if (uploadedFiles.length >= 5) {
        showAlert('you can upload 5 files at one time');
      } else {
        const {uri} = res;
        const uriParts = uri.split('.');
        const filename = uriParts[uriParts.length - 1];

        // setUploadedFiles((state) => res);
        // console.log(res, 'res');

        // console.log(
        //   'Selected File : ' + res.uri,
        //   res.type, // mime type
        //   res.name,
        //   res.size,
        // );
        setloading(true);
        const response = await UPLOAD(
          res.name ? res.name : `photo.${filename}`,
          Platform.OS === 'ios' ? res.uri : res.uri,
          res.type,
        );
        if (response) {
          setloading(false);

          const parsed = JSON.parse(response.data);
          console.log(
            response,
            'respose getting from the backend ====== > ',
            parsed,
          );
          setUploadedFiles((state) => [...state, res]);
          if (strictValidObjectWithKeys(parsed)) {
            setUploadededFiles((prevState) => [
              ...prevState,
              parsed.uplod_file,
            ]);
          }
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  const onSubmit = (value) => {
    setloading(true);
    if (strictValidObjectWithKeys(item) && item.id) {
      const data = {
        start_name: value.title,
        first_name: value.firstName,
        last_name: value.lastName,
        mobile_no: value.mobileNumber,
        landline: value.landlineNumber,
        personal_id: value.personalId,
        date_of_birth: value.dob,
        sex: value.sex,
        marital_status: value.maritial_status,
        email_id: value.email,
        address: value.address,
        relation: value.relation,
        govt_id: value.govtId,
        mother_tounge: value.mothertounge,
        photo: strictValidObjectWithKeys(profileImage)
          ? profileImage.base64
          : strictValidObjectWithKeys(item) && item.photo,
        uplod_file: strictValidArrayWithLength(uploadededFiles)
          ? uploadededFiles
          : '',
        govt_id_number: value.idNumber,
      };
      Webservice.post(`${APIURL.UpdateMember}/${item.id}`, data)
        .then((response) => {
          if (response.data == null) {
            setloading(false);
            // alert('error');
            showAlert(response.originalError.message);
            return;
          }
          //   console.log(response);
          console.log(
            'Get Edit Profile Response : ' + JSON.stringify(response),
          );

          if (response.data.status === true) {
            setloading(false);
            showAlert(response.data.message);
            goBack();
          } else {
            setloading(false);
            showAlert(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error.message);
          setloading(false);
          Alert.alert(error.message);
        });
      console.log({...value, photo: profileImage.base64, uploadedFiles});
    } else {
      const data = {
        start_name: value.title,
        first_name: value.firstName,
        last_name: value.lastName,
        mobile_no: value.mobileNumber,
        landline: value.landlineNumber,
        personal_id: value.personalId,
        date_of_birth: value.dob,
        sex: value.sex,
        marital_status: value.maritial_status,
        email_id: value.email,
        address: value.address,
        relation: value.relation,
        govt_id: value.govtId,
        mother_tounge: value.mothertounge,
        photo: strictValidObjectWithKeys(profileImage)
          ? profileImage.base64
          : '',
        uplod_file: strictValidArrayWithLength(uploadededFiles)
          ? uploadededFiles
          : '',
        govt_id_number: value.idNumber,
      };
      Webservice.post(APIURL.AddMember, data)
        .then((response) => {
          if (response.data == null) {
            setloading(false);
            // alert('error');
            showAlert(response.originalError.message);
            return;
          }
          //   console.log(response);
          console.log(
            'Get Edit Profile Response : ' + JSON.stringify(response),
          );

          if (response.data.status === true) {
            setloading(false);
            showAlert(response.data.message);
            goBack();
          } else {
            setloading(false);
            showAlert(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error.message);
          setloading(false);
          Alert.alert(error.message);
        });
      console.log({...value, photo: profileImage.base64, uploadedFiles});
    }
  };
  return (
    <>
      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={{
          firstName: (strictValidObjectWithKeys(item) && item.first_name) || '',
          lastName: (strictValidObjectWithKeys(item) && item.last_name) || '',
          email: (strictValidObjectWithKeys(item) && item.email_id) || '',
          mobileNumber:
            (strictValidObjectWithKeys(item) && item.mobile_no) || '',
          landlineNumber:
            (strictValidObjectWithKeys(item) && item.landline) || '',
          address: (strictValidObjectWithKeys(item) && item.address) || '',
          dob: (strictValidObjectWithKeys(item) && item.date_of_birth) || '',
          sex: (strictValidObjectWithKeys(item) && item.sex) || '',
          mothertounge:
            (strictValidObjectWithKeys(item) && item.mother_tounge) || '',
          govtId: (strictValidObjectWithKeys(item) && item.govt_id) || '',
          idNumber:
            (strictValidObjectWithKeys(item) && item.govt_id_number) || '',
          relation: (strictValidObjectWithKeys(item) && item.relation) || '',
          maritial_status:
            (strictValidObjectWithKeys(item) && item.marital_status) || '',
          title: (strictValidObjectWithKeys(item) && item.start_name) || '',
        }}
        onSubmit={onSubmit}
        validationSchema={yup.object().shape({
          firstName: yup.string().min(1).required(),
          title: yup.string().min(1).required(),
          lastName: yup.string().min(1).required(),
          email: yup.string().email().required(),
          mobileNumber: yup.string().min(8).required(),
          address: yup.string().min(3).required(),
          dob: yup.string().min(1).required(),
          sex: yup.string().min(1).required(),
          mothertounge: yup.string().min(1).required(),
          govtId: yup.string().min(1).required(),
          idNumber: yup.string().min(1).required(),
          relation: yup.string().min(1).required(),
          maritial_status: yup.string().min(1).required(),
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
          console.log(errors, 'errors', values);
          console.log(dirty, isValid);
          const {
            sex,
            firstName,
            lastName,
            mothertounge,
            email,
            address,
            mobileNumber,
            landlineNumber,
            govtId,
            idNumber,
            title,
            personalId,
            dob,
            relation,
            maritial_status,
          } = values;
          return (
            <>
              <Block linear>
                <StatusBar barStyle="light-content" />
                <SafeAreaView />
                {renderHeader()}
                <>
                  <ScrollView
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={styles.container}
                    bounces={false}>
                    <Block
                      style={{flexGrow: 1}}
                      borderTopLeftRadius={20}
                      borderTopRightRadius={20}
                      padding={[hp(2), wp(3)]}
                      color="#F2EDFA">
                      {renderProfile()}
                      <Block
                        margin={[hp(1), 0]}
                        alignSelf="center"
                        flex={false}>
                        <Text
                          uppercase
                          grey
                          semibold
                          center
                          margin={[0, 0, hp(2)]}>
                          {title} {firstName} {lastName}
                        </Text>
                        <Block
                          margin={[0, 0, hp(2)]}
                          alignSelf="center"
                          flex={false}>
                          <NeuButton
                            error={touched.title && errors.title}
                            onPress={() => typeOfAction('title')}
                            color="#eef2f9"
                            width={wp(80)}
                            height={hp(5)}
                            containerStyle={styles.buttonStyle}
                            borderRadius={16}>
                            <Text
                              capitalize
                              grey={!strictValidString(title)}
                              black={strictValidString(title)}
                              size={14}>
                              {strictValidString(title) ? title : 'Title'}
                            </Text>
                            <Block flex={false} margin={[0, wp(2), 0, 0]}>
                              <ImageComponent
                                name="down_arrow_icon"
                                height={10}
                                width={16}
                              />
                            </Block>
                          </NeuButton>
                        </Block>

                        <NeuInput
                          width={wp(80)}
                          height={hp(5)}
                          borderRadius={16}
                          color="#eef2f9"
                          onChangeText={handleChange('firstName')}
                          value={firstName}
                          placeholder="First Name"
                          onBlur={() => setFieldTouched('firstName')}
                          placeholderTextColor="grey"
                          errorText={touched.firstName && errors.firstName}
                          error={touched.firstName && errors.firstName}
                        />
                      </Block>
                      <Block
                        margin={[hp(1), 0]}
                        alignSelf="center"
                        flex={false}>
                        <NeuInput
                          width={wp(80)}
                          height={hp(5)}
                          borderRadius={16}
                          color="#eef2f9"
                          onChangeText={handleChange('lastName')}
                          value={lastName}
                          placeholder="Last Name"
                          placeholderTextColor="grey"
                          onBlur={() => setFieldTouched('lastName')}
                          errorText={touched.lastName && errors.lastName}
                          error={touched.lastName && errors.lastName}
                        />
                      </Block>
                      <Block
                        margin={[hp(1), 0]}
                        alignSelf="center"
                        flex={false}>
                        <NeuInput
                          width={wp(80)}
                          height={hp(5)}
                          borderRadius={16}
                          color="#eef2f9"
                          onChangeText={handleChange('email')}
                          value={email}
                          placeholder="Email"
                          placeholderTextColor="grey"
                          onBlur={() => setFieldTouched('email')}
                          errorText={touched.email && errors.email}
                          error={touched.email && errors.email}
                          keyboardType="email-address"
                        />
                      </Block>
                      <Block
                        margin={[hp(1), 0]}
                        alignSelf="center"
                        flex={false}>
                        <NeuInput
                          width={wp(80)}
                          height={hp(5)}
                          borderRadius={16}
                          containerStyle={{paddingVetical: hp(1)}}
                          color="#eef2f9"
                          onChangeText={handleChange('mobileNumber')}
                          value={mobileNumber}
                          placeholder="Mobile Number"
                          keyboardType="number-pad"
                          placeholderTextColor="grey"
                          onBlur={() => setFieldTouched('mobileNumber')}
                          errorText={
                            touched.mobileNumber && errors.mobileNumber
                          }
                          error={touched.mobileNumber && errors.mobileNumber}
                        />
                      </Block>
                      <Block
                        margin={[hp(1), 0]}
                        alignSelf="center"
                        flex={false}>
                        <NeuInput
                          width={wp(80)}
                          height={hp(5)}
                          borderRadius={16}
                          containerStyle={{paddingVetical: hp(1)}}
                          color="#eef2f9"
                          onChangeText={handleChange('landlineNumber')}
                          value={landlineNumber}
                          placeholder="Landline Number"
                          placeholderTextColor="grey"
                          keyboardType="number-pad"
                          onBlur={() => setFieldTouched('landlineNumber')}
                          errorText={
                            touched.landlineNumber && errors.landlineNumber
                          }
                          error={
                            touched.landlineNumber && errors.landlineNumber
                          }
                        />
                      </Block>
                      <Block
                        margin={[hp(1), 0]}
                        alignSelf="center"
                        flex={false}>
                        <NeuInput
                          width={wp(80)}
                          height={hp(5)}
                          borderRadius={16}
                          containerStyle={{paddingVetical: hp(1)}}
                          color="#eef2f9"
                          onChangeText={handleChange('address')}
                          value={address}
                          placeholder="Address"
                          placeholderTextColor="grey"
                          onBlur={() => setFieldTouched('address')}
                          errorText={touched.address && errors.address}
                          error={touched.address && errors.address}
                        />
                      </Block>
                      {/* <Block
                        margin={[hp(1), 0]}
                        alignSelf="center"
                        flex={false}>
                        <NeuInput
                          width={wp(80)}
                          height={hp(5)}
                          borderRadius={16}
                          containerStyle={{paddingVetical: hp(1)}}
                          color="#eef2f9"
                          onChangeText={handleChange('personalId')}
                          value={personalId}
                          placeholder="Personal ID"
                          placeholderTextColor="grey"
                          onBlur={() => setFieldTouched('personalId')}
                          errorText={touched.personalId && errors.personalId}
                          error={touched.personalId && errors.personalId}
                        />
                      </Block> */}
                      <Block center flex={false} margin={[hp(1), 0]}>
                        <NeuButton
                          error={touched.relation && errors.relation}
                          onPress={() => typeOfAction('relation')}
                          color="#eef2f9"
                          width={wp(80)}
                          height={hp(5)}
                          containerStyle={styles.buttonStyle}
                          borderRadius={16}>
                          <Text
                            capitalize
                            grey={!strictValidString(relation)}
                            black={strictValidString(relation)}
                            size={14}>
                            {strictValidString(relation)
                              ? relation
                              : 'Relation'}
                          </Text>
                          <Block flex={false} margin={[0, wp(2), 0, 0]}>
                            <ImageComponent
                              name="down_arrow_icon"
                              height={10}
                              width={16}
                            />
                          </Block>
                        </NeuButton>
                      </Block>
                      <Block center flex={false} margin={[hp(1), 0]}>
                        <NeuButton
                          error={
                            touched.maritial_status && errors.maritial_status
                          }
                          onPress={() => typeOfAction('maritial_status')}
                          color="#eef2f9"
                          width={wp(80)}
                          height={hp(5)}
                          containerStyle={styles.buttonStyle}
                          borderRadius={16}>
                          <Text
                            capitalize
                            grey={!strictValidString(maritial_status)}
                            black={strictValidString(maritial_status)}
                            size={14}>
                            {strictValidString(maritial_status)
                              ? maritial_status
                              : 'Mariatial Status'}
                          </Text>
                          <Block flex={false} margin={[0, wp(2), 0, 0]}>
                            <ImageComponent
                              name="down_arrow_icon"
                              height={10}
                              width={16}
                            />
                          </Block>
                        </NeuButton>
                      </Block>
                      <Block center flex={false} margin={[hp(1), 0]}>
                        <NeuButton
                          error={touched.dob && errors.dob}
                          onPress={() => setIsDatePickerVisible(true)}
                          color="#eef2f9"
                          width={wp(80)}
                          height={hp(5)}
                          containerStyle={styles.buttonStyle}
                          borderRadius={16}>
                          <Text
                            grey={!strictValidString(dob)}
                            black={strictValidString(dob)}
                            size={14}>
                            {strictValidString(dob) ? dob : 'MM/DD/YYYY'}
                          </Text>
                          <Block flex={false} margin={[0, wp(2), 0, 0]}>
                            <ImageComponent
                              name="down_arrow_icon"
                              height={10}
                              width={16}
                            />
                          </Block>
                        </NeuButton>
                      </Block>
                      <Block
                        margin={[hp(1), 0]}
                        alignSelf="center"
                        flex={false}>
                        <NeuButton
                          error={touched.sex && errors.sex}
                          onPress={() => typeOfAction('sex')}
                          color="#eef2f9"
                          width={wp(80)}
                          height={hp(5)}
                          containerStyle={styles.buttonStyle}
                          borderRadius={16}>
                          <Text
                            capitalize
                            grey={!strictValidString(sex)}
                            black={strictValidString(sex)}
                            size={14}>
                            {strictValidString(sex) ? sex : 'Sex'}
                          </Text>
                          <Block flex={false} margin={[0, wp(2), 0, 0]}>
                            <ImageComponent
                              name="down_arrow_icon"
                              height={10}
                              width={16}
                            />
                          </Block>
                        </NeuButton>
                      </Block>
                      <Block center flex={false} margin={[hp(1), 0]}>
                        <NeuButton
                          error={touched.mothertounge && errors.mothertounge}
                          onPress={() => typeOfAction('mother_tounge')}
                          color="#eef2f9"
                          width={wp(80)}
                          height={hp(5)}
                          containerStyle={styles.buttonStyle}
                          borderRadius={16}>
                          <Text
                            capitalize
                            grey={!strictValidString(mothertounge)}
                            black={strictValidString(mothertounge)}
                            size={14}>
                            {strictValidString(mothertounge)
                              ? mothertounge
                              : 'Mother Toungue'}
                          </Text>
                          <Block flex={false} margin={[0, wp(2), 0, 0]}>
                            <ImageComponent
                              name="down_arrow_icon"
                              height={10}
                              width={16}
                            />
                          </Block>
                        </NeuButton>
                      </Block>
                      <Block center flex={false} margin={[hp(1), 0]}>
                        <NeuButton
                          error={touched.govtId && errors.govtId}
                          onPress={() => typeOfAction('govtId')}
                          color="#eef2f9"
                          width={wp(80)}
                          height={hp(5)}
                          containerStyle={styles.buttonStyle}
                          borderRadius={16}>
                          <Text
                            capitalize
                            grey={!strictValidString(govtId)}
                            black={strictValidString(govtId)}
                            size={14}>
                            {strictValidString(govtId) ? govtId : 'Govt ID'}
                          </Text>
                          <Block flex={false} margin={[0, wp(2), 0, 0]}>
                            <ImageComponent
                              name="down_arrow_icon"
                              height={10}
                              width={16}
                            />
                          </Block>
                        </NeuButton>
                      </Block>

                      {strictValidString(govtId) && (
                        <Block
                          margin={[hp(1), 0]}
                          alignSelf="center"
                          flex={false}>
                          <NeuInput
                            width={wp(80)}
                            height={hp(5)}
                            borderRadius={16}
                            color="#eef2f9"
                            onChangeText={handleChange('idNumber')}
                            value={idNumber}
                            placeholder="Govt ID Number"
                            placeholderTextColor="grey"
                            onBlur={() => setFieldTouched('idNumber')}
                            errorText={touched.idNumber && errors.idNumber}
                            error={touched.idNumber && errors.idNumber}
                          />
                        </Block>
                      )}
                      <Block center flex={false} margin={[hp(1), 0, 0]}>
                        <NeuButton
                          onPress={() => btnChooseResumeFile('uploaded')}
                          color="#eef2f9"
                          width={wp(80)}
                          height={hp(5)}
                          containerStyle={styles.buttonStyle}
                          borderRadius={16}>
                          <Text
                            capitalize
                            grey={!strictValidArrayWithLength(uploadedFiles)}
                            black={strictValidArrayWithLength(uploadedFiles)}
                            size={14}>
                            {strictValidArrayWithLength(uploadedFiles)
                              ? `${uploadedFiles.length} file selected`
                              : 'Upload Files'}
                          </Text>
                          <Block flex={false} margin={[0, wp(2), 0, 0]}>
                            <ImageComponent
                              name="down_arrow_icon"
                              height={10}
                              width={16}
                            />
                          </Block>
                        </NeuButton>
                      </Block>
                    </Block>
                    <FlatList
                      data={uploadedFiles}
                      renderItem={({item, index}) => {
                        return (
                          <Block
                            row
                            space="between"
                            padding={[hp(0.2), wp(10)]}
                            flex={false}>
                            <Text size={14} grey>
                              {item.name}
                            </Text>
                            <TouchableOpacity
                              onPress={() => removeItemFromArray(index)}>
                              <ImageComponent
                                name="close_icon"
                                height={10}
                                width={10}
                                color={light.danger}
                              />
                            </TouchableOpacity>
                          </Block>
                        );
                      }}
                    />
                  </ScrollView>
                  <Block
                    flex={false}
                    color="#F2EDFA"
                    padding={[0, wp(3), hp(4)]}>
                    <Button
                      disabled={!isValid}
                      isLoading={loading}
                      onPress={handleSubmit}
                      color="primary"
                      linear>
                      Save
                    </Button>
                  </Block>
                </>
              </Block>

              <Modalize
                adjustToContentHeight={true}
                tapGestureEnabled={false}
                handlePosition="inside"
                overlayStyle={{backgroundColor: 'rgba(72, 30, 140,0.7)'}}
                handleStyle={{backgroundColor: '#6B37C3'}}
                modalStyle={[{backgroundColor: '#F2F0F7'}]}
                ref={modalizeRef}>
                {action === 'sex' && (
                  <Block flex={false} margin={[hp(1), 0, 0]} padding={[hp(4)]}>
                    <Text
                      semibold
                      purple
                      margin={[0, 0, hp(2)]}
                      size={16}
                      center>
                      Select Gender
                    </Text>
                    <Block flex={false} margin={[hp(1), 0, 0]} center>
                      <NeuButton
                        onPress={() => {
                          closeModal();
                          setFieldValue('sex', 'male');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        // containerStyle={styles.buttonStyle}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Male
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal();
                          setFieldValue('sex', 'female');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Female
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal();
                          setFieldValue('sex', 'transgender');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Transgender
                        </Text>
                      </NeuButton>
                    </Block>
                  </Block>
                )}
                {action === 'title' && (
                  <Block flex={false} margin={[hp(1), 0, 0]} padding={[hp(4)]}>
                    <Text
                      semibold
                      purple
                      margin={[0, 0, hp(2)]}
                      size={16}
                      center>
                      Select Title
                    </Text>
                    <Block flex={false} margin={[hp(1), 0, 0]} center>
                      <NeuButton
                        onPress={() => {
                          closeModal('male');
                          setFieldValue('title', 'Mr.');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        // containerStyle={styles.buttonStyle}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Mr.
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal('female');
                          setFieldValue('title', 'Mrs.');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Mrs.
                        </Text>
                      </NeuButton>
                    </Block>
                  </Block>
                )}
                {action === 'govtId' && (
                  <Block flex={false} margin={[hp(1), 0, 0]} padding={[hp(4)]}>
                    <Text
                      semibold
                      purple
                      margin={[0, 0, hp(2)]}
                      size={16}
                      center>
                      Select Govt ID
                    </Text>
                    <Block flex={false} margin={[hp(1), 0, 0]} center>
                      <NeuButton
                        onPress={() => {
                          closeModal('male');
                          setFieldValue('govtId', 'Adhaar Card');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        // containerStyle={styles.buttonStyle}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Adhaar Card
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal('female');
                          setFieldValue('govtId', 'Driving License');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Driving License
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal('transgender');
                          setFieldValue('govtId', 'Passport');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Passport
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal('transgender');
                          setFieldValue('govtId', ' Pan Card');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Pan Card
                        </Text>
                      </NeuButton>
                    </Block>
                  </Block>
                )}
                {action === 'mother_tounge' && (
                  <Block flex={false} margin={[hp(1), 0, 0]} padding={[hp(4)]}>
                    <Text
                      semibold
                      purple
                      margin={[0, 0, hp(2)]}
                      size={16}
                      center>
                      Select Mother Toungue
                    </Text>
                    <Block flex={false} margin={[hp(1), 0, 0]} center>
                      <NeuButton
                        onPress={() => {
                          closeModal('male');
                          setFieldValue('mothertounge', 'Hindi');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        // containerStyle={styles.buttonStyle}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Hindi
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal('female');
                          setFieldValue('mothertounge', 'English');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          English
                        </Text>
                      </NeuButton>
                    </Block>
                  </Block>
                )}
                {action === 'relation' && (
                  <Block flex={false} margin={[hp(1), 0, 0]} padding={[hp(4)]}>
                    <Text
                      semibold
                      purple
                      margin={[0, 0, hp(2)]}
                      size={16}
                      center>
                      Select Relation
                    </Text>
                    <Block flex={false} margin={[hp(1), 0, 0]} center>
                      <NeuButton
                        onPress={() => {
                          closeModal('male');
                          setFieldValue('relation', 'Self');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Self
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block flex={false} margin={[hp(2), 0, 0]} center>
                      <NeuButton
                        onPress={() => {
                          closeModal('male');
                          setFieldValue('relation', 'Mother');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Mother
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal('female');
                          setFieldValue('relation', 'Father');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Father
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal('female');
                          setFieldValue('relation', 'Wife');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Wife
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal('female');
                          setFieldValue('relation', 'Son');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Son
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal('female');
                          setFieldValue('relation', 'Daughter');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Daughter
                        </Text>
                      </NeuButton>
                    </Block>
                  </Block>
                )}
                {action === 'maritial_status' && (
                  <Block flex={false} margin={[hp(1), 0, 0]} padding={[hp(4)]}>
                    <Text
                      semibold
                      purple
                      margin={[0, 0, hp(2)]}
                      size={16}
                      center>
                      Select Maritial Status
                    </Text>
                    <Block flex={false} margin={[hp(1), 0, 0]} center>
                      <NeuButton
                        onPress={() => {
                          closeModal('male');
                          setFieldValue('maritial_status', 'Single');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Single
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal('female');
                          setFieldValue('maritial_status', 'Married');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Married
                        </Text>
                      </NeuButton>
                    </Block>
                    <Block center flex={false} margin={[hp(2), 0, 0]}>
                      <NeuButton
                        onPress={() => {
                          closeModal('female');
                          setFieldValue('maritial_status', 'Widow');
                        }}
                        color="#eef2f9"
                        width={wp(90)}
                        height={hp(5)}
                        borderRadius={16}>
                        <Text grey size={14}>
                          Widow
                        </Text>
                      </NeuButton>
                    </Block>
                  </Block>
                )}
              </Modalize>
            </>
          );
        }}
      </Formik>
      {loading ? <LoadingView /> : null}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        inline
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F2EDFA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  linear: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  neomorphStyle: {
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  activeNeomorph: {
    borderRadius: 10,
    shadowRadius: 6,
    backgroundColor: '#F2F0F7',
    padding: hp(1),
  },
  inactiveText: {
    width: wp(20),
  },
  containerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  neoContainer: {flexDirection: 'row'},
  deleteAccountButton: {position: 'absolute', top: 0, right: 0},
  flexStyle: {
    flexGrow: 1,
    paddingHorizontal: wp(1),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonStyle: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
    flexDirection: 'row',
  },
});
export default AddFamilyMember;
