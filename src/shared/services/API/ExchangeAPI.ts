import axios from "axios";
import URL from "shared/functions/getURL";
import { getPriviWallet } from "shared/helpers/wallet";
import { signPayload } from "../WalletSign";
import { IAPIRequestProps } from "shared/types/Media";


export interface ICreateExchange {
    "Address": string,
    "ExchangeToken": string,
    "InitialAmount": number,
    "OfferToken": string,
    "Price": string
  }
  
  export async function createExchange(
    address: string,
    payload: ICreateExchange,
    additionalData: Object,
    ): Promise<any> {
      try {
        const requestData: IAPIRequestProps = {
          Function: 'createExchange',
          Address: address,
          Signature: "",
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/createExchange/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface IPlaceOffer {
    "ExchangeId": string,
    "Address": string,
    "OfferToken": string,
    "Amount": string,
    "Price": string
  }
  
  export async function placeBuyingOffer(
    address: string,
    payload: IPlaceOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const requestData: IAPIRequestProps = {
          Function: 'placeBuyingOffer',
          Address: address,
          Signature: "",
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/placeBuyingOffer/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface IPlaceOffer {
    "ExchangeId": string,
    "Address": string,
    "OfferToken": string,
    "Amount": string,
    "Price": string
  }
  
  export async function placeSellingOffer(
    address: string,
    payload: IPlaceOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const requestData: IAPIRequestProps = {
          Function: 'placeSellingOffer',
          Address: address,
          Signature: "",
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/placeSellingOffer/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface IBuySellFromOffer {
    "ExchangeId": string,
    "OfferId": string,
    "Address": string,
    "Amount": string
  }
  
  export async function buyFromOffer(
    address: string,
    payload: IBuySellFromOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const requestData: IAPIRequestProps = {
          Function: 'buyFromOffer',
          Address: address,
          Signature: "",
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/buyFromOffer/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export async function sellFromOffer(
    address: string,
    payload: IBuySellFromOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const requestData: IAPIRequestProps = {
          Function: 'sellFromOffer',
          Address: address,
          Signature: "",
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/sellFromOffer/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export interface ICancelOffer {
    "ExchangeId": string,
    "OfferId": string
  }
  
  export async function cancelBuyingOffer(
    address: string,
    payload: ICancelOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const requestData: IAPIRequestProps = {
          Function: 'cancelBuyingOffer',
          Address: address,
          Signature: "",
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/cancelBuyingOffer/v2`, body);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export async function cancelSellingOffer(
    address: string,
    payload: ICancelOffer,
    additionalData: Object,
    ): Promise<any> {
      try {
        const requestData: IAPIRequestProps = {
          Function: 'cancelSellingOffer',
          Address: address,
          Signature: "",
          Payload: payload,
        };
        const body = {
            Data: requestData,
            AdditionalData: additionalData
        };
        const response = await axios.post(`${URL()}/exchange/cancelSellingOffer/v2`, body);
        return response.data;
      } 
      catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export async function getExchange(
    exchangeId: string,
    ): Promise<any> {
      try {
        const response = await axios.get(`${URL()}/exchange/getExchange/${exchangeId}`);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export async function getBuyingOffers(
    exchangeId: string,
    ): Promise<any> {
      try {
        const response = await axios.get(`${URL()}/exchange/getBuyingOffers/${exchangeId}`);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export async function getExchangePriceHistory(
    exchangeId: string,
    ): Promise<any> {
      try {
        const response = await axios.get(`${URL()}/exchange/getPriceHistory/${exchangeId}`);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }

  export async function getExchangeTransactions(
    exchangeId: string,
    ): Promise<any> {
      try {
        const response = await axios.get(`${URL()}/exchange/getTransactionHistory/${exchangeId}`);
        return response.data;
      } catch (e) {
        console.log(e);
        throw new Error(e.message);
      }
  }