import mongoose from 'mongoose';
import { connectDB } from '../db/connection';
import * as api from '../sync';
import { Base, Country, Equipment, YachtCategory, Service, YachtBuilder, CharterCompany, Region, Location, Journey } from '../models/catalogue';
import { Yacht, YachtModel } from '../models/yacht';
import { YachtEquipment } from '../models/yacht-equipment';
import { YachtService } from '../models/yacht-services';
import { YachtPricing } from '../models/yacht-pricing';
import { YachtRating } from '../models/yacht-ratings';
import { Reservation, Occupancy } from '../models/reservation';
import { CrewMember } from '../models/crew';
import { Invoice } from '../models/invoice';
import { Contact } from '../models/contact';
import { CabinCharterBase, CabinCharterCompany } from '../models/cabin-charter';
import { FreeCabinPackage, FreeCabinSearchCriteria } from '../models/free-cabin-charter';

// Helper function to convert string to multilingual text
const toMultilingualText = (text: string | any) => {
    if (typeof text === 'string') {
        return {
            textEN: text,
            textDE: text,
            textFR: text,
            textIT: text,
            textES: text,
            textHR: text
        };
    }
    return text;
};

// Helper function to convert string numbers to actual numbers
const toNumber = (value: string | number): number => {
    if (typeof value === 'string') {
        return parseFloat(value);
    }
    return value;
};

// Helper function to process reservation data
const processReservation = (reservation: any) => {
    return {
        ...reservation,
        priceListPrice: toNumber(reservation.priceListPrice),
        agencyPrice: toNumber(reservation.agencyPrice),
        clientPrice: toNumber(reservation.clientPrice),
        securityDeposit: toNumber(reservation.securityDeposit),
        services: reservation.services?.map((service: any) => ({
            ...service,
            quantity: toNumber(service.quantity),
            listPrice: toNumber(service.listPrice),
            amount: toNumber(service.amount)
        })),
        additionalEquipment: reservation.additionalEquipment?.map((equipment: any) => ({
            ...equipment,
            quantity: toNumber(equipment.quantity),
            listPrice: toNumber(equipment.listPrice),
            amount: toNumber(equipment.amount)
        }))
    };
};

export const syncCatalogueData = async () => {
    try {
        await connectDB();
        console.log('Starting catalogue data sync...');

        // Sync bases
        console.log('Fetching bases...');
        const bases = await api.getAllBases();
        console.log('Bases API response:', JSON.stringify(bases, null, 2));
        if (bases?.bases) {
            console.log(`Processing ${bases.bases.length} bases...`);
            for (const base of bases.bases) {
                const result = await Base.findOneAndUpdate(
                    { id: base.id },
                    {
                        ...base,
                        name: toMultilingualText(base.name),
                        returnToBaseNote: toMultilingualText(base.returnToBaseNote),
                        returnToBaseDelayNote: toMultilingualText(base.returnToBaseDelayNote)
                    },
                    { upsert: true, new: true }
                );
                console.log(`Saved base: ${base.id}`);
            }
        } else {
            console.log('No bases found in API response');
        }

        // Sync countries
        console.log('Fetching countries...');
        const countries = await api.getAllCountries();
        console.log('Countries API response:', JSON.stringify(countries, null, 2));
        if (countries?.countries) {
            console.log(`Processing ${countries.countries.length} countries...`);
            for (const country of countries.countries) {
                const result = await Country.findOneAndUpdate(
                    { id: country.id },
                    { ...country, name: toMultilingualText(country.name) },
                    { upsert: true, new: true }
                );
                console.log(`Saved country: ${country.id}`);
            }
        } else {
            console.log('No countries found in API response');
        }

        // Sync regions
        console.log('Fetching regions...');
        const regions = await api.getAllRegions();
        console.log('Regions API response:', JSON.stringify(regions, null, 2));
        if (regions?.regions) {
            console.log(`Processing ${regions.regions.length} regions...`);
            for (const region of regions.regions) {
                const result = await Region.findOneAndUpdate(
                    { id: region.id },
                    { ...region, name: toMultilingualText(region.name) },
                    { upsert: true, new: true }
                );
                console.log(`Saved region: ${region.id}`);
            }
        } else {
            console.log('No regions found in API response');
        }

        // Sync locations
        console.log('Fetching locations...');
        const locations = await api.getAllLocations();
        console.log('Locations API response:', JSON.stringify(locations, null, 2));
        if (locations?.locations) {
            console.log(`Processing ${locations.locations.length} locations...`);
            for (const location of locations.locations) {
                const result = await Location.findOneAndUpdate(
                    { id: location.id },
                    { ...location, name: toMultilingualText(location.name) },
                    { upsert: true, new: true }
                );
                console.log(`Saved location: ${location.id}`);
            }
        } else {
            console.log('No locations found in API response');
        }

        // Sync equipment
        console.log('Fetching equipment...');
        const equipment = await api.getAllEquipment();
        console.log('Equipment API response:', JSON.stringify(equipment, null, 2));
        if (equipment?.equipment) {
            console.log(`Processing ${equipment.equipment.length} equipment items...`);
            for (const item of equipment.equipment) {
                const result = await Equipment.findOneAndUpdate(
                    { id: item.id },
                    { ...item, name: toMultilingualText(item.name) },
                    { upsert: true, new: true }
                );
                console.log(`Saved equipment: ${item.id}`);
            }
        } else {
            console.log('No equipment found in API response');
        }

        // Sync yacht categories
        console.log('Fetching yacht categories...');
        const categories = await api.getAllYachtCategories();
        console.log('Categories API response:', JSON.stringify(categories, null, 2));
        if (categories?.categories) {
            console.log(`Processing ${categories.categories.length} categories...`);
            for (const category of categories.categories) {
                const result = await YachtCategory.findOneAndUpdate(
                    { id: category.id },
                    { ...category, name: toMultilingualText(category.name) },
                    { upsert: true, new: true }
                );
                console.log(`Saved category: ${category.id}`);
            }
        } else {
            console.log('No categories found in API response');
        }

        // Sync services
        console.log('Fetching services...');
        const services = await api.getAllServices();
        console.log('Services API response:', JSON.stringify(services, null, 2));
        if (services?.services) {
            console.log(`Processing ${services.services.length} services...`);
            for (const service of services.services) {
                const result = await Service.findOneAndUpdate(
                    { id: service.id },
                    { ...service, name: toMultilingualText(service.name) },
                    { upsert: true, new: true }
                );
                console.log(`Saved service: ${service.id}`);
            }
        } else {
            console.log('No services found in API response');
        }

        // Sync yacht builders
        console.log('Fetching yacht builders...');
        const builders = await api.getAllYachtBuilders();
        console.log('Builders API response:', JSON.stringify(builders, null, 2));
        if (builders?.builders) {
            console.log(`Processing ${builders.builders.length} builders...`);
            for (const builder of builders.builders) {
                const result = await YachtBuilder.findOneAndUpdate(
                    { id: builder.id },
                    { ...builder, name: toMultilingualText(builder.name) },
                    { upsert: true, new: true }
                );
                console.log(`Saved builder: ${builder.id}`);
            }
        } else {
            console.log('No builders found in API response');
        }

        console.log('Catalogue data sync completed');
    } catch (error) {
        console.error('Error syncing catalogue data:', error);
        throw error;
    }
};

