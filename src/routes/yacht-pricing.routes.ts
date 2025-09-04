import express from 'express';
import { YachtPricing } from '../models/yacht-pricing';
import { Yacht } from '../models/yacht';

const router = express.Router();

/**
 * @swagger
 * /api/yacht-pricing:
 *   get:
 *     summary: Get yacht pricing with filtering
 *     description: Retrieve yacht pricing with comprehensive filtering and pagination
 *     parameters:
 *       - in: query
 *         name: yachtId
 *         schema:
 *           type: integer
 *         description: Filter by yacht ID
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *         description: Filter by pricing period
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter pricing starting from this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter pricing ending before this date (YYYY-MM-DD)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum weekly price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum weekly price
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
 *         description: List of yacht pricing with pagination
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const {
            yachtId,
            period,
            startDate,
            endDate,
            minPrice,
            maxPrice,
            page = 1,
            limit = 20
        } = req.query;

        const query: any = { isActive: true };

        if (yachtId) query.yachtId = Number(yachtId);
        if (period) query.period = period;
        if (minPrice || maxPrice) {
            query.weeklyPrice = {};
            if (minPrice) query.weeklyPrice.$gte = Number(minPrice);
            if (maxPrice) query.weeklyPrice.$lte = Number(maxPrice);
        }
        if (startDate || endDate) {
            query.$and = [];
            if (startDate) {
                query.$and.push({ endDate: { $gte: new Date(startDate as string) } });
            }
            if (endDate) {
                query.$and.push({ startDate: { $lte: new Date(endDate as string) } });
            }
        }

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(100, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [pricing, total] = await Promise.all([
            YachtPricing.find(query)
                .skip(skip)
                .limit(limitNum)
                .sort({ startDate: 1 }),
            YachtPricing.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: pricing,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum)
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
 * @swagger
 * /api/yacht-pricing/{id}:
 *   get:
 *     summary: Get yacht pricing by ID
 *     description: Retrieve specific yacht pricing details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Pricing ID
 *     responses:
 *       200:
 *         description: Yacht pricing details
 *       404:
 *         description: Pricing not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    try {
        const pricing = await YachtPricing.findOne({ id: Number(req.params.id) })
            .populate({
                path: 'yachtId',
                select: 'id name',
                model: 'Yacht'
            });

        if (!pricing) {
            return res.status(404).json({
                success: false,
                message: 'Pricing not found'
            });
        }

        res.json({
            success: true,
            data: pricing
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

/**
 * @swagger
 * /api/yacht-pricing/yacht/{yachtId}:
 *   get:
 *     summary: Get all pricing for a specific yacht
 *     description: Retrieve all pricing periods for a specific yacht
 *     parameters:
 *       - in: path
 *         name: yachtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Yacht ID
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *     responses:
 *       200:
 *         description: List of pricing for the yacht
 *       404:
 *         description: Yacht not found
 *       500:
 *         description: Server error
 */
router.get('/yacht/:yachtId', async (req, res) => {
    try {
        const { yachtId } = req.params;
        const { year } = req.query;

        // Check if yacht exists
        const yacht = await Yacht.findOne({ id: Number(yachtId) });
        if (!yacht) {
            return res.status(404).json({
                success: false,
                message: 'Yacht not found'
            });
        }

        const query: any = { yachtId: Number(yachtId), isActive: true };
        
        if (year) {
            const yearNum = Number(year);
            query.startDate = {
                $gte: new Date(yearNum, 0, 1),
                $lt: new Date(yearNum + 1, 0, 1)
            };
        }

        const pricing = await YachtPricing.find(query)
            .sort({ startDate: 1 });

        // Calculate pricing statistics
        const stats = {
            totalPeriods: pricing.length,
            minPrice: Math.min(...pricing.map(p => p.weeklyPrice)),
            maxPrice: Math.max(...pricing.map(p => p.weeklyPrice)),
            avgPrice: pricing.reduce((sum, p) => sum + p.weeklyPrice, 0) / pricing.length,
            totalDays: pricing.reduce((sum, p) => {
                const days = Math.ceil((p.endDate.getTime() - p.startDate.getTime()) / (1000 * 60 * 60 * 24));
                return sum + days;
            }, 0)
        };

        res.json({
            success: true,
            data: {
                yachtId: Number(yachtId),
                yachtName: yacht.name,
                pricing,
                statistics: stats
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
 * @swagger
 * /api/yacht-pricing/calculate:
 *   get:
 *     summary: Calculate yacht pricing for a date range
 *     description: Calculate total cost for a yacht charter in a specific date range
 *     parameters:
 *       - in: query
 *         name: yachtId
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
 *         description: Charter start date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Charter end date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Calculated pricing for the date range
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: Yacht not found
 *       500:
 *         description: Server error
 */
router.get('/calculate', async (req, res) => {
    try {
        const { yachtId, startDate, endDate } = req.query;

        if (!yachtId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'yachtId, startDate, and endDate are required'
            });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date range'
            });
        }

        // Check if yacht exists
        const yacht = await Yacht.findOne({ id: Number(yachtId) });
        if (!yacht) {
            return res.status(404).json({
                success: false,
                message: 'Yacht not found'
            });
        }

        // Find pricing periods that overlap with the requested date range
        const pricingPeriods = await YachtPricing.find({
            yachtId: Number(yachtId),
            isActive: true,
            $or: [
                { startDate: { $lte: end }, endDate: { $gte: start } }
            ]
        }).sort({ startDate: 1 });

        if (pricingPeriods.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No pricing available for the requested date range'
            });
        }

        // Calculate cost for each overlapping period
        const costBreakdown = [];
        let totalCost = 0;

        for (const period of pricingPeriods) {
            const periodStart = new Date(Math.max(start.getTime(), period.startDate.getTime()));
            const periodEnd = new Date(Math.min(end.getTime(), period.endDate.getTime()));
            const days = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
            const weeks = Math.ceil(days / 7);
            const periodCost = weeks * period.weeklyPrice;

            costBreakdown.push({
                period: period.period,
                startDate: periodStart.toISOString().split('T')[0],
                endDate: periodEnd.toISOString().split('T')[0],
                days,
                weeks,
                weeklyPrice: period.weeklyPrice,
                totalCost: periodCost,
                currency: period.currency,
                discount: period.discount,
                discountType: period.discountType
            });

            totalCost += periodCost;
        }

        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.ceil(totalDays / 7);

        res.json({
            success: true,
            data: {
                yachtId: Number(yachtId),
                yachtName: yacht.name,
                dateRange: {
                    startDate: startDate,
                    endDate: endDate,
                    totalDays,
                    totalWeeks
                },
                costBreakdown,
                totalCost,
                currency: pricingPeriods[0]?.currency || 'EUR'
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
