import mongoose from 'mongoose';
import { connectDB } from '../db/connection';
import * as api from '../sync';
import { Base, Country, Equipment, YachtCategory, Service, YachtBuilder, CharterCompany, Region, Location, Journey } from '../models/catalogue';
import { Yacht, YachtModel } from '../models/yacht';
import { Reservation, Occupancy } from '../models/reservation';
import { CrewMember } from '../models/crew';
import { Invoice } from '../models/invoice';
import { Contact } from '../models/contact';

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
                                name: toMultilingualText(yacht.name),
                                description: toMultilingualText(yacht.description),
                                highlights: toMultilingualText(yacht.highlights),
                                note: toMultilingualText(yacht.note),
                                // Convert numeric fields that might come as strings from API
                                length: toNumber(yacht.length || modelSpecs?.loa), // Use yacht.length or fallback to model.loa
                                cabins: toNumber(yacht.cabins),
                                berths: toNumber(yacht.berthsTotal || yacht.berths), // Use berthsTotal from Nausys API
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
                                modelVirtualLength: modelSpecs?.virtualLength
                            },
                            { upsert: true, new: true }
                        );
                        console.log(`Saved yacht: ${yacht.id} for company ${company.id}`);
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
                                    name: toMultilingualText(yacht.name),
                                    description: toMultilingualText(yacht.description),
                                    highlights: toMultilingualText(yacht.highlights),
                                    note: toMultilingualText(yacht.note),
                                    // Convert numeric fields that might come as strings from API
                                    length: toNumber(yacht.length || modelSpecs?.loa), // Use yacht.length or fallback to model.loa
                                    cabins: toNumber(yacht.cabins),
                                    berths: toNumber(yacht.berthsTotal || yacht.berths), // Use berthsTotal from Nausys API
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
                                    modelVirtualLength: modelSpecs?.virtualLength
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
                        periodFrom: new Date(option.periodFrom.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')),
                        periodTo: new Date(option.periodTo.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')),
                        optionTill: new Date(option.optionTill.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1')),
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
        await syncYachtData();
        await syncReservationData();
        await syncCrewData();
        await syncInvoiceData();
        await syncContactData();
                await syncJourneyData();
        
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
}