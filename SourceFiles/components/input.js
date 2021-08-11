import React, {useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';

import {hp, wp} from './responsive';
import Block from './Block';

import Text from './Text';
import {AvertaRegular} from './theme/fontsize';
import {ImageComponent} from '.';
import Neomorph from '../common/shadow-src/Neomorph';

const componentStyles = () => {
  return StyleSheet.create({
    label: {
      // marginBottom: hp(0.8),
    },
    input: {
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(2),
      fontSize: 16,
      color: '#F2EDFA',
      fontFamily: AvertaRegular,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#F2EDFA',
      borderRadius: 16,
    },
    toggle: {
      position: 'absolute',
      alignItems: 'flex-end',
      width: 16 * 2,
      height: 16 * 2,
      top: 16,
      right: 8,
    },
    primaryInput: {
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(2),
      fontSize: 16,
      color: '#F2EDFA',
      fontFamily: AvertaRegular,
      backgroundColor: 'transparent',
      borderRadius: 16,
    },
    neomorph: {
      borderRadius: 16,
      shadowRadius: 1,
      backgroundColor: '#fff',
      marginTop: hp(0.3),
      marginHorizontal: wp(1),
      padding: 3,
    },
  });
};

const Input = ({
  email,
  rightLabel,
  label,
  phone,
  number,
  secure,
  error,
  style,
  rightStyle,
  onRightPress,
  placeholder,
  errorText,
  editable = true,
  center,
  placeholderTextColor,
  transparent,
  color,
  primary,
  rightIcon,
  neomorph,
  ...rest
}) => {
  const styles = componentStyles();
  const [toggleSecure, setToggleSecure] = useState(false);
  const renderLabel = () => (
    <Block flex={false}>
      {label ? (
        <Text
          errorColor={error}
          caption
          regular
          center={center ? true : false}
          style={styles.label}
          black={!error}
          accent={error}
          color="#8A8E99">
          {label}
        </Text>
      ) : null}
    </Block>
  );

  const renderToggle = () => {
    if (!secure) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() => setToggleSecure({toggleSecure: !toggleSecure})}>
        {rightLabel || (
          <ImageComponent
            height={30}
            width={30}
            name={!toggleSecure ? 'eye' : 'eye'}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderRight = () => {
    if (!rightLabel) {
      return null;
    }

    return (
      <TouchableOpacity
        style={{marginTop: hp(0.5)}}
        onPress={() => setToggleSecure(!toggleSecure)}>
        <ImageComponent
          height={30}
          width={30}
          name={!toggleSecure ? 'eye' : 'eye'}
        />
      </TouchableOpacity>
    );
  };

  const renderRightIcon = () => {
    if (!rightIcon) {
      return null;
    }

    return (
      <TouchableOpacity
        style={{marginTop: hp(0.5), marginRight: wp(2)}}
        onPress={() => setToggleSecure(!toggleSecure)}>
        <ImageComponent height={30} width={30} name={rightIcon} />
      </TouchableOpacity>
    );
  };

  const isSecure = toggleSecure ? false : secure;

  const inputType = email
    ? 'email-address'
    : number
    ? 'numeric'
    : phone
    ? 'phone-pad'
    : 'default';

  const inputStyles = [
    styles.input,
    color && {color: color},
    !editable && {
      backgroundColor: '#000',
      color: '#fff',
      borderColor: '#000',
    },
    style,
  ];
  const primaryInputStyles = [
    styles.primaryInput,
    color && {color: color},
    !editable && {
      backgroundColor: '#000',
      color: '#fff',
      borderColor: '#000',
    },
    style,
  ];

  if (primary) {
    return (
      <Block
        flex={false}
        borderColor={error ? 'red' : 'transparent'}
        borderWidth={error ? 1 : 0}
        margin={[hp(1), 0]}>
        {renderLabel()}
        <Block
          row
          center
          padding={[0, wp(2)]}
          space={'between'}
          style={{width: wp(90), backgroundColor: '#fff', borderRadius: 16}}>
          <TextInput
            placeholder={placeholder}
            style={[
              primaryInputStyles,
              rightLabel ? {width: wp(77)} : {width: wp(85)},
            ]}
            secureTextEntry={isSecure}
            autoComplete="off"
            autoCapitalize="none"
            editable={editable}
            autoCorrect={false}
            keyboardType={inputType}
            placeholderTextColor={
              placeholderTextColor ? placeholderTextColor : '#F2EDFA'
            }
            {...rest}
          />
          {errorText && error && (
            <Text size={12} errorColor>
              {errorText}
            </Text>
          )}
          {renderToggle()}
          {renderRight()}
        </Block>
      </Block>
    );
  }
  if (neomorph) {
    return (
      <Neomorph style={styles.neomorph}>
        <Block
          row
          center
          padding={[0, wp(2)]}
          space={'between'}
          style={{width: wp(91), backgroundColor: '#F2F0F7', borderRadius: 16}}>
          <TextInput
            placeholder={placeholder}
            style={[
              primaryInputStyles,
              rightIcon ? {width: wp(77)} : {width: wp(85)},
            ]}
            secureTextEntry={isSecure}
            autoComplete="off"
            autoCapitalize="none"
            editable={editable}
            autoCorrect={false}
            keyboardType={inputType}
            placeholderTextColor={
              placeholderTextColor ? placeholderTextColor : '#F2F0F7'
            }
            {...rest}
          />
          {errorText && error && (
            <Text size={12} errorColor>
              {errorText}
            </Text>
          )}
          {renderToggle()}
          {secure ? renderRight() : renderRightIcon()}
        </Block>
      </Neomorph>
    );
  }
  return (
    <Block
      flex={false}
      borderRadius={16}
      borderColor={error ? 'red' : 'transparent'}
      borderWidth={error ? 1 : 0}
      margin={[hp(2), 0, 0]}>
      {renderLabel()}
      <TextInput
        placeholder={placeholder}
        style={inputStyles}
        secureTextEntry={isSecure}
        autoComplete="off"
        autoCapitalize="none"
        editable={editable}
        autoCorrect={false}
        keyboardType={inputType}
        placeholderTextColor={
          placeholderTextColor ? placeholderTextColor : '#F2EDFA'
        }
        {...rest}
      />
      {errorText && error && (
        <Text size={12} errorColor>
          {errorText}
        </Text>
      )}
      {renderToggle()}
      {renderRight()}
    </Block>
  );
};

export default Input;
