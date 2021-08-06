import {Platform} from 'react-native';

export const ConstantKeys = {
  GOOGLE_KEY: 'AIzaSyD8bw72R-bXhXCfs9BGdyIh_Q-nGfmDpnw',
  IS_SKIP_TUTORIAL: 'ISSKIP_TUTORIAL',
  USERDATA: 'UserData',
  FCM_TOKEN: 'FCM_TOKEN',

  ...Platform.select({
    ios: {
      Averta_BOLD: 'Averta-Bold',
      Averta_EXTRA_BOLD: 'Averta-ExtraBold',
      Averta_LIGHT: 'Averta-Light',
      Averta_REGULAR: 'Averta-Regular',
      Averta_THIN: 'Averta-Thin',
    },
    android: {
      Averta_BOLD: 'Averta-Bold',
      Averta_EXTRA_BOLD: 'Averta-ExtraBold',
      Averta_LIGHT: 'Averta-Light',
      Averta_REGULAR: 'Averta-Regular',
      Averta_THIN: 'Averta-Thin',
    },
  }),
};
