import express from 'express';
import { YachtRating } from '../models/yacht-ratings';
import { Yacht } from '../models/yacht';

const router = express.Router();

/**
 * @swagger
 * /api/yacht-ratings:
 *   get:
 *     summary: Get yacht ratings with filtering
 *     description: Retrieve yacht ratings with comprehensive filtering and pagination
 *     parameters:
 *       - in: query
 *         name: yachtId
 *         schema:
 *           type: integer
 *         description: Filter by yacht ID
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filter by rating source (euminia, mysea, internal, etc.)
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum overall rating (1-5)
 *       - in: query
 *         name: maxRating
 *         schema:
 *           type: number
 *         description: Maximum overall rating (1-5)
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter for published ratings only
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
 *         description: List of yacht ratings with pagination
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const {
            yachtId,
            source,
            minRating,
            maxRating,
            isPublished,
            page = 1,
            limit = 20
        } = req.query;

        const query: any = {};

        if (yachtId) query.yachtId = Number(yachtId);
        if (source) query.source = source;
        if (isPublished !== undefined) query.isPublished = isPublished === 'true' || isPublished === '1';
        if (minRating || maxRating) {
            query['ratings.overall'] = {};
            if (minRating) query['ratings.overall'].$gte = Number(minRating);
            if (maxRating) query['ratings.overall'].$lte = Number(maxRating);
        }

        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.min(100, Math.max(1, Number(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [ratings, total] = await Promise.all([
            YachtRating.find(query)
                .skip(skip)
                .limit(limitNum)
                .sort({ reviewDate: -1 }),
            YachtRating.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: ratings,
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
 * /api/yacht-ratings/{id}:
 *   get:
 *     summary: Get yacht rating by ID
 *     description: Retrieve specific yacht rating details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Rating ID
 *     responses:
 *       200:
 *         description: Yacht rating details
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
    try {
        const rating = await YachtRating.findOne({ id: Number(req.params.id) });

        if (!rating) {
            return res.status(404).json({
                success: false,
                message: 'Rating not found'
            });
        }

        res.json({
            success: true,
            data: rating
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
 * /api/yacht-ratings/yacht/{yachtId}:
 *   get:
 *     summary: Get all ratings for a specific yacht
 *     description: Retrieve all ratings for a specific yacht with summary statistics
 *     parameters:
 *       - in: path
 *         name: yachtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Yacht ID
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filter by rating source
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Number of recent ratings to return (default: 10)"
 *     responses:
 *       200:
 *         description: List of ratings for the yacht with summary
 *       404:
 *         description: Yacht not found
 *       500:
 *         description: Server error
 */
