import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useI18nContext } from '../../../hooks/useI18nContext';

import { hideModal } from '../../../store/actions';

import Typography from '../../../components/ui/typography/typography';
import Box from '../../../components/ui/box/box';
import {
  TEXT_ALIGN,
  TypographyVariant,
  FONT_WEIGHT,
} from '../../../helpers/constants/design-system';
import NetworksForm from '../../settings/networks-tab/networks-form/networks-form';

export default function AddNetworkModal({
  showHeader = false,
  isNewNetworkFlow = false,
  addNewNetwork = true,
  networkToEdit = null,
}) {
  const dispatch = useDispatch();
  const t = useI18nContext();

  const closeCallback = () =>
    dispatch(hideModal({ name: 'ONBOARDING_ADD_NETWORK' }));

  const additionalProps = networkToEdit
    ? { selectedNetwork: networkToEdit }
    : {};

  return (
    <>
      {showHeader ? (
        <Box paddingTop={4}>
          <Typography
            variant={TypographyVariant.H4}
            align={TEXT_ALIGN.CENTER}
            fontWeight={FONT_WEIGHT.BOLD}
          >
            {t('onboardingMetametricsModalTitle')}
          </Typography>
        </Box>
      ) : null}
      <NetworksForm
        addNewNetwork={addNewNetwork}
        restrictHeight
        setActiveOnSubmit
        networksToRender={[]}
        cancelCallback={closeCallback}
        submitCallback={closeCallback}
        isNewNetworkFlow={isNewNetworkFlow}
        {...additionalProps}
      />
    </>
  );
}

AddNetworkModal.propTypes = {
  showHeader: PropTypes.bool,
  isNewNetworkFlow: PropTypes.bool,
  addNewNetwork: PropTypes.bool,
  networkToEdit: PropTypes.object,
};

AddNetworkModal.defaultProps = {
  showHeader: false,
  isNewNetworkFlow: false,
  addNewNetwork: true,
  networkToEdit: null,
};
