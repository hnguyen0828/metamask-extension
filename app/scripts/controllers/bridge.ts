import { ObservableStore } from '@metamask/obs-store';

export type BridgeFeatureFlags = {
  'extension-support': boolean;
};

const initialState = {
  bridgeState: {
    bridgeFeatureFlags: {},
  },
};

// TODO implement network calls
// TODO extend swaps controller, add bridge controller states to swaps controller
export default class BridgeController {
  store = new ObservableStore(initialState);

  resetState = () => {
    this.store.updateState({
      bridgeState: {
        ...initialState.bridgeState,
      },
    });
  };

  setBridgeFeatureFlags = (bridgeFeatureFlags: BridgeFeatureFlags) => {
    const { bridgeState } = this.store.getState();
    console.log('====setBridgeFeatureFlags', {
      bridgeFeatureFlags,
      bridgeState,
    });
    this.store.updateState({
      bridgeState: { ...bridgeState, bridgeFeatureFlags },
    });
  };
}
