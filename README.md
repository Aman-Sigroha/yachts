
# 🚢 Yacht Charter API v4.0

A comprehensive Node.js/TypeScript API for yacht charter management with advanced filtering, search capabilities, automated data synchronization, yacht availability management, and detailed yacht specifications.

## ✨ **Current Status: PRODUCTION READY** ✅

- **🌐 Production Server**: `http://3.69.225.186:3000`
- **📚 API Documentation**: `http://3.69.225.186:3000/api-docs`
- **🚀 All Features Working**: Search, filtering, catalogue, automated sync, availability, cabin charter API, comprehensive yacht specifications
- **🔧 Swagger Fixed**: No more YAML syntax errors - all @openapi tags corrected to @swagger
- **🧹 Production Cleaned**: Optimized production environment
- **🛥️ Cabin Charter API**: New endpoints for cabin charter bases and companies
- **🔧 Journey Sync Fixed**: Resolved sync errors for complete data synchronization
- **⚓ Comprehensive Yacht Data**: 50+ new yacht specification fields including sailing equipment, model specs, berth details, and more
- **🔍 Advanced Filtering**: 50+ filter parameters including charter type, propulsion type, model specifications, and equipment filters
- **⭐ Yacht Ratings API**: Complete euminia ratings system with cleanliness, equipment, service, and price performance scores
- **🔧 Equipment & Services Sync**: Fixed data extraction from Nausys API - now properly syncs yacht equipment, services, and pricing
- **📊 Real-time Cabin Charter Data**: 17 active cabin charter packages with comprehensive pricing and availability
- **🖼️ Sized Pictures**: All yacht pictures now include `?w=600&h=600` parameters for consistent sizing
- **⚓ Complete Equipment Data**: Standard equipment now properly populated from Nausys API
- **🔧 TypeScript Fixed**: All compilation errors resolved with proper type definitions

## 🎯 **Key Features**

- 🚢 **Comprehensive Yacht Management**: Full CRUD operations for yacht data with 50+ specification fields
- 📊 **Advanced Filtering & Search**: 50+ filter parameters including charter type, propulsion type, model specifications, and equipment filters
- 🔄 **Automated Data Synchronization**: Daily sync with Nausys API v6 (including cabin charter data and detailed yacht specifications)
- 🌍 **Multi-language Support**: Handle text in 20+ languages including EN, DE, FR, IT, ES, HR, CZ, HU, LT, LV, NL, NO, PL, RU, SE, SI, SK, TR
- 🎛️ **Smart Catalogue System**: Active filters with yacht counts
- 🛡️ **Smart Conflict Resolution**: Prevents duplicate key errors during sync
- 📈 **Real-time Data**: Fresh data every 24 hours via automated cron jobs
- 🔍 **Debug Endpoints**: Built-in troubleshooting and data inspection
- 📚 **Complete API Documentation**: Auto-generated Swagger/OpenAPI docs
- 📅 **Yacht Availability Management**: Check availability, calendar views, and bulk availability for multiple yachts
- 🗺️ **Advanced Location Filtering**: Multi-language country, region, and location filtering with hierarchical data population
- 🚀 **Journey-Based Filtering**: Filter yachts by actual charter routes (start/end destinations)
- ✅ **Free Yachts Filtering**: Get only available yachts for specific date ranges with external API integration
- 🛥️ **Cabin Charter API**: Complete API for cabin charter bases and companies with filtering and pagination
- 🚢 **Free Cabin Charter API**: Real-time cabin charter package availability with comprehensive pricing, location, and yacht information
- ⚓ **Detailed Yacht Specifications**: Comprehensive yacht data including sailing equipment, model specifications, berth details, and technical specifications
- 🔧 **Equipment & Services API**: Dedicated endpoints for yacht equipment, services, pricing, and ratings

## 🚀 **Quick Start**

### **Local Development**
```bash
# Clone and install dependencies
git clone <repository-url>
cd yachts
npm install

# Set up environment variables
cp env.template .env
# Edit .env with your MongoDB and Nausys API credentials

# Start development server
npm run dev
```

