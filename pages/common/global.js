import * as xrpl from 'xrpl';
import { MAIN_RPC } from "./constants";

const client = new xrpl.Client(MAIN_RPC.XRPL_WSS);
export {
    client,
};