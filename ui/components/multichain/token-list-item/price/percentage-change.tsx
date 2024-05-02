import React from 'react';
import { useSelector } from 'react-redux';
import { Text, Box } from '../../../component-library';
import {
  Display,
  FontWeight,
  TextColor,
  TextVariant,
} from '../../../../helpers/constants/design-system';
import { getCurrentCurrency } from '../../../../selectors';
import { getIntlLocale } from '../../../../ducks/locale/locale';

const renderPercentage = (value: string, color: TextColor) => {
  return (
    <Box display={Display.Flex}>
      <Text
        fontWeight={FontWeight.Normal}
        variant={TextVariant.bodyMd}
        color={color}
        data-testid="token-increase-decrease-percentage"
        ellipsis
      >
        {value}
      </Text>
    </Box>
  );
};

const renderPercentageWithNumber = (
  value: string,
  formattedValuePrice: string,
  color: TextColor,
) => {
  return (
    <Box display={Display.Flex}>
      <Text
        fontWeight={FontWeight.Normal}
        variant={TextVariant.bodyMd}
        color={color}
        data-testid="token-increase-decrease-value"
        style={{ whiteSpace: 'pre' }}
        ellipsis
      >
        {formattedValuePrice}
      </Text>
      <Text
        fontWeight={FontWeight.Normal}
        variant={TextVariant.bodyMd}
        color={color}
        data-testid="token-increase-decrease-percentage"
        ellipsis
      >
        {value}
      </Text>
    </Box>
  );
};

export const PercentageChange = ({
  value,
  valueChange,
  includeNumber = false,
}: {
  value: number | null | undefined;
  valueChange?: number | null | undefined;
  includeNumber?: boolean;
}) => {
  const fiatCurrency = useSelector(getCurrentCurrency);
  const locale = useSelector(getIntlLocale);

  let color = TextColor.textDefault;
  const isValidAmount = (amount: number | null | undefined): boolean =>
    amount !== null && amount !== undefined && !Number.isNaN(amount);

  if (isValidAmount(value)) {
    if ((value as number) >= 0) {
      color = TextColor.successDefault;
    } else {
      color = TextColor.errorDefault;
    }
  }

  const formattedValue = isValidAmount(value)
    ? `${(value as number) >= 0 ? '+' : ''}${(value as number).toFixed(2)}%`
    : '';

  const formattedValuePrice = isValidAmount(valueChange)
    ? `${(valueChange as number) >= 0 ? '+' : ''}(${Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short',
        style: 'currency',
        currency: fiatCurrency,
        maximumFractionDigits: 2,
      }).format(valueChange as number)}) `
    : '';

  return includeNumber
    ? renderPercentageWithNumber(formattedValue, formattedValuePrice, color)
    : renderPercentage(formattedValue, color);
};
