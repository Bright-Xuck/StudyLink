import axios, { AxiosRequestConfig } from "axios";

// Fapshi API response types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FapshiResponse<T = unknown> {
  message?: string;
  statusCode: number;
  success?: boolean;
  transId?: string;
  dateInitiated?: string;
  //data?: T;
}

export interface FapshiInitiatePaymentData {
  amount: number;
  email?: string;
  userId?: string;
  externalId?: string;
  redirectUrl?: string;
  message?: string;
}

export interface FapshiDirectPaymentData {
  amount: number;
  phone: string; // Required for direct pay
  medium?: string;
  name?: string;
  email?: string;
  userId?: string;
  externalId?: string;
  message?: string;
}

export interface FapshiPayoutData {
  amount: number;
  phone: string; // Required for payout
  medium?: string;
  name?: string;
  email?: string;
  userId?: string;
  externalId?: string;
  message?: string;
}

export interface FapshiPaymentResponse {
  link?: string;
  transId: string;
  status: string;
}

export interface FapshiTransactionStatus {
  transId: string;
  amount: number;
  status: "created" | "pending" | "successful" | "failed" | "expired";
  phone?: string;
  medium?: string;
  userId?: string;
  externalId?: string;
  message?: string;
  createdAt: string;
  updatedAt?: string;
  statusCode?: number;
  success?: boolean;
  dateInitiated?: string;
  dateConfirmed?: string;
}

export interface FapshiBalance {
  balance: number;
  currency: string;
}

export interface FapshiSearchParams {
  status?: "created" | "successful" | "failed" | "expired";
  medium?: "mobile money" | "orange money";
  start?: string; // yyyy-mm-dd format
  end?: string; // yyyy-mm-dd format
  amt?: number; // >= 100
  limit?: number; // range(1, 100), default is 10
  sort?: "asc" | "desc";
}

class FapshiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "FapshiError";
  }
}

class FapshiClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor() {
    this.baseUrl = process.env.FAPSHI_LIVE_URL ?? "";
    this.headers = {
      apiuser: process.env.FAPSHI_API_USER ?? "",
      apikey: process.env.FAPSHI_API_KEY ?? "",
      "Content-Type": "application/json",
    };

