import express from 'express';
import { Yacht } from '../models/yacht';

const router = express.Router();

/**
 * @openapi
 * /api/yachts:
 *   get:
 *     summary: Get yachts
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *       - in: query
 *         name: builder
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minLength
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxLength
 *         schema:
 *           type: number
 *       - in: query
 *         name: minCabins
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxCabins
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Yachts list
 */
// Get all yachts with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const {
            category,
            builder,
            minLength,
            maxLength,
            minCabins,
            maxCabins,
            year,
            page = 1,
            limit = 10
        } = req.query;

        const query: any = {};

        // Add filters if provided
        if (category) {
            query.categoryId = Number(category);
        }
        if (builder) {
            query.builderId = Number(builder);
        }
        if (minLength || maxLength) {
            query.length = {};
            if (minLength) {
                query.length.$gte = Number(minLength);
            }
            if (maxLength) {
                query.length.$lte = Number(maxLength);
            }
        }
        if (minCabins || maxCabins) {
            query.cabins = {};
            if (minCabins) {
                query.cabins.$gte = Number(minCabins);
            }
            if (maxCabins) {
                query.cabins.$lte = Number(maxCabins);
            }
        }
        if (year) {
            query.year = Number(year);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [yachts, total] = await Promise.all([
            Yacht.find(query)
                .skip(skip)
                .limit(Number(limit))
                .sort({ length: -1 }),
            Yacht.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: yachts,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
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
 * /api/yachts/{id}:
 *   get:
 *     summary: Get yacht by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Yacht
 *       404:
 *         description: Not found
 */
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

// Get yacht statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await Yacht.aggregate([
            {
                $group: {
                    _id: '$categoryId',
                    count: { $sum: 1 },
                    avgLength: { $avg: '$length' },
                    avgCabins: { $avg: '$cabins' },
                    avgYear: { $avg: '$year' }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Search yachts
router.get('/search/query', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const yachts = await Yacht.find({
            $or: [
                { 'name.textEN': { $regex: q, $options: 'i' } },
                { 'description.textEN': { $regex: q, $options: 'i' } }
            ]
        }).limit(10);

        res.json({
            success: true,
            data: yachts
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
