import { Driver } from '../webdriver/driver';
import Rule from '@open-rpc/test-coverage/build/rules/rule';
import { Call } from '@open-rpc/test-coverage/build/coverage';
import {
  ContentDescriptorObject,
  ExampleObject,
  ExamplePairingObject,
  MethodObject,
} from '@open-rpc/meta-schema';
import paramsToObj from '@open-rpc/test-coverage/build/utils/params-to-obj';
import {
  WINDOW_TITLES,
  switchToOrOpenDapp,
} from '../helpers';

interface ConfirmationsRejectRuleOptions {
  driver: Driver;
  only: string[];
}
// this rule makes sure that all confirmation requests are rejected.
// it also validates that the JSON-RPC response is an error with
// error code 4001 (user rejected request)
export class ConfirmationsRejectRule implements Rule {
  private driver: any;
  private only: string[];
  private rejectButtonInsteadOfCancel: string[];
  private requiresEthAccountsPermission: string[];

  constructor(options: ConfirmationsRejectRuleOptions) {
    this.driver = options.driver;
    this.only = options.only;
    this.rejectButtonInsteadOfCancel = [
      'personal_sign',
      'eth_signTypedData_v4',
    ];
    this.requiresEthAccountsPermission = [
      'personal_sign',
      'eth_signTypedData_v4',
      'eth_getEncryptionPublicKey',
    ];
  }

  getTitle() {
    return 'Confirmations Rejection Rule';
  }

  async beforeRequest(_: any, call: Call) {
    try {
      if (this.requiresEthAccountsPermission.includes(call.methodName)) {
        const requestPermissionsRequest = JSON.stringify({
          jsonrpc: '2.0',
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });

        await this.driver.executeScript(
          `window.ethereum.request(${requestPermissionsRequest})`,
        );
        const screenshot = await this.driver.driver.takeScreenshot();
        call.attachments = call.attachments || [];
        call.attachments.push({
          type: 'image',
          data: `data:image/png;base64,${screenshot.toString('base64')}`,
        });

        await this.driver.waitUntilXWindowHandles(3);
        await this.driver.switchToWindowWithTitle(WINDOW_TITLES.Dialog);

        await this.driver.findClickableElements({
          text: 'Next',
          tag: 'button',
        });

        const screenshotTwo = await this.driver.driver.takeScreenshot();
        call.attachments.push({
          type: 'image',
          data: `data:image/png;base64,${screenshotTwo.toString('base64')}`,
        });

        await this.driver.clickElement({
          text: 'Next',
          tag: 'button',
        });

        await this.driver.clickElement({
          text: 'Confirm',
          tag: 'button',
        });

        await switchToOrOpenDapp(this.driver);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async afterRequest(_: any, call: Call) {
    try {
      await this.driver.waitUntilXWindowHandles(3);
      await this.driver.switchToWindowWithTitle(WINDOW_TITLES.Dialog);

      let text = 'Cancel';
      if (this.rejectButtonInsteadOfCancel.includes(call.methodName)) {
        await this.driver.findClickableElements({
          text: 'Reject',
          tag: 'button',
        });
        text = 'Reject';
      } else {
        await this.driver.findClickableElements({
          text: 'Cancel',
          tag: 'button',
        });
      }
      const screenshot = await this.driver.driver.takeScreenshot();
      call.attachments = call.attachments || [];
      call.attachments.push({
        type: 'image',
        data: `data:image/png;base64,${screenshot.toString('base64')}`,
      });
      await this.driver.clickElement({ text, tag: 'button' });
      // make sure to switch back to the dapp or else the next test will fail on the wrong window
      await switchToOrOpenDapp(this.driver);
    } catch (e) {
      console.log(e);
    }
  }

  // get all the confirmation calls to make and expect to pass
  getCalls(_: any, method: MethodObject) {
    const calls: Call[] = [];
    const isMethodAllowed = this.only ? this.only.includes(method.name) : true;
    if (isMethodAllowed) {
      if (method.examples) {
        // pull the first example
        const e = method.examples[0];
        const ex = e as ExamplePairingObject;

        if (!ex.result) {
          return calls;
        }
        const p = ex.params.map((e) => (e as ExampleObject).value);
        const params =
          method.paramStructure === 'by-name'
            ? paramsToObj(p, method.params as ContentDescriptorObject[])
            : p;
        calls.push({
          title: `${this.getTitle()} - with example ${ex.name}`,
          methodName: method.name,
          params,
          url: '',
          resultSchema: (method.result as ContentDescriptorObject).schema,
          expectedResult: (ex.result as ExampleObject).value,
        });
      } else {
        // naively call the method with no params
        calls.push({
          title: `${method.name} > confirmation rejection`,
          methodName: method.name,
          params: [],
          url: '',
          resultSchema: (method.result as ContentDescriptorObject).schema,
        });
      }
    }
    return calls;
  }

  async afterResponse(_: any, call: Call) {
    try {
      if (this.requiresEthAccountsPermission.includes(call.methodName)) {
        const revokePermissionsRequest = JSON.stringify({
          jsonrpc: '2.0',
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });

        await this.driver.executeScript(
          `window.ethereum.request(${revokePermissionsRequest})`,
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  validateCall(call: Call) {
    if (call.error) {
      call.valid = call.error.code === 4001;
      if (!call.valid) {
        call.reason = `Expected error code 4001, got ${call.error.code}`;
      }
    }
    return call;
  }
}
