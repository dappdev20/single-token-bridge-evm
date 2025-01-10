import React from 'react';
import * as xrpl from 'xrpl';
import { MAIN_RPC } from "./constants";

export const client = new xrpl.Client(MAIN_RPC.XRPL_WSS);
export default client;