export const syncYachtData = async () => {
    try {
        await connectDB();
        console.log('Starting yacht data sync...');

        // First, sync charter companies
        console.log('Fetching charter companies...');
        const companies = await api.getCharterCompanies();
        console.log('Charter companies API response:', JSON.stringify(companies, null, 2));
        if (companies?.companies) {
            console.log(`Processing ${companies.companies.length} charter companies...`);
            for (const company of companies.companies) {
                const result = await CharterCompany.findOneAndUpdate(
                    { id: company.id },
                    {
                        ...company,
                        name: toMultilingualText(company.name)
                    },
                    { upsert: true, new: true }
                );
                console.log(`Saved charter company: ${company.id}`);

                // Now get yachts for this company
                console.log(`Fetching yachts for company ${company.id}...`);
                const yachts = await api.getYachtsByCompany(company.id);
                console.log(`Yachts API response for company ${company.id}:`, JSON.stringify(yachts, null, 2));
                if (yachts?.yachts) {
                    console.log(`Processing ${yachts.yachts.length} yachts for company ${company.id}...`);
                    for (const yacht of yachts.yachts) {
                        // Get full yacht details including equipment and pictures
                        console.log(`Fetching full details for yacht ${yacht.id}...`);
                        const fullYachtData = await api.getSingleYacht(yacht.id);
                        const fullYacht = fullYachtData?.yachts?.[0] || yacht;
                        // Smart mapping: Find yacht model specifications by name matching
                        let modelSpecs = null;
                        if (fullYacht.yachtModelId || fullYacht.modelId) {
                            const modelId = fullYacht.yachtModelId || fullYacht.modelId;
                            modelSpecs = await YachtModel.findOne({ id: modelId });
                            if (modelSpecs) {
                                console.log(`Found model specs by ID for yacht ${fullYacht.id}: LOA=${modelSpecs.loa}m, Beam=${modelSpecs.beam}m`);
                            }
                        }
                        
                        // If no model found by ID, try to find by name matching
                        if (!modelSpecs && fullYacht.name?.textEN) {
                            const yachtName = fullYacht.name.textEN.toLowerCase();
                            // Look for yacht models with similar names
                            const allModels = await YachtModel.find({});
                            for (const model of allModels) {
                                if (model.name?.textEN && yachtName.includes(model.name.textEN.toLowerCase())) {
                                    modelSpecs = model;
                                    console.log(`Found model specs by name matching for yacht ${fullYacht.id}: LOA=${modelSpecs.loa}m, Beam=${modelSpecs.beam}m`);
                                    break;
                                }
                            }
                        }
                        
                        if (!modelSpecs) {
                            console.log(`No yacht model specs found for yacht ${fullYacht.id} (${fullYacht.name?.textEN || 'unnamed'})`);
                        }

                        const result = await Yacht.findOneAndUpdate(
                            { id: fullYacht.id },
                            {
                                ...fullYacht,
                                charterCompanyId: company.id,
                                builderId: fullYacht.yachtBuilderId || modelSpecs?.builderId, // ✅ Fix: Get builderId from yacht or model
                                modelId: fullYacht.yachtModelId, // ✅ Fix: Map yachtModelId to modelId
                                name: toMultilingualText(fullYacht.name),
                                description: toMultilingualText(fullYacht.description),
                                highlights: toMultilingualText(fullYacht.highlights),
                                note: toMultilingualText(fullYacht.note),
                                // Convert numeric fields that might come as strings from API
                                length: toNumber(fullYacht.length || modelSpecs?.loa), // Use yacht.length or fallback to model.loa
                                cabins: toNumber(fullYacht.cabins),
                                berths: toNumber(fullYacht.berthsTotal || fullYacht.berths), // Use berthsTotal from Nausys API
                                wc: toNumber(fullYacht.wc),
                                year: toNumber(fullYacht.buildYear || fullYacht.year), // Use buildYear from Nausys API
                                draft: toNumber(fullYacht.draft || modelSpecs?.draft), // Use yacht.draft or fallback to model.draft
                                beam: toNumber(fullYacht.beam || modelSpecs?.beam), // Use yacht.beam or fallback to model.beam
                                deposit: toNumber(fullYacht.deposit),
                                fuelCapacity: toNumber(fullYacht.fuelCapacity || modelSpecs?.fuelTank), // Use yacht.fuelCapacity or fallback to model.fuelTank
                                waterCapacity: toNumber(fullYacht.waterCapacity || modelSpecs?.waterTank), // Use yacht.waterCapacity or fallback to model.waterTank
                                enginePower: toNumber(fullYacht.enginePower),
                                engineCount: toNumber(fullYacht.engines || fullYacht.engineCount), // Use engines from Nausys API
                                // Handle optional numeric fields
                                refit: fullYacht.refit ? toNumber(fullYacht.refit) : undefined,
                                engineBuilderId: fullYacht.engineBuilderId ? toNumber(fullYacht.engineBuilderId) : undefined,
                                engineBuildYear: fullYacht.engineBuildYear ? toNumber(fullYacht.engineBuildYear) : undefined,
                                sailArea: fullYacht.sailArea ? toNumber(fullYacht.sailArea) : undefined,
                                depositWhenInsured: fullYacht.depositWhenInsured ? toNumber(fullYacht.depositWhenInsured) : undefined,
                                crewCount: fullYacht.crewCount ? toNumber(fullYacht.crewCount) : undefined,
                                maxDiscountFromCommission: fullYacht.maxDiscountFromCommission ? toNumber(fullYacht.maxDiscountFromCommission) : undefined,
                                showers: fullYacht.showers ? toNumber(fullYacht.showers) : undefined,
                                showersCrew: fullYacht.showersCrew ? toNumber(fullYacht.showersCrew) : undefined,
                                recommendedPersons: fullYacht.recommendedPersons ? toNumber(fullYacht.recommendedPersons) : undefined,
                                fuelConsumption: fullYacht.fuelConsumption ? toNumber(fullYacht.fuelConsumption) : undefined,
                                maxSpeed: fullYacht.maxSpeed ? toNumber(fullYacht.maxSpeed) : undefined,
                                cruisingSpeed: fullYacht.cruisingSpeed ? toNumber(fullYacht.cruisingSpeed) : undefined,
                                // New fields from Nausys API
                                berthsCabin: fullYacht.berthsCabin ? toNumber(fullYacht.berthsCabin) : undefined,
                                berthsSalon: fullYacht.berthsSalon ? toNumber(fullYacht.berthsSalon) : undefined,
                                berthsCrew: fullYacht.berthsCrew ? toNumber(fullYacht.berthsCrew) : undefined,
                                sailTypeId: fullYacht.sailTypeId ? toNumber(fullYacht.sailTypeId) : undefined,
                                sailRenewed: fullYacht.sailRenewed ? toNumber(fullYacht.sailRenewed) : undefined,
                                genoaTypeId: fullYacht.genoaTypeId ? toNumber(fullYacht.genoaTypeId) : undefined,
                                genoaRenewed: fullYacht.genoaTypeId ? toNumber(fullYacht.genoaRenewed) : undefined,
                                steeringTypeId: fullYacht.steeringTypeId ? toNumber(fullYacht.steeringTypeId) : undefined,
                                fourStarCharter: fullYacht.fourStarCharter || false,
                                propulsionType: fullYacht.propulsionType || undefined,
                                charterType: fullYacht.charterType || undefined,
                                // Model specifications (merged from yacht model)
                                modelLoa: modelSpecs?.loa,
                                modelBeam: modelSpecs?.beam,
                                modelDraft: modelSpecs?.draft,
                                modelDisplacement: modelSpecs?.displacement,
                                modelVirtualLength: modelSpecs?.virtualLength,
                                
                                // Equipment mapping from Nausys API
                                standardEquipment: fullYacht.standardYachtEquipment ? fullYacht.standardYachtEquipment.map((eq: any) => ({
                                    id: eq.id,
                                    name: { textEN: '', textDE: '', textFR: '', textIT: '', textES: '', textHR: '' }, // Will be populated from equipment catalogue
                                    category: 'Standard',
                                    quantity: eq.quantity,
                                    isStandard: true,
                                    isOptional: false,
                                    highlight: eq.highlight || false,
                                    comment: eq.comment || {}
                                })) : [],
                                
                                // Pictures mapping from Nausys API with size parameters
                                picturesUrl: fullYacht.picturesURL ? fullYacht.picturesURL.map((url: string) => {
                                    // Add size parameters to Nausys picture URLs
                                    if (url.includes('ws.nausys.com/CBMS-external/rest/yacht') && url.includes('/pictures/')) {
                                        const separator = url.includes('?') ? '&' : '?';
                                        return `${url}${separator}w=600&h=600`;
                                    }
                                    return url;
                                }) : [],
                                
                                // Main picture URL with size parameters
                                mainPictureUrl: fullYacht.mainPictureUrl ? (() => {
                                    const url = fullYacht.mainPictureUrl;
                                    if (url.includes('ws.nausys.com/CBMS-external/rest/yacht') && url.includes('/pictures/')) {
                                        const separator = url.includes('?') ? '&' : '?';
                                        return `${url}${separator}w=600&h=600`;
                                    }
                                    return url;
                                })() : fullYacht.mainPictureUrl,
                                
                                // Video fields from Nausys API
                                youtubeVideos: fullYacht.youtubeVideos || '',
                                vimeoVideos: fullYacht.vimeoVideos || '',
                                linkFor360tour: fullYacht.linkFor360tour || '',
                                yachtTutorialVimeoVideos: fullYacht.yachtTutorialVimeoVideos || '',
                                yachtTutorialYoutubeVideos: fullYacht.yachtTutorialYoutubeVideos || ''
                            },
                            { upsert: true, new: true }
                        );
                        console.log(`Saved yacht: ${fullYacht.id} for company ${company.id}`);
                    }
                } else if (yachts?.yachtIDs) {
                    // If we only got yacht IDs, fetch each yacht individually
                    console.log(`Processing ${yachts.yachtIDs.length} yacht IDs for company ${company.id}...`);
                    const yachtDetails = await api.getYachtsByCompany(company.id, yachts.yachtIDs);
                    if (yachtDetails?.yachts) {
                        for (const yacht of yachtDetails.yachts) {
                            // Smart mapping: Find yacht model specifications by name matching
                            let modelSpecs = null;
                            if (yacht.yachtModelId || yacht.modelId) {
                                const modelId = yacht.yachtModelId || yacht.modelId;
                                modelSpecs = await YachtModel.findOne({ id: modelId });
                                if (modelSpecs) {
                                    console.log(`Found model specs by ID for yacht ${yacht.id}: LOA=${modelSpecs.loa}m, Beam=${modelSpecs.beam}m`);
                                }
                            }
                            
                            // If no model found by ID, try to find by name matching
                            if (!modelSpecs && yacht.name?.textEN) {
                                const yachtName = yacht.name.textEN.toLowerCase();
                                // Look for yacht models with similar names
                                const allModels = await YachtModel.find({});
                                for (const model of allModels) {
                                    if (model.name?.textEN && yachtName.includes(model.name.textEN.toLowerCase())) {
                                        modelSpecs = model;
                                        console.log(`Found model specs by name matching for yacht ${yacht.id}: LOA=${modelSpecs.loa}m, Beam=${modelSpecs.beam}m`);
                                        break;
                                    }
                                }
                            }
                            
                            if (!modelSpecs) {
                                console.log(`No yacht model specs found for yacht ${yacht.id} (${yacht.name?.textEN || 'unnamed'})`);
                            }

                            const result = await Yacht.findOneAndUpdate(
                                { id: yacht.id },
                                {
                                    ...yacht,
                                    charterCompanyId: company.id,
                                    builderId: yacht.yachtBuilderId || modelSpecs?.builderId, // ✅ Fix: Get builderId from yacht or model
                                    modelId: yacht.yachtModelId, // ✅ Fix: Map yachtModelId to modelId
                                    name: toMultilingualText(yacht.name),
                                    description: yacht.description ? toMultilingualText(yacht.description) : { textEN: '', textDE: '', textFR: '', textIT: '', textES: '', textHR: '' },
                                    highlights: yacht.highlightsIntText ? toMultilingualText(yacht.highlightsIntText) : (yacht.highlights ? { textEN: yacht.highlights, textDE: yacht.highlights, textFR: yacht.highlights, textIT: yacht.highlights, textES: yacht.highlights, textHR: yacht.highlights } : { textEN: '', textDE: '', textFR: '', textIT: '', textES: '', textHR: '' }),
                                    note: toMultilingualText(yacht.note),
                                    // Convert numeric fields that might come as strings from API
                                    length: toNumber(yacht.length || modelSpecs?.loa), // Use yacht.length or fallback to model.loa
                                    cabins: toNumber(yacht.cabins),
                                    berths: toNumber(yacht.berths || yacht.berthsTotal), // Use berths from Nausys API, fallback to berthsTotal
                                    wc: toNumber(yacht.wc),
                                    year: toNumber(yacht.buildYear || yacht.year), // Use buildYear from Nausys API
                                    draft: toNumber(yacht.draft || modelSpecs?.draft), // Use yacht.draft or fallback to model.draft
                                    beam: toNumber(yacht.beam || modelSpecs?.beam), // Use yacht.beam or fallback to model.beam
                                    deposit: toNumber(yacht.deposit),
                                    fuelCapacity: toNumber(yacht.fuelCapacity || modelSpecs?.fuelTank), // Use yacht.fuelCapacity or fallback to model.fuelTank
                                    waterCapacity: toNumber(yacht.waterCapacity || modelSpecs?.waterTank), // Use yacht.waterCapacity or fallback to model.waterTank
                                    enginePower: toNumber(yacht.enginePower),
                                    engineCount: toNumber(yacht.engines || yacht.engineCount), // Use engines from Nausys API
                                    // Handle optional numeric fields
                                    refit: yacht.refit ? toNumber(yacht.refit) : undefined,
                                    engineBuilderId: yacht.engineBuilderId ? toNumber(yacht.engineBuilderId) : undefined,
                                    engineBuildYear: yacht.engineBuildYear ? toNumber(yacht.engineBuildYear) : undefined,
                                    sailArea: yacht.sailArea ? toNumber(yacht.sailArea) : undefined,
                                    depositWhenInsured: yacht.depositWhenInsured ? toNumber(yacht.depositWhenInsured) : undefined,
                                    crewCount: yacht.crewCount ? toNumber(yacht.crewCount) : undefined,
                                    maxDiscountFromCommission: yacht.maxDiscountFromCommission ? toNumber(yacht.maxDiscountFromCommission) : undefined,
                                    showers: yacht.showers ? toNumber(yacht.showers) : undefined,
                                    showersCrew: yacht.showersCrew ? toNumber(yacht.showersCrew) : undefined,
                                    recommendedPersons: yacht.recommendedPersons ? toNumber(yacht.recommendedPersons) : undefined,
                                    fuelConsumption: yacht.fuelConsumption ? toNumber(yacht.fuelConsumption) : undefined,
                                    maxSpeed: yacht.maxSpeed ? toNumber(yacht.maxSpeed) : undefined,
                                    cruisingSpeed: yacht.cruisingSpeed ? toNumber(yacht.cruisingSpeed) : undefined,
                                    // New fields from Nausys API
                                    berthsCabin: yacht.berthsCabin ? toNumber(yacht.berthsCabin) : undefined,
                                    berthsSalon: yacht.berthsSalon ? toNumber(yacht.berthsSalon) : undefined,
                                    berthsCrew: yacht.berthsCrew ? toNumber(yacht.berthsCrew) : undefined,
                                    sailTypeId: yacht.sailTypeId ? toNumber(yacht.sailTypeId) : undefined,
                                    sailRenewed: yacht.sailRenewed ? toNumber(yacht.sailRenewed) : undefined,
                                    genoaTypeId: yacht.genoaTypeId ? toNumber(yacht.genoaTypeId) : undefined,
                                    genoaRenewed: yacht.genoaTypeId ? toNumber(yacht.genoaRenewed) : undefined,
                                    steeringTypeId: yacht.steeringTypeId ? toNumber(yacht.steeringTypeId) : undefined,
                                    fourStarCharter: yacht.fourStarCharter || false,
                                    propulsionType: yacht.propulsionType || undefined,
                                    charterType: yacht.charterType || undefined,
                                    // Model specifications (merged from yacht model)
                                    modelLoa: modelSpecs?.loa,
                                    modelBeam: modelSpecs?.beam,
                                    modelDraft: modelSpecs?.draft,
                                    modelDisplacement: modelSpecs?.displacement,
                                    modelVirtualLength: modelSpecs?.virtualLength,
                                    
                                    // Equipment mapping from Nausys API
                                    standardEquipment: yacht.standardYachtEquipment ? yacht.standardYachtEquipment.map((eq: any) => ({
                                        id: eq.id,
                                        name: { textEN: '', textDE: '', textFR: '', textIT: '', textES: '', textHR: '' }, // Will be populated from equipment catalogue
                                        category: 'Standard',
                                        quantity: eq.quantity || 1,
                                        isStandard: true,
                                        isOptional: false
                                    })) : [],
                                    
                                    // Pictures mapping from Nausys API
                                    picturesUrl: yacht.picturesURL || [],
                                    
                                    // Additional missing fields from Nausys API
                                    berthsTotal: yacht.berthsTotal ? toNumber(yacht.berthsTotal) : undefined,
                                    maxPersons: yacht.maxPersons ? toNumber(yacht.maxPersons) : undefined,
                                    buildYear: yacht.buildYear ? toNumber(yacht.buildYear) : undefined,
                                    renewed: yacht.renewed ? toNumber(yacht.renewed) : undefined,
                                    launchedYear: yacht.launchedYear ? toNumber(yacht.launchedYear) : undefined,
                                    fuelTank: yacht.fuelTank ? toNumber(yacht.fuelTank) : undefined,
                                    waterTank: yacht.waterTank ? toNumber(yacht.waterTank) : undefined,
                                    mastLength: yacht.mastLength ? toNumber(yacht.mastLength) : undefined,
                                    commission: yacht.commission ? toNumber(yacht.commission) : undefined,
                                    depositCurrency: yacht.depositCurrency || undefined,
                                    maxDiscount: yacht.maxDiscount ? toNumber(yacht.maxDiscount) : undefined,
                                    needsOptionApproval: yacht.needsOptionApproval || false,
                                    
                                    // Critical missing fields from Nausys API
                                    locationId: yacht.locationId ? toNumber(yacht.locationId) : undefined,
                                    cabinsCrew: yacht.cabinsCrew ? toNumber(yacht.cabinsCrew) : undefined,
                                    wcCrew: yacht.wcCrew ? toNumber(yacht.wcCrew) : undefined,
                                    engines: yacht.engines ? toNumber(yacht.engines) : undefined,
                                    engineRenewedYear: yacht.engineRenewedYear ? toNumber(yacht.engineRenewedYear) : undefined,
                                    numberOfRudderBlades: yacht.numberOfRudderBlades ? toNumber(yacht.numberOfRudderBlades) : undefined,
                                    crewedCharterType: yacht.crewedCharterType || undefined,
                                    hullColor: yacht.hullColor || undefined,
                                    thirdPartyInsuranceAmount: yacht.thirdPartyInsuranceAmount ? toNumber(yacht.thirdPartyInsuranceAmount) : undefined,
                                    thirdPartyInsuranceCurrency: yacht.thirdPartyInsuranceCurrency || undefined,
                                    checkInTime: yacht.checkInTime || undefined,
                                    checkOutTime: yacht.checkOutTime || undefined,
                                    crewMemberIds: yacht.crewMemberIds || [],
                                    highlightsIntText: yacht.highlightsIntText ? toMultilingualText(yacht.highlightsIntText) : undefined,
                                    noteIntText: yacht.noteIntText ? toMultilingualText(yacht.noteIntText) : undefined,
                                    flagsid: yacht.flagsid || [],
                                    canMakeBookingFixed: yacht.canMakeBookingFixed || false,
                                    seasonSpecificData: yacht.seasonSpecificData || [],
                                    euminia: yacht.euminia || undefined,
                                    
                                    // Video fields (as strings, not arrays)
                                    youtubeVideos: yacht.youtubeVideos || '',
                                    vimeoVideos: yacht.vimeoVideos || '',
                                    linkFor360tour: yacht.linkFor360tour || '',
                                    yachtTutorialVimeoVideos: yacht.yachtTutorialVimeoVideos || '',
                                    yachtTutorialYoutubeVideos: yacht.yachtTutorialYoutubeVideos || ''
                                },
                                { upsert: true, new: true }
                            );
                            console.log(`Saved yacht: ${yacht.id} for company ${company.id}`);
                        }
                    } else {
                        console.log(`No yacht details found for company ${company.id}`);
                    }
                } else {
                    console.log(`No yachts found for company ${company.id}`);
                }
            }
        } else {
            console.log('No charter companies found in API response');
        }

        // Sync yacht models with full specifications
        console.log('Fetching yacht models with specifications...');
        const models = await api.getAllYachtModels();
        console.log('Models API response:', JSON.stringify(models, null, 2));
        if (models?.models) {
            console.log(`Processing ${models.models.length} models with specifications...`);
            for (const model of models.models) {
                const result = await YachtModel.findOneAndUpdate(
                    { id: model.id },
                    { 
                        ...model, 
                        builderId: model.yachtBuilderId, // ✅ Fix: Map yachtBuilderId to builderId
                        name: toMultilingualText(model.name),
                        // Convert numeric specifications that might come as strings
                        loa: toNumber(model.loa),
                        beam: toNumber(model.beam),
                        draft: toNumber(model.draft),
                        cabins: toNumber(model.cabins),
                        wc: toNumber(model.wc),
                        waterTank: toNumber(model.waterTank),
                        fuelTank: toNumber(model.fuelTank),
                        displacement: toNumber(model.displacement),
                        virtualLength: toNumber(model.virtualLength)
                    },
                    { upsert: true, new: true }
                );
                console.log(`Saved model ${model.id} with specifications: LOA=${model.loa}m, Beam=${model.beam}m, Draft=${model.draft}m`);
            }
            
            // Now apply model specifications to existing yachts
            console.log('Applying model specifications to existing yachts...');
            await applyModelSpecsToYachts();
        } else {
            console.log('No models found in API response');
        }

        console.log('Yacht data sync completed');
    } catch (error) {
        console.error('Error syncing yacht data:', error);
        throw error;
    }
};

