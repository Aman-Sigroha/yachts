import express from 'express';
import { Reservation } from '../models/reservation';

const router = express.Router();

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get reservations
 *     parameters:
 *       - in: query
 *         name: yachtId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
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
 *         description: Reservations list
 */
// Get all reservations with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const {
            yachtId,
            startDate,
            endDate,
            status,
            page = 1,
            limit = 10
        } = req.query;

        const query: any = {};

        // Add filters if provided
        if (yachtId) {
            query.yachtId = Number(yachtId);
        }
        if (status) {
            query.reservationType = status;
        }
        if (startDate || endDate) {
            query.periodFrom = {};
            if (startDate) {
                query.periodFrom.$gte = new Date(startDate as string);
            }
            if (endDate) {
                query.periodFrom.$lte = new Date(endDate as string);
            }
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [reservations, total] = await Promise.all([
            Reservation.find(query)
                .skip(skip)
                .limit(Number(limit))
                .sort({ periodFrom: -1 }),
            Reservation.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: reservations,
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
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Get reservation by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation
 *       404:
 *         description: Not found
 */
// Get reservation by ID
router.get('/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findOne({ id: Number(req.params.id) });
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }
        res.json({
            success: true,
            data: reservation
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
 * /api/reservations/availability/{yachtId}:
 *   get:
 *     summary: Get yacht availability
 *     parameters:
 *       - in: path
 *         name: yachtId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Availability list
 */
// Get yacht availability
router.get('/availability/:yachtId', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        const reservations = await Reservation.find({
            yachtId: Number(req.params.yachtId),
            $or: [
                {
                    periodFrom: {
                        $gte: new Date(startDate as string),
                        $lte: new Date(endDate as string)
                    }
                },
                {
                    periodTo: {
                        $gte: new Date(startDate as string),
                        $lte: new Date(endDate as string)
                    }
                }
            ]
        }).sort({ periodFrom: 1 });

        res.json({
            success: true,
            data: reservations
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get reservation statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query: any = {};
        if (startDate || endDate) {
            query.periodFrom = {};
            if (startDate) {
                query.periodFrom.$gte = new Date(startDate as string);
            }
            if (endDate) {
                query.periodFrom.$lte = new Date(endDate as string);
            }
        }

        const stats = await Reservation.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$reservationType',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$priceListPrice' },
                    averageAmount: { $avg: '$priceListPrice' }
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

export default router;
