import express from 'express';
import { Contact } from '../models/contact';

const router = express.Router();

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get contacts
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: company
 *         schema:
 *           type: boolean
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
 *         description: Contacts list
 */
// Get all contacts with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const {
            name,
            email,
            company,
            page = 1,
            limit = 10
        } = req.query;

        const query: any = {};

        // Add filters if provided
        if (name) {
            query.$or = [
                { name: { $regex: name, $options: 'i' } },
                { surname: { $regex: name, $options: 'i' } }
            ];
        }
        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }
        if (company !== undefined) {
            query.company = company === 'true';
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [contacts, total] = await Promise.all([
            Contact.find(query)
                .skip(skip)
                .limit(Number(limit))
                .sort({ lastModifyTime: -1 }),
            Contact.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: contacts,
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
 * /api/contacts/{id}:
 *   get:
 *     summary: Get contact by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact
 *       404:
 *         description: Not found
 */
// Get contact by ID
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findOne({ id: Number(req.params.id) });
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        res.json({
            success: true,
            data: contact
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Search contacts
router.get('/search/query', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const contacts = await Contact.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { surname: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
                { phone: { $regex: q, $options: 'i' } }
            ]
        }).limit(10);

        res.json({
            success: true,
            data: contacts
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get contact statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await Contact.aggregate([
            {
                $group: {
                    _id: '$company',
                    count: { $sum: 1 },
                    withEmail: {
                        $sum: {
                            $cond: [{ $ne: ['$email', null] }, 1, 0]
                        }
                    },
                    withPhone: {
                        $sum: {
                            $cond: [{ $ne: ['$phone', null] }, 1, 0]
                        }
                    }
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