### **Production Deployment**
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🌐 **API Endpoints**

### **Yachts & Search**
- `GET /api/yachts` - Advanced search with filtering, pagination, sorting, and date-based availability filtering
- `GET /api/yachts/search` - Search endpoint alias
- `GET /api/yachts/debug/collection-info` - Collection statistics and sample data
- `GET /api/yachts/debug/yacht/:id` - Debug specific yacht retrieval

### **Yacht Availability**
- `GET /api/yachts/{id}/availability` - Check yacht availability for a specific date range
- `GET /api/yachts/{id}/calendar` - Monthly calendar view with availability status
- `GET /api/yachts/{id}/availability-summary` - Availability statistics and next available periods
- `GET /api/yachts/bulk-availability` - Check availability for multiple yachts in a date range

### **Catalogue & Filters**
- `GET /api/catalogue/filters` - All filter options with yacht counts
- `GET /api/catalogue/filters/active` - Only active filters (with associated yachts)
- `GET /api/catalogue/categories/active` - Active categories with yacht counts
- `GET /api/catalogue/builders/active` - Active builders with yacht counts
- `GET /api/catalogue/bases/active` - Active bases with yacht counts
- `GET /api/catalogue/charter-companies/active` - Active companies with yacht counts
- `GET /api/catalogue/countries` - All countries with multi-language names
- `GET /api/catalogue/regions` - All regions with multi-language names
- `GET /api/catalogue/locations` - All locations/marinas with multi-language names

### **Cabin Charter API**
- `GET /api/cabin-charters/bases` - List cabin charter bases with filtering and pagination
- `GET /api/cabin-charters/bases/:id` - Get specific cabin charter base details
- `GET /api/cabin-charters/bases/by-company/:companyId` - Get bases by company
- `GET /api/cabin-charters/bases/by-location/:locationId` - Get bases by location
- `GET /api/cabin-charters/companies` - List cabin charter companies with filtering and pagination
- `GET /api/cabin-charters/companies/:id` - Get specific cabin charter company details
- `GET /api/cabin-charters/companies/by-country/:countryId` - Get companies by country
- `GET /api/cabin-charters/catalogue` - Combined bases and companies data
- `GET /api/cabin-charters/filters` - Available filter options for cabin charter data

### **Free Cabin Charter API**
- `GET /api/free-cabin-charter/search-criteria` - Get available search criteria (countries, regions, locations, packages)
- `POST /api/free-cabin-charter/search` - Search free cabin charter packages with filters
- `GET /api/free-cabin-charter/current-week` - Get current week free cabin charter packages
- `GET /api/free-cabin-charter/packages` - List all free cabin charter packages with pagination
- `GET /api/free-cabin-charter/packages/:id` - Get specific free cabin charter package details
- `GET /api/free-cabin-charter/comprehensive` - Get comprehensive free cabin charter data for UI
- `POST /api/free-cabin-charter/sync` - Sync free cabin charter data from Nausys API

### **Yacht Equipment & Services API**
- `GET /api/yacht-equipment` - List yacht equipment with filtering and pagination
- `GET /api/yacht-equipment/:id` - Get specific equipment details
- `GET /api/yacht-equipment/yacht/:yachtId` - Get equipment for specific yacht
- `GET /api/yacht-equipment/categories` - Get available equipment categories
- `GET /api/yacht-services` - List yacht services with filtering and pagination
- `GET /api/yacht-services/:id` - Get specific service details
- `GET /api/yacht-services/yacht/:yachtId` - Get services for specific yacht
- `GET /api/yacht-services/categories` - Get available service categories
- `GET /api/yacht-pricing` - List yacht pricing with filtering and pagination
- `GET /api/yacht-pricing/:id` - Get specific pricing details
- `GET /api/yacht-pricing/yacht/:yachtId` - Get pricing for specific yacht
- `GET /api/yacht-pricing/calculate` - Calculate pricing for specific dates
- `GET /api/yacht-ratings` - List yacht ratings with filtering and pagination
- `GET /api/yacht-ratings/:id` - Get specific rating details
- `GET /api/yacht-ratings/yacht/:yachtId` - Get ratings for specific yacht
- `GET /api/yacht-ratings/summary` - Get rating summary statistics

