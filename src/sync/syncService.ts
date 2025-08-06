import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import mongoose from 'mongoose';
import Yacht from '../models/Yacht.js';
import CharterCompany from '../models/CharterCompany.js';
import Category from '../models/Category.js';
import Location from '../models/Location.js';
import PriceList from '../models/PriceList.js';
import Equipment from '../models/Equipment.js';
import Base from '../models/Base.js';
import Region from '../models/Region.js';
import Country from '../models/Country.js';
import YachtModel from '../models/Yacht.js'; // If you have a separate model for yacht models, import it here

const NAUSYS_API_BASE = process.env.NAUSYS_API_BASE || '';
const NAUSYS_USERNAME = process.env.NAUSYS_USERNAME || '';
const NAUSYS_PASSWORD = process.env.NAUSYS_PASSWORD || '';
const MONGO_URI = process.env.MONGO_URI || '';

if (!NAUSYS_API_BASE || !NAUSYS_USERNAME || !NAUSYS_PASSWORD) {
  throw new Error('NauSYS API credentials or base URL missing in .env');
}

if (!MONGO_URI) {
  throw new Error('MONGO_URI missing in .env');
}

console.log('NauSYS API Configuration:');
console.log('Base URL:', NAUSYS_API_BASE);
console.log('Username:', NAUSYS_USERNAME);
console.log('Password:', NAUSYS_PASSWORD ? '***' : 'NOT SET');
console.log('MongoDB URI:', MONGO_URI);

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Generic function to make API calls
async function makeApiCall(endpoint: string, additionalData: any = {}) {
  const url = `${NAUSYS_API_BASE}${endpoint}`;
  const body = {
    username: NAUSYS_USERNAME,
    password: NAUSYS_PASSWORD,
    ...additionalData
  };

  console.log(`Making API request to: ${url}`);
  console.log('Request body:', JSON.stringify(body, null, 2));

  try {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('API Response Status:', response.status);
    
    if (response.data) {
      console.log('API Response Status:', response.data.status);
      
      if (response.data.status === 'AUTHENTICATION_ERROR') {
        throw new Error(`Authentication failed: ${response.data.errorCode} - Please check your API credentials`);
      }
      
      if (response.data.status === 'OK') {
        return response.data;
      } else {
        throw new Error(`API returned error: ${response.data.status} - ${response.data.message || 'Unknown error'}`);
      }
    } else {
      throw new Error('No data in API response');
    }
  } catch (error: any) {
    console.error('Error making API call:');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    throw error;
  }
}

// Fetch charter companies
async function fetchCharterCompanies() {
  console.log('=== Fetching charter companies ===');
  const response = await makeApiCall('/charterCompanies');
  
  if (response.companies) {
    console.log(`Found ${response.companies.length} charter companies`);
    return response.companies;
  }
  
  console.log('No companies found in response');
  return [];
}

// Fetch yacht categories
async function fetchYachtCategories() {
  console.log('=== Fetching yacht categories ===');
  const response = await makeApiCall('/yachtCategories');
  
  if (response.categories) {
    console.log(`Found ${response.categories.length} yacht categories`);
    return response.categories;
  }
  
  return [];
}

// Fetch yacht models
async function fetchYachtModels() {
  console.log('=== Fetching yacht models ===');
  const response = await makeApiCall('/yachtModels');
  
  if (response.models) {
    console.log(`Found ${response.models.length} yacht models`);
    return response.models;
  }
  
  return [];
}

// Fetch price lists
async function fetchPriceLists() {
  console.log('=== Fetching price lists ===');
  const response = await makeApiCall('/priceLists');
  
  if (response.priceLists) {
    console.log(`Found ${response.priceLists.length} price lists`);
    return response.priceLists;
  }
  
  return [];
}

// Fetch equipment
async function fetchEquipment() {
  console.log('=== Fetching equipment ===');
  const response = await makeApiCall('/equipment');
  
  if (response.equipment) {
    console.log(`Found ${response.equipment.length} equipment items`);
    return response.equipment;
  }
  
  return [];
}

// Fetch bases
async function fetchBases() {
  console.log('=== Fetching bases ===');
  const response = await makeApiCall('/bases');
  if (response.bases) {
    console.log(`Found ${response.bases.length} bases`);
    return response.bases;
  }
  return [];
}

// Fetch regions
async function fetchRegions() {
  console.log('=== Fetching regions ===');
  const response = await makeApiCall('/regions');
  if (response.regions) {
    console.log(`Found ${response.regions.length} regions`);
    return response.regions;
  }
  return [];
}