export const syncReservationData = async () => {
    try {
        await connectDB();
        console.log('Starting reservation data sync...');

        // Sync reservations
        console.log('Fetching reservations...');
        const reservations = await api.getAllReservations();
        console.log('Reservations API response:', JSON.stringify(reservations, null, 2));
        if (reservations?.reservations) {
            console.log(`Processing ${reservations.reservations.length} reservations...`);
            for (const reservation of reservations.reservations) {
                const processedReservation = processReservation(reservation);
                const result = await Reservation.findOneAndUpdate(
                    { id: reservation.id },
                    processedReservation,
                    { upsert: true, new: true }
                );
                console.log(`Saved reservation: ${reservation.id}`);
            }
        } else {
            console.log('No reservations found in API response');
        }

        // Sync occupancy data
        console.log('Fetching occupancy...');
        const occupancy = await api.getOccupancy();
        console.log('Occupancy API response:', JSON.stringify(occupancy, null, 2));
        if (occupancy?.reservations) {
            console.log(`Processing ${occupancy.reservations.length} occupancy records...`);
            for (const occ of occupancy.reservations) {
                const result = await Occupancy.findOneAndUpdate(
                    { 
                        companyId: occupancy.companyId,
                        yachtId: occ.yachtId,
                        periodFrom: occ.periodFrom,
                        periodTo: occ.periodTo
                    },
                    {
                        ...occ,
                        companyId: occupancy.companyId
                    },
                    { upsert: true, new: true }
                );
                console.log(`Saved occupancy: ${occ.yachtId} (${occ.periodFrom} - ${occ.periodTo})`);
            }
        } else {
            console.log('No occupancy records found in API response');
        }

        console.log('Reservation data sync completed');
    } catch (error) {
        console.error('Error syncing reservation data:', error);
        throw error;
    }
};

