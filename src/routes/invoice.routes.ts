import express from 'express';
import { Invoice } from '../models/invoice';

const router = express.Router();

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get invoices
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [base, agency, owner]
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
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoices list
 */
// Get all invoices with optional filtering
router.get('/', async (req, res) => {
    try {
        const {
            type,
            startDate,
            endDate,
            page = 1,
            limit = 10
        } = req.query;

        const query: any = {};

        // Add filters if provided
        if (type) {
            query.invoiceType = type;
        }
        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate as string);
            }
            if (endDate) {
                query.date.$lte = new Date(endDate as string);
            }
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [invoices, total] = await Promise.all([
            Invoice.find(query)
                .skip(skip)
                .limit(Number(limit))
                .sort({ date: -1 }),
            Invoice.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: invoices,
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
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice
 *       404:
 *         description: Not found
 */
// Get invoice by ID
router.get('/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ id: Number(req.params.id) });
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }
        res.json({
            success: true,
            data: invoice
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
 * /api/invoices/stats/summary:
 *   get:
 *     summary: Get invoice stats
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Stats
 */
// Get invoice statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query: any = {};
        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate as string);
            }
            if (endDate) {
                query.date.$lte = new Date(endDate as string);
            }
        }

        const stats = await Invoice.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$invoiceType',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' },
                    totalVat: { $sum: '$totalVatAmount' },
                    averageAmount: { $avg: '$totalAmount' }
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
