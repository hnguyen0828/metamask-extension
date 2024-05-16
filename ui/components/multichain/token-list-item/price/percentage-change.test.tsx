import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { zeroAddress } from 'ethereumjs-util';
import { getIntlLocale } from '../../../../ducks/locale/locale';
import {
  getCurrentCurrency,
  getSelectedAccountCachedBalance,
  getTokensMarketData,
} from '../../../../selectors';
import {
  getConversionRate,
  getNativeCurrency,
} from '../../../../ducks/metamask/metamask';
import { PercentageChange } from './percentage-change';

jest.mock('react-redux', () => ({
  useSelector: jest.fn((selector) => selector()),
}));

jest.mock('../../../../ducks/locale/locale', () => ({
  getIntlLocale: jest.fn(),
}));

jest.mock('../../../../selectors', () => ({
  getCurrentCurrency: jest.fn(),
  getSelectedAccountCachedBalance: jest.fn(),
  getTokensMarketData: jest.fn(),
}));

jest.mock('../../../../ducks/metamask/metamask', () => ({
  getConversionRate: jest.fn(),
  getNativeCurrency: jest.fn(),
}));

const mockGetIntlLocale = getIntlLocale as unknown as jest.Mock;
const mockGetCurrentCurrency = getCurrentCurrency as jest.Mock;
const mockGetSelectedAccountCachedBalance =
  getSelectedAccountCachedBalance as jest.Mock;
const mockGetConversionRate = getConversionRate as jest.Mock;
const mockGetNativeCurrency = getNativeCurrency as jest.Mock;
const mockGetTOkensMarketData = getTokensMarketData as jest.Mock;

describe('PercentageChange Component', () => {
  beforeEach(() => {
    mockGetIntlLocale.mockReturnValue('en-US');
    mockGetCurrentCurrency.mockReturnValue('USD');
    mockGetSelectedAccountCachedBalance.mockReturnValue('0x02e8ac1ede6ade83');
    mockGetConversionRate.mockReturnValue(2913.15);
    mockGetNativeCurrency.mockReturnValue('ETH');
    mockGetTOkensMarketData.mockReturnValue({
      [zeroAddress()]: {
        pricePercentChange1d: 2,
      },
    });

    jest.clearAllMocks();
  });

  describe('render', () => {
    it('renders correctly', () => {
      const { container } = render(<PercentageChange value={5.123} />);
      expect(container).toMatchSnapshot();
    });
  });
  it('displays a positive value with a + sign and in green color', () => {
    render(<PercentageChange value={5.123} />);
    const valueElement = screen.getByText('(+5.12%)');
    expect(valueElement).toBeInTheDocument();
  });

  it('displays a negative value with a - sign and in red color', () => {
    render(<PercentageChange value={-2.345} />);
    const valueElement = screen.getByText('(-2.35%)');
    expect(valueElement).toBeInTheDocument();
  });

  it('displays a zero value with a + sign and in green color', () => {
    render(<PercentageChange value={0} />);
    const valueElement = screen.getByText('(+0.00%)');
    expect(valueElement).toBeInTheDocument();
  });

  it('renders an empty string when value is null', () => {
    render(<PercentageChange value={null} />);
    const textElement = screen.getByTestId(
      'token-increase-decrease-percentage',
    );
    expect(textElement).toHaveTextContent('');
  });

  it('renders an empty string when value is an invalid number', () => {
    render(<PercentageChange value={NaN} />);
    const textElement = screen.getByTestId(
      'token-increase-decrease-percentage',
    );
    expect(textElement).toHaveTextContent('');
  });

  it('renders empty strings for both percentage and value when value is null and includeNumber is true', () => {
    render(<PercentageChange value={null} includeNumber={true} />);
    const percentageElement = screen.getByTestId(
      'token-increase-decrease-percentage',
    );
    const valueElement = screen.getByTestId('token-increase-decrease-value');
    expect(percentageElement).toHaveTextContent('');
    expect(valueElement).toHaveTextContent('+$12.21');
  });

  it('displays empty string without color if value is not a number', () => {
    render(<PercentageChange value={0} />);
    const valueElement = screen.getByText('(+0.00%)');
    expect(valueElement).toBeInTheDocument();
  });

  it('displays positive percentage with number in success color', () => {
    render(
      <PercentageChange
        value={3.456}
        valueChange={100.12}
        includeNumber={true}
      />,
    );
    const percentageElement = screen.getByText('(+3.46%)');
    const numberElement = screen.getByText('+$12.21');
    expect(percentageElement).toBeInTheDocument();
    expect(numberElement).toBeInTheDocument();
  });

  it('displays negative percentage with number in error color', () => {
    render(<PercentageChange value={-1.234} includeNumber={true} />);
    const percentageElement = screen.getByText('(-1.23%)');
    const numberElement = screen.getByText('+$12.21');
    expect(percentageElement).toBeInTheDocument();
    expect(numberElement).toBeInTheDocument();
  });
});
