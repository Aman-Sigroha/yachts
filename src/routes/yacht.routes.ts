import express from 'express';
import { Yacht } from '../models/yacht';

const router = express.Router();

/**
 * @openapi
 * /api/yachts:
 *   get:
 *     summary: Get all yachts with filtering and search
 *     description: Retrieve yachts with comprehensive filtering, searching, and pagination
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

export default router;
