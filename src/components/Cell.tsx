import React, { memo } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

type CellProps = {
  value: number;
  isClue: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isConflict: boolean;
  onPress: () => void;
};

export const Cell = memo(function Cell({
  value,
  isClue,
  isSelected,
  isHighlighted,
  isConflict,
  onPress,
}: CellProps) {
  const { colors } = useTheme();

  const bgColor = isSelected
    ? colors.cellSelected
    : isConflict
      ? colors.cellConflict
      : isHighlighted
        ? colors.cellHighlight
        : colors.surface;

  const textColor = isConflict
    ? colors.cellConflictText
    : isClue
      ? colors.cellClue
      : colors.cellUser;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isClue ? 1 : 0.7}
      style={[styles.cell, { backgroundColor: bgColor }]}
    >
      {isSelected && (
        <View
          style={[
            styles.selectedOverlay,
            { borderColor: colors.cellSelectedBorder },
          ]}
          pointerEvents="none"
        />
      )}
      {value !== 0 && (
        <Text
          style={[
            styles.text,
            { color: textColor, fontWeight: isClue ? "700" : "500" },
          ]}
        >
          {value}
        </Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cell: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: {
    fontSize: 18,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  selectedOverlay: {
    position: "absolute",
    inset: 1,
    borderWidth: 2,
    borderRadius: 2,
  },
});
