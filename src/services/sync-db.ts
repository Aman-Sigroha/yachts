import mongoose from 'mongoose';
import { connectDB } from '../db/connection';
import * as api from '../sync';
import { Base, Country, Equipment, YachtCategory, Service, YachtBuilder, CharterCompany } from '../models/catalogue';
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
                        const result = await Yacht.findOneAndUpdate(
                            { id: yacht.id },
                            {
                                ...yacht,
                                charterCompanyId: company.id,
                                name: toMultilingualText(yacht.name),
                                description: toMultilingualText(yacht.description),
                                highlights: toMultilingualText(yacht.highlights),
                                note: toMultilingualText(yacht.note),
                                length: toNumber(yacht.length),
                                draft: toNumber(yacht.draft),
                                beam: toNumber(yacht.beam),
                                deposit: toNumber(yacht.deposit)
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
                            const result = await Yacht.findOneAndUpdate(
                                { id: yacht.id },
                                {
                                    ...yacht,
                                    charterCompanyId: company.id,
                                    name: toMultilingualText(yacht.name),
                                    description: toMultilingualText(yacht.description),
                                    highlights: toMultilingualText(yacht.highlights),
                                    note: toMultilingualText(yacht.note),
                                    length: toNumber(yacht.length),
                                    draft: toNumber(yacht.draft),
                                    beam: toNumber(yacht.beam),
                                    deposit: toNumber(yacht.deposit)
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

        // Sync yacht models
        console.log('Fetching yacht models...');
        const models = await api.getAllYachtModels();
        console.log('Models API response:', JSON.stringify(models, null, 2));
        if (models?.models) {
            console.log(`Processing ${models.models.length} models...`);
            for (const model of models.models) {
                const result = await YachtModel.findOneAndUpdate(
                    { id: model.id },
                    { ...model, name: toMultilingualText(model.name) },
                    { upsert: true, new: true }
                );
                console.log(`Saved model: ${model.id}`);
            }
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
        
        console.log('Full data sync completed successfully');
    } catch (error) {
        console.error('Error during full data sync:', error);
        throw error;
    }
};