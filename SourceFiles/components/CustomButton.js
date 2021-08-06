import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {light} from './theme/colors';

const componentStyles = () => {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    column: {
      flexDirection: 'column',
    },
    center: {
      alignItems: 'center',
    },
    middle: {
      justifyContent: 'center',
    },
    left: {
      justifyContent: 'flex-start',
    },
    right: {
      justifyContent: 'flex-end',
    },
    top: {
      justifyContent: 'flex-start',
    },
    bottom: {
      justifyContent: 'flex-end',
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,

      elevation: 3,
    },
    primary: {backgroundColor: light.primary},
    secondary: {backgroundColor: light.secondary},
    borderColor: {
      borderColor: '#E9EBF3',
    },
  });
};

const CustomButton = ({
  padding,
  margin,
  flex,
  row,
  column,
  center,
  middle,
  left,
  right,
  top,
  bottom,
  card,
  shadow,
  color,
  space,
  animated,
  wrap,
  style,
  children,
  white,
  primary,
  secondary,
  borderWidth,
  borderRadius,
  borderColor,
  borderColorDeafult,
  ...rest
}) => {
  const styles = componentStyles();
  const handleMargins = () => {
    if (typeof margin === 'number') {
      return {
        marginTop: margin,
        marginRight: margin,
        marginBottom: margin,
        marginLeft: margin,
      };
    }
    if (typeof margin === 'object') {
      const marginSize = Object.keys(margin).length;
      switch (marginSize) {
        case 1:
          return {
            marginTop: margin[0],
            marginRight: margin[0],
            marginBottom: margin[0],
            marginLeft: margin[0],
          };
        case 2:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[0],
            marginLeft: margin[1],
          };
        case 3:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[1],
          };
        default:
          return {
            marginTop: margin[0],
            marginRight: margin[1],
            marginBottom: margin[2],
            marginLeft: margin[3],
          };
      }
    }
  };
  const handleBorderWidth = () => {
    if (typeof borderWidth === 'number') {
      return {
        borderWidth: borderWidth,
      };
    }
    if (typeof borderWidth === 'object') {
      const borderSize = Object.keys(borderWidth).length;
      switch (borderSize) {
        case 1:
          return {
            borderTopWidth: borderWidth[0],
            borderRightWidth: borderWidth[0],
            borderBottomWidth: borderWidth[0],
            borderLeftWidth: borderWidth[0],
          };
        case 2:
          return {
            borderTopWidth: borderWidth[0],
            borderRightWidth: borderWidth[1],
            borderBottomWidth: borderWidth[0],
            borderLeftWidth: borderWidth[1],
          };
        case 3:
          return {
            borderTopWidth: borderWidth[0],
            borderRightWidth: borderWidth[1],
            borderBottomWidth: borderWidth[2],
            borderLeftWidth: borderWidth[1],
          };
        default:
          return {
            borderTopWidth: borderWidth[0],
            borderRightWidth: borderWidth[1],
            borderBottomWidth: borderWidth[2],
            borderLeftWidth: borderWidth[3],
          };
      }
    }
  };

  const handleBordersRadius = (border) => {
    if (typeof border === 'number') {
      return {
        borderTopLeftRadius: border,
        borderTopRightRadius: border,
        borderBottomLeftRadius: border,
        borderBottomRightRadius: border,
      };
    }
    if (typeof border === 'object') {
      const borderRadius = Object.keys(border).length;
      switch (borderRadius) {
        case 1:
          return {
            borderTopLeftRadius: border[0],
            borderTopRightRadius: border[0],
            borderBottomLeftRadius: border[0],
            borderBottomRightRadius: border[0],
          };
        case 2:
          return {
            borderTopLeftRadius: border[0],
            borderTopRightRadius: border[1],
            borderBottomLeftRadius: border[0],
            borderBottomRightRadius: border[1],
          };
        case 3:
          return {
            borderTopLeftRadius: border[0],
            borderTopRightRadius: border[1],
            borderBottomLeftRadius: border[2],
            borderBottomRightRadius: border[1],
          };
        default:
          return {
            borderTopLeftRadius: border[0],
            borderTopRightRadius: border[1],
            borderBottomLeftRadius: border[2],
            borderBottomRightRadius: border[3],
          };
      }
    }
  };

  const handlePaddings = () => {
    if (typeof padding === 'number') {
      return {
        paddingTop: padding,
        paddingRight: padding,
        paddingBottom: padding,
        paddingLeft: padding,
      };
    }

    if (typeof padding === 'object') {
      const paddingSize = Object.keys(padding).length;
      switch (paddingSize) {
        case 1:
          return {
            paddingTop: padding[0],
            paddingRight: padding[0],
            paddingBottom: padding[0],
            paddingLeft: padding[0],
          };
        case 2:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[0],
            paddingLeft: padding[1],
          };
        case 3:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[2],
            paddingLeft: padding[1],
          };
        default:
          return {
            paddingTop: padding[0],
            paddingRight: padding[1],
            paddingBottom: padding[2],
            paddingLeft: padding[3],
          };
      }
    }
  };
  const blockStyles = [
    styles.block,
    flex && {flex},
    flex === false && {flex: 0}, // reset / disable flex
    row && styles.row,
    column && styles.column,
    center && styles.center,
    middle && styles.middle,
    left && styles.left,
    right && styles.right,
    top && styles.top,
    bottom && styles.bottom,
    card && styles.card,
    shadow && styles.shadow,
    space && {justifyContent: `space-${space}`},
    wrap && {flexWrap: 'wrap'},
    borderColor && !styles[color] && {borderColor: borderColor},
    borderColorDeafult && styles.borderColor,
    secondary && styles.secondary,
    margin && {...handleMargins()},
    padding && {...handlePaddings()},
    borderWidth && {...handleBorderWidth()},
    borderRadius && {...handleBordersRadius(borderRadius)},
    primary && styles.primary,
    color && styles[color], // predefined styles colors for backgroundColor
    color && !styles[color] && {backgroundColor: color}, // custom backgroundColor
    style, // rewrite predefined styles
  ];

  return (
    <TouchableOpacity {...rest} style={blockStyles}>
      {children}
    </TouchableOpacity>
  );
};

export default CustomButton;
