import {useRoute} from '@react-navigation/native';
import React from 'react';
import {View, SafeAreaView} from 'react-native';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import HeaderSettings from '../../../common/header-setting';
import {Block, ImageComponent} from '../../../components';
import {APIURL} from '../../../Constants/APIURL';
import {
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/commonUtils';

const PreviewProfile = () => {
  const {params} = useRoute();
  const {width} = useWindowDimensions();
  const {profile} = params;
  return (
    <Block color="#F2EDFA">
      <SafeAreaView />
      <HeaderSettings title="Preview" />
      {strictValidObjectWithKeys(profile) &&
      strictValidString(profile.avatar) ? (
        <Block center={true} middle={true} flex={0.9}>
          <ImageComponent
            isURL
            name={`${APIURL.ImageUrl}${profile.avatar}`}
            height={400}
            width={width}
            radius={5}
          />
        </Block>
      ) : (
        <ImageComponent name="demouser" height={100} width={100} />
      )}
    </Block>
  );
};

export default PreviewProfile;