    // Only log in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        "Fapshi API User:",
        this.headers.apiuser ? "Loaded ✅" : "Not Loaded ❌"
      );
      console.log(
        "Fapshi API Key:",
        this.headers.apikey ? "Loaded ✅" : "Not Loaded ❌"
      );
      console.log(
        "Fapshi Base URL:",
        this.baseUrl ? "Loaded ✅" : "Not Loaded ❌"
      );
    }
  }

  private validateAmount(amount: number): void {
    if (!amount) {
      throw new FapshiError("Amount is required", 400);
    }
    if (!Number.isInteger(amount)) {
      throw new FapshiError("Amount must be an integer", 400);
    }
    if (amount < 100) {
      throw new FapshiError("Amount cannot be less than 100 XAF", 400);
    }
  }

  private validatePhone(phone: string): void {
    if (!phone) {
      throw new FapshiError("Phone number is required", 400);
    }
    if (typeof phone !== "string") {
      throw new FapshiError("Phone must be a string", 400);
    }
    if (!/^6[\d]{8}$/.test(phone)) {
      throw new FapshiError(
        "Invalid phone number format. Expected: 6XXXXXXXX",
        400
      );
    }
  }

  private validateTransactionId(transId: string): void {
    if (!transId || typeof transId !== "string") {
      throw new FapshiError(
        "Invalid transaction ID type, string expected",
        400
      );
    }
    if (!/^[a-zA-Z0-9]{8,10}$/.test(transId)) {
      throw new FapshiError("Invalid transaction ID format", 400);
    }
  }

  private validateUserId(userId: string): void {
    if (!userId || typeof userId !== "string") {
      throw new FapshiError("Invalid user ID type, string expected", 400);
    }
    if (!/^[a-zA-Z0-9-_]{1,100}$/.test(userId)) {
      throw new FapshiError("Invalid user ID format", 400);
    }
  }

  private async makeRequest<T>(
    config: AxiosRequestConfig
  ): Promise<FapshiResponse<T>> {
    try {
      const response = await axios({
        ...config,
        headers: {
          ...this.headers,
          ...config.headers,
        },
      });

      return {
        ...response.data,
        statusCode: response.status,
        success: true,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const errorData = error.response.data as any;
          throw new FapshiError(
            errorData.message || "Fapshi API error",
            error.response.status,
            errorData
          );
        } else if (error.request) {
          // Request made but no response
          throw new FapshiError(
            "No response from Fapshi API - network or timeout error",
            500,
            error
          );
        }
      }
      // Other errors
      throw new FapshiError("Unexpected error occurred", 500, error);
    }
  }
  private async makeRequest2(
    config: AxiosRequestConfig
  ) {
    try {
      const response = await axios({
        ...config,
        headers: {
          ...this.headers,
          ...config.headers,
        },
      });

      return {
        ...response.data,
        statusCode: response.status,
        success: true,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const errorData = error.response.data as any;
          throw new FapshiError(
            errorData.message || "Fapshi API error",
            error.response.status,
            errorData
          );
        } else if (error.request) {
          // Request made but no response
          throw new FapshiError(
            "No response from Fapshi API - network or timeout error",
            500,
            error
          );
        }
      }
      // Other errors
      throw new FapshiError("Unexpected error occurred", 500, error);
    }
  }

  /**
   * Initiates a payment and returns a redirect link for the user to complete payment
   * Only amount is required, other fields are optional
   */
  async initiatePay(
    data: FapshiInitiatePaymentData
  ): Promise<FapshiResponse<FapshiPaymentResponse>> {
    try {
      this.validateAmount(data.amount);

      const config: AxiosRequestConfig = {
        method: "post",
        url: `${this.baseUrl}/initiate-pay`,
        data,
      };

      return await this.makeRequest<FapshiPaymentResponse>(config);
    } catch (error) {
      if (error instanceof FapshiError) {
        return {
          message: error.message,
          statusCode: error.statusCode,
          success: false,
        };
      }
      return {
        message: "Unknown error occurred",
        statusCode: 500,
        success: false,
      };
    }
  }

  /**
   * Directly initiates a payment request to a user's mobile device
   * Returns a transaction ID for status checking
   * IMPORTANT: phone is REQUIRED for this method
   */
  async directPay(
    data: FapshiDirectPaymentData
  ): Promise<FapshiResponse<FapshiPaymentResponse>> {
    try {
      this.validateAmount(data.amount);
      this.validatePhone(data.phone); // FIXED: Now always validates phone

      const config: AxiosRequestConfig = {
        method: "post",
        url: `${this.baseUrl}/direct-pay`,
        data,
      };

      return await this.makeRequest<FapshiPaymentResponse>(config);
    } catch (error) {
      if (error instanceof FapshiError) {
        return {
          message: error.message,
          statusCode: error.statusCode,
          success: false,
        };
      }
      return {
        message: "Unknown error occurred",
        statusCode: 500,
        success: false,
      };
    }
  }

  /**
   * Gets the status of a payment transaction
   */
  async getPaymentStatus(transId: string): Promise<FapshiTransactionStatus> {
    try {
      this.validateTransactionId(transId);

      const config: AxiosRequestConfig = {
        method: "get",
        url: `${this.baseUrl}/payment-status/${transId}`,
      };

      const response = await this.makeRequest2(config);

      return {
        ...response,
        status: (response.status as string).toLowerCase() as "created" | "pending" | "successful" | "failed" | "expired",
      } as FapshiTransactionStatus;
    } catch (error) {
      if (error instanceof FapshiError) {
        return {
          transId,
          status: "failed",
          amount: 0,
          createdAt: "",
          success: false,
          statusCode: error.statusCode,
          message: error.message,
        };
      }
      return {
        transId,
        status: "failed",
        amount: 0,
        createdAt: "",
        success: false,
        statusCode: 500,
        message: "Unknown error occurred",
      };
    }
  }

  /**
   * Expires a pending payment transaction
   */
  async expirePayment(
    transId: string
  ): Promise<FapshiResponse<FapshiTransactionStatus>> {
    try {
      this.validateTransactionId(transId);

      const config: AxiosRequestConfig = {
        method: "post",
        url: `${this.baseUrl}/expire-pay`,
        data: { transId },
      };

      return await this.makeRequest<FapshiTransactionStatus>(config);
    } catch (error) {
      if (error instanceof FapshiError) {
        return {
          message: error.message,
          statusCode: error.statusCode,
          success: false,
        };
      }
      return {
        message: "Unknown error occurred",
        statusCode: 500,
        success: false,
      };
    }
  }

  /**
   * Gets all transactions for a specific user
   */
  async getUserTransactions(
    userId: string
  ): Promise<FapshiResponse<FapshiTransactionStatus[]>> {
    try {
      this.validateUserId(userId);

      const config: AxiosRequestConfig = {
        method: "get",
        url: `${this.baseUrl}/transaction/${userId}`,
      };

      return await this.makeRequest<FapshiTransactionStatus[]>(config);
    } catch (error) {
      if (error instanceof FapshiError) {
        return {
          message: error.message,
          statusCode: error.statusCode,
          success: false,
        };
      }
      return {
        message: "Unknown error occurred",
        statusCode: 500,
        success: false,
      };
    }
  }

  /**
   * Gets the current account balance
   */
  async getBalance(): Promise<FapshiResponse<FapshiBalance>> {
    try {
      const config: AxiosRequestConfig = {
        method: "get",
        url: `${this.baseUrl}/balance`,
      };

      return await this.makeRequest<FapshiBalance>(config);
    } catch (error) {
      if (error instanceof FapshiError) {
        return {
          message: error.message,
          statusCode: error.statusCode,
          success: false,
        };
      }
      return {
        message: "Unknown error occurred",
        statusCode: 500,
        success: false,
      };
    }
  }

  /**
   * Performs a payout to a specified phone number
   * Note: Payouts must be enabled in your Fapshi account
   * IMPORTANT: phone is REQUIRED for this method
   */
  async payout(
    data: FapshiPayoutData
  ): Promise<FapshiResponse<FapshiPaymentResponse>> {
    try {
      this.validateAmount(data.amount);
      this.validatePhone(data.phone); // FIXED: Now always validates phone

      const config: AxiosRequestConfig = {
        method: "post",
        url: `${this.baseUrl}/payout`,
        data,
      };

      return await this.makeRequest<FapshiPaymentResponse>(config);
    } catch (error) {
      if (error instanceof FapshiError) {
        return {
          message: error.message,
          statusCode: error.statusCode,
          success: false,
        };
      }
      return {
        message: "Unknown error occurred",
        statusCode: 500,
        success: false,
      };
    }
  }

  /**
   * Search transactions based on criteria
   */
  async searchTransactions(
    params: FapshiSearchParams = {}
  ): Promise<FapshiResponse<FapshiTransactionStatus[]>> {
    try {
      const config: AxiosRequestConfig = {
        method: "get",
        url: `${this.baseUrl}/search`,
        params,
      };

      return await this.makeRequest<FapshiTransactionStatus[]>(config);
    } catch (error) {
      if (error instanceof FapshiError) {
        return {
          message: error.message,
          statusCode: error.statusCode,
          success: false,
        };
      }
      return {
        message: "Unknown error occurred",
        statusCode: 500,
        success: false,
      };
    }
  }

  /**
   * Webhook signature validation
   * Use this to validate incoming webhook requests
   */
  validateWebhookSignature(payload: string, signature: string): boolean {
    // Implement webhook signature validation based on Fapshi's documentation
    const expectedSignature = process.env.FAPSHI_WEBHOOK_SECRET;
    return signature === expectedSignature;
  }
}

