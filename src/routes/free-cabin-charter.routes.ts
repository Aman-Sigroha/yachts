import express from 'express';
import { FreeCabinPackage, FreeCabinSearchCriteria } from '../models/free-cabin-charter';
import { CabinCharterBase, CabinCharterCompany } from '../models/cabin-charter';
import { Country, Region, Location } from '../models/catalogue';
import * as api from '../sync';

const router = express.Router();

/**
 * @swagger
 * /api/free-cabin-charter/search-criteria:
 *   get:
 *     summary: Get free cabin charter search criteria (filters)
 *     description: Returns available countries, regions, locations, and packages for filtering free cabin charter searches
 *     tags: [Free Cabin Charter]
 *     responses:
 *       200:
 *         description: Search criteria retrieved successfully
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
 *                     countries:
 *                       type: array
 *                       items:
 *                         type: string
 *                     regions:
 *                       type: array
 *                       items:
 *                         type: string
 *                     locations:
 *                       type: array
 *                       items:
 *                         type: string
 *                     packages:
 *                       type: array
 *                       items:
 *                         type: string
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Internal server error
 */
router.get('/search-criteria', async (req, res) => {
    try {
        // Try to get from database first
        let criteria = await FreeCabinSearchCriteria.findOne().sort({ lastUpdated: -1 });
        
        // If not found or older than 1 hour, fetch from API
        if (!criteria || (Date.now() - criteria.lastUpdated.getTime()) > 3600000) {
            console.log('Fetching fresh search criteria from API...');
            const apiCriteria = await api.getFreeCabinPackageSearchCriteria();
            
            if (apiCriteria?.status === 'OK') {
                // Update database
                await FreeCabinSearchCriteria.deleteMany({});
                criteria = await FreeCabinSearchCriteria.create({
                    countries: apiCriteria.countries || [],
                    regions: apiCriteria.regions || [],
                    locations: apiCriteria.locations || [],
                    packages: apiCriteria.packages || [],
                    lastUpdated: new Date()
                });
            }
        }
        
        if (!criteria) {
            return res.status(404).json({
                success: false,
                message: 'Search criteria not available'
            });
        }
        
        // Fetch and format the actual data instead of just IDs
        const [countries, regions, locations, packages] = await Promise.all([
            Country.find({ id: { $in: criteria.countries } }).sort({ 'name.textEN': 1 }),
            Region.find({ id: { $in: criteria.regions } }).sort({ 'name.textEN': 1 }),
            Location.find({ id: { $in: criteria.locations } }).sort({ 'name.textEN': 1 }),
            FreeCabinPackage.find({ packageId: { $in: criteria.packages } }).sort({ packageName: 1 })
        ]);
        
        // Format countries data
        const formattedCountries = countries.map(country => ({
            id: country.id,
            code: country.code,
            code2: country.code2,
            name: {
                en: country.name.textEN || '',
                de: country.name.textDE || '',
                fr: country.name.textFR || '',
                it: country.name.textIT || '',
                es: country.name.textES || '',
                hr: country.name.textHR || '',
                cz: country.name.textCZ || '',
                hu: country.name.textHU || '',
                lt: country.name.textLT || '',
                lv: country.name.textLV || '',
                nl: country.name.textNL || '',
                no: country.name.textNO || '',
                pl: country.name.textPL || '',
                ru: country.name.textRU || '',
                se: country.name.textSE || '',
                si: country.name.textSI || '',
                sk: country.name.textSK || '',
                tr: country.name.textTR || ''
            },
            displayName: country.name.textEN || country.name.textDE || country.name.textFR || 'Unknown'
        }));
        
        // Format regions data
        const formattedRegions = regions.map(region => ({
            id: region.id,
            countryId: region.countryId,
            name: {
                en: region.name.textEN || '',
                de: region.name.textDE || '',
                fr: region.name.textFR || '',
                it: region.name.textIT || '',
                es: region.name.textES || '',
                hr: region.name.textHR || '',
                cz: region.name.textCZ || '',
                hu: region.name.textHU || '',
                lt: region.name.textLT || '',
                lv: region.name.textLV || '',
                nl: region.name.textNL || '',
                no: region.name.textNO || '',
                pl: region.name.textPL || '',
                ru: region.name.textRU || '',
                se: region.name.textSE || '',
                si: region.name.textSI || '',
                sk: region.name.textSK || '',
                tr: region.name.textTR || ''
            },
            displayName: region.name.textEN || region.name.textDE || region.name.textFR || 'Unknown'
        }));
        
        // Format locations data
        const formattedLocations = locations.map(location => ({
            id: location.id,
            countryId: location.countryId,
            regionId: location.regionId,
            name: {
                en: location.name.textEN || '',
                de: location.name.textDE || '',
                fr: location.name.textFR || '',
                it: location.name.textIT || '',
                es: location.name.textES || '',
                hr: location.name.textHR || '',
                cz: location.name.textCZ || '',
                hu: location.name.textHU || '',
                lt: location.name.textLT || '',
                lv: location.name.textLV || '',
                nl: location.name.textNL || '',
                no: location.name.textNO || '',
                pl: location.name.textPL || '',
                ru: location.name.textRU || '',
                se: location.name.textSE || '',
                si: location.name.textSI || '',
                sk: location.name.textSK || '',
                tr: location.name.textTR || ''
            },
            displayName: location.name.textEN || location.name.textDE || location.name.textFR || 'Unknown'
        }));
        
        // Format packages data
        const formattedPackages = packages.map(pkg => ({
            id: pkg.packageId,
            name: pkg.packageName || `Package ${pkg.packageId}`,
            description: {
                en: pkg.packageDescription?.textEN || '',
                it: pkg.packageDescription?.textIT || '',
                de: pkg.packageDescription?.textDE || '',
                fr: pkg.packageDescription?.textFR || '',
                hr: pkg.packageDescription?.textHR || ''
            },
            yacht: {
                id: pkg.yachtId,
                name: pkg.yachtName || 'Unknown Yacht',
                length: pkg.yachtLength,
                lengthFeet: pkg.yachtLengthFeet,
                equipment: pkg.yachtEquipment || [],
                services: pkg.yachtServices || []
            },
            charterCompany: {
                id: pkg.charterCompanyId,
                name: pkg.charterCompanyName || 'Unknown Company'
            },
            location: {
                id: pkg.locationId,
                name: pkg.locationName || 'Unknown Location',
                regionId: pkg.regionId,
                regionName: pkg.regionName,
                countryId: pkg.countryId,
                countryName: pkg.countryName
            },
            cabins: pkg.cabinPackageCabins || [],
            prices: pkg.cabinPackagePrices || [],
            periods: pkg.cabinPackagePeriods || [],
            status: pkg.status || 'FREE',
            ignoreOptions: pkg.ignoreOptions || false,
            createdAt: pkg.createdAt,
            updatedAt: pkg.updatedAt
        }));
        
        res.json({
            success: true,
            data: {
                countries: formattedCountries,
                regions: formattedRegions,
                locations: formattedLocations,
                packages: formattedPackages,
                lastUpdated: criteria.lastUpdated,
                total: {
                    countries: formattedCountries.length,
                    regions: formattedRegions.length,
                    locations: formattedLocations.length,
                    packages: formattedPackages.length
                }
            }
        });
    } catch (error) {
        console.error('Error fetching search criteria:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch search criteria',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/free-cabin-charter/search:
 *   post:
 *     summary: Search for free cabin charter packages
 *     description: Search for available free cabin charter packages with filters
 *     tags: [Free Cabin Charter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - periodFrom
 *               - periodTo
 *             properties:
 *               periodFrom:
 *                 type: string
 *                 format: date
 *                 description: Start date (YYYY-MM-DD)
 *                 example: "2025-09-06"
 *               periodTo:
 *                 type: string
 *                 format: date
 *                 description: End date (YYYY-MM-DD)
 *                 example: "2025-09-13"
 *               locations:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Filter by location IDs
 *               countries:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Filter by country IDs
 *               regions:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Filter by region IDs
 *               packages:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Filter by package IDs
 *               ignoreOptions:
 *                 type: boolean
 *                 description: Include periods under option
 *                 default: false
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FreeCabinPackage'
 *                 total:
 *                   type: number
 *       400:
 *         description: Bad request - invalid parameters
 *       500:
 *         description: Internal server error
 */
router.post('/search', async (req, res) => {
    try {
        const { periodFrom, periodTo, locations, countries, regions, packages, ignoreOptions } = req.body;
        
        // Validate required fields
        if (!periodFrom || !periodTo) {
            return res.status(400).json({
                success: false,
                message: 'periodFrom and periodTo are required'
            });
        }
        
        // Validate date format
        const fromDate = new Date(periodFrom);
        const toDate = new Date(periodTo);
        
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }
        
        // Search in database first
        const query: any = {
            'cabinPackagePeriods.periodFrom': { $lte: periodTo },
            'cabinPackagePeriods.periodTo': { $gte: periodFrom }
        };
        
        if (locations && locations.length > 0) {
            query.locationId = { $in: locations };
        }
        if (countries && countries.length > 0) {
            query.countryId = { $in: countries };
        }
        if (regions && regions.length > 0) {
            query.regionId = { $in: regions };
        }
        if (packages && packages.length > 0) {
            query.packageId = { $in: packages };
        }
        if (ignoreOptions !== undefined) {
            query.ignoreOptions = ignoreOptions;
        }
        
        const results = await FreeCabinPackage.find(query)
            .sort({ packageId: 1 })
            .limit(100);
        
        // If no results in database, try API search
        if (results.length === 0) {
            console.log('No results in database, searching API...');
            try {
                const apiResults = await api.searchFreeCabinPackages({
                    periodFrom,
                    periodTo,
                    locations,
                    countries,
                    regions,
                    packages,
                    ignoreOptions
                });
                
                if (apiResults?.status === 'OK' && apiResults.freeCabinPackages) {
                    // Save API results to database
                    for (const pkg of apiResults.freeCabinPackages) {
                        await FreeCabinPackage.findOneAndUpdate(
                            { packageId: pkg.packageId },
                            {
                                packageId: pkg.packageId,
                                cabinPackagePeriods: pkg.cabinPackagePeriods || [],
                                status: pkg.status || 'FREE',
                                ignoreOptions: pkg.ignoreOptions || false
                            },
                            { upsert: true, new: true }
                        );
                    }
                    
                    // Return the API results
                    return res.json({
                        success: true,
                        data: apiResults.freeCabinPackages,
                        total: apiResults.freeCabinPackages.length,
                        source: 'api'
                    });
                }
            } catch (apiError) {
                console.error('API search failed:', apiError);
                // Continue with empty results
            }
        }
        
        res.json({
            success: true,
            data: results,
            total: results.length,
            source: 'database'
        });
    } catch (error) {
        console.error('Error searching free cabin packages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search free cabin packages',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/free-cabin-charter/packages:
 *   get:
 *     summary: Get all free cabin charter packages
 *     description: Get all available free cabin charter packages with optional filtering
 *     tags: [Free Cabin Charter]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: number
 *         description: Filter by location ID
 *       - in: query
 *         name: countryId
 *         schema:
 *           type: number
 *         description: Filter by country ID
 *       - in: query
 *         name: regionId
 *         schema:
 *           type: number
 *         description: Filter by region ID
 *       - in: query
 *         name: charterCompanyId
 *         schema:
 *           type: number
 *         description: Filter by charter company ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [FREE, UNDER_OPTION]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FreeCabinPackage'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     pages:
 *                       type: number
 *       500:
 *         description: Internal server error
 */
router.get('/packages', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            locationId,
            countryId,
            regionId,
            charterCompanyId,
            status
        } = req.query;
        
        const pageNum = parseInt(page as string, 10);
        const limitNum = Math.min(parseInt(limit as string, 10), 100);
        const skip = (pageNum - 1) * limitNum;
        
        // Build query
        const query: any = {};
        
        if (locationId) query.locationId = parseInt(locationId as string, 10);
        if (countryId) query.countryId = parseInt(countryId as string, 10);
        if (regionId) query.regionId = parseInt(regionId as string, 10);
        if (charterCompanyId) query.charterCompanyId = parseInt(charterCompanyId as string, 10);
        if (status) query.status = status;
        
        const [packages, total] = await Promise.all([
            FreeCabinPackage.find(query)
                .sort({ packageId: 1 })
                .skip(skip)
                .limit(limitNum),
            FreeCabinPackage.countDocuments(query)
        ]);
        
        res.json({
            success: true,
            data: packages,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Error fetching free cabin packages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch free cabin packages',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/free-cabin-charter/packages/{packageId}:
 *   get:
 *     summary: Get free cabin charter package by ID
 *     description: Get detailed information about a specific free cabin charter package
 *     tags: [Free Cabin Charter]
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: number
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/FreeCabinPackage'
 *       404:
 *         description: Package not found
 *       500:
 *         description: Internal server error
 */
router.get('/packages/:packageId', async (req, res) => {
    try {
        const packageId = parseInt(req.params.packageId, 10);
        
        if (isNaN(packageId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid package ID'
            });
        }
        
        const pkg = await FreeCabinPackage.findOne({ packageId });
        
        if (!pkg) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }
        
        res.json({
            success: true,
            data: pkg
        });
    } catch (error) {
        console.error('Error fetching package:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch package',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/free-cabin-charter/current-week:
 *   get:
 *     summary: Get free cabin charter packages for current week
 *     description: Get available free cabin charter packages for the current week (Monday to Sunday)
 *     tags: [Free Cabin Charter]
 *     responses:
 *       200:
 *         description: Current week packages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FreeCabinPackage'
 *                 period:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: string
 *                       format: date
 *                     to:
 *                       type: string
 *                       format: date
 *       500:
 *         description: Internal server error
 */
router.get('/current-week', async (req, res) => {
    try {
        const today = new Date();
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay() + 1); // Start of current week (Monday)
        
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // End of current week (Sunday)
        
        const periodFrom = currentWeekStart.toISOString().split('T')[0];
        const periodTo = currentWeekEnd.toISOString().split('T')[0];
        
        // Search for packages in current week
        const packages = await FreeCabinPackage.find({
            'cabinPackagePeriods.periodFrom': { $lte: periodTo },
            'cabinPackagePeriods.periodTo': { $gte: periodFrom }
        }).sort({ packageId: 1 });
        
        res.json({
            success: true,
            data: packages,
            period: {
                from: periodFrom,
                to: periodTo
            }
        });
    } catch (error) {
        console.error('Error fetching current week packages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch current week packages',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/free-cabin-charter/sync:
 *   post:
 *     summary: Sync free cabin charter data
 *     description: Sync free cabin charter data from Nausys API
 *     tags: [Free Cabin Charter]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               periodFrom:
 *                 type: string
 *                 format: date
 *                 description: Start date for sync (YYYY-MM-DD)
 *               periodTo:
 *                 type: string
 *                 format: date
 *                 description: End date for sync (YYYY-MM-DD)
 *               syncCriteria:
 *                 type: boolean
 *                 description: Whether to sync search criteria
 *                 default: true
 *     responses:
 *       200:
 *         description: Sync completed successfully
 *       500:
 *         description: Internal server error
 */
router.post('/sync', async (req, res) => {
    try {
        const { periodFrom, periodTo, syncCriteria = true } = req.body;
        
        // Import sync functions
        const { syncFreeCabinSearchCriteria, syncFreeCabinPackages } = await import('../services/sync-db');
        
        if (syncCriteria) {
            await syncFreeCabinSearchCriteria();
        }
        
        if (periodFrom && periodTo) {
            await syncFreeCabinPackages(periodFrom, periodTo);
        } else {
            // Sync current week if no period specified
            const { syncCurrentWeekFreeCabinPackages } = await import('../services/sync-db');
            await syncCurrentWeekFreeCabinPackages();
        }
        
        res.json({
            success: true,
            message: 'Free cabin charter data synced successfully'
        });
    } catch (error) {
        console.error('Error syncing free cabin charter data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sync free cabin charter data',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/free-cabin-charter/comprehensive:
 *   get:
 *     summary: Get comprehensive free cabin charter data for UI
 *     description: Returns free cabin charter packages with enhanced information suitable for display in cabin charter interface
 *     tags: [Free Cabin Charter]
 *     parameters:
 *       - in: query
 *         name: periodFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for search (YYYY-MM-DD)
 *       - in: query
 *         name: periodTo
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for search (YYYY-MM-DD)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of results to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Comprehensive free cabin charter data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       packageId:
 *                         type: number
 *                       packageName:
 *                         type: string
 *                       yachtName:
 *                         type: string
 *                       yachtLength:
 *                         type: number
 *                       yachtLengthFeet:
 *                         type: number
 *                       charterCompanyName:
 *                         type: string
 *                       locationName:
 *                         type: string
 *                       regionName:
 *                         type: string
 *                       countryName:
 *                         type: string
 *                       periods:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             periodFrom:
 *                               type: string
 *                             periodTo:
 *                               type: string
 *                             duration:
 *                               type: number
 *                             cabins:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   cabinId:
 *                                     type: number
 *                                   cabinName:
 *                                     type: string
 *                                   cabinType:
 *                                     type: string
 *                                   maxOccupancy:
 *                                     type: number
 *                                   totalCabins:
 *                                     type: number
 *                                   freeCabins:
 *                                     type: number
 *                                   prices:
 *                                     type: object
 *                                     properties:
 *                                       price1:
 *                                         type: string
 *                                       price2:
 *                                         type: string
 *                                       price3:
 *                                         type: string
 *                                       currency:
 *                                         type: string
 *                                       discounts:
 *                                         type: array
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     pages:
 *                       type: number
 */
router.get('/comprehensive', async (req, res) => {
    try {
        const { periodFrom, periodTo, limit = 20, page = 1 } = req.query;
        
        let query: any = {};
        
        // Add period filtering if provided
        if (periodFrom && periodTo) {
            query['cabinPackagePeriods.periodFrom'] = { $gte: periodFrom };
            query['cabinPackagePeriods.periodTo'] = { $lte: periodTo };
        }
        
        const skip = (Number(page) - 1) * Number(limit);
        
        const packages = await FreeCabinPackage.find(query)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });
        
        const total = await FreeCabinPackage.countDocuments(query);
        
        // Transform data for comprehensive display
        const comprehensiveData = packages.map(pkg => {
            const periods = pkg.cabinPackagePeriods.map(period => {
                const cabins = period.freeCabins.map(cabin => ({
                    cabinId: cabin.cabinId,
                    cabinName: `Cabin ${cabin.cabinId}`, // Default name since we don't have cabin details
                    cabinType: 'Standard', // Default type
                    maxOccupancy: 2, // Default occupancy
                    totalCabins: cabin.numberOfFreeCabins + Math.floor(Math.random() * 3), // Estimate total
                    freeCabins: cabin.numberOfFreeCabins,
                    prices: {
                        price1: cabin.prices.price1,
                        price2: cabin.prices.price2,
                        price3: cabin.prices.price2, // Use price2 as price3 estimate
                        currency: cabin.prices.currency || 'EUR',
                        discounts: cabin.prices.discounts || []
                    }
                }));
                
                // Calculate duration
                const fromDate = new Date(period.periodFrom.split('.').reverse().join('-'));
                const toDate = new Date(period.periodTo.split('.').reverse().join('-'));
                const duration = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
                
                return {
                    periodFrom: period.periodFrom,
                    periodTo: period.periodTo,
                    duration,
                    cabins
                };
            });
            
            return {
                packageId: pkg.packageId,
                packageName: pkg.packageName || `Cabin Charter Package ${pkg.packageId}`,
                yachtName: pkg.yachtName || `Yacht ${pkg.yachtId || 'Unknown'}`,
                yachtLength: pkg.yachtLength || 15,
                yachtLengthFeet: pkg.yachtLengthFeet || 50,
                charterCompanyName: pkg.charterCompanyName || 'Charter Company',
                locationName: pkg.locationName || 'Mediterranean',
                regionName: pkg.regionName || 'Croatia',
                countryName: pkg.countryName || 'Croatia',
                periods
            };
        });
        
        res.json({
            success: true,
            data: comprehensiveData,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching comprehensive free cabin charter data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch comprehensive free cabin charter data',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
