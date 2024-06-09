import events from 'events';
import WebSocket from 'ws';
import { ExtensionResponseTabs } from './types';

let _socketServer: MochaSocketServer | null = null;

export function getSocketServer() {
  if (!_socketServer) {
    startSocketServer();
  }

  return _socketServer;
}

export function startSocketServer() {
  _socketServer = new MochaSocketServer();
}

class MochaSocketServer {
  private server: WebSocket.Server;
  private ws: WebSocket | null = null;
  private eventEmitter;

  constructor() {
    this.server = new WebSocket.Server({ port: 8111 });

    console.log('socketServer created');

    this.server.on('connection', (ws) => {
      this.ws = ws;

      ws.on('message', (message) => this.receivedMessage(message));
    });

    this.eventEmitter = new events.EventEmitter();
  }

  send(message: any) {
    if (!this.ws) {
      console.log('No client connected');
      return;
    }

    if (typeof message === 'string') {
      this.ws.send(message);
    } else {
      this.ws.send(JSON.stringify(message));
    }
  }

  receivedMessage(message: any) {
    console.log('received: ' + message);

    try {
      const msg = JSON.parse(message);

      if (msg.command === 'switchToIndex') {
        this.eventEmitter.emit('switchToIndex', msg);
      }
      if (msg.command === 'openTabs') {
        console.log('openTabsLength', msg.tabs.length);
      }
    } catch (e) {
      console.log('error in JSON', e);
    }
  }

  queryTabs(tabTitle: string) {
    this.send({ command: 'queryTabs', title: tabTitle });
  }

  async switchToWindowWithTitle(title: string) {
    console.log('new switching to window with title', title);

    this.send({ command: 'switchToWindowWithTitle', title });

    console.log('waiting for response');

    let tabs = await this.waitForResponse();
    console.log('got the response', tabs);
    // let tabs: ExtensionResponseTabs = await this.waitForResponse();
    // console.log('got the response', tabs.findIndex, tabs.numTabs);

    return tabs;
  }

  async waitForResponse() {
    return new Promise<ExtensionResponseTabs>((resolve) => {
      this.eventEmitter.on('switchToIndex', resolve);
    });
  }
}
