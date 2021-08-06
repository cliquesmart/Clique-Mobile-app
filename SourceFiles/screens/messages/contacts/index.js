import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import HeaderPostLogin from '../../../common/header-post-login';
import Neomorph from '../../../common/shadow-src/Neomorph';
import {Block, ImageComponent, Text} from '../../../components';
import {hp, wp} from '../../../components/responsive';
import {useNavigation} from '@react-navigation/native';

const Contacts = () => {
  const {navigate} = useNavigation();
  const selectProfileTap = (item) => {
    requestAnimationFrame(() => {
      navigate('UserProfile', {profile_id: 395});
    });
  };
  const _renderItem = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          selectProfileTap();
        }}
        style={{alignSelf: 'center'}}>
        <Neomorph style={styles.neoSubContainer}>
          <Block padding={[0, wp(3)]} row center flex={false}>
            <ImageComponent
              name="tejus_icon"
              height={70}
              width={70}
              radius={70}
            />
            <Block margin={[0, 0, 0, wp(3)]} flex={false}>
              <Text semibold grey size={18}>
                Tejus V Reddy
              </Text>
              <Text height={26} regular grey size={14}>
                Founder
              </Text>
            </Block>
          </Block>
        </Neomorph>
      </TouchableOpacity>
    );
  };
  return (
    <Block linear>
      <SafeAreaView />
      <HeaderPostLogin title="My Connections" />
      <Block
        color={'#F2EDFA'}
        padding={[hp(2), 0]}
        margin={[hp(2), 0, 0]}
        borderTopRightRadius={30}
        borderTopLeftRadius={30}>
        <FlatList
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          data={[1]}
          renderItem={_renderItem}
        />
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  neoSubContainer: {
    shadowRadius: 3,
    backgroundColor: '#F2F0F7',
    width: wp(90),
    height: hp(10),
    justifyContent: 'center',
    marginTop: hp(1),
    borderRadius: 10,
  },
});

export default Contacts;
