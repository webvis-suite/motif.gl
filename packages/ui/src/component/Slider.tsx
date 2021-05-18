import React, { FC } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getTrackBackground } from 'react-range';
import { useStyletron } from 'baseui';
import { StatefulSlider, StatefulSliderProps } from 'baseui/slider';

interface SliderProps extends StatefulSliderProps {
  showThumbValue?: boolean;
  showTickBar?: boolean;
}

export const Slider: FC<SliderProps> = ({
  showThumbValue,
  showTickBar,
  ...rest
}) => {
  const [css, theme] = useStyletron();
  return (
    <StatefulSlider
      {...rest}
      overrides={{
        Thumb: {
          style: ({ $theme }) => {
            return {
              height: '20px',
              width: '20px',
              // modify to border: 0 will breaks atomic rendering
              borderTopLeftRadius: '35px',
              borderTopRightRadius: '35px',
              borderBottomLeftRadius: '35px',
              borderBottomRightRadius: '35px',
              backgroundColor: $theme.colors.accent500,
              color: $theme.colors.contentPrimary,
              display: 'flex',
              outline: 'none',
              justifyContent: 'center',
              alignItems: 'center',
              borderLeftColor: $theme.colors.mono400,
              borderRightColor: $theme.colors.mono400,
              borderTopColor: $theme.colors.mono400,
              borderBottomColor: $theme.colors.mono400,
              zIndex: 0,
            };
          },
        },
        ThumbValue: {
          style: ({ $theme }) => {
            return {
              display: showThumbValue ? 'block' : 'none',
              position: 'absolute',
              backgroundColor: 'transparent',
              top: `-${$theme.sizing.scale700}`,
              ...$theme.typography.font200,
              color: $theme.colors.contentPrimary,

              // simplify to padding:0, border:0 will break atomic rendering
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
              paddingBottom: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            };
          },
        },
        InnerTrack: {
          style: ({ $theme, $value = [], $min, $max, $disabled }) => {
            const { colors, direction } = $theme;
            return {
              height: '2px',
              background: getTrackBackground({
                values: $value,
                colors:
                  $value.length === 1
                    ? [
                        $disabled
                          ? colors.borderOpaque
                          : $theme.colors.accent500,
                        $disabled
                          ? colors.backgroundSecondary
                          : colors.borderOpaque,
                      ]
                    : [
                        $disabled
                          ? colors.backgroundSecondary
                          : colors.borderOpaque,
                        $disabled
                          ? colors.borderOpaque
                          : $theme.colors.accent500,
                        $disabled
                          ? colors.backgroundSecondary
                          : colors.borderOpaque,
                      ],
                min: $min || 0,
                max: $max || 0,
                rtl: direction === 'rtl',
              }),
            };
          },
        },
        Track: {
          style: ({ $theme }) => {
            return {
              paddingBottom: $theme.sizing.scale200,
              paddingLeft: 0,
              paddingRight: 0,
            };
          },
        },
        TickBar: ({ $min, $max }) => (
          <div
            className={css({
              display: showTickBar ? 'flex' : 'none',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: theme.colors.contentSecondary,
              ...theme.typography.font200,
            })}
          >
            <div>{$min}</div>
            <div>{$max}</div>
          </div>
        ),
        InnerThumb: () => null,
      }}
    />
  );
};
