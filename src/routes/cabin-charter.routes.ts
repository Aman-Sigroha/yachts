import express from 'express';
import { CabinCharterBase, CabinCharterCompany } from '../models/cabin-charter';

const router = express.Router();

/**
 * @swagger
 * /api/cabin-charters/bases:
 *   get:
 *     summary: Get all cabin charter bases
 *     description: Retrieve all charter bases with filtering and pagination
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: integer
 *         description: Filter by charter company ID
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: integer
 *         description: Filter by location ID
 *       - in: query
 *         name: disabled
 *         schema:
 *           type: boolean
 *         description: Filter by disabled status
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
 *     responses:
 *       200:
 *         description: List of charter bases
 *       500:
 *         description: Server error
 */
router.get('/bases', async (req, res) => {
    try {
        const { companyId, locationId, disabled, page = 1, limit = 20 } = req.query;
        
        // Build filter object
        const filter: any = {};
        if (companyId) filter.companyId = parseInt(companyId as string);
        if (locationId) filter.locationId = parseInt(locationId as string);
        if (disabled !== undefined) filter.disabled = disabled === 'true';
        
        // Calculate pagination
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const limitNum = Math.min(parseInt(limit as string), 100);
        
        // Execute query
        const bases = await CabinCharterBase.find(filter)
            .skip(skip)
            .limit(limitNum)
            .sort({ id: 1 });
        
        const total = await CabinCharterBase.countDocuments(filter);
        
        res.json({
            success: true,
            data: bases,
            pagination: {
                page: parseInt(page as string),
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            },
            filters: {
                companyId: companyId ? parseInt(companyId as string) : null,
                locationId: locationId ? parseInt(locationId as string) : null,
                disabled: disabled !== undefined ? disabled === 'true' : null
            }
        });
    } catch (error) {
        console.error('Error fetching charter bases:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching charter bases',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/cabin-charters/bases/{baseId}:
 *   get:
 *     summary: Get specific charter base
 *     description: Retrieve details of a specific charter base
 *     parameters:
 *       - in: path
 *         name: baseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Charter base ID
 *     responses:
 *       200:
 *         description: Charter base details
 *       404:
 *         description: Charter base not found
 *       500:
 *         description: Server error
 */
router.get('/bases/:baseId', async (req, res) => {
    try {
        const baseId = parseInt(req.params.baseId);
        
        const base = await CabinCharterBase.findOne({ id: baseId });
        
        if (!base) {
            return res.status(404).json({
                success: false,
                message: 'Charter base not found'
            });
        }
        
        res.json({
            success: true,
            data: base
        });
    } catch (error) {
        console.error('Error fetching charter base:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching charter base',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/cabin-charters/bases/by-company/{companyId}:
 *   get:
 *     summary: Get bases by company
 *     description: Retrieve all bases for a specific charter company
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Charter company ID
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
 *     responses:
 *       200:
 *         description: List of bases for the company
 *       500:
 *         description: Server error
 */
router.get('/bases/by-company/:companyId', async (req, res) => {
    try {
        const companyId = parseInt(req.params.companyId);
        const { page = 1, limit = 20 } = req.query;
        
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const limitNum = Math.min(parseInt(limit as string), 100);
        
        const bases = await CabinCharterBase.find({ companyId })
            .skip(skip)
            .limit(limitNum)
            .sort({ id: 1 });
        
        const total = await CabinCharterBase.countDocuments({ companyId });
        
        res.json({
            success: true,
            data: bases,
            pagination: {
                page: parseInt(page as string),
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            },
            companyId
        });
    } catch (error) {
        console.error('Error fetching bases by company:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bases by company',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/cabin-charters/bases/by-location/{locationId}:
 *   get:
 *     summary: Get bases by location
 *     description: Retrieve all bases in a specific location
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Location ID
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
 *     responses:
 *       200:
 *         description: List of bases in the location
 *       500:
 *         description: Server error
 */
router.get('/bases/by-location/:locationId', async (req, res) => {
    try {
        const locationId = parseInt(req.params.locationId);
        const { page = 1, limit = 20 } = req.query;
        
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const limitNum = Math.min(parseInt(limit as string), 100);
        
        const bases = await CabinCharterBase.find({ locationId })
            .skip(skip)
            .limit(limitNum)
            .sort({ id: 1 });
        
        const total = await CabinCharterBase.countDocuments({ locationId });
        
        res.json({
            success: true,
            data: bases,
            pagination: {
                page: parseInt(page as string),
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            },
            locationId
        });
    } catch (error) {
        console.error('Error fetching bases by location:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bases by location',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/cabin-charters/companies:
 *   get:
 *     summary: Get all cabin charter companies
 *     description: Retrieve all charter companies with filtering and pagination
 *     parameters:
 *       - in: query
 *         name: countryId
 *         schema:
 *           type: integer
 *         description: Filter by country ID
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city name
 *       - in: query
 *         name: pac
 *         schema:
 *           type: boolean
 *         description: Filter by PAC status
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
 *     responses:
 *       200:
 *         description: List of charter companies
 *       500:
 *         description: Server error
 */
router.get('/companies', async (req, res) => {
    try {
        const { countryId, city, pac, page = 1, limit = 20 } = req.query;
        
        // Build filter object
        const filter: any = {};
        if (countryId) filter.countryId = parseInt(countryId as string);
        if (city) filter.city = { $regex: city as string, $options: 'i' };
        if (pac !== undefined) filter.pac = pac === 'true';
        
        // Calculate pagination
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const limitNum = Math.min(parseInt(limit as string), 100);
        
        // Execute query
        const companies = await CabinCharterCompany.find(filter)
            .skip(skip)
            .limit(limitNum)
            .sort({ name: 1 });
        
        const total = await CabinCharterCompany.countDocuments(filter);
        
        res.json({
            success: true,
            data: companies,
            pagination: {
                page: parseInt(page as string),
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            },
            filters: {
                countryId: countryId ? parseInt(countryId as string) : null,
                city: city || null,
                pac: pac !== undefined ? pac === 'true' : null
            }
        });
    } catch (error) {
        console.error('Error fetching charter companies:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching charter companies',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/cabin-charters/companies/{companyId}:
 *   get:
 *     summary: Get specific charter company
 *     description: Retrieve details of a specific charter company
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Charter company ID
 *     responses:
 *       200:
 *         description: Charter company details
 *       404:
 *         description: Charter company not found
 *       500:
 *         description: Server error
 */
router.get('/companies/:companyId', async (req, res) => {
    try {
        const companyId = parseInt(req.params.companyId);
        
        const company = await CabinCharterCompany.findOne({ id: companyId });
        
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Charter company not found'
            });
        }
        
        res.json({
            success: true,
            data: company
        });
    } catch (error) {
        console.error('Error fetching charter company:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching charter company',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/cabin-charters/companies/by-country/{countryId}:
 *   get:
 *     summary: Get companies by country
 *     description: Retrieve all companies in a specific country
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Country ID
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
 *     responses:
 *       200:
 *         description: List of companies in the country
 *       500:
 *         description: Server error
 */
router.get('/companies/by-country/:countryId', async (req, res) => {
    try {
        const countryId = parseInt(req.params.countryId);
        const { page = 1, limit = 20 } = req.query;
        
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const limitNum = Math.min(parseInt(limit as string), 100);
        
        const companies = await CabinCharterCompany.find({ countryId })
            .skip(skip)
            .limit(limitNum)
            .sort({ name: 1 });
        
        const total = await CabinCharterCompany.countDocuments({ countryId });
        
        res.json({
            success: true,
            data: companies,
            pagination: {
                page: parseInt(page as string),
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            },
            countryId
        });
    } catch (error) {
        console.error('Error fetching companies by country:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching companies by country',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/cabin-charters/catalogue:
 *   get:
 *     summary: Get cabin charter catalogue
 *     description: Retrieve combined bases and companies data for catalogue/filter purposes
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Combined catalogue data
 *       500:
 *         description: Server error
 */
router.get('/catalogue', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
        const limitNum = Math.min(parseInt(limit as string), 100);
        
        // Get bases and companies in parallel
        const [bases, companies] = await Promise.all([
            CabinCharterBase.find({}).skip(skip).limit(limitNum).sort({ id: 1 }),
            CabinCharterCompany.find({}).skip(skip).limit(limitNum).sort({ name: 1 })
        ]);
        
        const [basesTotal, companiesTotal] = await Promise.all([
            CabinCharterBase.countDocuments({}),
            CabinCharterCompany.countDocuments({})
        ]);
        
        res.json({
            success: true,
            data: {
                bases,
                companies
            },
            pagination: {
                page: parseInt(page as string),
                limit: limitNum,
                basesTotal,
                companiesTotal,
                basesPages: Math.ceil(basesTotal / limitNum),
                companiesPages: Math.ceil(companiesTotal / limitNum)
            }
        });
    } catch (error) {
        console.error('Error fetching cabin charter catalogue:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cabin charter catalogue',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/cabin-charters/filters:
 *   get:
 *     summary: Get cabin charter filter options
 *     description: Retrieve available filter options for cabin charter search
 *     responses:
 *       200:
 *         description: Available filter options
 *       500:
 *         description: Server error
 */
router.get('/filters', async (req, res) => {
    try {
        // Get unique values for filtering
        const [countries, cities, companies] = await Promise.all([
            CabinCharterCompany.distinct('countryId'),
            CabinCharterCompany.distinct('city'),
            CabinCharterCompany.distinct('name')
        ]);
        
        // Get counts for each filter option
        const countryCounts = await Promise.all(
            countries.map(async (countryId) => ({
                countryId,
                count: await CabinCharterCompany.countDocuments({ countryId })
            }))
        );
        
        const cityCounts = await Promise.all(
            cities.map(async (city) => ({
                city,
                count: await CabinCharterCompany.countDocuments({ city })
            }))
        );
        
        res.json({
            success: true,
            data: {
                countries: countryCounts,
                cities: cityCounts,
                companies: companies.map(name => ({ name }))
            }
        });
    } catch (error) {
        console.error('Error fetching cabin charter filters:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cabin charter filters',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;
