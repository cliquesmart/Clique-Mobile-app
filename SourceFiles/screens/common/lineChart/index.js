import React from 'react';
import {
  Defs,
  G,
  LinearGradient,
  Rect,
  Stop,
  Svg,
  Text as TextSVG,
} from 'react-native-svg';
import Animated from 'react-native-reanimated';
import {CommonColors} from '../../../Constants/ColorConstant';
import {LineChart} from 'react-native-chart-kit';
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Dimensions,
  View,
} from 'react-native';
import {light} from '../../../components/theme/colors';
export class CustomLineChart extends LineChart {
  render() {
    const {
      width,
      height,
      data,
      withScrollableDot = false,
      withShadow = true,
      withDots = true,
      withInnerLines = true,
      withOuterLines = true,
      withHorizontalLines = true,
      withVerticalLines = true,
      withHorizontalLabels = true,
      withVerticalLabels = true,
      style = {},
      decorator,
      onDataPointClick,
      verticalLabelRotation = 0,
      horizontalLabelRotation = 0,
      formatYLabel = (yLabel) => yLabel,
      formatXLabel = (xLabel) => xLabel,
      segments,
      transparent = false,
      chartConfig,
    } = this.props;

    const {scrollableDotHorizontalOffset} = this.state;
    const {labels = []} = data;
    const {
      borderRadius = 0,
      paddingTop = 16,
      paddingRight = 64,
      margin = 0,
      marginRight = 0,
      paddingBottom = 0,
    } = style;

    const config = {
      width,
      height,
      verticalLabelRotation,
      horizontalLabelRotation,
    };

    const datas = this.getDatas(data.datasets);

    let count = Math.min(...datas) === Math.max(...datas) ? 1 : 4;
    if (segments) {
      count = segments;
    }

    const legendOffset = this.props.data.legend ? height * 0.15 : 0;

    return (
      <View style={style}>
        <Svg
          height={height + paddingBottom + legendOffset}
          width={width - margin * 2 - marginRight}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop
                offset="1"
                stopColor={CommonColors.gradientEnd}
                stopOpacity="1"
              />
              <Stop
                offset="0"
                stopColor={CommonColors.gradientStart}
                stopOpacity="0.9"
              />
            </LinearGradient>
          </Defs>
          <Rect
            width="100%"
            height={height + legendOffset}
            rx={borderRadius}
            ry={borderRadius}
            fill="white"
            fillOpacity={transparent ? 0 : 1}
          />
          {this.props.data.legend &&
            this.renderLegend(config.width, legendOffset)}
          <G x="0" y={legendOffset}>
            <G>
              {withHorizontalLines &&
                (withInnerLines
                  ? this.renderHorizontalLines({
                      ...config,
                      count: count,
                      paddingTop,
                      paddingRight,
                    })
                  : withOuterLines
                  ? this.renderHorizontalLine({
                      ...config,
                      paddingTop,
                      paddingRight,
                    })
                  : null)}
            </G>
            <G>
              {withHorizontalLabels &&
                this.renderHorizontalLabels({
                  ...config,
                  count: count,
                  data: datas,
                  paddingTop: paddingTop,
                  paddingRight: paddingRight,
                  formatYLabel,
                  decimalPlaces: chartConfig.decimalPlaces,
                })}
            </G>
            <G>
              {withVerticalLines &&
                (withInnerLines
                  ? this.renderVerticalLines({
                      ...config,
                      data: data.datasets[0].data,
                      paddingTop: paddingTop,
                      paddingRight: paddingRight,
                    })
                  : withOuterLines
                  ? this.renderVerticalLine({
                      ...config,
                      paddingTop: paddingTop,
                      paddingRight: paddingRight,
                    })
                  : null)}
            </G>
            <G>
              {withVerticalLabels &&
                this.renderVerticalLabels({
                  ...config,
                  labels,
                  paddingTop: paddingTop,
                  paddingRight: paddingRight,
                  formatXLabel,
                })}
            </G>
            <G>
              {this.renderLine({
                ...config,
                ...chartConfig,
                paddingRight: paddingRight,
                paddingTop: paddingTop,
                data: data.datasets,
              })}
            </G>
            <G>
              {withDots &&
                this.renderDots({
                  ...config,
                  data: data.datasets,
                  paddingTop: paddingTop,
                  paddingRight: paddingRight,
                  onDataPointClick,
                })}
            </G>
            <G>
              {withScrollableDot &&
                this.renderScrollableDot({
                  ...config,
                  ...chartConfig,
                  data: data.datasets,
                  paddingTop: paddingTop,
                  paddingRight: paddingRight,
                  onDataPointClick,
                  scrollableDotHorizontalOffset,
                })}
            </G>
            <G>
              {decorator &&
                decorator({
                  ...config,
                  data: data.datasets,
                  paddingTop,
                  paddingRight,
                })}
            </G>
          </G>
        </Svg>
        {withScrollableDot && (
          <ScrollView
            style={StyleSheet.absoluteFill}
            contentContainerStyle={{width: width * 2}}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: {x: scrollableDotHorizontalOffset},
                },
              },
            ])}
            horizontal
            bounces={false}
          />
        )}
      </View>
    );
  }
}
