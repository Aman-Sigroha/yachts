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
        throw new Error('NAUSYS_USERNAME and NAUSYS_PASSWORD environment variables are required');
    }

    return { username, password };
};

// Make authenticated request to Nausys API
const makeRequest = async (url: string, method: string, data?: any): Promise<any> => {
    const config: AxiosRequestConfig = {
        method,
        url,
        data,
        timeout: 30000, // 30 second timeout
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    try {
        const response = await axios(config);
        return response;
    } catch (error: any) {
        if (error.response) {
            // Server responded with error status
            throw new Error(`API Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('No response from Nausys API. Please check your internet connection.');
        } else {
            // Something else happened
            throw new Error(`Request setup error: ${error.message}`);
        }
    }
};

// Helper function to format dates for API
const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// Catalogue API Functions
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

export async function getAllCharterBases() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/charterBases`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getAllCharterCompanies() {
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

// Get yacht equipment details
export async function getYachtEquipment(yachtId: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/yachtEquipment/${yachtId}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

// Get yacht services details
export async function getYachtServices(yachtId: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/yachtServices/${yachtId}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

// Get yacht pricing details
export async function getYachtPricing(yachtId: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/yachtPricing/${yachtId}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

// Get yacht ratings/reviews
export async function getYachtRatings(yachtId: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/yachtRatings/${yachtId}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

// Get yacht detailed specifications
export async function getYachtDetails(yachtId: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/yachtDetails/${yachtId}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

// Get single yacht with full details (including equipment)
export async function getSingleYacht(yachtId: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/yacht/${yachtId}`;
    const data = {
        ...credentials,
        extendedDataSet: "OBLIGATORY_SERVICES"
    };
    const response = await makeRequest(url, 'POST', data);
    return response.data;
}

export async function getCrewMember(crewMemberId: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/client2/v6/crewMember/${crewMemberId}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

export async function getAllYachtModels() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/yachtModels`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

// Reservation API Functions
export async function getAllReservations() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/yachtReservation/v6/reservations`;
    
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
    let url: string;
    switch (type) {
        case 'base':
            url = `${BASE_URL}/invoice/v6/base`;
            break;
        case 'agency':
            url = `${BASE_URL}/invoice/v6/agency`;
            break;
        case 'owner':
            url = `${BASE_URL}/invoice/v6/owner`;
            break;
        default:
            throw new Error(`Invalid invoice type: ${type}`);
    }
    
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
    
    // Get contacts for the last year
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

export async function getAllOptions() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/yachtReservation/v6/options`;
    
    // Get options for the last year
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

// Free Cabin Charter API Functions

// Get free cabin package search criteria (filters)
export async function getFreeCabinPackageSearchCriteria() {
    const credentials = getCredentials();
    const url = `${BASE_URL}/yachtReservation/v6/freeCabinPackageSearchCriteria`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

// Search for free cabin packages
export async function searchFreeCabinPackages(searchRequest: {
    periodFrom: string;
    periodTo: string;
    locations?: number[];
    countries?: number[];
    regions?: number[];
    packages?: number[];
    ignoreOptions?: boolean;
}) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/yachtReservation/v6/freeCabinPackageSearch`;
    
    // Convert date format from YYYY-MM-DD to DD.MM.YYYY
    const formatDateForAPI = (dateStr: string): string => {
        const [year, month, day] = dateStr.split('-');
        return `${day}.${month}.${year}`;
    };
    
    const data = {
        credentials,
        periodFrom: formatDateForAPI(searchRequest.periodFrom),
        periodTo: formatDateForAPI(searchRequest.periodTo),
        locations: searchRequest.locations || [],
        countries: searchRequest.countries || [],
        regions: searchRequest.regions || [],
        packages: searchRequest.packages || [],
        ignoreOptions: searchRequest.ignoreOptions || false
    };

    const response = await makeRequest(url, 'POST', data);
    return response.data;
}

// Get cabin package details
export async function getCabinPackageDetails(packageId: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/cabinPackage/${packageId}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

// Get cabin charter occupancy
export async function getCabinCharterOccupancy(packageId: number, year: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/yachtReservation/v6/cabinCharterOccupancy/${packageId}/${year}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

// Get location details
export async function getLocationDetails(locationId: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/location/${locationId}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

// Get charter company details
export async function getCharterCompanyDetails(companyId: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/charterCompany/${companyId}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}

// Get cabin type details
export async function getCabinTypeDetails(cabinId: number) {
    const credentials = getCredentials();
    const url = `${BASE_URL}/catalogue/v6/cabinType/${cabinId}`;
    const response = await makeRequest(url, 'POST', credentials);
    return response.data;
}