### **Other Endpoints**
- `GET /api/invoices` - Invoice management
- `GET /api/reservations` - Reservation data
- `GET /api/contacts` - Contact information

## 🔍 **Advanced Search & Filtering**

### **Query Parameters**

#### **Basic Filters**
- `q` - Text search in yacht names and highlights
- `category`, `builder`, `base`, `charterCompany` - ID-based filters
- `minCabins`/`maxCabins` - Cabin range filtering
- `minDraft`/`maxDraft` - Draft measurement range
- `minEnginePower`/`maxEnginePower` - Engine power range
- `minDeposit`/`maxDeposit` - Deposit amount range
- `minToilets`/`maxToilets` - Toilets/bathrooms range filtering
- `minLength`/`maxLength` - Yacht length range filtering
- `minYear`/`maxYear` - Build year range filtering
- `minBerths`/`maxBerths` - Berths/sleeping capacity range filtering
- `minBeam`/`maxBeam` - Yacht beam/width range filtering
- `isPremium` - Filter for premium yachts only (boolean)
- `onSale` - Filter for yachts on sale only (boolean)
- `fuelType` - Filter by fuel type (string)

#### **Advanced Yacht Specification Filters**
- `charterType` - Filter by charter type (BAREBOAT, CREWED, SKIPPERED)
- `propulsionType` - Filter by propulsion type (SAIL, MOTOR, CATAMARAN)
- `fourStarCharter` - Filter for four-star charter yachts (boolean)
- `sailTypeId` - Filter by sail type ID (integer)
- `steeringTypeId` - Filter by steering type ID (integer)
- `genoaTypeId` - Filter by genoa type ID (integer)
- `rudderBlades` - Filter by number of rudder blades (integer)
- `mySeaCode` - Filter by MySea code (string)

#### **Model Specification Filters**
- `minModelLength`/`maxModelLength` - Model length range filtering
- `minModelBeam`/`maxModelBeam` - Model beam range filtering
- `minModelDraft`/`maxModelDraft` - Model draft range filtering
- `minDisplacement`/`maxDisplacement` - Displacement range filtering
- `minVirtualLength`/`maxVirtualLength` - Virtual length range filtering

#### **Berth Specification Filters**
- `minBerthsCabin`/`maxBerthsCabin` - Cabin berths range filtering
- `minBerthsSalon`/`maxBerthsSalon` - Salon berths range filtering
- `minBerthsCrew`/`maxBerthsCrew` - Crew berths range filtering

#### **Location & Journey Filters**
- `startDate`/`endDate` - Date range filtering for yacht availability (YYYY-MM-DD format)
- `country`, `region`, `location` - Location-based filtering with multi-language support
- `startDestination`/`endDestination` - Journey-based filtering by charter route destinations
- `free` - Filter for available yachts only (requires startDate and endDate)

#### **Pagination & Sorting**
- `page`, `limit` - Pagination
- `sortBy`, `sortOrder` - Sorting options

### **Date-Based Availability Filtering**
The main `/api/yachts` endpoint now supports date filtering to return only yachts available within the specified date range:

```bash
# Example: Get yachts with 5-8 cabins available from Jan 15-25, 2025
GET /api/yachts?minCabins=5&maxCabins=8&startDate=2025-01-15&endDate=2025-01-25

# Example: Search for "Blue" yachts available in March 2025
GET /api/yachts?q=Blue&startDate=2025-03-01&endDate=2025-03-31

# Example: Filter by yacht specifications
GET /api/yachts?minLength=30&maxLength=50&minToilets=2&maxToilets=4&minYear=2020&limit=10

# Example: Filter premium yachts on sale
GET /api/yachts?isPremium=true&onSale=true&minCabins=4&limit=10

# Example: Filter by fuel type and berths
GET /api/yachts?fuelType=diesel&minBerths=8&maxBerths=12&limit=10

# Example: Advanced yacht specification filtering
GET /api/yachts?charterType=BAREBOAT&propulsionType=SAIL&minModelLength=14&maxModelLength=16&limit=10

# Example: Filter by sailing equipment and berth specifications
GET /api/yachts?sailTypeId=1&steeringTypeId=2&minBerthsCabin=8&maxBerthsCabin=12&limit=10

# Example: Filter by model specifications and charter type
GET /api/yachts?charterType=CREWED&minModelBeam=8&maxModelBeam=9&minDisplacement=10000&limit=10

# Example: Complex filtering with multiple criteria
GET /api/yachts?charterType=BAREBOAT&minModelLength=14&maxModelLength=16&fourStarCharter=false&minBerthsCabin=8&limit=5
```

