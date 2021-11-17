import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Bar} from 'react-native-progress';
import {wp, hp} from './responsive';

import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import Block from './Block';
import {
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
} from '../utils/commonUtils';
// import config from '../config';
import Text from './Text';
import {APIURL} from '../Constants/APIURL';
import {CommonColors} from '../Constants/ColorConstant';

const UploadImage = ({
  children,
  file: selectedfile,
  onUploadComplete,
  onProgressChange,
}) => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [progress, setProgress] = useState(-1);
  const navigation = useNavigation();

  useEffect(() => {
    if (strictValidObjectWithKeys(selectedfile)) {
      setFiles((prevState) => [selectedfile]);
    }
  }, [selectedfile]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      setUploadedFiles([]);
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    if (progress >= 0 && progress < 100) {
      onProgressChange(true);
    } else {
      onProgressChange(false);
    }
  }, [progress]);
  const upload = async (index = 0) => {
    if (strictValidArrayWithLength(files)) {
      const file = files[index];
      // var getFilename = res.path.split('/');
      // const imgName = getFilename[getFilename.length - 1];
      // console.log(imgName, 'path from library');
      // console.log(res, 'jkfgsdfysgdyfguydsgfuyfguysdg');
      const token = await AsyncStorage.getItem('token');
      // const parsedToken = JSON.parse(token);
      const date = new Date();
      const tempPath = `${
        RNFS.DocumentDirectoryPath
      }/${date.getMilliseconds()}${date.getHours()}`;

      await RNFS.copyFile(file.uri, tempPath);

      const fileExist = await RNFS.exists(tempPath);

      if (!fileExist) {
        Alert.alert('does not exist!');
        return false;
      }
      const _headers = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      };
      let res = {};

      res = await RNFetchBlob.fetch(
        'POST',
        `${APIURL.BaseURL}add-member-uplod-file`,
        _headers,
        [
          {
            name: 'image',
            filename: file.fileName || file.name,
            type: file.type,
            data: RNFetchBlob.wrap(tempPath),
          },
        ],
      )
        .uploadProgress({count: 10}, (written, total) => {
          const percent_completed = (written / total) * 100;
          setProgress(percent_completed);
        })
        .catch((err) => {
          console.log(err);
        });
      const val = await JSON.parse(res.data);
      onUploadComplete(val);
      setUploadedFiles(() => [val]);
      setProgress(98);
      setTimeout(() => {
        setProgress(100);
      }, 1000);
      return val;
    }
  };

  useEffect(() => {
    upload();
  }, [files]);

  return (
    <Block blackColor flex={false}>
      {children}

      {progress > 1 && progress !== 100 && (
        <Bar
          style={{marginTop: hp(2)}}
          color={CommonColors.gradientEnd}
          progress={progress / 100}
          width={wp(80)}
        />
      )}
    </Block>
  );
};

UploadImage.propTypes = {
  children: PropTypes.shape(PropTypes.object),
  file: PropTypes.shape(PropTypes.object),
  onUploadComplete: PropTypes.func.isRequired,
  onProgressChange: PropTypes.func.isRequired,
};

export default UploadImage;
