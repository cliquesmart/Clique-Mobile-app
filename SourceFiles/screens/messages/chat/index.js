import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import HeaderPostLogin from '../../../common/header-post-login';
import {
  Block,
  CustomButton,
  Input,
  Text,
  ImageComponent,
} from '../../../components';
import {hp, wp} from '../../../components/responsive';

const Messages = () => {
  const flatlistRef = useRef();
  const [messages, setMessages] = useState('');
  const [loader, setloader] = useState(false);
  const _renderItem = ({item}) => {
    return (
      <Block
        alignSelf={item === 'out' && 'flex-end'}
        style={{width: wp(60)}}
        borderRadius={10}
        shadow
        color={item === 'out' ? '#6F3AC8' : '#F2F0F7'}
        padding={[hp(2)]}
        margin={[hp(1), wp(3)]}
        flex={false}>
        <Text regular color={item === 'out' ? '#fff' : '#626262'} size={14}>
          {'Porta convallis suscipit nisl platea. Amet sed proin lorem.'}
        </Text>
      </Block>
    );
  };
  return (
    <Block linear flex={1}>
      <SafeAreaView />
      <HeaderPostLogin title="Jerome Bell" />

      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          backgroundColor: '#F2EDFA',
          flexGrow: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <Block
          style={{flexGrow: 1}}
          color={'#F2EDFA'}
          padding={[hp(2), 0]}
          margin={[hp(2), 0, 0]}
          borderTopRightRadius={30}
          borderTopLeftRadius={30}>
          <FlatList
            inverted
            contentContainerStyle={{flexGrow: 1}}
            ref={flatlistRef}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={(contentWidth, contentHeight) => {
              flatlistRef.current?.scrollToEnd({y: 0, animated: true});
            }}
            data={[
              'in',
              'out',
              'in',
              'in',
              'out',
              'in',
              'in',
              'out',
              'in',
              'in',
              'out',
              'in',
            ]}
            renderItem={_renderItem}
          />
        </Block>
        <Block
          shadow
          space={'between'}
          center
          row
          white
          flex={false}
          padding={[hp(1), wp(3), hp(3)]}>
          <Input
            transparent
            style={{width: wp(85)}}
            placeholder={'Write your message'}
            value={messages}
            onChangeText={(v) => setMessages(v)}
            placeholderTextColor="#777777"
            color="#777777"
          />
          <CustomButton
            flex={false}
            // disabled={!strictValidString(messages)}
            // onPress={() => sendMessage()}
            center
            middle
            margin={[hp(2), 0, 0]}>
            {loader ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ImageComponent name="message_send_icon" height="30" width="30" />
            )}
          </CustomButton>
        </Block>
      </KeyboardAvoidingView>
    </Block>
  );
};
const buttonStyle = {
  height: 40,
  width: 40,
};

export default Messages;
