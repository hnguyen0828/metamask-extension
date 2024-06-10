import React from 'react';
import { useSelector } from 'react-redux';
import { isValidAddress } from 'ethereumjs-util';

import {
  ConfirmInfoRow,
  ConfirmInfoRowAddress,
  ConfirmInfoRowDivider,
  ConfirmInfoRowUrl,
} from '../../../../../../components/app/confirm/info/row';
import { useI18nContext } from '../../../../../../hooks/useI18nContext';
import { currentConfirmationSelector } from '../../../../../../selectors';
import { Box } from '../../../../../../components/component-library';
import {
  BackgroundColor,
  BorderRadius,
} from '../../../../../../helpers/constants/design-system';
import { EIP712_PRIMARY_TYPE_PERMIT } from '../../../../constants';
import { SignatureRequestType } from '../../../../types/confirm';
import { parseTypedDataMessage } from '../../../../utils';
import { getUseTransactionSimulations } from '../../../../selectors/preferences';
import { ConfirmInfoRowTypedSignData } from '../../row/typed-sign-data/typedSignData';
import { PermitSimulation } from './permit-simulation';

const TypedSignInfo: React.FC = () => {
  const t = useI18nContext();
  const currentConfirmation = useSelector(
    currentConfirmationSelector,
  ) as SignatureRequestType;
  const useTransactionSimulations = useSelector(getUseTransactionSimulations);

  if (!currentConfirmation?.msgParams) {
    return null;
  }

  const {
    domain: { verifyingContract },
    primaryType,
    message: { spender },
  } = parseTypedDataMessage(currentConfirmation.msgParams.data as string);

  return (
    <>
      {primaryType === EIP712_PRIMARY_TYPE_PERMIT &&
        useTransactionSimulations && <PermitSimulation />}
      <Box
        backgroundColor={BackgroundColor.backgroundDefault}
        borderRadius={BorderRadius.MD}
        marginBottom={4}
        padding={0}
      >
        {primaryType === EIP712_PRIMARY_TYPE_PERMIT && (
          <>
            <Box padding={2}>
              <ConfirmInfoRow label={t('approvingTo')}>
                <ConfirmInfoRowAddress address={spender} />
              </ConfirmInfoRow>
            </Box>
            <ConfirmInfoRowDivider />
          </>
        )}
        <Box padding={2}>
          <ConfirmInfoRow
            label={t('requestFrom')}
            tooltip={t('requestFromInfo')}
          >
            <ConfirmInfoRowUrl url={currentConfirmation.msgParams.origin} />
          </ConfirmInfoRow>
        </Box>
        {isValidAddress(verifyingContract) && (
          <Box padding={2}>
            <ConfirmInfoRow label={t('interactingWith')}>
              <ConfirmInfoRowAddress address={verifyingContract} />
            </ConfirmInfoRow>
          </Box>
        )}
      </Box>
      <Box
        backgroundColor={BackgroundColor.backgroundDefault}
        borderRadius={BorderRadius.MD}
        padding={2}
        marginBottom={4}
      >
        <ConfirmInfoRow label={t('message')}>
          <ConfirmInfoRowTypedSignData
            data={currentConfirmation.msgParams?.data as string}
          />
        </ConfirmInfoRow>
      </Box>
    </>
  );
};

export default TypedSignInfo;
