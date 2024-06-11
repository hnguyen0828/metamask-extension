const { hexToNumber } = require('@metamask/utils');
const FixtureBuilder = require('../../../fixture-builder');
const {
  defaultGanacheOptions,
  defaultGanacheOptionsForType2Transactions,
  openDapp,
  unlockWallet,
  WINDOW_TITLES,
  withFixtures,
} = require('../../../helpers');
const { SMART_CONTRACTS } = require('../../../seeder/smart-contracts');
const { CHAIN_IDS } = require('../../../../../shared/constants/network');

describe('Confirmation Redesign Contract Interaction Component', function () {
  if (!process.env.ENABLE_CONFIRMATION_REDESIGN) {
    return;
  }

  it(`Opens a contract interaction type 0 transaction (Legacy)`, async function () {
    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder()
          .withPermissionControllerConnectedToTestDapp()
          .withPreferencesController({
            preferences: { redesignedConfirmationsEnabled: true },
          })
          .build(),
        ganacheOptions: defaultGanacheOptions,
        smartContract: SMART_CONTRACTS.PIGGYBANK,
        title: this.test?.fullTitle(),
      },
      async ({ driver }) => {
        await unlockWallet(driver);
        await openDapp(driver);

        await driver.delay(1024 * 1024);

        // await deployContract(driver);
        // await initiateContractInteractionTx(driver);
      },
    );
  });

  it(`Opens a contract interaction type 2 transaction (EIP1559)`, async function () {
    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder()
          .withPermissionControllerConnectedToTestDapp()
          .withPreferencesController({
            preferences: { redesignedConfirmationsEnabled: true },
          })
          .build(),
        ganacheOptions: defaultGanacheOptionsForType2Transactions,
        smartContract: SMART_CONTRACTS.PIGGYBANK,
        title: this.test?.fullTitle(),
      },
      async ({ driver }) => {
        await unlockWallet(driver);
        await openDapp(driver);

        await driver.delay(1024 * 1024);

        // await deployContract(driver);
        // await initiateContractInteractionTx(driver);
      },
    );
  });

  it(`Opens a contract interaction type 2 transaction that includes layer 1 fees breakdown on a layer 2`, async function () {
    await withFixtures(
      {
        dapp: true,
        fixtures: new FixtureBuilder({ inputChainId: CHAIN_IDS.OPTIMISM })
          .withPermissionControllerConnectedToTestDapp()
          .withPreferencesController({
            preferences: { redesignedConfirmationsEnabled: true },
          })
          .withTransactionControllerOPLayer2Transaction()
          .build(),
        ganacheOptions: {
          ...defaultGanacheOptionsForType2Transactions,
          network_id: hexToNumber(CHAIN_IDS.OPTIMISM),
          chainId: hexToNumber(CHAIN_IDS.OPTIMISM),
        },
        title: this.test?.fullTitle(),
      },
      async ({ driver }) => {
        await unlockWallet(driver);

        await openAdvancedDetailsAndCheckTheyExist(driver);
      },
    );
  });
});

async function deployContract(driver) {
  await driver.switchToWindowWithTitle(WINDOW_TITLES.TestDApp);
  await driver.clickElement(`#deployButton`);

  await driver.delay(2000);
  await driver.switchToWindowWithTitle(WINDOW_TITLES.Dialog);

  await driver.waitForSelector({
    css: '.confirm-page-container-summary__action__name',
    text: 'Contract deployment',
  });

  await driver.clickElement({ text: 'Confirm', tag: 'button' });
  await driver.waitUntilXWindowHandles(2);
  await driver.switchToWindowWithTitle(WINDOW_TITLES.ExtensionInFullScreenView);
  await driver.clickElement({ text: 'Activity', tag: 'button' });
  await driver.waitForSelector(
    '.transaction-list__completed-transactions .activity-list-item:nth-of-type(1)',
  );
}

async function initiateContractInteractionTx(driver) {
  await driver.switchToWindowWithTitle(WINDOW_TITLES.TestDApp);
  await driver.clickElement(`#depositButton`);

  await driver.delay(2000);
  await driver.switchToWindowWithTitle(WINDOW_TITLES.Dialog);

  await driver.waitForSelector({
    css: 'h2',
    text: 'Transaction request',
  });
}

async function openAdvancedDetailsAndCheckTheyExist(driver) {
  await driver.waitForSelector({ css: 'p', text: 'Fee details' });
  await driver.clickElement({ css: 'p', text: 'Fee details' });

  await driver.waitForSelector({ css: 'p', text: 'L2 Fees' });
  await driver.waitForSelector({ css: 'p', text: 'L1 Fees' });
}
