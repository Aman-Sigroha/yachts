import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Base Types
export interface Credentials {
    username: string;
    password: string;
}

// Yacht Client Types
export interface YachtClient {
    name: string;
    surname: string;
    countryId?: number;
}

// Yacht Reservation Types
export interface YachtReservation {
    id: number;
    uuid: string;
    reservationStatus: string;
    yachtId: number;
    baseFromId?: number;
    baseToId?: number;
    locationFromId?: number;
    locationToId?: number;
    yachtName: string;
    periodFrom: string;
    periodTo: string;
    optionTill?: string;
    agency: string;
    client: YachtClient;
    discounts: YachtDiscount[];
    additionalEquipment: YachtEquipment[];
    services: YachtService[];
    priceListPrice: string;
    agencyPrice?: string;
    clientPrice: string;
    currency: string;
    paymentCurrency?: string;
    localizedFinalPrice?: string;
    createdDate?: string;
    approved: boolean;
}

// Discount Types
export interface YachtDiscount {
    discountItemId: number;
    amount: number;
    type: string;
}

// Equipment Types
export interface YachtEquipment {
    id: number;
    quantity: string;
    listPrice: string;
    priceMeasureId: number;
    equipmentId: number;
    calculationType: string;
    condition: Record<string, unknown>;
}

// Service Types
export interface YachtService {
    id: number;
    quantity: string;
    listPrice: string;
    currency: string;
    priceMeasureId: number;
    serviceId: number;
    calculationType: string;
    condition: Record<string, unknown>;
}

// Storno Types
export interface StornoRequest {
    periodFrom?: string;
    periodTo?: string;
    endDateFrom?: string;
    endDateTo?: string;
    includeWaitingOptions?: boolean;
    reservations?: number[];
    modifyTimeFrom?: string;
    modifyTimeTo?: string;
    displayCurrency?: 'DEFAULT' | 'CLIENT' | 'COMPANY';
}

export interface StornoResponse {
    status: string;
    reservations: YachtReservation[];
}

const BASE_URL = 'https://ws.nausys.com/CBMS-external/rest';

// Get credentials from environment variables
const getCredentials = (): Credentials => {
    const username = process.env.NAUSYS_USERNAME;
    const password = process.env.NAUSYS_PASSWORD;

    if (!username || !password) {
        throw new Error('NAUSYS_USERNAME and NAUSYS_PASSWORD must be set in .env file');
    }

    return { username, password };
};

// Format date as DD.MM.YYYY
const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

// Format date as DD.MM.YYYY HH:mm
const formatDateTime = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Base request function
async function makeRequest(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any,
    headers?: Record<string, string>
) {
    try {
        const config: AxiosRequestConfig = {
            method,
            url,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            data
        };

        const response = await axios(config);
        return {
            status: response.status,
            data: response.data
        };
    } catch (error: any) {
        if (error.response) {
            return {
                status: error.response.status,
                data: error.response.data
            };
        }
        throw error;
    }
}

// API Functions
export async function getAllBases() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/charterBases`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getAllCountries() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/countries`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getAllRegions() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/regions`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getAllLocations() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/locations`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getAllEquipment() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/equipment`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getAllYachtCategories() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/yachtCategories`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getAllServices() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/services`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getAllYachtBuilders() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/yachtBuilders`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getCharterCompanies() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/charterCompanies`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getYachtsByCompany(charterCompanyId: number, yachtIds?: number[]) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/yachts/${charterCompanyId}`;
    const data = {
        ...credentials,
        yachtIDs: yachtIds
    };
    const response = await makeRequest(url, 'POST', data);
    return response.data;
}

export async function getAllYachtModels() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/yachtModels`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getAllReservations() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/yachtReservation/v6/reservations`;
    
    // Get reservations for the last year
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    const data = {
        credentials,
        periodFrom: formatDate(lastYear),
        periodTo: formatDate(nextYear),
        includeWaitingOptions: true
    };

    const response = await makeRequest(url, 'POST', data);
    return response.data;
}

export async function getOccupancy() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/yachtReservation/v6/occupancy/102701/${new Date().getFullYear()}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getCrewList(reservationId: number, securityCode: string) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/crewList/v6/get/${reservationId}/${securityCode}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getInvoices(type: 'base' | 'agency' | 'owner' = 'base') {
    const credentials = getCredentials();
    
    // Construct URL based on invoice type
    let endpoint = '/sales/v6/invoices';
    if (type === 'agency') {
        endpoint += '/agency';
    } else if (type === 'owner') {
        endpoint += '/owner';
    }
    const url = `${BASE_URL}${endpoint}`;
    
    // Get invoices for the last year
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    const data = {
        credentials,
        periodFrom: formatDate(lastYear),
        periodTo: formatDate(nextYear)
    };

    const response = await makeRequest(url, 'POST', data);
    return response.data;
}

export async function getContact2() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/client/v6/contact/all2`;
    
    // Get contacts modified in the last year
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    const data = {
        credentials,
        modifyTimeFrom: formatDateTime(lastYear),
        modifyTimeTo: formatDateTime(nextYear)
    };

    const response = await makeRequest(url, 'POST', data);
    return response.data;
}

export async function getAllStornos(request: StornoRequest): Promise<StornoResponse> {
    const credentials = getCredentials();
    const url = `${BASE_URL}/yachtReservation/v6/stornos`;
    const response = await makeRequest(
        url,
        'POST',
        {
            ...credentials,
            ...request
        }
    );
    return response.data;
}

// Get all available yacht reservation options (journeys)
export async function getAllOptions() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/yachtReservation/v6/options`;
    
    // Get options for the next year to cover future charters
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

    const data = {
        credentials,
        periodFrom: formatDate(now),
        periodTo: formatDate(nextYear),
        includeWaitingOptions: true
    };

    const response = await makeRequest(url, 'POST', data);
    return response.data;
}

// Get free yachts for a specific period
export async function getFreeYachts(periodFrom: string, periodTo: string, yachtIds?: number[]) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/yachtReservation/v6/freeYachts`;
    
    const data: any = {
        credentials,
        periodFrom,
        periodTo
    };
    
    if (yachtIds && yachtIds.length > 0) {
        data.yachts = yachtIds;
    }

    const response = await makeRequest(url, 'POST', data);
    return response.data;
}