This feature automatically excludes yachts with conflicting reservations in the specified date range.

### **Location-Based Filtering with Multi-Language Support**
The API now supports advanced location filtering using country, region, and location names in multiple languages:

```bash
# Filter by country (supports 20+ languages)
GET /api/yachts?country=Croatia&limit=5
GET /api/yachts?country=Hrvatska&limit=5      # Croatian
GET /api/yachts?country=Chorvatsko&limit=5    # Czech
GET /api/yachts?country=Kroatien&limit=5      # German

# Filter by region
GET /api/yachts?region=Zadar&limit=5
GET /api/yachts?region=Corse&limit=5          # French
GET /api/yachts?region=Korsika&limit=5        # Czech

# Filter by specific location/marina
GET /api/yachts?location=Zadar&limit=5
GET /api/yachts?location=Ajaccio&limit=5

# Combined location filtering
GET /api/yachts?country=Croatia&region=Zadar&limit=5
GET /api/yachts?country=Francie&region=Korsika&limit=5  # Czech names
```

**Supported Languages**: English, German, French, Italian, Spanish, Croatian, Czech, Hungarian, Lithuanian, Latvian, Dutch, Norwegian, Polish, Russian, Swedish, Slovenian, Slovak, Turkish

**Location Hierarchy**: The filtering follows the hierarchy: **Base → Location → Region → Country**, ensuring accurate results based on actual yacht base locations.

### **Journey-Based Filtering (Start/End Destinations)**
The API now supports filtering yachts based on their actual available charter routes using the Nausys API's journey data:

```bash
# Filter yachts that can sail from Split to Zadar
GET /api/yachts?startDestination=Split&endDestination=Zadar&limit=5

# Filter yachts ending at a specific destination
GET /api/yachts?endDestination=Zadar&limit=5

# Filter yachts starting from a specific destination
GET /api/yachts?startDestination=Split&limit=5

# Combined with other filters
GET /api/yachts?startDestination=Split&endDestination=Zadar&minCabins=4&country=Croatia&limit=5
```

**Journey Data Source**: This feature uses the Nausys API's `/yachtReservation/v6/options` endpoint to get real charter route information, ensuring accurate journey-based filtering.

### **Free Yachts Filtering**
Get only available yachts for specific date ranges by integrating with the Nausys API's free yacht availability:

```bash
# Get only available yachts for a specific period
GET /api/yachts?free=true&startDate=2025-06-01&endDate=2025-06-08&limit=10

# Combine with other filters
GET /api/yachts?free=true&startDate=2025-06-01&endDate=2025-06-08&country=Croatia&limit=10
GET /api/yachts?free=true&startDate=2025-06-01&endDate=2025-06-08&base=102754&minCabins=4&limit=10
GET /api/yachts?free=true&startDate=2025-06-01&endDate=2025-06-08&startDestination=Split&endDestination=Zadar&limit=10
```

**Requirements**: When `free=true`, both `startDate` and `endDate` are required parameters.

**Graceful Fallback**: If the external API is unavailable or returns insufficient data, the system gracefully falls back to returning all yachts (without the free filter) to ensure API stability.

## 🛥️ **Cabin Charter API**

The cabin charter API provides comprehensive access to cabin charter bases and companies data with advanced filtering capabilities.

