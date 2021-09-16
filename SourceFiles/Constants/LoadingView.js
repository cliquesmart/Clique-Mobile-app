import React, {Component} from 'react';
import {View, Text, SafeAreaView, ActivityIndicator} from 'react-native';
import {CommonColors} from './ColorConstant';
import {ConstantKeys} from './ConstantKey';
import {SetFontSize} from './FontSize';

export default class LoadingView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0,0,0,0.3)',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
        }}>
        <View
          style={{
            borderRadius: 10,
            shadowColor: 'black',
            backgroundColor: CommonColors.whiteColor,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 25,
            shadowOffset: {width: 0, height: 2},
            maxWidth: 150,
            maxHeight: 150,
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: 5,
          }}>
          <ActivityIndicator size={'large'} color={CommonColors.primaryColor} />
          {this.props.text !== '' && this.props.text !== undefined ? (
            <Text
              onPress={this.props.onPress}
              style={{
                margin: 5,
                fontSize: SetFontSize.ts14,
                color: CommonColors.blackColor,
                fontFamily: ConstantKeys.Averta_REGULAR,
              }}
              numberOfLines={2}>
              {this.props.text}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }
}
