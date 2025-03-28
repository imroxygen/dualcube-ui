import axios, { AxiosRequestConfig } from "axios";

declare const appLocalizer: { apiurl: string; restUrl: string; nonce: string };

/**
 * Get response from REST API.
 * @param url - API URL
 * @param headers - Request headers
 * @returns API response data or null in case of an error
 */
export const getApiResponse = async <T>(url: string, headers: AxiosRequestConfig = {}): Promise<T | null> => {
    try {
        const result = await axios.get<T>(url, headers);
        return result.data;
    } catch (error) {
        console.error(`❌ Error fetching data from ${url}`, error);
        return null;
    }
};

/**
 * Send response to REST API.
 * @param url - API URL
 * @param data - Data to send
 * @param headers - Request headers
 * @returns API response data or null in case of an error
 */
export const sendApiResponse = async <T>(
    url: string,
    data: unknown,
    headers: AxiosRequestConfig = {}
): Promise<T | null> => {
    try {
        const config: AxiosRequestConfig = {
            headers: {
                "X-WP-Nonce": appLocalizer.nonce,
                ...headers.headers,
            },
            ...headers,
        };
        const result = await axios.post<T>(url, data, config);
        return result.data;
    } catch (error) {
        console.error(`❌ Error sending data to ${url}`, error);
        return null;
    }
};

/**
 * Generate API endpoint URL.
 * @param endpoint - API endpoint
 * @param namespace - API namespace (optional)
 * @param rootUrl - API root URL (optional)
 * @returns Complete API URL
 */
export const getApiLink = (endpoint: string, namespace?: string, rootUrl?: string): string => {
    return `${rootUrl || appLocalizer.apiurl}/${namespace || appLocalizer.restUrl}/${endpoint}`;
};
