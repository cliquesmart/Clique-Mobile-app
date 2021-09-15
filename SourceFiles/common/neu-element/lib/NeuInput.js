import React from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import NeuView from './NeuView';
import PropTypes from 'prop-types';
import {Text} from '../../../components';
import {hp} from '../../../components/responsive';
import {Block} from '../../../components';

const NeuInput = (props) => {
  const {
    style = {},
    textStyle,
    placeholder = '',
    onChangeText = () => {},
    value = '',
    prefix: Prefix,
    placeholderTextColor,
    secureTextEntry,
    leftPrefix,
    keyboardType,
    editable = true,
    maxLength,
    onBlur,
    errorText,
    error,
    multiline = false,
    textAlignVertical,
    ...rest
  } = props;

  const styles = StyleSheet.create({
    input: {
      borderBottomWidth: 0,
      flex: 1,
    },
  });

  return (
    <>
      <NeuView {...rest} style={{...style, alignItems: 'stretch'}}>
        <Block
          borderColor={errorText && error ? 'red' : 'transparent'}
          borderWidth={errorText && error ? 1 : 0}
          borderRadius={errorText && error ? 10 : 0}
          style={{
            flexDirection: 'row',
            paddingHorizontal: 12,
          }}>
          {leftPrefix && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 6,
              }}>
              {leftPrefix}
            </View>
          )}
          <TextInput
            style={{
              ...styles.input,
              ...textStyle,
            }}
            onChangeText={onChangeText}
            placeholder={placeholder}
            value={value}
            placeholderTextColor={placeholderTextColor}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType || 'default'}
            editable={editable}
            maxLength={maxLength}
            onBlur={onBlur}
            multiline={multiline}
            textAlignVertical={textAlignVertical}
          />
          {Prefix && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 6,
              }}>
              {Prefix}
            </View>
          )}
        </Block>
      </NeuView>
      {/* {errorText && error && (
        <Text
          margin={[hp(1), 0, 0]}
          style={{textAlign: 'left'}}
          size={12}
          errorColor>
          {errorText}
        </Text>
      )} */}
    </>
  );
};

NeuInput.propTypes = {
  style: PropTypes.object,
  textStyle: PropTypes.object,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  ...NeuView.propTypes,
};
export default NeuInput;
