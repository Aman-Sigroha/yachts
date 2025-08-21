# 🚢 Yacht Charter API v3.0

A comprehensive Node.js/TypeScript API for yacht charter management with advanced filtering, search capabilities, automated data synchronization, and yacht availability management.

## ✨ **Current Status: PRODUCTION READY** ✅

- **🌐 Production Server**: `http://3.69.225.186:3000`
- **📚 API Documentation**: `http://3.69.225.186:3000/api-docs`
- **🚀 All Features Working**: Search, filtering, catalogue, automated sync, availability
- **🔧 Swagger Fixed**: No more YAML syntax errors
- **🧹 Production Cleaned**: Optimized production environment

## 🎯 **Key Features**

- 🚢 **Comprehensive Yacht Management**: Full CRUD operations for yacht data
- 📊 **Advanced Filtering & Search**: Multi-parameter filtering, text search, pagination, and date-based availability filtering
- 🔄 **Automated Data Synchronization**: Daily sync with Nausys API v6
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

### **Other Endpoints**
- `GET /api/invoices` - Invoice management
- `GET /api/reservations` - Reservation data
- `GET /api/contacts` - Contact information

## 🔍 **Advanced Search & Filtering**

### **Query Parameters**
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
- `startDate`/`endDate` - Date range filtering for yacht availability (YYYY-MM-DD format)
- `country`, `region`, `location` - Location-based filtering with multi-language support
- `startDestination`/`endDestination` - Journey-based filtering by charter route destinations
- `free` - Filter for available yachts only (requires startDate and endDate)
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

**Last Updated**: August 20, 2025  
**API Version**: 3.0.0  
**Status**: ✅ **PRODUCTION READY - All features working including journey-based filtering, free yachts filtering, advanced location filtering, and comprehensive yacht specification filtering**

---

*Built with Node.js, TypeScript, Express, MongoDB, and automated data synchronization from Nausys API v6.*
