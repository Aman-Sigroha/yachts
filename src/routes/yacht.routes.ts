import express from 'express';
import { Yacht } from '../models/yacht';
import { Reservation } from '../models/reservation'; // Added import for Reservation

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
            startDate,
            endDate,
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

        let [yachts, total] = await Promise.all([
            Yacht.find(query)
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
        if (startDate && endDate) appliedFilters.availability = { startDate, endDate };

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