export const syncCrewData = async () => {
    try {
        await connectDB();
        console.log('Starting crew data sync...');

        // Check if crew list security code is available
        const securityCode = process.env.NAUSYS_CREW_SECURITY_CODE;
        if (!securityCode) {
            console.log('NAUSYS_CREW_SECURITY_CODE not found in .env, skipping crew data sync');
            return;
        }

        // Get all reservations to fetch crew lists
        const reservations = await Reservation.find({});
        console.log(`Found ${reservations.length} reservations to check for crew...`);
        
        for (const reservation of reservations) {
            console.log(`Fetching crew for reservation ${reservation.id}...`);
            const crewList = await api.getCrewList(reservation.id, securityCode);
            console.log(`Crew API response for reservation ${reservation.id}:`, JSON.stringify(crewList, null, 2));
            if (crewList?.passengers) {
                console.log(`Processing ${crewList.passengers.length} crew members for reservation ${reservation.id}...`);
                for (const crew of crewList.passengers) {
                    const result = await CrewMember.findOneAndUpdate(
                        { 
                            id: crew.id,
                            reservationId: reservation.id
                        },
                        {
                            ...crew,
                            reservationId: reservation.id
                        },
                        { upsert: true, new: true }
                    );
                    console.log(`Saved crew member: ${crew.id} for reservation ${reservation.id}`);
                }
            } else {
                console.log(`No crew found for reservation ${reservation.id}`);
            }
        }

        console.log('Crew data sync completed');
    } catch (error) {
        console.error('Error syncing crew data:', error);
        throw error;
    }
};

