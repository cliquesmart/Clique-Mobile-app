import React, {useState} from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import NeuInput from '../common/neu-element/lib/NeuInput';
import ImageComponent from './ImageComponent';
import {hp, wp} from './responsive';

const NeoInputField = ({
  width,
  height,
  icon,
  radius,
  fontColor,
  iconHeight,
  iconWidth,
  onChangeText,
  value,
  placeholder,
  secure,
  inset,
  keyboardType,
  leftIcon,
  maxLength,
  onBlur,
  secureTextEntry,
  error,
  errorText,
  editable = true,
}) => {
  const [toggleSecure, setToggleSecure] = useState(false);
  const isSecure = toggleSecure ? false : secure;
  return (
    <NeuInput
      keyboardType={keyboardType}
      width={wp(width)}
      height={hp(height)}
      borderRadius={radius}
      textStyle={{
        color: fontColor,
      }}
      color="#eef2f9"
      placeholderTextColor={fontColor}
      leftPrefix={
        leftIcon && (
          <ImageComponent
            name={leftIcon}
            height={iconHeight}
            width={iconWidth}
          />
        )
      }
      prefix={
        secure ? (
          <TouchableOpacity onPress={() => setToggleSecure(!toggleSecure)}>
            <ImageComponent
              name={!toggleSecure ? 'eye' : 'eye'}
              height={iconHeight}
              width={iconWidth}
            />
          </TouchableOpacity>
        ) : (
          <ImageComponent name={icon} height={iconHeight} width={iconWidth} />
        )
      }
      onChangeText={onChangeText}
      value={value}
      secureTextEntry={isSecure || secureTextEntry}
      placeholder={placeholder}
      inset={inset}
      maxLength={maxLength}
      onBlur={onBlur}
      error={error}
      errorText={errorText}
      editable={editable}
    />
  );
};
NeoInputField.defaultProps = {
  width: 90,
  height: Platform.OS === 'ios' ? 5 : 5.5,
  icon: 'MinUserIcon',
  radius: 16,
  fontColor: '#707070',
  iconWidth: 25,
  iconHeight: 25,
  placeholder: 'Enter Field Name',
  secure: false,
  inset: false,
};

export default NeoInputField;
