import express from 'express';
import { Yacht } from '../models/yacht';
import { Reservation } from '../models/reservation'; // Added import for Reservation
import { Base, Country, Region, Location, Journey } from '../models/catalogue';
import { getFreeYachts } from '../sync';

const router = express.Router();

/**
 * @openapi
 * /api/yachts:
 *   get:
 *     summary: Get all yachts with filtering and search
 *     description: Retrieve yachts with comprehensive filtering, searching, and pagination. Journey-based filtering (startDestination/endDestination) requires journey data to be synced from the Nausys API.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Text search in yacht name and highlights
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: builder
 *         schema:
 *           type: integer
 *         description: Filter by builder ID
 *       - in: query
 *         name: base
 *         schema:
 *           type: integer
 *         description: Filter by base ID
 *       - in: query
 *         name: charterCompany
 *         schema:
 *           type: integer
 *         description: Filter by charter company ID
 *       - in: query
 *         name: minCabins
 *         schema:
 *           type: integer
 *         description: Minimum number of cabins
 *       - in: query
 *         name: maxCabins
 *         schema:
 *           type: integer
 *         description: Maximum number of cabins
 *       - in: query
 *         name: minDraft
 *         schema:
 *           type: number
 *         description: Minimum draft measurement
 *       - in: query
 *         name: maxDraft
 *         schema:
 *           type: number
 *         description: Maximum draft measurement
 *       - in: query
 *         name: minEnginePower
 *         schema:
 *           type: integer
 *         description: Minimum engine power
 *       - in: query
 *         name: maxEnginePower
 *         schema:
 *           type: integer
 *         description: Maximum engine power
 *       - in: query
 *         name: minDeposit
 *         schema:
 *           type: integer
 *         description: Minimum deposit amount
 *       - in: query
 *         name: maxDeposit
 *         schema:
 *           type: integer
 *         description: Maximum deposit amount
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Page number for pagination (default: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Items per page (default: 20, max: 100)"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: "Sort field (name, cabins, draft, enginePower, deposit - default: cabins)"
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *         description: "Sort order (asc, desc - default: desc)"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for availability filtering (YYYY-MM-DD format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for availability filtering (YYYY-MM-DD format)
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country name (supports multi-language names)
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter by region name (supports multi-language names)
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by specific location/marina name (supports multi-language names)
 *       - in: query
 *         name: startDestination
 *         schema:
 *           type: string
 *         description: Filter yachts available for charters STARTING from this destination (supports multi-language names)
 *       - in: query
 *         name: endDestination
 *         schema:
 *           type: string
 *         description: Filter yachts available for charters ENDING at this destination (supports multi-language names)
 *       - in: query
 *         name: free
 *         schema:
 *           type: boolean
 *         description: When true, returns only free/available yachts (requires startDate and endDate). When false or not provided, returns all yachts.
 *       - in: query
 *         name: minToilets
 *         schema:
 *           type: integer
 *         description: Minimum number of toilets/bathrooms
 *       - in: query
 *         name: maxToilets
 *         schema:
 *           type: integer
 *         description: Maximum number of toilets/bathrooms
 *       - in: query
 *         name: minLength
 *         schema:
 *           type: number
 *         description: Minimum yacht length
 *       - in: query
 *         name: maxLength
 *         schema:
 *           type: number
 *         description: Maximum yacht length
 *       - in: query
 *         name: minYear
 *         schema:
 *           type: integer
 *         description: Minimum build year
 *       - in: query
 *         name: maxYear
 *         schema:
 *           type: integer
 *         description: Maximum build year
 *       - in: query
 *         name: minBerths
 *         schema:
 *           type: integer
 *         description: Minimum number of berths/sleeping capacity
 *       - in: query
 *         name: maxBerths
 *         schema:
 *           type: integer
 *         description: Maximum number of berths/sleeping capacity
 *       - in: query
 *         name: minBeam
 *         schema:
 *           type: number
 *         description: Minimum yacht beam/width
 *       - in: query
 *         name: maxBeam
 *         schema:
 *           type: number
 *         description: Maximum yacht beam/width
 *       - in: query
 *         name: isPremium
 *         schema:
 *           type: boolean
 *         description: Filter for premium yachts only
 *       - in: query
 *         name: onSale
 *         schema:
 *           type: boolean
 *         description: Filter for yachts on sale only
 *       - in: query
 *         name: fuelType
 *         schema:
 *           type: string
 *         description: Filter by fuel type (diesel, petrol, etc.)
 *     responses:
 *       200:
 *         description: List of yachts with pagination and filter summary
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const {
            q, // Text search query
            category,
            builder,
            base,
            charterCompany,
            minCabins,
            maxCabins,
            minDraft,
            maxDraft,
            minEnginePower,
            maxEnginePower,
            minDeposit,
            maxDeposit,
            minToilets,
            maxToilets,
            minLength,
            maxLength,
            minYear,
            maxYear,
            minBerths,
            maxBerths,
            minBeam,
            maxBeam,
            isPremium,
            onSale,
            fuelType,
            startDate,
            endDate,
            startDestination,
            endDestination,
            country,
            region,
            location,
            free,
            page = 1,
            limit = 20,
            sortBy = 'cabins',
            sortOrder = 'desc'
        } = req.query;

        const query: any = {};

        // Text search in name and highlights (description doesn't exist)
        if (q && q.toString().trim()) {
            query.$or = [
                { 'name.textEN': { $regex: q.toString().trim(), $options: 'i' } },
                { 'name.textDE': { $regex: q.toString().trim(), $options: 'i' } },
                { 'name.textFR': { $regex: q.toString().trim(), $options: 'i' } },
                { 'name.textIT': { $regex: q.toString().trim(), $options: 'i' } },
                { 'name.textES': { $regex: q.toString().trim(), $options: 'i' } },
                { 'name.textHR': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textEN': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textDE': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textFR': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textIT': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textES': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textHR': { $regex: q.toString().trim(), $options: 'i' } }
            ];
        }

        // Category filters
        if (category) query.categoryId = Number(category);
        if (builder) query.builderId = Number(builder);
        if (base) query.baseId = Number(base);
        if (charterCompany) query.charterCompanyId = Number(charterCompany);

        // Numeric range filters - only for fields that exist in database
        if (minCabins || maxCabins) {
            query.cabins = {};
            if (minCabins) query.cabins.$gte = Number(minCabins);
            if (maxCabins) query.cabins.$lte = Number(maxCabins);
        }

        if (minDraft || maxDraft) {
            query.draft = {};
            if (minDraft) query.draft.$gte = Number(minDraft);
            if (maxDraft) query.draft.$lte = Number(maxDraft);
        }

        if (minEnginePower || maxEnginePower) {
            query.enginePower = {};
            if (minEnginePower) query.enginePower.$gte = Number(minEnginePower);
            if (maxEnginePower) query.enginePower.$lte = Number(maxEnginePower);
        }

        if (minDeposit || maxDeposit) {
            query.deposit = {};
            if (minDeposit) query.deposit.$gte = Number(minDeposit);
            if (maxDeposit) query.deposit.$lte = Number(maxDeposit);
        }

        // Range filters for toilets/wc
        if (minToilets || maxToilets) {
            query.wc = {};
            if (minToilets) query.wc.$gte = Number(minToilets);
            if (maxToilets) query.wc.$lte = Number(maxToilets);
        }

        // Range filters for length
        if (minLength || maxLength) {
            query.length = {};
            if (minLength) query.length.$gte = Number(minLength);
            if (maxLength) query.length.$lte = Number(maxLength);
        }

        // Range filters for year
        if (minYear || maxYear) {
            query.year = {};
            if (minYear) query.year.$gte = Number(minYear);
            if (maxYear) query.year.$lte = Number(maxYear);
        }

        // Range filters for berths
        if (minBerths || maxBerths) {
            query.berths = {};
            if (minBerths) query.berths.$gte = Number(minBerths);
            if (maxBerths) query.berths.$lte = Number(maxBerths);
        }

        // Range filters for beam
        if (minBeam || maxBeam) {
            query.beam = {};
            if (minBeam) query.beam.$gte = Number(minBeam);
            if (maxBeam) query.beam.$lte = Number(maxBeam);
        }

        // Boolean filters
        if (isPremium !== undefined) {
            query.isPremium = isPremium === 'true' || isPremium === '1';
        }

        if (onSale !== undefined) {
            query.onSale = onSale === 'true' || onSale === '1';
        }

        // Fuel type filter
        if (fuelType && fuelType.toString().trim()) {
            query.fuelType = { $regex: fuelType.toString().trim(), $options: 'i' };
        }

        // Location-based filtering (country, region, location, base)
        if (country || region || location) {
            // We need to find bases through the hierarchy: Base → Location → Region → Country
            let locationIds: number[] = [];
            let shouldReturnEmpty = false;
            
            // Country filtering
            if (country) {
                console.log('Country filter value:', country);
                const countryQuery = {
                    $or: [
                        { 'name.textEN': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textDE': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textFR': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textIT': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textES': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textHR': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textCZ': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textHU': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textLT': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textLV': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textNL': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textNO': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textPL': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textRU': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textSE': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textSI': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textSK': { $regex: country.toString().trim(), $options: 'i' } },
                        { 'name.textTR': { $regex: country.toString().trim(), $options: 'i' } }
                    ]
                };
                
                console.log('Country query:', JSON.stringify(countryQuery, null, 2));
                const matchingCountries = await Country.find(countryQuery).select('id');
                console.log('Matching countries:', matchingCountries.length, matchingCountries);
                
                if (matchingCountries.length > 0) {
                    const countryIds = matchingCountries.map(c => c.id);
                    console.log('Country IDs found:', countryIds);
                    
                    // Find locations that belong to these countries through regions
                    const regionsInCountry = await Region.find({ countryId: { $in: countryIds } }).select('id');
                    const countryRegionIds = regionsInCountry.map(r => r.id);
                    console.log('Regions in country:', countryRegionIds);
                    
                    if (countryRegionIds.length > 0) {
                        const locationsInCountry = await Location.find({ regionId: { $in: countryRegionIds } }).select('id');
                        const countryLocationIds = locationsInCountry.map(l => l.id);
                        console.log('Locations in country:', countryLocationIds);
                        
                        if (locationIds.length === 0) {
                            locationIds = countryLocationIds;
                        } else {
                            locationIds = locationIds.filter(id => countryLocationIds.includes(id));
                        }
                    } else {
                        console.log('No regions found for country, setting empty baseId');
                        shouldReturnEmpty = true;
                    }
                } else {
                    console.log('No countries found, setting empty baseId');
                    shouldReturnEmpty = true;
                }
            }
            
            // Region filtering
            if (region) {
                const regionQuery = {
                    $or: [
                        { 'name.textEN': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textDE': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textFR': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textIT': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textES': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textHR': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textCZ': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textHU': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textLT': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textLV': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textNL': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textNO': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textPL': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textRU': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textSE': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textSI': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textSK': { $regex: region.toString().trim(), $options: 'i' } },
                        { 'name.textTR': { $regex: region.toString().trim(), $options: 'i' } }
                    ]
                };
                
                const matchingRegions = await Region.find(regionQuery).select('id');
                console.log('Matching regions:', matchingRegions.length, matchingRegions);
                
                if (matchingRegions.length > 0) {
                    const regionIds = matchingRegions.map((r: any) => r.id);
                    console.log('Region IDs found:', regionIds);
                    
                    // Find locations that belong to these regions
                    const locationsInRegion = await Location.find({ regionId: { $in: regionIds } }).select('id');
                    const regionLocationIds = locationsInRegion.map(l => l.id);
                    console.log('Locations in region:', regionLocationIds);
                    
                    if (locationIds.length === 0) {
                        locationIds = regionLocationIds;
                    } else {
                        locationIds = locationIds.filter(id => regionLocationIds.includes(id));
                    }
                } else {
                    console.log('No regions found, setting empty baseId');
                    shouldReturnEmpty = true;
                }
            }
            
            // Location filtering
            if (location) {
                const locationNameQuery = {
                    $or: [
                        { 'name.textEN': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textDE': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textFR': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textIT': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textES': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textHR': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textCZ': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textHU': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textLT': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textLV': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textNL': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textNO': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textPL': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textRU': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textSE': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textSI': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textSK': { $regex: location.toString().trim(), $options: 'i' } },
                        { 'name.textTR': { $regex: location.toString().trim(), $options: 'i' } }
                    ]
                };
                
                const matchingLocations = await Location.find(locationNameQuery).select('id');
                console.log('Matching locations:', matchingLocations.length, matchingLocations);
                
                if (matchingLocations.length > 0) {
                    const directLocationIds = matchingLocations.map((l: any) => l.id);
                    console.log('Direct location IDs found:', directLocationIds);
                    
                    if (locationIds.length === 0) {
                        locationIds = directLocationIds;
                    } else {
                        locationIds = locationIds.filter(id => directLocationIds.includes(id));
                    }
                } else {
                    console.log('No locations found, setting empty baseId');
                    shouldReturnEmpty = true;
                }
            }
            
            // Check if we should return empty results
            if (shouldReturnEmpty) {
                console.log('Setting empty baseId due to filtering constraints');
                query.baseId = { $in: [] };
            } else {
                // Find bases that have these location IDs
                console.log('Final location IDs to search:', locationIds);
                if (locationIds.length > 0) {
                    const matchingBases = await Base.find({ locationId: { $in: locationIds } }).select('id');
                    console.log('Matching bases:', matchingBases.length);
                    const baseIds = matchingBases.map(b => b.id);
                    
                    if (baseIds.length > 0) {
                        query.baseId = { $in: baseIds };
                        console.log('Base IDs found:', baseIds);
                    } else {
                        query.baseId = { $in: [] };
                    }
                } else {
                    query.baseId = { $in: [] };
                }
            }
        }

        // Journey-based filtering using actual charter routes
        if (startDestination || endDestination) {
            console.log('Journey filtering - startDestination:', startDestination, 'endDestination:', endDestination);
            
            // Build journey query based on available options
            let journeyQuery: any = {};
            
            if (startDestination) {
                // Find journeys that start from locations matching the start destination name
                const startLocationQuery = {
                    $or: [
                        { 'name.textEN': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textDE': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textFR': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textIT': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textES': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textHR': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textCZ': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textHU': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textLT': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textLV': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textNL': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textNO': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textPL': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textRU': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textSE': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textSI': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textSK': { $regex: startDestination.toString().trim(), $options: 'i' } },
                        { 'name.textTR': { $regex: startDestination.toString().trim(), $options: 'i' } }
                    ]
                };
                
                const startLocations = await Location.find(startLocationQuery).select('id');
                const startLocationIds = startLocations.map((l: any) => l.id);
                console.log('Start destination locations found:', startLocationIds.length, startLocationIds);
                
                if (startLocationIds.length > 0) {
                    journeyQuery.locationFromId = { $in: startLocationIds };
                } else {
                    // No start locations found, return empty result
                    query.baseId = { $in: [] };
                    console.log('No start locations found, setting empty baseId');
                }
            }
            
            if (endDestination && !query.baseId?.$in) {
                // Find journeys that end at locations matching the end destination name
                const endLocationQuery = {
                    $or: [
                        { 'name.textEN': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textDE': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textFR': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textIT': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textES': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textHR': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textCZ': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textHU': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textLT': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textLV': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textNL': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textNO': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textPL': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textRU': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textSE': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textSI': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textSK': { $regex: endDestination.toString().trim(), $options: 'i' } },
                        { 'name.textTR': { $regex: endDestination.toString().trim(), $options: 'i' } }
                    ]
                };
                
                const endLocations = await Location.find(endLocationQuery).select('id');
                const endLocationIds = endLocations.map((l: any) => l.id);
                console.log('End destination locations found:', endLocationIds.length, endLocationIds);
                
                if (endLocationIds.length > 0) {
                    if (journeyQuery.locationFromId) {
                        // Both start and end destinations specified - find intersection
                        journeyQuery.locationToId = { $in: endLocationIds };
                    } else {
                        // Only end destination specified
                        journeyQuery.locationToId = { $in: endLocationIds };
                    }
                } else {
                    // No end locations found, return empty result
                    query.baseId = { $in: [] };
                    console.log('No end locations found, setting empty baseId');
                }
            }
            
            // If we have journey criteria, find matching journeys and get yacht IDs
            if (Object.keys(journeyQuery).length > 0 && !query.baseId?.$in) {
                console.log('Journey query:', JSON.stringify(journeyQuery, null, 2));
                
                // Find journeys that match our criteria
                const matchingJourneys = await Journey.find(journeyQuery).select('yachtId baseFromId baseToId');
                console.log('Matching journeys found:', matchingJourneys.length);
                
                if (matchingJourneys.length > 0) {
                    // Get unique yacht IDs from matching journeys
                    const journeyYachtIds = [...new Set(matchingJourneys.map((j: any) => j.yachtId))];
                    console.log('Yacht IDs from matching journeys:', journeyYachtIds);
                    
                    // Filter yachts by these IDs
                    if (query.id) {
                        // If we already have yacht ID filtering, intersect them
                        if (Array.isArray(query.id.$in)) {
                            query.id.$in = query.id.$in.filter((id: number) => journeyYachtIds.includes(id));
                        } else if (typeof query.id === 'number') {
                            if (!journeyYachtIds.includes(query.id)) {
                                query.id = { $in: [] }; // No match
                            }
                        }
                    } else {
                        // No existing yacht ID filtering, use journey yacht IDs
                        query.id = { $in: journeyYachtIds };
                    }
                    
                    // Also filter by base IDs from the journeys
                    const journeyBaseIds = [...new Set(matchingJourneys.map((j: any) => j.baseFromId))];
                    console.log('Base IDs from matching journeys:', journeyBaseIds);
                    
                    if (query.baseId && query.baseId.$in) {
                        // Intersect with existing base filtering
                        query.baseId.$in = query.baseId.$in.filter((id: number) => journeyBaseIds.includes(id));
                    } else {
                        // Use journey base IDs
                        query.baseId = { $in: journeyBaseIds };
                    }
                } else {
                    // No matching journeys found, return empty result
                    query.id = { $in: [] };
                    console.log('No matching journeys found, setting empty yacht ID');
                }
            }
        }

        // Free yachts filtering - when free=true, use Nausys API to get only available yachts
        if (free === 'true' || free === '1') {
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'startDate and endDate are required when free=true'
                });
            }

            try {
                console.log('Fetching free yachts for period:', startDate, 'to', endDate);
                
                // Format dates for Nausys API (DD.MM.YYYY format)
                const startDateObj = new Date(startDate.toString());
                const endDateObj = new Date(endDate.toString());
                
                if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid date format. Use YYYY-MM-DD'
                    });
                }

                const formatDateForNausys = (date: Date) => {
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}.${month}.${year}`;
                };

                const periodFrom = formatDateForNausys(startDateObj);
                const periodTo = formatDateForNausys(endDateObj);

                // Get free yachts from Nausys API
                const freeYachtsResponse = await getFreeYachts(periodFrom, periodTo);
                console.log('Free yachts API response:', JSON.stringify(freeYachtsResponse, null, 2));

                if (freeYachtsResponse?.status === 'OK' && freeYachtsResponse?.freeYachts) {
                    const freeYachtIds = freeYachtsResponse.freeYachts.map((yacht: any) => yacht.yachtId);
                    console.log('Free yacht IDs from API:', freeYachtIds);

                                    if (freeYachtIds.length > 0) {
                    // Filter yachts by free yacht IDs
                    if (query.id) {
                        if (Array.isArray(query.id.$in)) {
                            query.id.$in = query.id.$in.filter((id: number) => freeYachtIds.includes(id));
                        } else if (typeof query.id === 'number') {
                            if (!freeYachtIds.includes(query.id)) {
                                query.id = { $in: [] }; // No match
                            }
                        }
                    } else {
                        query.id = { $in: freeYachtIds };
                    }
                    
                    // If base filter is already applied, ensure it doesn't conflict with free yachts
                    if (query.baseId && typeof query.baseId === 'number') {
                        // Base filter is already set, keep it as is
                        console.log('Base filter already applied, keeping existing baseId filter');
                    }
                } else {
                    // No free yachts found, return empty result
                    query.id = { $in: [] };
                    console.log('No free yachts found for the specified period');
                }
                } else if (freeYachtsResponse?.status === 'INSUFFICIENT_DATA') {
                    console.log('Nausys API returned INSUFFICIENT_DATA - this might mean no yachts available for the period or missing required parameters');
                    console.log('For now, returning all yachts since we cannot determine which are free');
                    // Don't filter by free yachts - return all yachts
                    // This is a fallback when the API doesn't have sufficient data
                } else {
                    console.log('No free yachts data in API response');
                    // Don't filter - return all yachts as fallback
                }
            } catch (error) {
                console.error('Error fetching free yachts:', error);
                console.log('Falling back to returning all yachts due to API error');
                // Don't filter - return all yachts as fallback
                // Continue with normal yacht query without free filtering
                // Clear any free yachts filtering that might have been set
                if (query.id && query.id.$in && query.id.$in.length === 0) {
                    delete query.id.$in;
                }
                // Also clear any other free yachts related filters
                if (query.id && query.id.$in && Array.isArray(query.id.$in) && query.id.$in.length === 0) {
                    delete query.id;
                }
            }
        }

        // Pagination
        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(100, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        // Sorting
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        const sortOptions: any = {};
        
        // Handle different sort fields
        switch (sortBy) {
            case 'name':
                sortOptions['name.textEN'] = sortDirection;
                break;
            case 'draft':
                sortOptions.draft = sortDirection;
                break;
            case 'cabins':
                sortOptions.cabins = sortDirection;
                break;
            case 'enginePower':
                sortOptions.enginePower = sortDirection;
                break;
            case 'deposit':
                sortOptions.deposit = sortDirection;
                break;
            default:
                sortOptions.cabins = sortDirection;
                break;
        }

        let [yachts, total] = await Promise.all([
            Yacht.find(query)
                .populate({
                    path: 'base',
                    select: 'id name countryId regionId locationId lat lon checkInTime checkOutTime secondaryBase',
                    populate: [
                        {
                            path: 'location',
                            select: 'id name regionId',
                            model: 'Location',
                            populate: [
                                {
                                    path: 'region',
                                    select: 'id name countryId',
                                    model: 'Region',
                                    populate: [
                                        {
                                            path: 'country',
                                            select: 'id name code code2',
                                            model: 'Country'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                })
                .skip(skip)
                .limit(limitNum)
                .sort(sortOptions),
            Yacht.countDocuments(query)
        ]);

        // Date range availability filtering (exclude yachts with overlapping reservations)
        if (startDate && endDate) {
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);

            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start < end) {
                const yachtIds = yachts.map((y: any) => y.id);

                if (yachtIds.length > 0) {
                    const conflictingReservations = await Reservation.find({
                        yachtId: { $in: yachtIds },
                        $or: [
                            { periodFrom: { $lte: end, $gte: start } },
                            { periodTo: { $gte: start, $lte: end } },
                            { periodFrom: { $lte: start }, periodTo: { $gte: end } }
                        ]
                    });

                    const conflictingYachtIds = [...new Set(conflictingReservations.map((r: any) => r.yachtId))];
                    yachts = yachts.filter((y: any) => !conflictingYachtIds.includes(y.id));
                    total = yachts.length;
                }
            }
        }

        // Prepare filters summary
        const appliedFilters: any = {};
        if (category) appliedFilters.category = category;
        if (builder) appliedFilters.builder = builder;
        if (base) appliedFilters.base = base;
        if (charterCompany) appliedFilters.charterCompany = charterCompany;
        if (minCabins || maxCabins) appliedFilters.cabins = { min: minCabins, max: maxCabins };
        if (minDraft || maxDraft) appliedFilters.draft = { min: minDraft, max: maxDraft };
        if (minEnginePower || maxEnginePower) appliedFilters.enginePower = { min: minEnginePower, max: maxEnginePower };
        if (minDeposit || maxDeposit) appliedFilters.deposit = { min: minDeposit, max: maxDeposit };
        if (minToilets || maxToilets) appliedFilters.toilets = { min: minToilets, max: maxToilets };
        if (minLength || maxLength) appliedFilters.length = { min: minLength, max: maxLength };
        if (minYear || maxYear) appliedFilters.year = { min: minYear, max: maxYear };
        if (minBerths || maxBerths) appliedFilters.berths = { min: minBerths, max: maxBerths };
        if (minBeam || maxBeam) appliedFilters.beam = { min: minBeam, max: maxBeam };
        if (isPremium !== undefined) appliedFilters.isPremium = isPremium;
        if (onSale !== undefined) appliedFilters.onSale = onSale;
        if (fuelType) appliedFilters.fuelType = fuelType;
        if (startDate && endDate) appliedFilters.availability = { startDate, endDate };
        if (startDestination) appliedFilters.startDestination = startDestination;
        if (endDestination) appliedFilters.endDestination = endDestination;
        if (country) appliedFilters.country = country;
        if (region) appliedFilters.region = region;
        if (location) appliedFilters.location = location;
        if (free) appliedFilters.free = free;

        res.json({
            success: true,
            data: yachts,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            },
            filters: appliedFilters,
            search: q ? {
                query: q.toString().trim(),
                results: total
            } : null
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @openapi
 * /api/yachts/search:
 *   get:
 *     summary: Advanced search endpoint for yachts
 *     description: Same functionality as main endpoint, provided as an alias for better API organization
 */