export const syncInvoiceData = async () => {
    try {
        await connectDB();
        console.log('Starting invoice data sync...');

        // Array of invoice types to fetch
        const invoiceTypes: ('base' | 'agency' | 'owner')[] = ['base', 'agency', 'owner'];

        for (const type of invoiceTypes) {
            try {
            console.log(`Fetching ${type} invoices...`);
            const invoices = await api.getInvoices(type);
            console.log(`${type} invoices API response:`, JSON.stringify(invoices, null, 2));
            
            if (invoices?.invoices) {
                console.log(`Processing ${invoices.invoices.length} ${type} invoices...`);
                for (const invoice of invoices.invoices) {
                    const result = await Invoice.findOneAndUpdate(
                        { id: invoice.id },
                        {
                            id: invoice.id, // Use the original invoice ID from API
                            invoiceType: type,
                            number: invoice.number,
                            date: new Date(invoice.date),
                            dueDate: new Date(invoice.date), // Using invoice date as due date since it's not provided
                            currency: invoice.altcurrency,
                            totalAmount: toNumber(invoice.totalaltpricewithouttax),
                            totalAmountWithVat: toNumber(invoice.totalaltprice),
                            totalVatAmount: toNumber(invoice.totalalttax),
                            client: {
                                name: invoice.client2.name,
                                address: invoice.client2.address,
                                city: invoice.client2.city,
                                zip: invoice.client2.zip,
                                country: invoice.clientcountry,
                                vatNr: invoice.client2.vatNr
                            },
                            items: invoice.items.items.map((item: any, index: number) => ({
                                id: Date.now() + index, // Generate unique item ID using timestamp
                                description: item.identname,
                                quantity: toNumber(item.quantity),
                                price: toNumber(item.singlepricewithouttax),
                                amount: toNumber(item.totalaltpricewithouttax),
                                vatPercentage: toNumber(item.vatrate),
                                vatAmount: toNumber(item.totalalttax),
                                amountWithVat: toNumber(item.totalaltpricewithtax)
                            }))
                        },
                        { upsert: true, new: true }
                    );
                    console.log(`Saved ${type} invoice: ${invoice.id}`);
                }
            } else {
                console.log(`No ${type} invoices found in API response`);
            }
            } catch (error) {
                console.warn(`Error syncing ${type} invoices:`, error instanceof Error ? error.message : String(error));
                // Continue with other invoice types even if one fails
            }
        }

        console.log('Invoice data sync completed');
    } catch (error) {
        console.error('Error syncing invoice data:', error);
        throw error;
    }
};

export const syncContactData = async () => {
    try {
        await connectDB();
        console.log('Starting contact data sync...');

        console.log('Fetching contacts...');
        const contacts = await api.getContact2();
        console.log('Contacts API response:', JSON.stringify(contacts, null, 2));
        if (contacts?.clients) {
            console.log(`Processing ${contacts.clients.length} contacts...`);
            for (const contact of contacts.clients) {
                const result = await Contact.findOneAndUpdate(
                    { id: contact.id },
                    contact,
                    { upsert: true, new: true }
                );
                console.log(`Saved contact: ${contact.id}`);
            }
        } else {
            console.log('No contacts found in API response');
        }

        console.log('Contact data sync completed');
    } catch (error) {
        console.error('Error syncing contact data:', error);
        throw error;
    }
};