router.get('/yacht/:yachtId', async (req, res) => {
    try {
        const { yachtId } = req.params;
        const { source, limit = 10 } = req.query;

        // Check if yacht exists
        const yacht = await Yacht.findOne({ id: Number(yachtId) });
        if (!yacht) {
            return res.status(404).json({
                success: false,
                message: 'Yacht not found'
            });
        }

        const query: any = { yachtId: Number(yachtId), isPublished: true };
        if (source) query.source = source;

        const ratings = await YachtRating.find(query)
            .sort({ reviewDate: -1 })
            .limit(Number(limit));

        // Calculate summary statistics
        const allRatings = await YachtRating.find({ yachtId: Number(yachtId), isPublished: true });
        
        const summary = {
            totalReviews: allRatings.length,
            averageRatings: {
                cleanliness: 0,
                equipment: 0,
                personalService: 0,
                pricePerformance: 0,
                recommendation: 0,
                overall: 0
            },
            ratingDistribution: {
                '5': 0,
                '4': 0,
                '3': 0,
                '2': 0,
                '1': 0
            },
            sources: {} as Record<string, number>
        };

        if (allRatings.length > 0) {
            // Calculate averages
            summary.averageRatings.cleanliness = allRatings.reduce((sum, r) => sum + r.ratings.cleanliness, 0) / allRatings.length;
            summary.averageRatings.equipment = allRatings.reduce((sum, r) => sum + r.ratings.equipment, 0) / allRatings.length;
            summary.averageRatings.personalService = allRatings.reduce((sum, r) => sum + r.ratings.personalService, 0) / allRatings.length;
            summary.averageRatings.pricePerformance = allRatings.reduce((sum, r) => sum + r.ratings.pricePerformance, 0) / allRatings.length;
            summary.averageRatings.recommendation = allRatings.reduce((sum, r) => sum + r.ratings.recommendation, 0) / allRatings.length;
            summary.averageRatings.overall = allRatings.reduce((sum, r) => sum + r.ratings.overall, 0) / allRatings.length;

            // Calculate rating distribution
            allRatings.forEach(rating => {
                const overall = Math.round(rating.ratings.overall);
                if (overall >= 1 && overall <= 5) {
                    summary.ratingDistribution[overall.toString() as keyof typeof summary.ratingDistribution]++;
                }
            });

            // Calculate source distribution
            allRatings.forEach(rating => {
                if (!summary.sources[rating.source]) {
                    summary.sources[rating.source] = 0;
                }
                summary.sources[rating.source]++;
            });
        }

        res.json({
            success: true,
            data: {
                yachtId: Number(yachtId),
                yachtName: yacht.name,
                recentRatings: ratings,
                summary
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
 * /api/yacht-ratings/summary:
 *   get:
 *     summary: Get yacht ratings summary
 *     description: Retrieve summary statistics for yacht ratings across all yachts
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filter by rating source
 *       - in: query
 *         name: minReviews
 *         schema:
 *           type: integer
 *         description: Minimum number of reviews required
 *     responses:
 *       200:
 *         description: Yacht ratings summary statistics
 *       500:
 *         description: Server error
 */
router.get('/summary', async (req, res) => {
    try {
        const { source, minReviews = 1 } = req.query;

        const matchQuery: any = { isPublished: true };
        if (source) matchQuery.source = source;

        const summary = await YachtRating.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$yachtId',
                    totalReviews: { $sum: 1 },
                    avgCleanliness: { $avg: '$ratings.cleanliness' },
                    avgEquipment: { $avg: '$ratings.equipment' },
                    avgPersonalService: { $avg: '$ratings.personalService' },
                    avgPricePerformance: { $avg: '$ratings.pricePerformance' },
                    avgRecommendation: { $avg: '$ratings.recommendation' },
                    avgOverall: { $avg: '$ratings.overall' },
                    lastReviewDate: { $max: '$reviewDate' }
                }
            },
            { $match: { totalReviews: { $gte: Number(minReviews) } } },
            { $sort: { avgOverall: -1 } }
        ]);

        // Get yacht names for the summary
        const yachtIds = summary.map(s => s._id);
        const yachts = await Yacht.find({ id: { $in: yachtIds } }).select('id name');

        const yachtMap = yachts.reduce((acc: any, yacht) => {
            acc[yacht.id] = yacht.name;
            return acc;
        }, {});

        const enrichedSummary = summary.map(item => ({
            yachtId: item._id,
            yachtName: yachtMap[item._id] || 'Unknown',
            totalReviews: item.totalReviews,
            averageRatings: {
                cleanliness: Math.round(item.avgCleanliness * 10) / 10,
                equipment: Math.round(item.avgEquipment * 10) / 10,
                personalService: Math.round(item.avgPersonalService * 10) / 10,
                pricePerformance: Math.round(item.avgPricePerformance * 10) / 10,
                recommendation: Math.round(item.avgRecommendation * 10) / 10,
                overall: Math.round(item.avgOverall * 10) / 10
            },
            lastReviewDate: item.lastReviewDate
        }));

        res.json({
            success: true,
            data: {
                totalYachts: enrichedSummary.length,
                summary: enrichedSummary
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
