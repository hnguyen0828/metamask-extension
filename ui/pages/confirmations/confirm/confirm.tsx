import React from 'react';
import { AlertActionHandlerProvider } from '../../../components/app/alert-system/contexts/alertActionHandler';
///: BEGIN:ONLY_INCLUDE_IF(build-mmi)
import { MMISignatureMismatchBanner } from '../../../components/app/mmi-signature-mismatch-banner';
///: END:ONLY_INCLUDE_IF
import { Page } from '../../../components/multichain/pages/page';
import { GasFeeContextProvider } from '../../../contexts/gasFee';
import { TransactionModalContextProvider } from '../../../contexts/transaction-modal';
import { Footer } from '../components/confirm/footer';
import { Header } from '../components/confirm/header';
import { Info } from '../components/confirm/info';
import { LedgerInfo } from '../components/confirm/ledger-info';
import { Nav } from '../components/confirm/nav';
import { PluggableSection } from '../components/confirm/pluggable-section';
import ScrollToBottom from '../components/confirm/scroll-to-bottom';
import { Title } from '../components/confirm/title';
import setConfirmationAlerts from '../hooks/setConfirmationAlerts';
import setCurrentConfirmation from '../hooks/setCurrentConfirmation';
import syncConfirmPath from '../hooks/syncConfirmPath';
import useConfirmationAlertActions from '../hooks/useConfirmationAlertActions';
import useCurrentConfirmation from '../hooks/useCurrentConfirmation';

const Confirm = () => {
  setCurrentConfirmation();
  syncConfirmPath();
  setConfirmationAlerts();

  const processAction = useConfirmationAlertActions();
  const { currentConfirmation } = useCurrentConfirmation();

  return (
    <AlertActionHandlerProvider onProcessAction={processAction}>
      <TransactionModalContextProvider>
        <GasFeeContextProvider transaction={currentConfirmation}>
          <Page className="confirm_wrapper">
            <Nav />
            <Header />
            {
              ///: BEGIN:ONLY_INCLUDE_IF(build-mmi)
              <MMISignatureMismatchBanner />
              ///: END:ONLY_INCLUDE_IF
            }
            <ScrollToBottom>
              <LedgerInfo />
              <Title />
              <Info />
              <PluggableSection />
            </ScrollToBottom>
            <Footer />
          </Page>
        </GasFeeContextProvider>
      </TransactionModalContextProvider>
    </AlertActionHandlerProvider>
  );
};

export default Confirm;