// Fetch countries
async function fetchCountries() {
  console.log('=== Fetching countries ===');
  const response = await makeApiCall('/countries');
  if (response.countries) {
    console.log(`Found ${response.countries.length} countries`);
    return response.countries;
  }
  return [];
}

// Fetch yachts for a specific charter company
async function fetchYachtsForCompany(companyId: string, companyName: string) {
  console.log(`=== Fetching yachts for company: ${companyName} (ID: ${companyId}) ===`);
  
  try {
    const response = await makeApiCall(`/yachts/${companyId}`, {
      yachtId: companyId
    });
    
    if (response.yachts) {
      console.log(`Found ${response.yachts.length} yachts for company ${companyName}`);
      return response.yachts;
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching yachts for company ${companyName}:`, error);
    return [];
  }
}

// Fetch yacht availability (occupancy)
async function fetchYachtAvailability(yachtId: string) {
  try {
    const response = await makeApiCall(`/occupancy/${yachtId}`);
    if (response.occupancy && Array.isArray(response.occupancy)) {
      // Map to {start, end} date ranges
      return response.occupancy.map((occ: any) => ({
        start: occ.startDate ? new Date(occ.startDate) : null,
        end: occ.endDate ? new Date(occ.endDate) : null
      })).filter((occ: any) => occ.start && occ.end);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching availability for yacht ${yachtId}:`, error);
    return [];
  }
}

// Upsert charter companies into MongoDB
async function upsertCharterCompanies(companies: any[]) {
  console.log(`Starting to upsert ${companies.length} charter companies...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const company of companies) {
    try {
      // Handle translated name object
      let name = company.name;
      let nameTranslations = null;
      if (typeof name === 'object' && name !== null) {
        nameTranslations = name;
        name = name.textEN || name.texten || Object.values(name)[0] || 'Unknown Company';
      }
      const mappedCompany = {
        id: String(company.id),
        name,
        nameTranslations,
        country: company.country || 'Unknown',
        updatedAt: new Date()
      };

      await CharterCompany.findOneAndUpdate(
        { id: company.id },
        { $set: mappedCompany },
        { upsert: true, new: true }
      );
      
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`Error upserting company ${company.id}:`, error);
    }
  }

  console.log(`Charter companies upsert completed: ${successCount} successful, ${errorCount} errors`);
}

// Upsert yacht categories into MongoDB
async function upsertYachtCategories(categories: any[]) {
  console.log(`Starting to upsert ${categories.length} yacht categories...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const category of categories) {
    try {
      // Handle translated name object
      let name = category.name;
      let nameTranslations = null;
      if (typeof name === 'object' && name !== null) {
        nameTranslations = name;
        name = name.textEN || name.texten || Object.values(name)[0] || 'Unknown Category';
      }
      const mappedCategory = {
        id: String(category.id),
        name,
        nameTranslations,
        updatedAt: new Date()
      };

      await Category.findOneAndUpdate(
        { id: category.id },
        { $set: mappedCategory },
        { upsert: true, new: true }
      );
      
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`Error upserting category ${category.id}:`, error);
    }
  }

  console.log(`Yacht categories upsert completed: ${successCount} successful, ${errorCount} errors`);
}

