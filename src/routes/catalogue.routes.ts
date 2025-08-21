import express from 'express';
import { 
    YachtCategory, 
    YachtBuilder, 
    Base, 
    Country, 
    CharterCompany,
    Equipment,
    Region,
    Location
} from '../models/catalogue';
import { Yacht } from '../models/yacht';

const router = express.Router();

/**
 * @openapi
 * /api/catalogue/filters:
 *   get:
 *     summary: Get all available filter options for yacht search
 *     description: Returns comprehensive catalogue data including categories, builders, bases, countries, and available value ranges for yacht filtering
 *     responses:
 *       200:
 *         description: Complete filter catalogue data
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
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           name:
 *                             type: object
 *                             properties:
 *                               textEN:
 *                                 type: string
 *                               textDE:
 *                                 type: string
 *                               textFR:
 *                                 type: string
 *                               textIT:
 *                                 type: string
 *                               textES:
 *                                 type: string
 *                               textHR:
 *                                 type: string
 *                     builders:
 *                       type: array
 *                       items:
 *                         type: object
 *                     bases:
 *                       type: array
 *                       items:
 *                         type: object
 *                     countries:
 *                       type: array
 *                       items:
 *                         type: object
 *                     charterCompanies:
 *                       type: array
 *                       items:
 *                         type: object
 *                     ranges:
 *                       type: object
 *                       properties:
 *                         length:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                         cabins:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                         berths:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                         year:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                         beam:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                         draft:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                         enginePower:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                         deposit:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                         toilets:
 *                           type: object
 *                           properties:
 *                             min:
 *                               type: number
 *                             max:
 *                               type: number
 *                     fuelTypes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Available fuel types
 *                     premiumStatus:
 *                       type: object
 *                       properties:
 *                         isPremium:
 *                           type: boolean
 *                         premiumCount:
 *                           type: number
 *                     saleStatus:
 *                       type: object
 *                       properties:
 *                         onSale:
 *                           type: boolean
 *                         saleCount:
 *                           type: number
 */