export const syncJourneyData = async () => {
    try {
        await connectDB();
        console.log('Starting journey/options data sync...');

        console.log('Fetching available options...');
        const options = await api.getAllOptions();
        console.log('Options API response:', JSON.stringify(options, null, 2));
        
        if (options?.reservations) {
            console.log(`Processing ${options.reservations.length} available options...`);
            for (const option of options.reservations) {
                const result = await Journey.findOneAndUpdate(
                    { id: option.id },
                    {
                        id: option.id,
                        yachtId: option.yachtId,
                        baseFromId: option.baseFromId,
                        baseToId: option.baseToId,
                        locationFromId: option.locationFromId,
                        locationToId: option.locationToId,
                        periodFrom: option.periodFrom ? new Date(option.periodFrom.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')) : undefined,
                        periodTo: option.periodTo ? new Date(option.periodTo.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')) : undefined,
                        optionTill: option.optionTill ? new Date(option.optionTill.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')) : undefined,
                        reservationStatus: option.reservationStatus,
                        agency: option.agency,
                        priceListPrice: toNumber(option.priceListPrice),
                        agencyPrice: option.agencyPrice ? toNumber(option.agencyPrice) : undefined,
                        clientPrice: toNumber(option.clientPrice),
                        currency: option.currency,
                        approved: option.approved,
                        createdAt: new Date()
                    },
                    { upsert: true, new: true }
                );
                console.log(`Saved journey option: ${option.id}`);
            }
        } else {
            console.log('No options found in API response');
        }

        console.log('Journey data sync completed');
    } catch (error) {
        console.error('Error syncing journey data:', error);
        throw error;
    }
};

// Sync yacht equipment data
export const syncYachtEquipmentData = async () => {
    try {
        await connectDB();
        console.log('Starting yacht equipment data sync...');

        // Get all yachts
        const yachts = await Yacht.find({}).select('id').limit(10); // Limit for testing
        console.log(`Processing equipment for ${yachts.length} yachts...`);

        // Get yacht data by company instead of individual yacht details
        const companies = await CabinCharterCompany.find({}).select('id');
        console.log(`Processing equipment for ${companies.length} companies...`);

        for (const company of companies) {
            try {
                console.log(`Fetching yachts for company ${company.id}...`);
                const yachtData = await api.getYachtsByCompany(company.id);
                
                if (yachtData?.yachts) {
                    console.log(`Processing ${yachtData.yachts.length} yachts for company ${company.id}...`);
                    
                    for (const yacht of yachtData.yachts) {
                        // Process standard equipment
                        if (yacht.standardYachtEquipment) {
                            console.log(`Processing ${yacht.standardYachtEquipment.length} standard equipment items for yacht ${yacht.id}...`);
                            
                            for (const equipmentItem of yacht.standardYachtEquipment) {
                                await YachtEquipment.findOneAndUpdate(
                                    { id: equipmentItem.id },
                                    {
                                        id: equipmentItem.id,
                                        yachtId: yacht.id,
                                        equipmentId: equipmentItem.equipmentId,
                                        quantity: toNumber(equipmentItem.quantity),
                                        comment: equipmentItem.comment || '',
                                        isStandard: true,
                                        isOptional: false,
                                        category: 'Standard'
                                    },
                                    { upsert: true, new: true }
                                );
                            }
                        }

                        // Process additional equipment from season data
                        if (yacht.seasonSpecificData) {
                            for (const seasonData of yacht.seasonSpecificData) {
                                if (seasonData.additionalYachtEquipment) {
                                    console.log(`Processing ${seasonData.additionalYachtEquipment.length} additional equipment items for yacht ${yacht.id}...`);
                                    for (const equipmentItem of seasonData.additionalYachtEquipment) {
                                        await YachtEquipment.findOneAndUpdate(
                                            { id: equipmentItem.id },
                                            {
                                                id: equipmentItem.id,
                                                yachtId: yacht.id,
                                                equipmentId: equipmentItem.equipmentId,
                                                quantity: toNumber(equipmentItem.quantity),
                                                comment: equipmentItem.comment || '',
                                                isStandard: false,
                                                isOptional: true,
                                                category: 'Additional',
                                                price: toNumber(equipmentItem.price),
                                                seasonId: seasonData.seasonId
                                            },
                                            { upsert: true, new: true }
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Error syncing equipment for company ${company.id}:`, error);
                // Continue with other companies
            }
        }

        console.log('Yacht equipment data sync completed');
    } catch (error) {
        console.error('Error syncing yacht equipment data:', error);
        throw error;
    }
};

// Sync yacht services data
export const syncYachtServicesData = async () => {
    try {
        await connectDB();
        console.log('Starting yacht services data sync...');

        // Get all yachts
        const yachts = await Yacht.find({}).select('id').limit(10); // Limit for testing
        console.log(`Processing services for ${yachts.length} yachts...`);

        // Get yacht data by company instead of individual yacht details
        const companies = await CabinCharterCompany.find({}).select('id');
        console.log(`Processing services for ${companies.length} companies...`);

        for (const company of companies) {
            try {
                console.log(`Fetching yachts for company ${company.id}...`);
                const yachtData = await api.getYachtsByCompany(company.id);
                
                if (yachtData?.yachts) {
                    console.log(`Processing ${yachtData.yachts.length} yachts for company ${company.id}...`);
                    
                    for (const yacht of yachtData.yachts) {
                        // Process services from season data
                        if (yacht.seasonSpecificData) {
                            for (const seasonData of yacht.seasonSpecificData) {
                                if (seasonData.services) {
                                    console.log(`Processing ${seasonData.services.length} services for yacht ${yacht.id}...`);
                                    for (const service of seasonData.services) {
                                        await YachtService.findOneAndUpdate(
                                            { id: service.id },
                                            {
                                                id: service.id,
                                                yachtId: yacht.id,
                                                serviceId: service.serviceId,
                                                name: toMultilingualText(service.description),
                                                description: toMultilingualText(service.description),
                                                price: toNumber(service.price),
                                                isObligatory: service.obligatory || false,
                                                isOptional: !service.obligatory,
                                                category: 'Additional',
                                                seasonId: seasonData.seasonId
                                            },
                                            { upsert: true, new: true }
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Error syncing services for company ${company.id}:`, error);
                // Continue with other companies
            }
        }

        console.log('Yacht services data sync completed');
    } catch (error) {
        console.error('Error syncing yacht services data:', error);
        throw error;
    }
};

// Sync yacht pricing data
export const syncYachtPricingData = async () => {
    try {
        await connectDB();
        console.log('Starting yacht pricing data sync...');

        // Get all yachts
        const yachts = await Yacht.find({}).select('id').limit(10); // Limit for testing
        console.log(`Processing pricing for ${yachts.length} yachts...`);

        // Get yacht data by company instead of individual yacht details
        const companies = await CabinCharterCompany.find({}).select('id');
        console.log(`Processing pricing for ${companies.length} companies...`);

        for (const company of companies) {
            try {
                console.log(`Fetching yachts for company ${company.id}...`);
                const yachtData = await api.getYachtsByCompany(company.id);
                
                if (yachtData?.yachts) {
                    console.log(`Processing ${yachtData.yachts.length} yachts for company ${company.id}...`);
                    
                    for (const yacht of yachtData.yachts) {
                        // Process pricing from season data
                        if (yacht.seasonSpecificData) {
                            for (const seasonData of yacht.seasonSpecificData) {
                                if (seasonData.prices) {
                                    console.log(`Processing ${seasonData.prices.length} pricing entries for yacht ${yacht.id}...`);
                                    for (const pricing of seasonData.prices) {
                                        // Parse dates from DD.MM.YYYY format
                                        const parseDate = (dateStr: string) => {
                                            const [day, month, year] = dateStr.split('.');
                                            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                                        };

                                        await YachtPricing.findOneAndUpdate(
                                            { id: pricing.id },
                                            {
                                                id: pricing.id,
                                                yachtId: yacht.id,
                                                seasonId: seasonData.seasonId,
                                                startDate: parseDate(pricing.dateFrom),
                                                endDate: parseDate(pricing.dateTo),
                                                period: pricing.type,
                                                weeklyPrice: toNumber(pricing.price),
                                                currency: pricing.currency,
                                                isActive: true
                                            },
                                            { upsert: true, new: true }
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`Error syncing pricing for company ${company.id}:`, error);
                // Continue with other companies
            }
        }

        console.log('Yacht pricing data sync completed');
    } catch (error) {
        console.error('Error syncing yacht pricing data:', error);
        throw error;
    }
};

// Sync yacht ratings data
export const syncYachtRatingsData = async () => {
    try {
        await connectDB();
        console.log('Starting yacht ratings data sync...');

        // Get all yachts
        const yachts = await Yacht.find({}).select('id').limit(10); // Limit for testing
        console.log(`Processing ratings for ${yachts.length} yachts...`);

        // Get yacht data by company instead of individual yacht details
        const companies = await CabinCharterCompany.find({}).select('id');
        console.log(`Processing ratings for ${companies.length} companies...`);

        for (const company of companies) {
            try {
                console.log(`Fetching yachts for company ${company.id}...`);
                const yachtData = await api.getYachtsByCompany(company.id);
                
                if (yachtData?.yachts) {
                    console.log(`Processing ${yachtData.yachts.length} yachts for company ${company.id}...`);
                    
                    for (const yacht of yachtData.yachts) {
                        // Process euminia ratings if available
                        if (yacht.euminia) {
                            console.log(`Processing euminia ratings for yacht ${yacht.id}...`);
                            
                            await YachtRating.findOneAndUpdate(
                                { yachtId: yacht.id, source: 'euminia' },
                                {
                                    yachtId: yacht.id,
                                    source: 'euminia',
                                    reviewDate: new Date(),
                                    ratings: {
                                        cleanliness: toNumber(yacht.euminia.cleanliness),
                                        equipment: toNumber(yacht.euminia.equipment),
                                        personalService: toNumber(yacht.euminia.personalService),
                                        pricePerformance: toNumber(yacht.euminia.pricePerformance),
                                        recommendation: toNumber(yacht.euminia.recommendation),
                                        overall: toNumber(yacht.euminia.total)
                                    },
                                    totalReviews: toNumber(yacht.euminia.reviews),
                                    isPublished: true
                                },
                                { upsert: true, new: true }
                            );
                            console.log(`Saved euminia ratings for yacht ${yacht.id}`);
                        }
                    }
                }
            } catch (error) {
                console.error(`Error syncing ratings for company ${company.id}:`, error);
                // Continue with other companies
            }
        }

        console.log('Yacht ratings data sync completed');
    } catch (error) {
        console.error('Error syncing yacht ratings data:', error);
        throw error;
    }
};

export const syncAllData = async () => {
    try {
        console.log('Starting full data sync...');
        
        // Drop invoice collection before sync to prevent conflicts
        try {
            if (mongoose.connection.db) {
                await mongoose.connection.db.collection('invoices').drop();
                console.log('Invoice collection dropped successfully');
            }
        } catch (error) {
            console.log('Invoice collection already dropped or does not exist');
        }
        
        await syncCatalogueData();
        
        // Try to sync yacht data, but don't fail the entire sync if it fails
        try {
        await syncYachtData();
        } catch (error) {
            console.warn('Yacht data sync failed, continuing with other data:', error instanceof Error ? error.message : String(error));
        }
        
        // Try to sync reservation data, but don't fail the entire sync if it fails
        try {
        await syncReservationData();
        } catch (error) {
            console.warn('Reservation data sync failed, continuing with other data:', error instanceof Error ? error.message : String(error));
        }
        
        // Try to sync crew data, but don't fail the entire sync if it fails
        try {
        await syncCrewData();
        } catch (error) {
            console.warn('Crew data sync failed, continuing with other data:', error instanceof Error ? error.message : String(error));
        }
        
        // Try to sync invoice data, but don't fail the entire sync if it fails
        try {
        await syncInvoiceData();
        } catch (error) {
            console.warn('Invoice sync failed, continuing with other data:', error instanceof Error ? error.message : String(error));
        }
        
        await syncContactData();
        await syncJourneyData();
        await syncCabinCharterBases();
        await syncCabinCharterCompanies();
        
        // Sync additional yacht data (with error handling)
        try {
            await syncYachtEquipmentData();
        } catch (error) {
            console.warn('Yacht equipment sync failed, continuing:', error instanceof Error ? error.message : String(error));
        }
        
        try {
            await syncYachtServicesData();
        } catch (error) {
            console.warn('Yacht services sync failed, continuing:', error instanceof Error ? error.message : String(error));
        }
        
        try {
            await syncYachtPricingData();
        } catch (error) {
            console.warn('Yacht pricing sync failed, continuing:', error instanceof Error ? error.message : String(error));
        }
        
        try {
            await syncYachtRatingsData();
        } catch (error) {
            console.warn('Yacht ratings sync failed, continuing:', error instanceof Error ? error.message : String(error));
        }
        
        // Sync Free Cabin Charter data
        await syncFreeCabinSearchCriteria();
        await syncCurrentWeekFreeCabinPackages();
        
        console.log('Full data sync completed successfully');
    } catch (error) {
        console.error('Error during full data sync:', error);
        throw error;
    }
}

// Function to apply yacht model specifications to existing yachts
async function applyModelSpecsToYachts() {
    try {
        console.log('Starting yacht model specification application...');
        
        // Get all yacht models
        const yachtModels = await YachtModel.find({});
        console.log(`Found ${yachtModels.length} yacht models to apply`);
        
        if (yachtModels.length === 0) {
            console.log('No yacht models found, skipping specification application');
            return;
        }
        
        // Get all yachts
        const yachts = await Yacht.find({});
        console.log(`Processing ${yachts.length} yachts for specification updates`);
        
        let updatedCount = 0;
        
        for (const yacht of yachts) {
            let bestMatch = null;
            let bestScore = 0;
            
            // Try to find the best matching yacht model
            for (const model of yachtModels) {
                let score = 0;
                
                // Score based on name similarity
                if (yacht.name?.textEN && model.name?.textEN) {
                    const yachtName = yacht.name.textEN.toLowerCase();
                    const modelName = model.name.textEN.toLowerCase();
                    
                    // Exact match gets highest score
                    if (yachtName === modelName) {
                        score = 100;
                    }
                    // Contains match gets medium score
                    else if (yachtName.includes(modelName) || modelName.includes(yachtName)) {
                        score = 50;
                    }
                    // Partial word match gets lower score
                    else {
                        const yachtWords = yachtName.split(/\s+/);
                        const modelWords = modelName.split(/\s+/);
                        for (const yachtWord of yachtWords) {
                            for (const modelWord of modelWords) {
                                if (yachtWord.length > 2 && modelWord.length > 2 && 
                                    (yachtWord.includes(modelWord) || modelWord.includes(yachtWord))) {
                                    score += 10;
                                }
                            }
                        }
                    }
                }
                
                // Score based on cabin count similarity
                if (yacht.cabins && model.cabins && yacht.cabins === model.cabins) {
                    score += 20;
                }
                
                // Score based on toilet count similarity
                if (yacht.wc && model.wc && yacht.wc === model.wc) {
                    score += 20;
                }
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = model;
                }
            }
            
            // Apply specifications if we found a good match
            if (bestMatch && bestScore >= 30) {
                const updateData: any = {};
                
                // Only update fields that are currently null/undefined
                if (!yacht.length && bestMatch.loa) {
                    updateData.length = bestMatch.loa;
                }
                if (!yacht.beam && bestMatch.beam) {
                    updateData.beam = bestMatch.beam;
                }
                if (!yacht.draft && bestMatch.draft) {
                    updateData.draft = bestMatch.draft;
                }
                if (!yacht.fuelCapacity && bestMatch.fuelTank) {
                    updateData.fuelCapacity = bestMatch.fuelTank;
                }
                if (!yacht.waterCapacity && bestMatch.waterTank) {
                    updateData.waterCapacity = bestMatch.waterTank;
                }
                
                if (Object.keys(updateData).length > 0) {
                    await Yacht.findByIdAndUpdate(yacht._id, updateData);
                    console.log(`Updated yacht ${yacht.id} with model specs: ${Object.keys(updateData).join(', ')}`);
                    updatedCount++;
                }
            }
        }
        
        console.log(`Specification application completed. Updated ${updatedCount} yachts.`);
        
    } catch (error) {
        console.error('Error applying yacht model specifications:', error);
    }
};

// Sync cabin charter bases
export const syncCabinCharterBases = async () => {
    try {
        console.log('Starting cabin charter bases sync...');
        
        const bases = await api.getAllCharterBases();
        console.log('Charter bases API response:', JSON.stringify(bases, null, 2));
        
        if (bases?.bases) {
            console.log(`Processing ${bases.bases.length} charter bases...`);
            for (const base of bases.bases) {
                const result = await CabinCharterBase.findOneAndUpdate(
                    { id: base.id },
                    {
                        ...base,
                        // Convert numeric fields that might come as strings from API
                        lat: toNumber(base.lat),
                        lon: toNumber(base.lon)
                    },
                    { upsert: true, new: true }
                );
                console.log(`Saved charter base: ${base.id} - ${base.locationId}`);
            }
        } else {
            console.log('No charter bases found in API response');
        }
        
        console.log('Cabin charter bases sync completed');
    } catch (error) {
        console.error('Error syncing cabin charter bases:', error);
        throw error;
    }
};

// Sync cabin charter companies
export const syncCabinCharterCompanies = async () => {
    try {
        console.log('Starting cabin charter companies sync...');
        
        const companies = await api.getAllCharterCompanies();
        console.log('Charter companies API response:', JSON.stringify(companies, null, 2));
        
        if (companies?.companies) {
            console.log(`Processing ${companies.companies.length} charter companies...`);
            for (const company of companies.companies) {
                const result = await CabinCharterCompany.findOneAndUpdate(
                    { id: company.id },
                    {
                        ...company,
                        // Ensure bank accounts array is properly formatted
                        bankAccounts: company.bankAccounts || []
                    },
                    { upsert: true, new: true }
                );
                console.log(`Saved charter company: ${company.id} - ${company.name}`);
            }
        } else {
            console.log('No charter companies found in API response');
        }
        
        console.log('Cabin charter companies sync completed');
    } catch (error) {
        console.error('Error syncing cabin charter companies:', error);
        throw error;
    }
};

// Sync free cabin package search criteria
export const syncFreeCabinSearchCriteria = async () => {
    try {
        console.log('Starting free cabin search criteria sync...');
        
        const criteria = await api.getFreeCabinPackageSearchCriteria();
        console.log('Free cabin search criteria API response:', JSON.stringify(criteria, null, 2));
        
        if (criteria?.status === 'OK') {
            // Clear existing criteria
            await FreeCabinSearchCriteria.deleteMany({});
            
            const result = await FreeCabinSearchCriteria.create({
                countries: criteria.countries || [],
                regions: criteria.regions || [],
                locations: criteria.locations || [],
                packages: criteria.packages || [],
                lastUpdated: new Date()
            });
            
            console.log(`Saved free cabin search criteria: ${result._id}`);
        } else {
            console.log('No search criteria found in API response');
        }
        
        console.log('Free cabin search criteria sync completed');
    } catch (error) {
        console.error('Error syncing free cabin search criteria:', error);
        throw error;
    }
};

// Sync free cabin packages for a specific period
export const syncFreeCabinPackages = async (periodFrom: string, periodTo: string, filters?: {
    locations?: number[];
    countries?: number[];
    regions?: number[];
    packages?: number[];
    ignoreOptions?: boolean;
}) => {
    try {
        console.log(`Starting free cabin packages sync for period ${periodFrom} to ${periodTo}...`);
        
        const searchRequest = {
            periodFrom,
            periodTo,
            ...filters
        };
        
        const packages = await api.searchFreeCabinPackages(searchRequest);
        console.log('Free cabin packages API response:', JSON.stringify(packages, null, 2));
        
        if (packages?.status === 'OK' && packages.freeCabinPackages) {
            console.log(`Processing ${packages.freeCabinPackages.length} free cabin packages...`);
            
            for (const pkg of packages.freeCabinPackages) {
                // Get additional package details
                let packageDetails = null;
                try {
                    packageDetails = await api.getCabinPackageDetails(pkg.packageId);
                } catch (error) {
                    console.log(`Could not fetch details for package ${pkg.packageId}:`, error);
                }
                
                // Get yacht details if available
                let yachtDetails = null;
                if (packageDetails?.yachtId) {
                    try {
                        yachtDetails = await api.getYachtDetails(packageDetails.yachtId);
                    } catch (error) {
                        console.log(`Could not fetch yacht details for yacht ${packageDetails.yachtId}:`, error);
                    }
                }
                
                // Get location details if available
                let locationDetails = null;
                if (packageDetails?.locationId) {
                    try {
                        locationDetails = await api.getLocationDetails(packageDetails.locationId);
                    } catch (error) {
                        console.log(`Could not fetch location details for location ${packageDetails.locationId}:`, error);
                    }
                }
                
                // Get charter company details if available
                let companyDetails = null;
                if (packageDetails?.charterCompanyId) {
                    try {
                        companyDetails = await api.getCharterCompanyDetails(packageDetails.charterCompanyId);
                    } catch (error) {
                        console.log(`Could not fetch charter company details for company ${packageDetails.charterCompanyId}:`, error);
                    }
                }
                
                const result = await FreeCabinPackage.findOneAndUpdate(
                    { packageId: pkg.packageId },
                    {
                        packageId: pkg.packageId,
                        packageName: packageDetails?.packageName || undefined,
                        packageDescription: packageDetails?.packageDescription || undefined,
                        yachtId: packageDetails?.yachtId || undefined,
                        yachtName: packageDetails?.yachtName || yachtDetails?.name || undefined,
                        yachtLength: packageDetails?.yachtLength || yachtDetails?.length || undefined,
                        yachtLengthFeet: packageDetails?.yachtLengthFeet || yachtDetails?.lengthFeet || undefined,
                        yachtEquipment: yachtDetails?.equipment || undefined,
                        yachtServices: yachtDetails?.services || undefined,
                        charterCompanyId: packageDetails?.charterCompanyId || undefined,
                        charterCompanyName: packageDetails?.charterCompanyName || companyDetails?.name || undefined,
                        locationId: packageDetails?.locationId || undefined,
                        locationName: packageDetails?.locationName || locationDetails?.name || undefined,
                        regionId: packageDetails?.regionId || undefined,
                        regionName: packageDetails?.regionName || undefined,
                        countryId: packageDetails?.countryId || undefined,
                        countryName: packageDetails?.countryName || undefined,
                        cabinPackagePeriods: pkg.cabinPackagePeriods || [],
                        cabinPackageCabins: packageDetails?.cabinPackageCabins || undefined,
                        cabinPackagePrices: packageDetails?.cabinPackagePrices || undefined,
                        status: pkg.status || 'FREE',
                        ignoreOptions: pkg.ignoreOptions || false
                    },
                    { upsert: true, new: true }
                );
                
                console.log(`Saved free cabin package: ${pkg.packageId}`);
            }
        } else {
            console.log('No free cabin packages found in API response');
        }
        
        console.log('Free cabin packages sync completed');
    } catch (error) {
        console.error('Error syncing free cabin packages:', error);
        throw error;
    }
};

// Sync free cabin packages for current week
export const syncCurrentWeekFreeCabinPackages = async () => {
    try {
        const today = new Date();
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay() + 1); // Start of current week (Monday)
        
        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // End of current week (Sunday)
        
        const periodFrom = currentWeekStart.toISOString().split('T')[0];
        const periodTo = currentWeekEnd.toISOString().split('T')[0];
        
        console.log(`Syncing free cabin packages for current week: ${periodFrom} to ${periodTo}`);
        
        await syncFreeCabinPackages(periodFrom, periodTo);
        
        console.log('Current week free cabin packages sync completed');
    } catch (error) {
        console.error('Error syncing current week free cabin packages:', error);
        throw error;
    }
};