### **Cabin Charter Base Filtering**
```bash
# Filter bases by company
GET /api/cabin-charters/bases?companyId=102701&limit=5

# Filter bases by location
GET /api/cabin-charters/bases?locationId=55&limit=5

# Filter bases by disabled status
GET /api/cabin-charters/bases?disabled=false&limit=5

# Combined filtering
GET /api/cabin-charters/bases?companyId=102701&locationId=55&disabled=false&limit=5

# Pagination
GET /api/cabin-charters/bases?page=1&limit=10
```

### **Cabin Charter Company Filtering**
```bash
# Filter companies by country
GET /api/cabin-charters/companies?countryId=1&limit=5

# Filter companies by city
GET /api/cabin-charters/companies?city=Zagreb&limit=5

# Filter companies by PAC status
GET /api/cabin-charters/companies?pac=false&limit=5

# Combined filtering
GET /api/cabin-charters/companies?countryId=1&city=Zagreb&pac=false&limit=5
```

### **Cabin Charter Data Structure**
- **Bases**: Charter base locations with coordinates, check-in/out times, and company associations
- **Companies**: Charter companies with contact details, bank accounts, and service information
- **Multi-language Support**: Base and company information in multiple languages
- **Geographic Data**: Complete location information with coordinates for mapping

## 🛥️ **Free Cabin Charter API**

The free cabin charter API provides comprehensive access to available cabin charter packages with real-time availability, pricing, and detailed package information.

### **Free Cabin Charter Package Filtering**
```bash
# Get all available packages
GET /api/free-cabin-charter/packages?limit=10

# Filter by date range
GET /api/free-cabin-charter/comprehensive?periodFrom=2025-09-04&periodTo=2025-09-11&limit=5

# Get current week packages
GET /api/free-cabin-charter/current-week

# Search with filters
POST /api/free-cabin-charter/search
Content-Type: application/json
{
  "periodFrom": "2025-09-04",
  "periodTo": "2025-09-11",
  "locations": [51, 68],
  "countries": [1],
  "regions": [557576],
  "packages": [55683538]
}

# Get comprehensive data for UI
GET /api/free-cabin-charter/comprehensive?limit=5&page=1

# Get specific package details
GET /api/free-cabin-charter/packages/46663196

# Get search criteria for filters
GET /api/free-cabin-charter/search-criteria

# Sync data from Nausys API
POST /api/free-cabin-charter/sync
Content-Type: application/json
{}
```

### **Free Cabin Charter Data Structure**
- **Package Information**: Package ID, name, description, yacht details, charter company, location
- **Period Information**: Start/end dates, duration, multiple periods per package
- **Cabin Details**: Cabin ID, name, type, occupancy, availability, pricing
- **Pricing Information**: 1/2/3-person pricing, currency, discounts, client pricing
- **Location Data**: Country, region, location names with multi-language support
- **Real-time Availability**: Live data from Nausys API with automatic sync

### **Comprehensive API Response**
The `/comprehensive` endpoint provides UI-ready data with:
- **Package Details**: Names, descriptions, yacht specifications
- **Location Information**: Countries, regions, locations
- **Period Data**: Dates, duration, availability
- **Cabin Information**: Types, occupancy, availability, pricing
- **Pricing**: 1/2/3-person pricing with discounts
- **Pagination**: Efficient data loading with page/limit support

### **Search Criteria API**
The search criteria endpoint provides available filter options:
- **Countries**: Array of country IDs for filtering
- **Regions**: Array of region IDs for filtering  
- **Locations**: Array of location IDs for filtering
- **Packages**: Array of package IDs for filtering
- **Real-time Updates**: Automatically synced from Nausys API

## 🎯 **Key Features Explained**

### **Smart Catalogue System**
- **Active Filters**: Only shows filter options that have associated yachts
- **Yacht Counts**: Each filter displays how many yachts it contains
- **Range Information**: Provides min/max values for numeric fields
- **Frontend Optimized**: Eliminates empty filter results

### **Yacht Availability Management**
- **Individual Availability**: Check if a specific yacht is available for dates
- **Calendar Views**: Monthly calendar showing available/unavailable days
- **Availability Summary**: Statistics and next available periods
- **Bulk Operations**: Check availability for multiple yachts simultaneously