router.get('/search', async (req, res) => {
    try {
        const {
            q, // Text search query
            category,
            builder,
            base,
            charterCompany,
            minCabins,
            maxCabins,
            minDraft,
            maxDraft,
            minEnginePower,
            maxEnginePower,
            minDeposit,
            maxDeposit,
            page = 1,
            limit = 20,
            sortBy = 'cabins',
            sortOrder = 'desc'
        } = req.query;

        const query: any = {};

        // Text search in name and highlights (description doesn't exist)
        if (q && q.toString().trim()) {
            query.$or = [
                { 'name.textEN': { $regex: q.toString().trim(), $options: 'i' } },
                { 'name.textDE': { $regex: q.toString().trim(), $options: 'i' } },
                { 'name.textFR': { $regex: q.toString().trim(), $options: 'i' } },
                { 'name.textIT': { $regex: q.toString().trim(), $options: 'i' } },
                { 'name.textES': { $regex: q.toString().trim(), $options: 'i' } },
                { 'name.textHR': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textEN': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textDE': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textFR': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textIT': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textES': { $regex: q.toString().trim(), $options: 'i' } },
                { 'highlights.textHR': { $regex: q.toString().trim(), $options: 'i' } }
            ];
        }

        // Category filters
        if (category) query.categoryId = Number(category);
        if (builder) query.builderId = Number(builder);
        if (base) query.baseId = Number(base);
        if (charterCompany) query.charterCompanyId = Number(charterCompany);

        // Numeric range filters - only for fields that exist in database
        if (minCabins || maxCabins) {
            query.cabins = {};
            if (minCabins) query.cabins.$gte = Number(minCabins);
            if (maxCabins) query.cabins.$lte = Number(maxCabins);
        }

        if (minDraft || maxDraft) {
            query.draft = {};
            if (minDraft) query.draft.$gte = Number(minDraft);
            if (maxDraft) query.draft.$lte = Number(maxDraft);
        }

        if (minEnginePower || maxEnginePower) {
            query.enginePower = {};
            if (minEnginePower) query.enginePower.$gte = Number(minEnginePower);
            if (maxEnginePower) query.enginePower.$lte = Number(maxEnginePower);
        }

        if (minDeposit || maxDeposit) {
            query.deposit = {};
            if (minDeposit) query.deposit.$gte = Number(minDeposit);
            if (maxDeposit) query.deposit.$lte = Number(maxDeposit);
        }

        // Pagination
        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(100, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        // Sorting
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        const sortOptions: any = {};
        
        // Handle different sort fields
        switch (sortBy) {
            case 'name':
                sortOptions['name.textEN'] = sortDirection;
                break;
            case 'draft':
                sortOptions.draft = sortDirection;
                break;
            case 'cabins':
                sortOptions.cabins = sortDirection;
                break;
            case 'enginePower':
                sortOptions.enginePower = sortDirection;
                break;
            case 'deposit':
                sortOptions.deposit = sortDirection;
                break;
            default:
                sortOptions.cabins = sortDirection;
                break;
        }

        const [yachts, total] = await Promise.all([
            Yacht.find(query)
                .skip(skip)
                .limit(limitNum)
                .sort(sortOptions),
            Yacht.countDocuments(query)
        ]);

        // Prepare filters summary
        const appliedFilters: any = {};
        if (category) appliedFilters.category = category;
        if (builder) appliedFilters.builder = builder;
        if (base) appliedFilters.base = base;
        if (charterCompany) appliedFilters.charterCompany = charterCompany;
        if (minCabins || maxCabins) appliedFilters.cabins = { min: minCabins, max: maxCabins };
        if (minDraft || maxDraft) appliedFilters.draft = { min: minDraft, max: maxDraft };
        if (minEnginePower || maxEnginePower) appliedFilters.enginePower = { min: minEnginePower, max: maxEnginePower };
        if (minDeposit || maxDeposit) appliedFilters.deposit = { min: minDeposit, max: maxDeposit };

        res.json({
            success: true,
            data: yachts,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
            },
            filters: appliedFilters,
            search: q ? {
                query: q.toString().trim(),
                results: total
            } : null
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @openapi
 * /api/yachts/bulk-availability:
 *   get:
 *     summary: Get availability for multiple yachts
 *     description: Check availability for multiple yachts in a date range
 *     parameters:
 *       - in: query
 *         name: yachtIds
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of yacht IDs (e.g., "1,2,3")
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for availability check (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for availability check (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Bulk availability information for multiple yachts
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
// Bulk availability check for multiple yachts
router.get('/bulk-availability', async (req, res) => {
    try {
        const { yachtIds, startDate, endDate } = req.query;

        // Validate parameters
        if (!yachtIds || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Yacht IDs, start date, and end date are required'
            });
        }

        const yachtIdArray = (yachtIds as string)
            .split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));
        
        if (yachtIdArray.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one valid yacht ID is required'
            });
        }

        // Ensure all IDs are valid numbers
        for (const id of yachtIdArray) {
            if (typeof id !== 'number' || isNaN(id) || !isFinite(id)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid yacht ID: ${id}`
                });
            }
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        if (start >= end) {
            return res.status(400).json({
                success: false,
                message: 'Start date must be before end date'
            });
        }

        // Find yachts one by one to avoid order-intercept issues
        const yachts: any[] = [];
        for (const yachtId of yachtIdArray) {
            const yacht = await Yacht.findOne({ id: yachtId });
            if (yacht) {
                yachts.push(yacht);
            }
        }
        
        if (yachts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No yachts found with the provided IDs'
            });
        }

        // Get all reservations for these yachts in the date range
        const reservations = await Reservation.find({
            yachtId: { $in: yachtIdArray },
            $or: [
                { periodFrom: { $lte: end, $gte: start } },
                { periodTo: { $gte: start, $lte: end } },
                { periodFrom: { $lte: start }, periodTo: { $gte: end } }
            ]
        }).sort({ yachtId: 1, periodFrom: 1 });

        // Calculate availability for each yacht
        const availabilityResults = yachtIdArray.map(yachtId => {
            const yacht = yachts.find(y => y.id === yachtId);
            if (!yacht) {
                return { yachtId, available: false, error: 'Yacht not found' } as any;
            }

            const yachtReservations = reservations.filter(res => res.yachtId === yachtId);
            
            const availableDates: string[] = [];
            const unavailableDates: Array<{ date: string; reason: string; reservationId?: number; }> = [];

            const currentDate = new Date(start);
            while (currentDate <= end) {
                const dateStr = currentDate.toISOString().split('T')[0];
                const conflictingReservation = yachtReservations.find(res => {
                    const resStart = new Date(res.periodFrom);
                    const resEnd = new Date(res.periodTo);
                    return currentDate >= resStart && currentDate <= resEnd;
                });

                if (conflictingReservation) {
                    unavailableDates.push({ date: dateStr, reason: 'Reserved', reservationId: conflictingReservation.id });
                } else {
                    availableDates.push(dateStr);
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const availableDays = availableDates.length;
            const unavailableDays = unavailableDates.length;
            const availabilityPercentage = Math.round((availableDays / totalDays) * 100);

            return {
                yachtId,
                yachtName: (yacht as any).name,
                available: true,
                dateRange: { startDate, endDate },
                availability: { totalDays, availableDays, unavailableDays, availabilityPercentage },
                availableDates,
                unavailableDates,
                totalReservations: yachtReservations.length
            };
        });

        const totalYachts = availabilityResults.filter(r => (r as any).available).length;
        const averageAvailability = availabilityResults
            .filter(r => (r as any).available)
            .reduce((sum, r) => sum + (r as any).availability.availabilityPercentage, 0) / (totalYachts || 1);

        res.json({
            success: true,
            data: {
                dateRange: { startDate, endDate },
                totalDays: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
                totalYachts: yachtIdArray.length,
                availableYachts: totalYachts,
                averageAvailability: Math.round(averageAvailability),
                results: availabilityResults
            }
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get yacht by ID
router.get('/:id', async (req, res) => {
    try {
        const yacht = await Yacht.findOne({ id: Number(req.params.id) });
        
        if (!yacht) {
            return res.status(404).json({
                success: false,
                message: 'Yacht not found'
            });
        }

        res.json({
            success: true,
            data: yacht
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Debug endpoint to check yacht data
router.get('/debug/collection-info', async (req, res) => {
    try {
        // Get total count
        const totalYachts = await Yacht.countDocuments({});
        
        // Get sample documents
        const sampleYachts = await Yacht.find().limit(3);
        
        // Check if collection exists and has data
        const hasData = totalYachts > 0;
        
        // Get sample field names from first document
        let sampleFields: any = {};
        if (sampleYachts.length > 0) {
            const firstYacht = sampleYachts[0].toObject();
            sampleFields = Object.keys(firstYacht);
        }

        res.json({
            success: true,
            debug: {
                totalYachts,
                hasData,
                sampleYachts: sampleYachts.map(y => y.toObject()),
                sampleFields
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error.stack
        });
    }
});

// Debug endpoint to check specific yacht by ID
router.get('/debug/yacht/:id', async (req, res) => {
    try {
        const yachtId = Number(req.params.id);
        
        // Try different ID fields
        const yachtById = await Yacht.findOne({ id: yachtId });
        const yachtByNumberId = await Yacht.findOne({ id: yachtId.toString() });
        
        // Only try ObjectId if it's a valid MongoDB ObjectId format
        let yachtByMongoId = null;
        try {
            if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                yachtByMongoId = await Yacht.findById(req.params.id);
            }
        } catch (error) {
            // Ignore ObjectId errors
        }
        
        // Get first yacht regardless of ID
        const firstYacht = await Yacht.findOne({});

        res.json({
            success: true,
            debug: {
                searchedId: yachtId,
                yachtById: yachtById ? yachtById.toObject() : null,
                yachtByMongoId: yachtByMongoId ? yachtByMongoId.toObject() : null,
                yachtByNumberId: yachtByNumberId ? yachtByNumberId.toObject() : null,
                firstYacht: firstYacht ? firstYacht.toObject() : null
            }
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error.stack
        });
    }
});

/**
 * @openapi
 * /api/yachts/{id}/availability:
 *   get:
 *     summary: Get yacht availability for a date range
 *     description: Returns available and unavailable dates for a specific yacht
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Yacht ID
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for availability check (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for availability check (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Yacht availability information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     yachtId:
 *                       type: number
 *                     yachtName:
 *                       type: object
 *                     dateRange:
 *                       type: object
 *                       properties:
 *                         startDate:
 *                           type: string
 *                           format: date
 *                         endDate:
 *                           type: string
 *                           format: date
 *                     availability:
 *                       type: object
 *                       properties:
 *                         totalDays:
 *                           type: number
 *                         availableDays:
 *                           type: number
 *                         unavailableDays:
 *                           type: number
 *                         availabilityPercentage:
 *                           type: number
 *                     availableDates:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: date
 *                     unavailableDates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                             format: date
 *                           reason:
 *                             type: string
 *                           reservationId:
 *                             type: number
 *       400:
 *         description: Invalid date parameters
 *       404:
 *         description: Yacht not found
 *       500:
 *         description: Server error
 */
// Get yacht availability for a date range
router.get('/:id/availability', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const yachtId = Number(req.params.id);

        // Validate parameters
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required (format: YYYY-MM-DD)'
            });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        if (start >= end) {
            return res.status(400).json({
                success: false,
                message: 'Start date must be before end date'
            });
        }

        // Check if yacht exists
        const yacht = await Yacht.findOne({ id: yachtId });
        if (!yacht) {
            return res.status(404).json({
                success: false,
                message: 'Yacht not found'
            });
        }

        // Get all reservations for this yacht in the date range
        const reservations = await Reservation.find({
            yachtId: yachtId,
            $or: [
                {
                    periodFrom: { $lte: end, $gte: start }
                },
                {
                    periodTo: { $gte: start, $lte: end }
                },
                {
                    periodFrom: { $lte: start },
                    periodTo: { $gte: end }
                }
            ]
        }).sort({ periodFrom: 1 });

        // Calculate available and unavailable dates
        const availableDates: string[] = [];
        const unavailableDates: Array<{
            date: string;
            reason: string;
            reservationId?: number;
        }> = [];

        const currentDate = new Date(start);
        while (currentDate <= end) {
            const dateStr = currentDate.toISOString().split('T')[0];
            
            // Check if this date is unavailable due to reservations
            const conflictingReservation = reservations.find(res => {
                const resStart = new Date(res.periodFrom);
                const resEnd = new Date(res.periodTo);
                return currentDate >= resStart && currentDate <= resEnd;
            });

            if (conflictingReservation) {
                unavailableDates.push({
                    date: dateStr,
                    reason: 'Reserved',
                    reservationId: conflictingReservation.id
                });
            } else {
                availableDates.push(dateStr);
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Calculate statistics
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const availableDays = availableDates.length;
        const unavailableDays = unavailableDates.length;
        const availabilityPercentage = Math.round((availableDays / totalDays) * 100);

        res.json({
            success: true,
            data: {
                yachtId: yachtId,
                yachtName: yacht.name,
                dateRange: {
                    startDate: startDate,
                    endDate: endDate
                },
                availability: {
                    totalDays,
                    availableDays,
                    unavailableDays,
                    availabilityPercentage
                },
                availableDates,
                unavailableDates
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @openapi
 * /api/yachts/{id}/calendar:
 *   get:
 *     summary: Get yacht availability calendar for a month
 *     description: Returns monthly calendar view with availability status for each day
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Yacht ID
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (e.g., 2025)
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *         description: Month (1-12)
 *     responses:
 *       200:
 *         description: Monthly availability calendar
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: Yacht not found
 *       500:
 *         description: Server error
 */
// Get yacht availability calendar for a month
router.get('/:id/calendar', async (req, res) => {
    try {
        const { year, month } = req.query;
        const yachtId = Number(req.params.id);

        // Validate parameters
        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: 'Year and month are required'
            });
        }

        const yearNum = Number(year);
        const monthNum = Number(month);

        if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return res.status(400).json({
                success: false,
                message: 'Invalid year or month. Month must be 1-12'
            });
        }

        // Check if yacht exists
        const yacht = await Yacht.findOne({ id: yachtId });
        if (!yacht) {
            return res.status(404).json({
                success: false,
                message: 'Yacht not found'
            });
        }

        // Calculate month boundaries
        const startDate = new Date(yearNum, monthNum - 1, 1);
        const endDate = new Date(yearNum, monthNum, 0); // Last day of month

        // Get all reservations for this yacht in the month
        const reservations = await Reservation.find({
            yachtId: yachtId,
            $or: [
                {
                    periodFrom: { $lte: endDate, $gte: startDate }
                },
                {
                    periodTo: { $gte: startDate, $lte: endDate }
                },
                {
                    periodFrom: { $lte: startDate },
                    periodTo: { $gte: endDate }
                }
            ]
        }).sort({ periodFrom: 1 });

        // Build calendar
        const calendar: Array<{
            date: string;
            dayOfWeek: string;
            dayOfMonth: number;
            isAvailable: boolean;
            reservationId?: number;
            reservationType?: string;
        }> = [];

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
            const dayOfMonth = currentDate.getDate();

            // Check if this date is unavailable due to reservations
            const conflictingReservation = reservations.find(res => {
                const resStart = new Date(res.periodFrom);
                const resEnd = new Date(res.periodTo);
                return currentDate >= resStart && currentDate <= resEnd;
            });

            calendar.push({
                date: dateStr,
                dayOfWeek,
                dayOfMonth,
                isAvailable: !conflictingReservation,
                reservationId: conflictingReservation?.id,
                reservationType: conflictingReservation?.reservationType
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Calculate month statistics
        const totalDays = calendar.length;
        const availableDays = calendar.filter(day => day.isAvailable).length;
        const unavailableDays = totalDays - availableDays;
        const availabilityPercentage = Math.round((availableDays / totalDays) * 100);

        res.json({
            success: true,
            data: {
                yachtId: yachtId,
                yachtName: yacht.name,
                year: yearNum,
                month: monthNum,
                monthName: startDate.toLocaleDateString('en-US', { month: 'long' }),
                dateRange: {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0]
                },
                statistics: {
                    totalDays,
                    availableDays,
                    unavailableDays,
                    availabilityPercentage
                },
                calendar
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @openapi
 * /api/yachts/{id}/availability-summary:
 *   get:
 *     summary: Get yacht availability summary and next available dates
 *     description: Returns availability statistics and next available periods
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Yacht ID
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to look ahead for availability
 *     responses:
 *       200:
 *         description: Yacht availability summary
 *       404:
 *         description: Yacht not found
 *       500:
 *         description: Server error
 */
// Get yacht availability summary and next available dates
router.get('/:id/availability-summary', async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const yachtId = Number(req.params.id);
        const daysToCheck = Math.min(Number(days), 365); // Max 1 year

        // Check if yacht exists
        const yacht = await Yacht.findOne({ id: yachtId });
        if (!yacht) {
            return res.status(404).json({
                success: false,
                message: 'Yacht not found'
            });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + daysToCheck);

        // Get all reservations for this yacht in the date range
        const reservations = await Reservation.find({
            yachtId: yachtId,
            $or: [
                {
                    periodFrom: { $lte: endDate, $gte: startDate }
                },
                {
                    periodTo: { $gte: startDate, $lte: endDate }
                },
                {
                    periodFrom: { $lte: startDate },
                    periodTo: { $gte: endDate }
                }
            ]
        }).sort({ periodFrom: 1 });

        // Find next available periods
        const nextAvailablePeriods: Array<{
            startDate: string;
            endDate: string;
            duration: number;
        }> = [];

        let currentDate = new Date(startDate);
        while (currentDate < endDate) {
            // Find next available date
            let availableStart = null;
            while (currentDate < endDate) {
                const conflictingReservation = reservations.find(res => {
                    const resStart = new Date(res.periodFrom);
                    const resEnd = new Date(res.periodTo);
                    return currentDate >= resStart && currentDate <= resEnd;
                });

                if (!conflictingReservation) {
                    availableStart = new Date(currentDate);
                    break;
                }

                // Skip to after this reservation
                const resEnd = new Date(reservations.find(res => {
                    const resStart = new Date(res.periodFrom);
                    const resEnd = new Date(res.periodTo);
                    return currentDate >= resStart && currentDate <= resEnd;
                })!.periodTo);
                currentDate = new Date(resEnd);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (availableStart) {
                // Find how long this available period lasts
                let availableEnd = new Date(availableStart);
                let duration = 0;

                while (availableEnd < endDate) {
                    const nextDate = new Date(availableEnd);
                    nextDate.setDate(nextDate.getDate() + 1);

                    const conflictingReservation = reservations.find(res => {
                        const resStart = new Date(res.periodFrom);
                        const resEnd = new Date(res.periodTo);
                        return nextDate >= resStart && nextDate <= resEnd;
                    });

                    if (conflictingReservation) {
                        break;
                    }

                    availableEnd = nextDate;
                    duration++;
                }

                if (duration > 0) {
                    nextAvailablePeriods.push({
                        startDate: availableStart.toISOString().split('T')[0],
                        endDate: availableEnd.toISOString().split('T')[0],
                        duration
                    });
                }

                currentDate = availableEnd;
            }
        }

        // Calculate overall statistics
        const totalDays = daysToCheck;
        const reservedDays = reservations.reduce((total, res) => {
            const resStart = new Date(res.periodFrom);
            const resEnd = new Date(res.periodTo);
            const start = resStart < startDate ? startDate : resStart;
            const end = resEnd > endDate ? endDate : resEnd;
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            return total + Math.max(0, days);
        }, 0);

        const availableDays = totalDays - reservedDays;
        const availabilityPercentage = Math.round((availableDays / totalDays) * 100);

        res.json({
            success: true,
            data: {
                yachtId: yachtId,
                yachtName: yacht.name,
                period: {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                    days: totalDays
                },
                statistics: {
                    totalDays,
                    availableDays,
                    reservedDays,
                    availabilityPercentage
                },
                nextAvailablePeriods: nextAvailablePeriods.slice(0, 5), // Top 5 available periods
                totalAvailablePeriods: nextAvailablePeriods.length
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @openapi
 * /api/yachts/bulk-availability:
 *   get:
 *     summary: Get availability for multiple yachts
 *     description: Check availability for multiple yachts in a date range
 *     parameters:
 *       - in: query
 *         name: yachtIds
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated list of yacht IDs (e.g., "1,2,3")
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for availability check (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for availability check (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Bulk availability information for multiple yachts
 *       400:
 *         description: Invalid parameters
 *       500:
 *         description: Server error
 */
// Bulk availability check for multiple yachts
// (moved above the generic :id route)

export default router;