// Get comprehensive filter catalogue data
router.get('/filters', async (req, res) => {
    try {
        // Get all catalogue data in parallel
        const [
            categories,
            builders,
            bases,
            countries,
            charterCompanies,
            equipment
        ] = await Promise.all([
            YachtCategory.find().sort({ 'name.textEN': 1 }),
            YachtBuilder.find().sort({ 'name.textEN': 1 }),
            Base.find({ disabled: false }).sort({ 'name.textEN': 1 }),
            Country.find().sort({ 'name.textEN': 1 }),
            CharterCompany.find({ disabled: false }).sort({ 'name.textEN': 1 }),
            Equipment.find().sort({ 'name.textEN': 1 })
        ]);

        // Get value ranges from yacht data
        const yachtRanges = await Yacht.aggregate([
            {
                $group: {
                    _id: null,
                    minLength: { $min: '$length' },
                    maxLength: { $max: '$length' },
                    minCabins: { $min: '$cabins' },
                    maxCabins: { $max: '$cabins' },
                    minBerths: { $min: '$berths' },
                    maxBerths: { $max: '$berths' },
                    minYear: { $min: '$year' },
                    maxYear: { $max: '$year' },
                    minBeam: { $min: '$beam' },
                    maxBeam: { $max: '$beam' },
                    minDraft: { $min: '$draft' },
                    maxDraft: { $max: '$draft' },
                    minEnginePower: { $min: '$enginePower' },
                    maxEnginePower: { $max: '$enginePower' },
                    minDeposit: { $min: '$deposit' },
                    maxDeposit: { $max: '$deposit' },
                    minToilets: { $min: '$wc' },
                    maxToilets: { $max: '$wc' }
                }
            }
        ]);

        // Get toilets range separately to handle null values properly
        const toiletsRange = await Yacht.aggregate([
            { $match: { wc: { $exists: true, $ne: null, $type: "number" } } },
            {
                $group: {
                    _id: null,
                    minToilets: { $min: '$wc' },
                    maxToilets: { $max: '$wc' }
                }
            }
        ]);

        // Get unique fuel types
        const fuelTypes = await Yacht.distinct('fuelType').then(types => 
            types.filter(type => type && type.trim() !== '').sort()
        );

        // Get premium and sale status counts
        const [premiumCount, onSaleCount] = await Promise.all([
            Yacht.countDocuments({ isPremium: true }),
            Yacht.countDocuments({ onSale: true })
        ]);

        // Get unique years for year filter
        const years = await Yacht.distinct('year');
        const sortedYears = years.sort((a, b) => b - a); // Most recent first

        // Get yacht counts for each category
        const categoryCounts = await Yacht.aggregate([
            {
                $group: {
                    _id: '$categoryId',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get yacht counts for each builder
        const builderCounts = await Yacht.aggregate([
            {
                $group: {
                    _id: '$builderId',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get yacht counts for each base
        const baseCounts = await Yacht.aggregate([
            {
                $group: {
                    _id: '$baseId',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get yacht counts for each charter company
        const companyCounts = await Yacht.aggregate([
            {
                $group: {
                    _id: '$charterCompanyId',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Create a map for quick lookup
        const countsMap = {
            categories: Object.fromEntries(categoryCounts.map(c => [c._id, c.count])),
            builders: Object.fromEntries(builderCounts.map(b => [b._id, b.count])),
            bases: Object.fromEntries(baseCounts.map(b => [b._id, b.count])),
            charterCompanies: Object.fromEntries(companyCounts.map(c => [c._id, c.count]))
        };

        // Add counts to catalogue data
        const categoriesWithCounts = categories.map(cat => ({
            ...cat.toObject(),
            yachtCount: countsMap.categories[cat.id] || 0
        }));

        const buildersWithCounts = builders.map(builder => ({
            ...builder.toObject(),
            yachtCount: countsMap.builders[builder.id] || 0
        }));

        const basesWithCounts = bases.map(base => ({
            ...base.toObject(),
            yachtCount: countsMap.bases[base.id] || 0
        }));

        const charterCompaniesWithCounts = charterCompanies.map(company => ({
            ...company.toObject(),
            yachtCount: countsMap.charterCompanies[company.id] || 0
        }));

        // Structure the response
        const filterData = {
            categories: categoriesWithCounts,
            builders: buildersWithCounts,
            bases: basesWithCounts,
            countries: countries,
            charterCompanies: charterCompaniesWithCounts,
            equipment: equipment,
            years: sortedYears,
            ranges: yachtRanges[0] ? {
                length: {
                    min: Math.floor(yachtRanges[0].minLength),
                    max: Math.ceil(yachtRanges[0].maxLength)
                },
                cabins: {
                    min: yachtRanges[0].minCabins,
                    max: yachtRanges[0].maxCabins
                },
                berths: {
                    min: yachtRanges[0].minBerths,
                    max: yachtRanges[0].maxBerths
                },
                year: {
                    min: yachtRanges[0].minYear,
                    max: yachtRanges[0].maxYear
                },
                beam: {
                    min: Math.round(yachtRanges[0].minBeam * 10) / 10,
                    max: Math.round(yachtRanges[0].maxBeam * 10) / 10
                },
                draft: {
                    min: Math.round(yachtRanges[0].minDraft * 10) / 10,
                    max: Math.round(yachtRanges[0].maxDraft * 10) / 10
                },
                enginePower: {
                    min: yachtRanges[0].minEnginePower,
                    max: yachtRanges[0].maxEnginePower
                },
                deposit: {
                    min: yachtRanges[0].minDeposit,
                    max: yachtRanges[0].maxDeposit
                },
                toilets: toiletsRange[0] ? {
                    min: toiletsRange[0].minToilets,
                    max: toiletsRange[0].maxToilets
                } : {
                    min: yachtRanges[0].minToilets,
                    max: yachtRanges[0].maxToilets
                }
            } : null,
            fuelTypes: fuelTypes,
            premiumStatus: {
                isPremium: premiumCount > 0,
                premiumCount: premiumCount
            },
            saleStatus: {
                onSale: onSaleCount > 0,
                saleCount: onSaleCount
            }
        };

        res.json({
            success: true,
            data: filterData,
            message: 'Filter catalogue data retrieved successfully'
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve filter catalogue data',
            error: error.message
        });
    }
});

/**
 * @openapi
 * /api/catalogue/filters/active:
 *   get:
 *     summary: Get only active filter options that have at least one yacht
 *     description: Returns catalogue data for filters that contain at least one yacht, excluding empty options
 *     responses:
 *       200:
 *         description: Active filter catalogue data with yacht counts
 */
router.get('/filters/active', async (req, res) => {
    try {
        // Get yacht counts for each category, builder, base, and charter company
        const [categoryCounts, builderCounts, baseCounts, companyCounts] = await Promise.all([
            Yacht.aggregate([
                {
                    $group: {
                        _id: '$categoryId',
                        count: { $sum: 1 }
                    }
                }
            ]),
            Yacht.aggregate([
                {
                    $group: {
                        _id: '$builderId',
                        count: { $sum: 1 }
                    }
                }
            ]),
            Yacht.aggregate([
                {
                    $group: {
                        _id: '$baseId',
                        count: { $sum: 1 }
                    }
                }
            ]),
            Yacht.aggregate([
                {
                    $group: {
                        _id: '$charterCompanyId',
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Create sets of active IDs (those with at least one yacht)
        const activeCategoryIds = new Set(categoryCounts.map(c => c._id));
        const activeBuilderIds = new Set(builderCounts.map(b => b._id));
        const activeBaseIds = new Set(baseCounts.map(b => b._id));
        const activeCompanyIds = new Set(companyCounts.map(c => c._id));

        // Get only active catalogue data
        const [categories, builders, bases, countries, charterCompanies, equipment] = await Promise.all([
            YachtCategory.find({ id: { $in: Array.from(activeCategoryIds) } }).sort({ 'name.textEN': 1 }),
            YachtBuilder.find({ id: { $in: Array.from(activeBuilderIds) } }).sort({ 'name.textEN': 1 }),
            Base.find({ id: { $in: Array.from(activeBaseIds) }, disabled: false }).sort({ 'name.textEN': 1 }),
            Country.find().sort({ 'name.textEN': 1 }), // Countries are always included as they're reference data
            CharterCompany.find({ id: { $in: Array.from(activeCompanyIds) }, disabled: false }).sort({ 'name.textEN': 1 }),
            Equipment.find().sort({ 'name.textEN': 1 }) // Equipment is always included as it's reference data
        ]);

        // Get value ranges from yacht data
        const yachtRanges = await Yacht.aggregate([
            {
                $group: {
                    _id: null,
                    minLength: { $min: '$length' },
                    maxLength: { $max: '$length' },
                    minCabins: { $min: '$cabins' },
                    maxCabins: { $max: '$cabins' },
                    minBerths: { $min: '$berths' },
                    maxBerths: { $max: '$berths' },
                    minYear: { $min: '$year' },
                    maxYear: { $max: '$year' },
                    minBeam: { $min: '$beam' },
                    maxBeam: { $max: '$beam' },
                    minDraft: { $min: '$draft' },
                    maxDraft: { $max: '$draft' },
                    minEnginePower: { $min: '$enginePower' },
                    maxEnginePower: { $max: '$enginePower' },
                    minDeposit: { $min: '$deposit' },
                    maxDeposit: { $max: '$deposit' },
                    minToilets: { $min: '$wc' },
                    maxToilets: { $max: '$wc' }
                }
            }
        ]);

        // Get toilets range separately to handle null values properly
        const toiletsRange = await Yacht.aggregate([
            { $match: { wc: { $exists: true, $ne: null, $type: "number" } } },
            {
                $group: {
                    _id: null,
                    minToilets: { $min: '$wc' },
                    maxToilets: { $max: '$wc' }
                }
            }
        ]);

        // Get unique fuel types
        const fuelTypes = await Yacht.distinct('fuelType').then(types => 
            types.filter(type => type && type.trim() !== '').sort()
        );

        // Get premium and sale status counts
        const [premiumCount, onSaleCount] = await Promise.all([
            Yacht.countDocuments({ isPremium: true }),
            Yacht.countDocuments({ onSale: true })
        ]);

        // Get unique years for year filter
        const years = await Yacht.distinct('year');
        const sortedYears = years.sort((a, b) => b - a); // Most recent first

        // Create a map for quick lookup
        const countsMap = {
            categories: Object.fromEntries(categoryCounts.map(c => [c._id, c.count])),
            builders: Object.fromEntries(builderCounts.map(b => [b._id, b.count])),
            bases: Object.fromEntries(baseCounts.map(b => [b._id, b.count])),
            charterCompanies: Object.fromEntries(companyCounts.map(c => [c._id, c.count]))
        };

        // Add counts to catalogue data
        const categoriesWithCounts = categories.map(cat => ({
            ...cat.toObject(),
            yachtCount: countsMap.categories[cat.id] || 0
        }));

        const buildersWithCounts = builders.map(builder => ({
            ...builder.toObject(),
            yachtCount: countsMap.builders[builder.id] || 0
        }));

        const basesWithCounts = bases.map(base => ({
            ...base.toObject(),
            yachtCount: countsMap.bases[base.id] || 0
        }));

        const charterCompaniesWithCounts = charterCompanies.map(company => ({
            ...company.toObject(),
            yachtCount: countsMap.charterCompanies[company.id] || 0
        }));

        // Structure the response
        const filterData = {
            categories: categoriesWithCounts,
            builders: buildersWithCounts,
            bases: basesWithCounts,
            countries: countries,
            charterCompanies: charterCompaniesWithCounts,
            equipment: equipment,
            years: sortedYears,
            ranges: yachtRanges[0] ? {
                length: {
                    min: Math.floor(yachtRanges[0].minLength),
                    max: Math.ceil(yachtRanges[0].maxLength)
                },
                cabins: {
                    min: yachtRanges[0].minCabins,
                    max: yachtRanges[0].maxCabins
                },
                berths: {
                    min: yachtRanges[0].minBerths,
                    max: yachtRanges[0].maxBerths
                },
                year: {
                    min: yachtRanges[0].minYear,
                    max: yachtRanges[0].maxYear
                },
                beam: {
                    min: Math.round(yachtRanges[0].minBeam * 10) / 10,
                    max: Math.round(yachtRanges[0].maxBeam * 10) / 10
                },
                draft: {
                    min: Math.round(yachtRanges[0].minDraft * 10) / 10,
                    max: Math.round(yachtRanges[0].maxDraft * 10) / 10
                },
                enginePower: {
                    min: yachtRanges[0].minEnginePower,
                    max: yachtRanges[0].maxEnginePower
                },
                deposit: {
                    min: yachtRanges[0].minDeposit,
                    max: yachtRanges[0].maxDeposit
                },
                toilets: toiletsRange[0] ? {
                    min: toiletsRange[0].minToilets,
                    max: toiletsRange[0].maxToilets
                } : {
                    min: yachtRanges[0].minToilets,
                    max: yachtRanges[0].maxToilets
                }
            } : null,
            fuelTypes: fuelTypes,
            premiumStatus: {
                isPremium: premiumCount > 0,
                premiumCount: premiumCount
            },
            saleStatus: {
                onSale: onSaleCount > 0,
                saleCount: onSaleCount
            }
        };

        res.json({
            success: true,
            data: filterData,
            message: 'Active filter catalogue data retrieved successfully',
            summary: {
                totalCategories: categoriesWithCounts.length,
                totalBuilders: buildersWithCounts.length,
                totalBases: basesWithCounts.length,
                totalCharterCompanies: charterCompaniesWithCounts.length,
                totalYears: sortedYears.length
            }
        });

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve active filter catalogue data',
            error: error.message
        });
    }
});

/**
 * @openapi
 * /api/catalogue/categories:
 *   get:
 *     summary: Get yacht categories
 *     responses:
 *       200:
 *         description: List of yacht categories
 */
router.get('/categories', async (req, res) => {
    try {
        const categories = await YachtCategory.find().sort({ 'name.textEN': 1 });
        
        // Get yacht counts for each category
        const categoryCounts = await Yacht.aggregate([
            {
                $group: {
                    _id: '$categoryId',
                    count: { $sum: 1 }
                }
            }
        ]);

        const countsMap = Object.fromEntries(categoryCounts.map(c => [c._id, c.count]));

        const categoriesWithCounts = categories.map(cat => ({
            ...cat.toObject(),
            yachtCount: countsMap[cat.id] || 0
        }));

        res.json({
            success: true,
            data: categoriesWithCounts
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
 * /api/catalogue/categories/active:
 *   get:
 *     summary: Get only yacht categories that have at least one yacht
 *     responses:
 *       200:
 *         description: List of active yacht categories with yacht counts
 */
router.get('/categories/active', async (req, res) => {
    try {
        // Get yacht counts for each category
        const categoryCounts = await Yacht.aggregate([
            {
                $group: {
                    _id: '$categoryId',
                    count: { $sum: 1 }
                }
            }
        ]);

        const activeCategoryIds = categoryCounts.map(c => c._id);
        const countsMap = Object.fromEntries(categoryCounts.map(c => [c._id, c.count]));

        // Get only categories with yachts
        const categories = await YachtCategory.find({ id: { $in: activeCategoryIds } }).sort({ 'name.textEN': 1 });

        const categoriesWithCounts = categories.map(cat => ({
            ...cat.toObject(),
            yachtCount: countsMap[cat.id] || 0
        }));

        res.json({
            success: true,
            data: categoriesWithCounts,
            summary: {
                totalCategories: categoriesWithCounts.length,
                totalYachts: Object.values(countsMap).reduce((sum: number, count: any) => sum + (count as number), 0)
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
 * /api/catalogue/builders:
 *   get:
 *     summary: Get yacht builders
 *     responses:
 *       200:
 *         description: List of yacht builders
 */
router.get('/builders', async (req, res) => {
    try {
        const builders = await YachtBuilder.find().sort({ 'name.textEN': 1 });
        
        // Get yacht counts for each builder
        const builderCounts = await Yacht.aggregate([
            {
                $group: {
                    _id: '$builderId',
                    count: { $sum: 1 }
                }
            }
        ]);

        const countsMap = Object.fromEntries(builderCounts.map(b => [b._id, b.count]));

        const buildersWithCounts = builders.map(builder => ({
            ...builder.toObject(),
            yachtCount: countsMap[builder.id] || 0
        }));

        res.json({
            success: true,
            data: buildersWithCounts
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
 * /api/catalogue/builders/active:
 *   get:
 *     summary: Get only yacht builders that have at least one yacht
 *     responses:
 *       200:
 *         description: List of active yacht builders with yacht counts
 */
router.get('/builders/active', async (req, res) => {
    try {
        // Get yacht counts for each builder
        const builderCounts = await Yacht.aggregate([
            {
                $group: {
                    _id: '$builderId',
                    count: { $sum: 1 }
                }
            }
        ]);

        const activeBuilderIds = builderCounts.map(b => b._id);
        const countsMap = Object.fromEntries(builderCounts.map(b => [b._id, b.count]));

        // Get only builders with yachts
        const builders = await YachtBuilder.find({ id: { $in: activeBuilderIds } }).sort({ 'name.textEN': 1 });

        const buildersWithCounts = builders.map(builder => ({
            ...builder.toObject(),
            yachtCount: countsMap[builder.id] || 0
        }));

        res.json({
            success: true,
            data: buildersWithCounts,
            summary: {
                totalBuilders: buildersWithCounts.length,
                totalYachts: Object.values(countsMap).reduce((sum: number, count: any) => sum + (count as number), 0)
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
 * /api/catalogue/bases:
 *   get:
 *     summary: Get charter bases
 *     responses:
 *       200:
 *         description: List of charter bases
 */
router.get('/bases', async (req, res) => {
    try {
        const bases = await Base.find({ disabled: false }).sort({ 'name.textEN': 1 });
        
        // Get yacht counts for each base
        const baseCounts = await Yacht.aggregate([
            {
                $group: {
                    _id: '$baseId',
                    count: { $sum: 1 }
                }
            }
        ]);

        const countsMap = Object.fromEntries(baseCounts.map(b => [b._id, b.count]));

        const basesWithCounts = bases.map(base => ({
            ...base.toObject(),
            yachtCount: countsMap[base.id] || 0
        }));

        res.json({
            success: true,
            data: basesWithCounts
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
 * /api/catalogue/bases/active:
 *   get:
 *     summary: Get only charter bases that have at least one yacht
 *     responses:
 *       200:
 *         description: List of active charter bases with yacht counts
 */
router.get('/bases/active', async (req, res) => {
    try {
        // Get yacht counts for each base
        const baseCounts = await Yacht.aggregate([
            {
                $group: {
                    _id: '$baseId',
                    count: { $sum: 1 }
                }
            }
        ]);

        const activeBaseIds = baseCounts.map(b => b._id);
        const countsMap = Object.fromEntries(baseCounts.map(b => [b._id, b.count]));

        // Get only bases with yachts
        const bases = await Base.find({ id: { $in: activeBaseIds }, disabled: false }).sort({ 'name.textEN': 1 });

        const basesWithCounts = bases.map(base => ({
            ...base.toObject(),
            yachtCount: countsMap[base.id] || 0
        }));

        res.json({
            success: true,
            data: basesWithCounts,
            summary: {
                totalBases: basesWithCounts.length,
                totalYachts: Object.values(countsMap).reduce((sum: number, count: any) => sum + (count as number), 0)
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
 * /api/catalogue/countries:
 *   get:
 *     summary: Get all countries with multi-language names
 *     description: Returns a list of all countries with names in multiple languages (EN, DE, FR, IT, ES, HR, CZ, HU, LT, LV, NL, NO, PL, RU, SE, SI, SK, TR)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Maximum number of countries to return (default: all)"
 *     responses:
 *       200:
 *         description: List of countries with multi-language names
 */
router.get('/countries', async (req, res) => {
    try {
        const countries = await Country.find().sort({ 'name.textEN': 1 });
        res.json({
            success: true,
            data: countries
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
 * /api/catalogue/regions:
 *   get:
 *     summary: Get all regions with multi-language names
 *     description: Returns a list of all regions with names in multiple languages (EN, DE, FR, IT, ES, HR, CZ, HU, LT, LV, NL, NO, PL, RU, SE, SI, SK, TR)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Maximum number of regions to return (default: all)"
 *     responses:
 *       200:
 *         description: List of regions with multi-language names
 */
router.get('/regions', async (req, res) => {
    try {
        const regions = await Region.find().sort({ 'name.textEN': 1 });
        res.json({
            success: true,
            data: regions
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
 * /api/catalogue/locations:
 *   get:
 *     summary: Get all locations/marinas with multi-language names
 *     description: Returns a list of all locations and marinas with names in multiple languages (EN, DE, FR, IT, ES, HR, CZ, HU, LT, LV, NL, NO, PL, RU, SE, SI, SK, TR)
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Maximum number of locations to return (default: all)"
 *     responses:
 *       200:
 *         description: List of locations/marinas with multi-language names
 */
router.get('/locations', async (req, res) => {
    try {
        const locations = await Location.find().sort({ 'name.textEN': 1 });
        res.json({
            success: true,
            data: locations
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
 * /api/catalogue/ranges:
 *   get:
 *     summary: Get available value ranges for yacht filters
 *     responses:
 *       200:
 *         description: Value ranges for yacht properties
 */
router.get('/ranges', async (req, res) => {
    try {
        const yachtRanges = await Yacht.aggregate([
            {
                $group: {
                    _id: null,
                    minLength: { $min: '$length' },
                    maxLength: { $max: '$length' },
                    minCabins: { $min: '$cabins' },
                    maxCabins: { $max: '$cabins' },
                    minBerths: { $min: '$berths' },
                    maxBerths: { $max: '$berths' },
                    minYear: { $min: '$year' },
                    maxYear: { $max: '$year' },
                    minBeam: { $min: '$beam' },
                    maxBeam: { $max: '$beam' },
                    minDraft: { $min: '$draft' },
                    maxDraft: { $max: '$draft' },
                    minEnginePower: { $min: '$enginePower' },
                    maxEnginePower: { $max: '$enginePower' },
                    minDeposit: { $min: '$deposit' },
                    maxDeposit: { $max: '$deposit' },
                    minToilets: { $min: '$wc' },
                    maxToilets: { $max: '$wc' }
                }
            }
        ]);

        const ranges = yachtRanges[0] ? {
            length: {
                min: Math.floor(yachtRanges[0].minLength),
                max: Math.ceil(yachtRanges[0].maxLength)
            },
            cabins: {
                min: yachtRanges[0].minCabins,
                max: yachtRanges[0].maxCabins
            },
            berths: {
                min: yachtRanges[0].minBerths,
                max: yachtRanges[0].maxBerths
            },
            year: {
                min: yachtRanges[0].minYear,
                max: yachtRanges[0].maxYear
            },
            beam: {
                min: Math.round(yachtRanges[0].minBeam * 10) / 10,
                max: Math.round(yachtRanges[0].maxBeam * 10) / 10
            },
            draft: {
                min: Math.round(yachtRanges[0].minDraft * 10) / 10,
                max: Math.round(yachtRanges[0].maxDraft * 10) / 10
            },
            enginePower: {
                min: yachtRanges[0].minEnginePower,
                max: yachtRanges[0].maxEnginePower
            },
            deposit: {
                min: yachtRanges[0].minDeposit,
                max: yachtRanges[0].maxDeposit
            },
            toilets: {
                min: yachtRanges[0].minToilets,
                max: yachtRanges[0].maxToilets
            }
        } : null;

        res.json({
            success: true,
            data: ranges
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
 * /api/catalogue/charter-companies/active:
 *   get:
 *     summary: Get only charter companies that have at least one yacht
 *     responses:
 *       200:
 *         description: List of active charter companies with yacht counts
 */
router.get('/charter-companies/active', async (req, res) => {
    try {
        // Get yacht counts for each charter company
        const companyCounts = await Yacht.aggregate([
            {
                $group: {
                    _id: '$charterCompanyId',
                    count: { $sum: 1 }
                }
            }
        ]);

        const activeCompanyIds = companyCounts.map(c => c._id);
        const countsMap = Object.fromEntries(companyCounts.map(c => [c._id, c.count]));

        // Get only companies with yachts
        const charterCompanies = await CharterCompany.find({ id: { $in: activeCompanyIds }, disabled: false }).sort({ 'name.textEN': 1 });

        const charterCompaniesWithCounts = charterCompanies.map(company => ({
            ...company.toObject(),
            yachtCount: countsMap[company.id] || 0
        }));

        res.json({
            success: true,
            data: charterCompaniesWithCounts,
            summary: {
                totalCharterCompanies: charterCompaniesWithCounts.length,
                totalYachts: Object.values(countsMap).reduce((sum: number, count: any) => sum + (count as number), 0)
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
