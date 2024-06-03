import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

//import { getBalanceFromChain } from '../../../store/actions';
import { getSelectedInternalAccount } from '../../../selectors';

import { CoinOverview } from './coin-overview';

const BtcOverview = ({ className }) => {
  const account = useSelector(getSelectedInternalAccount);

  const [balance, setBalance] = useState('0.000001');
  //const getBalance = async () => {
  //  const response = await getBalanceFromChain(account.id);
  //  setBalance(response.amount);
  //};

  // HACK: Until we cache the balance
  // useEffect(() => {
  //  getBalance();
  // }, [getBalance]);

  return (
    <CoinOverview
      balance={balance}
      balanceIsCached={false}
      balanceRaw
      className={className}
      chainId="bip122:000000000019d6689c085ae165831e93"
      isSigningEnabled={false}
      isSwapsChain={false}
      ///: BEGIN:ONLY_INCLUDE_IF(build-main,build-beta,build-flask)
      isBridgeChain={false}
      isBuyableChain
      isBuyableChainWithoutSigning
      ///: END:ONLY_INCLUDE_IF
    />
  );
};

BtcOverview.propTypes = {
  className: PropTypes.string,
};

export default BtcOverview;
