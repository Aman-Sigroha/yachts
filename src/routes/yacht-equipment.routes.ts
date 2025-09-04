import express from 'express';
import { YachtEquipment } from '../models/yacht-equipment';
import { Yacht } from '../models/yacht';

const router = express.Router();

/**
 * @swagger
 * /api/yacht-equipment:
 *   get:
 *     summary: Get yacht equipment with filtering
 *     description: Retrieve yacht equipment with comprehensive filtering and pagination
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
 *         description: Filter by equipment category
 *       - in: query
 *         name: isStandard
 *         schema:
 *           type: boolean
 *         description: Filter for standard equipment only
 *       - in: query
 *         name: isOptional
 *         schema:
 *           type: boolean
 *         description: Filter for optional equipment only
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page (default 20, max 100)
 *     responses:
 *       200:
 *         description: List of yacht equipment with pagination
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const {
            yachtId,
            category,
            isStandard,
            isOptional,
            page = 1,
            limit = 20
        } = req.query;

        const query: any = {};

        if (yachtId) query.yachtId = Number(yachtId);
        if (category) query.category = category;
        if (isStandard !== undefined) query.isStandard = isStandard === 'true' || isStandard === '1';
        if (isOptional !== undefined) query.isOptional = isOptional === 'true' || isOptional === '1';

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(100, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [equipment, total] = await Promise.all([
            YachtEquipment.find(query)
                .skip(skip)
                .limit(limitNum)
                .sort({ category: 1, name: 1 }),
            YachtEquipment.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: equipment,
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
 * /api/yacht-equipment/{id}:
 *   get:
 *     summary: Get yacht equipment by ID
 *     description: Retrieve specific yacht equipment details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment ID
 *     responses:
 *       200:
 *         description: Yacht equipment details
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    try {
        const equipment = await YachtEquipment.findOne({ id: Number(req.params.id) });

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        res.json({
            success: true,
            data: equipment
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
 * /api/yacht-equipment/yacht/{yachtId}:
 *   get:
 *     summary: Get all equipment for a specific yacht
 *     description: Retrieve all equipment (standard and optional) for a specific yacht
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
 *         description: Filter by equipment category
 *     responses:
 *       200:
 *         description: List of equipment for the yacht
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

        const equipment = await YachtEquipment.find(query)
            .sort({ category: 1, isStandard: -1, name: 1 });

        // Group equipment by category
        const groupedEquipment = equipment.reduce((acc: any, item) => {
            const cat = item.category;
            if (!acc[cat]) {
                acc[cat] = {
                    standard: [],
                    optional: []
                };
            }
            if (item.isStandard) {
                acc[cat].standard.push(item);
            } else {
                acc[cat].optional.push(item);
            }
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                yachtId: Number(yachtId),
                yachtName: yacht.name,
                equipment: groupedEquipment,
                totalItems: equipment.length
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
 * /api/yacht-equipment/categories:
 *   get:
 *     summary: Get available equipment categories
 *     description: Retrieve list of all equipment categories with counts
 *     responses:
 *       200:
 *         description: List of equipment categories
 *       500:
 *         description: Server error
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await YachtEquipment.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    standardCount: {
                        $sum: { $cond: [{ $eq: ['$isStandard', true] }, 1, 0] }
                    },
                    optionalCount: {
                        $sum: { $cond: [{ $eq: ['$isOptional', true] }, 1, 0] }
                    }
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
                standardCount: cat.standardCount,
                optionalCount: cat.optionalCount
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