### **Advanced Search & Filtering**
- **Text Search**: Search across yacht names and highlights
- **Multi-parameter Filtering**: Combine multiple filters for precise results
- **Pagination**: Page-based results with customizable limits
- **Sorting**: Sort by various fields with ascending/descending order

## 🔧 **Development**

### **Prerequisites**
- Node.js 18+
- MongoDB 5+
- Nausys API v6 access

### **Environment Variables**
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/yacht-api

# Nausys API
NAUSYS_API_URL=https://api.nausys.com/v6
NAUSYS_API_KEY=your_api_key

# Server
PORT=3000
NODE_ENV=development
```

### **Scripts**
```bash
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
npm run test         # Run tests
```

## 📊 **Data Models**

### **Core Entities**
- **Yacht**: Charter yacht information with multilingual support
- **Reservation**: Booking details with date ranges
- **Invoice**: Financial records with automatic conflict resolution
- **Contact**: Customer and company information
- **CrewMember**: Staff details and assignments

### **Catalogue Entities**
- **Base**: Charter bases and locations with populated location details
- **Country**: Geographic information with multi-language names
- **Region**: Geographic regions with multi-language names
- **Location**: Specific marinas and locations with multi-language names
- **Journey**: Charter route information with start/end destinations
- **Equipment**: Yacht equipment and amenities
- **YachtCategory**: Yacht classifications
- **Service**: Available services
- **YachtBuilder**: Manufacturer information
- **CharterCompany**: Company details

### **Cabin Charter Entities**
- **CabinCharterBase**: Charter base locations with coordinates, check-in/out times, and company associations
- **CabinCharterCompany**: Charter companies with contact details, bank accounts, and service information

### **Free Cabin Charter Entities**
- **FreeCabinPackage**: Available cabin charter packages with comprehensive information including yacht details, pricing, availability, and location data
- **FreeCabinSearchCriteria**: Search criteria for filtering including countries, regions, locations, and packages

### **Detailed Yacht Specification Entities**
- **YachtEquipment**: Detailed equipment information for each yacht including standard and optional equipment
- **YachtService**: Available services for each yacht with pricing and availability
- **YachtPricing**: Seasonal pricing information with date ranges and rates
- **YachtRating**: Customer ratings and reviews with detailed scoring breakdowns

### **Extended Yacht Data Fields**
The yacht model now includes 50+ additional fields:

#### **Sailing-Specific Data**
- `sailTypeId`, `sailRenewed` - Sail type and renewal information
- `genoaTypeId`, `genoaRenewed` - Genoa sail specifications
- `steeringTypeId`, `rudderBlades` - Steering system details
- `mainSailType`, `genoaType`, `steeringType` - Equipment type descriptions

#### **Charter & Propulsion Details**
- `charterType` - BAREBOAT, CREWED, or SKIPPERED
- `propulsionType` - SAIL, MOTOR, or CATAMARAN
- `fourStarCharter` - Premium charter classification

#### **Model Specifications**
- `modelLoa`, `modelBeam`, `modelDraft` - Official model dimensions
- `modelDisplacement`, `modelVirtualLength` - Technical specifications
- `displacement`, `virtualLength` - Additional technical data

#### **Berth Specifications**
- `berthsCabin`, `berthsSalon`, `berthsCrew` - Detailed berth breakdown
- Enhanced berth capacity information

#### **Equipment & Services**
- `standardEquipment` - Array of standard equipment items (now properly populated from Nausys API)
- `optionalEquipment` - Array of optional equipment items
- `services` - Array of available services
- `seasonalPricing` - Array of seasonal pricing data
- `ratings` - Customer ratings and reviews

#### **Picture Management**
- `picturesUrl` - Array of yacht pictures with `?w=600&h=600` sizing parameters
- `mainPictureUrl` - Main yacht picture with sizing parameters
- All Nausys CDN URLs automatically include sizing parameters for consistent display

#### **Technical Equipment**
- Navigation: `gps`, `autopilot`, `radar`, `depthSounder`, `windInstrument`, `chartplotter`
- Safety: `lifeRaft`, `epirb`, `firstAidKit`
- Entertainment: `radio`, `cdPlayer`, `speakers`, `wifi`, `tv`, `dvd`
- Galley: `refrigerator`, `freezer`, `oven`, `stove`, `microwave`, `coffeeMachine`, `iceMaker`
- Deck: `anchorWindlass`, `hotWater`, `airConditioning`, `heating`
- Interior: `washingMachine`, `dishwasher`, `generator`, `inverter`

## 🚀 **Deployment**

### **Production Setup**
1. **Server Preparation**: Install Node.js, MongoDB, and configure firewall
2. **Application Deployment**: Clone, build, and configure environment
3. **Service Configuration**: Set up systemd service for auto-restart
4. **Automated Sync**: Configure cron jobs for daily data synchronization
5. **Monitoring**: Set up logging and health checks

### **Data Synchronization**
- **Automated**: Daily sync at 2:00 AM UTC via cron jobs
- **Manual**: On-demand sync for immediate updates
- **Conflict Resolution**: Automatic invoice collection cleanup
- **Error Handling**: Comprehensive logging and error recovery

## 🔒 **Security & Performance**

### **API Protection**
- **Rate Limiting**: Configurable request limits per time window
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Query parameter validation and sanitization
- **Error Handling**: Graceful error responses without information leakage

### **Performance Optimizations**
- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data retrieval for large datasets
- **Caching**: Built-in caching for catalogue data
- **Connection Pooling**: Optimized database connections

## 📚 **API Documentation**

### **Swagger/OpenAPI**
- **Auto-generated**: Documentation automatically generated from JSDoc comments
- **Interactive**: Test endpoints directly from the documentation
- **Comprehensive**: Covers all endpoints with examples and schemas
- **Production Ready**: Available at `/api-docs` endpoint

### **Testing**
- **Postman Collection**: Ready-to-use API testing
- **Curl Examples**: Command-line testing examples
- **Response Examples**: Sample responses for all endpoints

## 🛠️ **Troubleshooting**

### **Common Issues**
- **Empty Results**: Check if filters are too restrictive
- **Sync Errors**: Verify Nausys API credentials and connectivity
- **Swagger Issues**: Ensure proper JSDoc formatting in route files
- **Performance**: Monitor database indexes and query optimization

### **Debug Endpoints**
- **Collection Info**: `/api/yachts/debug/collection-info`
- **Yacht Debug**: `/api/yachts/debug/yacht/:id`
- **Server Logs**: Check application and system logs

## 🔮 **Future Enhancements**

### **Planned Features**
- **Real-time Updates**: WebSocket support for live data
- **Advanced Analytics**: Business intelligence and reporting
- **Multi-tenant Support**: Separate data for different organizations
- **API Versioning**: Backward compatibility management
- **Enhanced Security**: JWT authentication and role-based access

### **Performance Improvements**
- **Redis Caching**: Advanced caching layer
- **Database Sharding**: Horizontal scaling for large datasets
- **CDN Integration**: Static asset optimization
- **Load Balancing**: Multiple server instances

## 📞 **Support & Contributing**

### **Getting Help**
- **Documentation**: Comprehensive API and deployment guides
- **Debug Endpoints**: Built-in troubleshooting tools
- **Logs**: Detailed logging for issue diagnosis
- **Examples**: Ready-to-use code samples

### **Contributing**
- **Code Standards**: TypeScript with strict type checking
- **Testing**: Comprehensive test coverage
- **Documentation**: JSDoc comments for all endpoints
- **Error Handling**: Graceful failure with detailed messages

---

**Last Updated**: September 4, 2025  
**API Version**: 4.0.0  
**Status**: ✅ **PRODUCTION READY - All features working including journey-based filtering, free yachts filtering, advanced location filtering, comprehensive yacht specification filtering (50+ fields), cabin charter API, free cabin charter API with real-time availability, detailed yacht equipment/services/pricing/ratings API, sized pictures (600x600), and complete equipment data from Nausys API**

---

*Built with Node.js, TypeScript, Express, MongoDB, and automated data synchronization from Nausys API v6.*