// Upsert yacht models into MongoDB
async function upsertYachtModels(models: any[]) {
  console.log(`Starting to upsert ${models.length} yacht models...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const model of models) {
    try {
      const mappedModel = {
        id: String(model.id),
        name: model.name || 'Unknown Model',
        manufacturer: model.manufacturer || 'Unknown',
        updatedAt: new Date()
      };

      await Yacht.findOneAndUpdate(
        { yachtModel: model.id },
        { $set: { yachtModel: mappedModel.name } },
        { upsert: false }
      );
      
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`Error upserting model ${model.id}:`, error);
    }
  }

  console.log(`Yacht models upsert completed: ${successCount} successful, ${errorCount} errors`);
}

// Upsert yachts into MongoDB (with availability)
async function upsertYachts(yachts: any[]) {
  console.log(`Starting to upsert ${yachts.length} yachts...`);
  let successCount = 0;
  let errorCount = 0;

  // Preload all reference data for fast lookup
  const categories = await Category.find().lean();
  const companies = await CharterCompany.find().lean();
  const models = await YachtModel.find().lean();
  const bases = await Base.find().lean();
  const regions = await Region.find().lean();
  const countries = await Country.find().lean();
  const equipmentList = await Equipment.find().lean();

  for (const yacht of yachts) {
    try {
      // Map category
      let categoryName = 'Unknown Category';
      if (yacht.yachtCategoryId) {
        const cat = categories.find(c => c.id === String(yacht.yachtCategoryId));
        if (cat) categoryName = cat.name;
      }
      // Map company
      let companyName = 'Unknown Company';
      if (yacht.companyId) {
        const comp = companies.find(c => c.id === String(yacht.companyId));
        if (comp) companyName = comp.name;
      }
      // Map model
      let modelName = 'Unknown Model';
      if (yacht.yachtModelId) {
        const mod = models.find(m => m.yachtId === String(yacht.yachtModelId) || m.id === String(yacht.yachtModelId));
        if (mod) modelName = mod.name;
      }
      // Map equipment
      let equipmentNames: string[] = [];
      if (Array.isArray(yacht.standardYachtEquipment)) {
        equipmentNames = yacht.standardYachtEquipment.map((eq: any) => {
          const found = equipmentList.find(e => e.id === String(eq.equipmentId));
          return found ? found.name : String(eq.equipmentId);
        });
      }
      // Map location
      let baseName = 'Unknown Base', regionName = 'Unknown Region', countryName = 'Unknown Country';
      if (yacht.baseId) {
        const base = bases.find(b => b.id === String(yacht.baseId));
        if (base) {
          baseName = base.name;
          const region = regions.find(r => r.id === base.regionId);
          if (region) regionName = region.name;
          const country = countries.find(c => c.id === base.countryId);
          if (country) countryName = country.name;
        }
      }
      // Fetch availability
      const availability = await fetchYachtAvailability(String(yacht.id));
      // Map the yacht data according to our schema
      const mappedYacht = {
        yachtId: String(yacht.id),
        name: yacht.name || 'Unknown Yacht',
        yachtModel: modelName,
        type: yacht.charterType || 'Unknown Type',
        category: categoryName,
        charterCompany: {
          id: String(yacht.companyId || 'unknown'),
          name: companyName
        },
        price: {
          from: yacht.seasonSpecificData?.[0]?.prices?.[0]?.price || 0,
          currency: yacht.seasonSpecificData?.[0]?.prices?.[0]?.currency || 'EUR',
          priceListId: yacht.seasonSpecificData?.[0]?.prices?.[0]?.id || 'N/A'
        },
        availability,
        location: {
          base: baseName,
          region: regionName,
          country: countryName
        },
        images: yacht.picturesURL || [],
        videos: yacht.youtubeVideos ? [yacht.youtubeVideos] : [],
        equipment: equipmentNames,
        cabins: yacht.cabins || 0,
        bathrooms: yacht.wc || 0,
        length: yacht.loa || 0,
        year: yacht.buildYear || 0,
        updatedAt: new Date()
      };
      await Yacht.findOneAndUpdate(
        { yachtId: yacht.id },
        { $set: mappedYacht },
        { upsert: true, new: true }
      );
      successCount++;
      console.log(`Successfully upserted yacht ${yacht.id}`);
    } catch (error) {
      errorCount++;
      console.error(`Error upserting yacht ${yacht.id}:`, error);
    }
  }
  console.log(`Yachts upsert completed: ${successCount} successful, ${errorCount} errors`);
}

// Upsert bases
async function upsertBases(bases: any[]) {
  console.log(`Starting to upsert ${bases.length} bases...`);
  let successCount = 0;
  let errorCount = 0;
  for (const base of bases) {
    try {
      const mappedBase = {
        id: String(base.id),
        name: typeof base.name === 'object' ? (base.name.textEN || Object.values(base.name)[0] || 'Unknown Base') : base.name,
        regionId: String(base.regionId || ''),
        countryId: String(base.countryId || ''),
        address: base.address || '',
        latitude: base.latitude,
        longitude: base.longitude,
        updatedAt: new Date()
      };
      await Base.findOneAndUpdate(
        { id: base.id },
        { $set: mappedBase },
        { upsert: true, new: true }
      );
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`Error upserting base ${base.id}:`, error);
    }
  }
  console.log(`Bases upsert completed: ${successCount} successful, ${errorCount} errors`);
}

// Upsert regions
async function upsertRegions(regions: any[]) {
  console.log(`Starting to upsert ${regions.length} regions...`);
  let successCount = 0;
  let errorCount = 0;
  for (const region of regions) {
    try {
      const mappedRegion = {
        id: String(region.id),
        name: typeof region.name === 'object' ? (region.name.textEN || Object.values(region.name)[0] || 'Unknown Region') : region.name,
        countryId: String(region.countryId || ''),
        updatedAt: new Date()
      };
      await Region.findOneAndUpdate(
        { id: region.id },
        { $set: mappedRegion },
        { upsert: true, new: true }
      );
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`Error upserting region ${region.id}:`, error);
    }
  }
  console.log(`Regions upsert completed: ${successCount} successful, ${errorCount} errors`);
}

// Upsert countries
async function upsertCountries(countries: any[]) {
  console.log(`Starting to upsert ${countries.length} countries...`);
  let successCount = 0;
  let errorCount = 0;
  for (const country of countries) {
    try {
      const mappedCountry = {
        id: String(country.id),
        name: typeof country.name === 'object' ? (country.name.textEN || Object.values(country.name)[0] || 'Unknown Country') : country.name,
        code: country.code || '',
        updatedAt: new Date()
      };
      await Country.findOneAndUpdate(
        { id: country.id },
        { $set: mappedCountry },
        { upsert: true, new: true }
      );
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`Error upserting country ${country.id}:`, error);
    }
  }
  console.log(`Countries upsert completed: ${successCount} successful, ${errorCount} errors`);
}

// Upsert equipment
async function upsertEquipment(equipmentList: any[]) {
  console.log(`Starting to upsert ${equipmentList.length} equipment items...`);
  let successCount = 0;
  let errorCount = 0;
  for (const eq of equipmentList) {
    try {
      let name = eq.name;
      let nameTranslations = null;
      if (typeof name === 'object' && name !== null) {
        nameTranslations = name;
        name = name.textEN || Object.values(name)[0] || 'Unknown Equipment';
      }
      const mappedEquipment = {
        id: String(eq.id),
        name,
        nameTranslations,
        category: eq.category || ''
      };
      await Equipment.findOneAndUpdate(
        { id: eq.id },
        { $set: mappedEquipment },
        { upsert: true, new: true }
      );
      successCount++;
    } catch (error) {
      errorCount++;
      console.error(`Error upserting equipment ${eq.id}:`, error);
    }
  }
  console.log(`Equipment upsert completed: ${successCount} successful, ${errorCount} errors`);
}

// Main sync function
export async function syncYachts() {
  try {
    console.log('=== Starting yacht sync process ===');
    
    // Ensure MongoDB connection
    await connectToMongoDB();
    
    // Step 1: Fetch and sync reference data
    const companies = await fetchCharterCompanies();
    if (companies.length > 0) {
      await upsertCharterCompanies(companies);
    }
    
    const categories = await fetchYachtCategories();
    if (categories.length > 0) {
      await upsertYachtCategories(categories);
    }
    
    const models = await fetchYachtModels();
    if (models.length > 0) {
      await upsertYachtModels(models);
    }

    // Skipping bases, regions, countries due to 404
    // const bases = await fetchBases();
    // if (bases.length > 0) await upsertBases(bases);

    // const regions = await fetchRegions();
    // if (regions.length > 0) await upsertRegions(regions);

    // const countries = await fetchCountries();
    // if (countries.length > 0) await upsertCountries(countries);

    const equipmentList = await fetchEquipment();
    if (equipmentList.length > 0) await upsertEquipment(equipmentList);
    
    // Step 2: Fetch yachts for each company
    let totalYachts = 0;
    for (const company of companies) {
      const yachts = await fetchYachtsForCompany(company.id, company.name);
      if (yachts.length > 0) {
        await upsertYachts(yachts);
        totalYachts += yachts.length;
      }
    }
    
    console.log(`=== Yacht sync completed successfully. Total yachts processed: ${totalYachts} ===`);
  } catch (err) {
    console.error('=== Error syncing yachts ===');
    console.error(err);
  } finally {
    // Close MongoDB connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Schedule sync every 24 hours
import cron from 'node-cron';
cron.schedule('0 0 * * *', () => {
  console.log('Starting scheduled yacht sync...');
  syncYachts();
});

// Allow running this file directly for manual sync testing
console.log('=== Running manual yacht sync ===');
syncYachts().then(() => {
  console.log('=== Manual yacht sync complete ===');
  process.exit(0);
}).catch((error) => {
  console.error('=== Manual yacht sync failed ===');
  console.error(error);
  process.exit(1);
});