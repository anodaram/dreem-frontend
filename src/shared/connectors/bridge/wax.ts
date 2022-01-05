import * as WaxJS from "@waxio/waxjs/dist";

export const rcpEndpoint = process.env.REACT_APP_WAX_NODE_URL || 'https://jungle3.cryptolions.io';

const testWaxUsername = process.env.REACT_APP_TEST_WAX_USERNAME;
const testWaxActivePubKey =
  process.env.REACT_APP_TEST_WAX_ACTIVE_PUBKEY;
const testWaxOwnerPubKey =
  process.env.REACT_APP_TEST_WAX_OWNER_PUBKEY;

export const WAX_ACTIONS = {
  SWAP_WAX: 'SWAP_WAX',
  WITHDRAW_WAX: 'WITHDRAW_WAX',
};

export type WaxWalletBalance = {
  amount: number;
  symbol: string;
};

export type WaxNFT = {
  author: string;
  category: string;
  owner: string;
  id: string;
  idata: Record<string, any>;
  mdata: Record<string, any>;
  container: any[];
  containerf: any[];
};

export const getWaxInstance = (username?: string, pubKeys?: string[]) => {
  const account = username || testWaxUsername;
  const pubkeys = pubKeys || [testWaxActivePubKey, testWaxOwnerPubKey];

  return new WaxJS.WaxJS(rcpEndpoint, account, pubkeys.filter(key => !key).length === 0 ? pubkeys as string[] : undefined, true);
};

export const getNewWaxInstance = () => {
  if (process.env.NODE_ENV === 'production') {
    return new WaxJS.WaxJS(rcpEndpoint, undefined, undefined, false);
  } else {
    return getWaxInstance();
  }
};

export const getWaxNFTs = async (wax: WaxJS.WaxJS, username: string): Promise<WaxNFT[]> => {
  try {
    const results = await (wax as any).rpc.get_table_rows({
      json: true,               // Get the response as json
      code: 'simpleassets',     // Contract that we target
      scope: username,          // Account that owns the data
      table: 'sassets',        // Table name
      limit: 10,               // Maximum number of rows that we want to get
    });
  
    console.log('wax nfts', results);

    if (results && Array.isArray(results.rows)) {
      return results.rows as WaxNFT[];
    }
  } catch (e) {
    console.error('getWaxNFTs() error:', e);
    return [];
  }

  return [];
}

export const transferNFT = async (wax: WaxJS.WaxJS, from: string, assetId: string) => {
  try {
    return await wax.api.transact({
      actions: [{
        account: 'simpleassets',
        name: 'transfer',
        authorization: [{
          actor: from,
          permission: 'active',
        }],
        data: {
          from,
          to: process.env.REACT_APP_PRIVI_WAX_ACCOUNT,
          assetids: [assetId],
          memo: 'Transfer to Privi'
        },
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    })
  } catch (e) {
    console.error('transferNFT() error:', e);
    throw e;
  }
}

export const getWaxBalances = async (wax: WaxJS.WaxJS, username: string): Promise<WaxWalletBalance[]> => {
  try {
    const results = await (wax as any).rpc.get_table_rows({
      json: true,               // Get the response as json
      code: 'eosio.token',      // Contract that we target
      scope: username,          // Account that owns the data
      table: 'accounts',        // Table name
      limit: 10,                // Maximum number of rows that we want to get
      reverse: false,           // Optional: Get reversed data
      show_payer: true          // Optional: Show ram payer
    });
  
    if (results && Array.isArray(results.rows)) {
      return results.rows.filter(row => !!row.data?.balance).map(row => {
        const balanceString = row.data.balance + ''; // e.g. 1000.00000000 WAX

        const parts = balanceString.split(' ');

        return {
          amount: +parts[0],
          symbol: parts[1],
        } as WaxWalletBalance;
      });
    }
  } catch (e) {
    console.error('getWaxBalances() error:', e);
    return [];
  }

  return [];
}
