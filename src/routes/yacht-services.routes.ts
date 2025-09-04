import express from 'express';
import { YachtService } from '../models/yacht-services';
import { Yacht } from '../models/yacht';

const router = express.Router();

/**
 * @swagger
 * /api/yacht-services:
 *   get:
 *     summary: Get yacht services with filtering
 *     description: Retrieve yacht services with comprehensive filtering and pagination
 *     parameters:
 *       - in: query
 *         name: yachtId
 *         schema:
 *           type: integer
 *         description: Filter by yacht ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by service category
 *       - in: query
 *         name: isObligatory
 *         schema:
 *           type: boolean
 *         description: Filter for obligatory services only
 *       - in: query
 *         name: isOptional
 *         schema:
 *           type: boolean
 *         description: Filter for optional services only
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
 *         description: List of yacht services with pagination
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const {
            yachtId,
            category,
            isObligatory,
            isOptional,
            page = 1,
            limit = 20
        } = req.query;

        const query: any = {};

        if (yachtId) query.yachtId = Number(yachtId);
        if (category) query.category = category;
        if (isObligatory !== undefined) query.isObligatory = isObligatory === 'true' || isObligatory === '1';
        if (isOptional !== undefined) query.isOptional = isOptional === 'true' || isOptional === '1';

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(100, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [services, total] = await Promise.all([
            YachtService.find(query)
                .skip(skip)
                .limit(limitNum)
                .sort({ category: 1, price: 1 }),
            YachtService.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: services,
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
 * /api/yacht-services/{id}:
 *   get:
 *     summary: Get yacht service by ID
 *     description: Retrieve specific yacht service details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Yacht service details
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    try {
        const service = await YachtService.findOne({ id: Number(req.params.id) })
            .populate({
                path: 'yachtId',
                select: 'id name',
                model: 'Yacht'
            });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.json({
            success: true,
            data: service
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
 * /api/yacht-services/yacht/{yachtId}:
 *   get:
 *     summary: Get all services for a specific yacht
 *     description: Retrieve all services (obligatory and optional) for a specific yacht
 *     parameters:
 *       - in: path
 *         name: yachtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Yacht ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by service category
 *     responses:
 *       200:
 *         description: List of services for the yacht
 *       404:
 *         description: Yacht not found
 *       500:
 *         description: Server error
 */
router.get('/yacht/:yachtId', async (req, res) => {
    try {
        const { yachtId } = req.params;
        const { category } = req.query;

        // Check if yacht exists
        const yacht = await Yacht.findOne({ id: Number(yachtId) });
        if (!yacht) {
            return res.status(404).json({
                success: false,
                message: 'Yacht not found'
            });
        }

        const query: any = { yachtId: Number(yachtId) };
        if (category) query.category = category;

        const services = await YachtService.find(query)
            .sort({ category: 1, isObligatory: -1, price: 1 });

        // Group services by category
        const groupedServices = services.reduce((acc: any, item) => {
            const cat = item.category;
            if (!acc[cat]) {
                acc[cat] = {
                    obligatory: [],
                    optional: []
                };
            }
            if (item.isObligatory) {
                acc[cat].obligatory.push(item);
            } else {
                acc[cat].optional.push(item);
            }
            return acc;
        }, {});

        // Calculate total costs
        const totalObligatoryCost = services
            .filter(s => s.isObligatory)
            .reduce((sum, s) => sum + s.price, 0);

        const totalOptionalCost = services
            .filter(s => s.isOptional)
            .reduce((sum, s) => sum + s.price, 0);

        res.json({
            success: true,
            data: {
                yachtId: Number(yachtId),
                yachtName: yacht.name,
                services: groupedServices,
                totalItems: services.length,
                costSummary: {
                    totalObligatoryCost,
                    totalOptionalCost,
                    totalCost: totalObligatoryCost + totalOptionalCost
                }
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
 * /api/yacht-services/categories:
 *   get:
 *     summary: Get available service categories
 *     description: Retrieve list of all service categories with counts and price ranges
 *     responses:
 *       200:
 *         description: List of service categories
 *       500:
 *         description: Server error
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await YachtService.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    obligatoryCount: {
                        $sum: { $cond: [{ $eq: ['$isObligatory', true] }, 1, 0] }
                    },
                    optionalCount: {
                        $sum: { $cond: [{ $eq: ['$isOptional', true] }, 1, 0] }
                    },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    avgPrice: { $avg: '$price' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.json({
            success: true,
            data: categories.map(cat => ({
                category: cat._id,
                totalCount: cat.count,
                obligatoryCount: cat.obligatoryCount,
                optionalCount: cat.optionalCount,
                priceRange: {
                    min: cat.minPrice,
                    max: cat.maxPrice,
                    average: Math.round(cat.avgPrice * 100) / 100
                }
            }))
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