// Export singleton instance
export const fapshiClient = new FapshiClient();

// Helper functions for DigiPlug integration
export async function createPaymentIntent(
  amount: number,
  userId: string,
  externalId: string,
  redirectUrl?: string
): Promise<FapshiResponse<FapshiPaymentResponse>> {
  return fapshiClient.initiatePay({
    amount,
    userId,
    externalId,
    redirectUrl:
      redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
    message: `DigiPlug wallet top-up - ${amount} XAF`,
  });
}

export async function processDirectPayment(
  amount: number,
  phone: string,
  userId: string,
  externalId: string,
  medium?: string
): Promise<FapshiResponse<FapshiPaymentResponse>> {
  return fapshiClient.directPay({
    amount,
    phone,
    userId,
    externalId,
    medium: medium || "mobile money",
    message: `DigiPlug wallet top-up - ${amount} XAF`,
  });
}

export async function checkPaymentStatus(
  transId: string
): Promise<FapshiTransactionStatus> {
  return fapshiClient.getPaymentStatus(transId);
}

export async function processRefund(
  amount: number,
  phone: string,
  userId: string,
  externalId: string
): Promise<FapshiResponse<FapshiPaymentResponse>> {
  return fapshiClient.payout({
    amount,
    phone,
    userId,
    externalId,
    message: `DigiPlug refund - ${amount} XAF`,
  });
}

export { FapshiError };
export default fapshiClient;
