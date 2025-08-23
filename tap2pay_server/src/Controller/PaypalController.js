import * as JWT from '../Helper/Core/JWT.js'
import Logger from "../Helper/Core/Logger.js"
import * as ApiResponse from "../Helper/Core/ApiResponse.js"
import { StatusCodes } from "../Helper/Core/ApiResponse.js"
import User from "../Model/User.js"
import bcrypt from "bcrypt"
import paypal from 'paypal-rest-sdk'
import Product from "../Model/Product.js"
import CryptoJS from 'crypto-js'
import Purchase from "../Model/Purchase.js"

paypal.configure({
  mode: 'sandbox', // or 'live'
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
})

const secretKey = process.env.JWT_SECRET

export const getProducts = async (req, res) => {
  try {
    const plans = await Product.find()
    Logger.info('Get plans successfully')
    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success({ details: plans }, StatusCodes.OK, 'Get plans successfully'))
  } catch (error) {
    console.log(error)
    Logger.error(error.isJoi === true ? error.details : error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse.error(
          error.isJoi === true ? error.details : error,
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Invalid details provided.',
        ),
      )
  }
}

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.headers['userId'] }).sort({ createdAt: -1 })
    Logger.info('Get purchases successfully')
    return res
      .status(StatusCodes.OK)
      .json(ApiResponse.success({ details: purchases }, StatusCodes.OK, 'Get purchases successfully'))
  } catch (error) {
    console.log(error)
    Logger.error(error.isJoi === true ? error.details : error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse.error(
          error.isJoi === true ? error.details : error,
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Invalid details provided.',
        ),
      )
  }
}

export const createCheckoutSession = async (req, res) => {
  try {
    const { cart, totalAmount } = req.body;
    const bytes = CryptoJS.AES.decrypt(cart, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const bytesTotalAmount = CryptoJS.AES.decrypt(totalAmount, secretKey);
    const decryptedTotalAmount = JSON.parse(bytesTotalAmount.toString(CryptoJS.enc.Utf8));

    const create_payment_json = {
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      redirect_urls: {
        return_url: 'http://localhost:5173/success?cart=' + cart + '&totalAmount=' + totalAmount + '&type=payment',
        cancel_url: 'http://localhost:5173/dashboard',
      },
      transactions: [{
        item_list: {
          items: decryptedData.map((item) => {
            return {
              name: item.name,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: 'USD',
              quantity: item.quantity.toString(),
            };
          }),
        },
        amount: {
          currency: 'USD',
          total: decryptedTotalAmount.toString(),
        },
        description: `Subscription plan`,
      }],
    }

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) return res.status(500).json({ message: error.message })
      const approvalUrl = payment.links.find((link) => link.rel === 'approval_url').href
      return res.status(StatusCodes.OK).json(ApiResponse.success({ url: approvalUrl }, StatusCodes.OK, 'Payment created successfully'))
    })
  } catch (error) {
    console.log(error)
    Logger.error(error.isJoi === true ? error.details : error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse.error(
          error.isJoi === true ? error.details : error,
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Invalid details provided.',
        ),
      )
  }
}

function executePaymentAsync(paymentId, execute_payment_json) {
  return new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) return reject(error);
      resolve(payment);
    });
  });
}

export const executePayment = async (req, res) => {
  try {
    const { paymentId, PayerID, cart, totalAmount } = req.body;

    // Validate required fields first
    if (!paymentId || !PayerID || !totalAmount) {
      return res.status(400).json({
        message: 'Missing paymentId, PayerID or totalAmount',
      });
    }

    // Decrypt totalAmount safely
    const bytesTotalAmount = CryptoJS.AES.decrypt(totalAmount?.replaceAll(' ', '+'), secretKey);
    const decryptedString = bytesTotalAmount.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      return res.status(400).json({ message: 'Invalid encrypted amount' });
    }

    const decryptedTotalAmount = parseFloat(JSON.parse(decryptedString)).toFixed(2);

    const execute_payment_json = {
      payer_id: PayerID,
      transactions: [
        {
          amount: {
            currency: 'USD',
            total: decryptedTotalAmount,
          },
        },
      ],
    };

    // PayPal Execution
    const payment = await executePaymentAsync(paymentId, execute_payment_json);
    console.log('PAYMENT RESPONSE:', payment);

    await Purchase.create({
      userId: req.headers['userId'],
      amount: decryptedTotalAmount,
      paymentId: paymentId,
      PayerID: PayerID,
      cart: cart,
    });

    Logger.info('Payment executed successfully');
    return res.status(StatusCodes.OK).json(
      ApiResponse.success({ message: 'Payment executed successfully' }, StatusCodes.OK)
    );

  } catch (error) {
    console.log('EXECUTE PAYMENT ERROR:', error);
    Logger.error(error.isJoi === true ? error.details : error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        ApiResponse.error(
          error.isJoi === true ? error.details : error,
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Invalid details provided.'
        )
      );
  }
};
