import React from 'react';
import PropTypes from 'prop-types';
import ResponsiveImage from 'react-native-responsive-image';
import {images} from '../Assets/Images/images';

const ImageComponent = ({
  name,
  height,
  width,
  isURL,
  color,
  radius,
  resizeMode,
}) => {
  return (
    <ResponsiveImage
      source={isURL ? {uri: name} : images[name]}
      initWidth={width}
      initHeight={height}
      borderRadius={radius}
      style={color && {tintColor: color}}
      resizeMode={resizeMode}
      // indicator={ActivityIndicator}
    />
  );
};

ImageComponent.propTypes = {
  name: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  isURL: PropTypes.bool,
  color: PropTypes.string,
  radius: PropTypes.number,
};

ImageComponent.defaultProps = {
  name: undefined,
  height: 100,
  width: 100,
  isURL: false,
  color: undefined,
  radius: undefined,
};

export default ImageComponent;
