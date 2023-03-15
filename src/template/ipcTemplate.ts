import { createTemplate } from './createTemplate';
import { IpcRenderer } from 'electron';
import { ipcInvoker } from '../utils';

export const ipcTemplate = (i: IpcRenderer) =>
    createTemplate(c => ({
        create: data => ipcInvoker(i, c, 'POST', data),

        index: () => ipcInvoker(i, c, 'GET'),
        read: data => ipcInvoker(i, c, 'GET', data),

        update: data => ipcInvoker(i, c, 'PATCH', data),

        destroy: data => ipcInvoker(i, c, 'DELETE', data),
    }));
