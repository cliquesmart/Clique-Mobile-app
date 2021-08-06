import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import HeaderPostLogin from '../../common/header-post-login';
import Neomorph from '../../common/shadow-src/Neomorph';
import {Block, ImageComponent, Text} from '../../components';
import {hp, wp} from '../../components/responsive';

const Chat = () => {
  const {navigate} = useNavigation();
  const _renderItem = () => {
    return (
      <TouchableOpacity
        onPress={() => navigate('Messages')}
        style={{alignSelf: 'center'}}>
        <Neomorph style={styles.neoSubContainer}>
          <Block space="between" padding={[0, wp(3)]} row flex={false}>
            <Block row center>
              <ImageComponent
                name="demouser"
                height={40}
                width={40}
                radius={40}
              />
              <Block margin={[0, 0, 0, wp(3)]} flex={false}>
                <Text grey size={16}>
                  Jerome Bell
                </Text>
                <Text
                  numberOfLines={1}
                  height={14}
                  margin={[hp(0.5), 0]}
                  color="#5E5E5E"
                  size={12}>
                  Hey! Whats’up? I Would like to talk to you about...
                </Text>
              </Block>
            </Block>
            <Text margin={[0, 0, 0, wp(3)]} color="#A2A1A3" size={10}>
              14:34pm
            </Text>
          </Block>
        </Neomorph>
      </TouchableOpacity>
    );
  };
  return (
    <Block linear>
      <SafeAreaView />
      <HeaderPostLogin title="Chats" />
      <Block
        color={'#F2EDFA'}
        padding={[hp(2), 0]}
        margin={[hp(2), 0, 0]}
        borderTopRightRadius={30}
        borderTopLeftRadius={30}>
        <FlatList
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]}
          renderItem={_renderItem}
        />
      </Block>
    </Block>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: hp(4),
  },
  neoSubContainer: {
    shadowRadius: 3,
    backgroundColor: '#F2F0F7',
    width: wp(90),
    height: hp(8),
    justifyContent: 'center',
    marginTop: hp(1),
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default Chat;
