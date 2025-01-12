import React, { ReactElement } from 'react';
import { View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';

import { GradientBackground, Text } from '@components';
import styles from './settings.styles';
import { colors } from '@utils';
import { difficulties, useSettings } from '@contexts/settings-context';

export default function Settings(): ReactElement | null {
  const { settings, saveSetting } = useSettings();

  if (!settings) return null;
  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.field}>
          <Text style={styles.label}>Bot difficulty</Text>
          <View style={styles.choices}>
            {Object.keys(difficulties).map((level) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    saveSetting('difficulty', level as keyof typeof difficulties);
                  }}
                  style={[
                    styles.choice,
                    {
                      backgroundColor:
                        settings.difficulty === level
                          ? colors.lightPurple
                          : colors.lightGreen
                    }
                  ]}
                  key={level}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      {
                        color:
                          settings.difficulty === level
                            ? colors.lightGreen
                            : colors.darkPurple
                      }
                    ]}
                  >
                    {difficulties[level as keyof typeof difficulties]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.field, styles.switchField]}>
          <Text style={styles.label}>Sounds</Text>
          <Switch
            trackColor={{
              false: colors.purple,
              true: colors.lightPurple
            }}
            thumbColor={colors.lightGreen}
            ios_backgroundColor={colors.purple}
            value={settings.sounds}
            onValueChange={() => saveSetting('sounds', !settings.sounds)}
          />
        </View>

        <View style={[styles.field, styles.switchField]}>
          <Text style={styles.label}>Haptics/Vibrations</Text>
          <Switch
            trackColor={{
              false: colors.purple,
              true: colors.lightPurple
            }}
            thumbColor={colors.lightGreen}
            ios_backgroundColor={colors.purple}
            value={settings.haptics}
            onValueChange={() => saveSetting('haptics', !settings.haptics)}
          />
        </View>
      </ScrollView>
    </GradientBackground>
  );
}
