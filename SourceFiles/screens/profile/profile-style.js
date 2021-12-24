import {Platform, StyleSheet} from 'react-native';
import {hp, wp} from '../../components/responsive';
import {CommonColors} from '../../Constants/ColorConstant';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginBottom: hp(3),
  },
  linear: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  neomorphStyle: {
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  activeNeomorph: {
    borderRadius: 10,
    shadowRadius: 6,
    backgroundColor: '#F2F0F7',
    padding: hp(1),
  },
  inactiveText: {
    width: wp(20),
  },
  containerStyle: {
    alignItems: 'center',
  },
  neoContainer: {
    flexDirection: 'row',
  },
  bgImage: {
    height: Platform.OS === 'ios' ? hp(8) : 62,
    width: Platform.OS === 'ios' ? hp(8) : 62,
  },
  pro: {position: 'absolute', right: -10, top: -15, zIndex: 99},
  socialIcons: {
    flexGrow: 1,
    paddingHorizontal: wp(1),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonStyle: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(2),
    flexDirection: 'row',
  },
  neoSubContainer: {
    shadowRadius: 3,
    backgroundColor: '#F2F0F7',
    width: wp(90),
    height: Platform.OS === 'ios' ? hp(10) : hp(12),
    marginTop: Platform.OS === 'ios' ? hp(1) : hp(2.5),
    borderRadius: 10,
  },
  activeHospital: {
    borderWidth: 1.5,
    borderColor: CommonColors.gradientEnd,
  },
  handleStyle: {backgroundColor: '#6B37C3', marginTop: hp(1)},
  overlayStyle: {backgroundColor: 'rgba(72, 30, 140,0.7)'},
  modalStyle: {backgroundColor: '#F2F0F7'},
  flexEnd: {alignSelf: 'flex-end'},
});
