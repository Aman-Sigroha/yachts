# 🚢 Yacht Charter API - Complete Usage Guide

Comprehensive guide for using the Yacht Charter API v3.0 with all endpoints, filtering options, and examples.

## 🌐 **Base URL**
- **Production**: `http://3.69.225.186:3000`
- **API Documentation**: `http://3.69.225.186:3000/api-docs`

## 🚢 **Yacht Management Endpoints**

### **Search & Filter Yachts**
```bash
# Basic yacht listing with pagination
GET /api/yachts?page=1&limit=20

# Text search
GET /api/yachts?q=Blue&limit=10

# Filter by yacht specifications
GET /api/yachts?minCabins=5&maxCabins=8&minLength=30&maxLength=50&limit=10

# Filter by build year and berths
GET /api/yachts?minYear=2020&maxYear=2025&minBerths=8&maxBerths=12&limit=10

# Filter by premium status and sale status
GET /api/yachts?isPremium=true&onSale=true&limit=10

# Filter by fuel type and toilets
GET /api/yachts?fuelType=diesel&minToilets=2&maxToilets=4&limit=10

# Filter by draft and engine power
GET /api/yachts?minDraft=1.5&maxDraft=3.0&minEnginePower=200&maxEnginePower=500&limit=10

# Filter by deposit range
GET /api/yachts?minDeposit=1000&maxDeposit=5000&limit=10
```

### **Date-Based Availability Filtering**
```bash
# Get yachts available for specific dates
GET /api/yachts?startDate=2025-06-01&endDate=2025-06-08&limit=10

# Combine availability with other filters
GET /api/yachts?startDate=2025-06-01&endDate=2025-06-08&minCabins=4&country=Croatia&limit=10

# Get only available yachts (free filter)
GET /api/yachts?free=true&startDate=2025-06-01&endDate=2025-06-08&limit=10
```

### **Location-Based Filtering**
```bash
# Filter by country (multi-language support)
GET /api/yachts?country=Croatia&limit=5
GET /api/yachts?country=Hrvatska&limit=5      # Croatian
GET /api/yachts?country=Kroatien&limit=5      # German

# Filter by region
GET /api/yachts?region=Zadar&limit=5
GET /api/yachts?region=Corse&limit=5          # French

# Filter by specific location/marina
GET /api/yachts?location=Zadar&limit=5
GET /api/yachts?location=Ajaccio&limit=5

# Combined location filtering
GET /api/yachts?country=Croatia&region=Zadar&limit=5
```

### **Journey-Based Filtering**
```bash
# Filter by start destination
GET /api/yachts?startDestination=Split&limit=5

# Filter by end destination
GET /api/yachts?endDestination=Zadar&limit=5

# Filter by complete journey
GET /api/yachts?startDestination=Split&endDestination=Zadar&limit=5

# Combine with other filters
GET /api/yachts?startDestination=Split&endDestination=Zadar&minCabins=4&country=Croatia&limit=5
```

### **Yacht Availability Management**
```bash
# Check individual yacht availability
GET /api/yachts/{yachtId}/availability?startDate=2025-06-01&endDate=2025-06-08

# Get monthly calendar view
GET /api/yachts/{yachtId}/calendar?year=2025&month=6

# Get availability summary
GET /api/yachts/{yachtId}/availability-summary

# Check bulk availability for multiple yachts
GET /api/yachts/bulk-availability?yachtIds=479287,479288,479289&startDate=2025-06-01&endDate=2025-06-08
```

## 🛥️ **Cabin Charter API Endpoints**

### **Cabin Charter Bases**
```bash
# List all bases with pagination
GET /api/cabin-charters/bases?page=1&limit=20

# Filter bases by company
GET /api/cabin-charters/bases?companyId=102701&limit=10

# Filter bases by location
GET /api/cabin-charters/bases?locationId=55&limit=10

# Filter bases by disabled status
GET /api/cabin-charters/bases?disabled=false&limit=10

# Combined filtering
GET /api/cabin-charters/bases?companyId=102701&locationId=55&disabled=false&limit=10

# Get specific base details
GET /api/cabin-charters/bases/102755

# Get bases by company
GET /api/cabin-charters/bases/by-company/102701?limit=10

# Get bases by location
GET /api/cabin-charters/bases/by-location/55?limit=10
```

### **Cabin Charter Companies**
```bash
# List all companies with pagination
GET /api/cabin-charters/companies?page=1&limit=20

# Filter companies by country
GET /api/cabin-charters/companies?countryId=1&limit=10

# Filter companies by city
GET /api/cabin-charters/companies?city=Zagreb&limit=10

# Filter companies by PAC status
GET /api/cabin-charters/companies?pac=false&limit=10

# Combined filtering
GET /api/cabin-charters/companies?countryId=1&city=Zagreb&pac=false&limit=10

# Get specific company details
GET /api/cabin-charters/companies/102701

# Get companies by country
GET /api/cabin-charters/companies/by-country/1?limit=10
```

### **Cabin Charter Catalogue & Filters**
```bash
# Get combined bases and companies data
GET /api/cabin-charters/catalogue?limit=10

# Get available filter options
GET /api/cabin-charters/filters
```

## 📊 **Catalogue & Filter Endpoints**

### **Active Filters**
```bash
# Get all active filters with yacht counts
GET /api/catalogue/filters/active

# Get active categories
GET /api/catalogue/categories/active

# Get active builders
GET /api/catalogue/builders/active

# Get active bases
GET /api/catalogue/bases/active

# Get active charter companies
GET /api/catalogue/charter-companies/active
```

### **Geographic Data**
```bash
# Get all countries with multi-language names
GET /api/catalogue/countries?limit=50

# Get all regions with multi-language names
GET /api/catalogue/regions?limit=50

# Get all locations/marinas with multi-language names
GET /api/catalogue/locations?limit=50
```

## 🔍 **Debug & Monitoring Endpoints**

### **Collection Information**
```bash
# Get yacht collection statistics
GET /api/yachts/debug/collection-info

# Debug specific yacht retrieval
GET /api/yachts/debug/yacht/{yachtId}
```

### **Other Data Endpoints**
```bash
# Invoice management
GET /api/invoices?limit=10

# Reservation data
GET /api/reservations?limit=10

# Contact information
GET /api/contacts?limit=10
```

## 📚 **API Documentation**

### **Swagger/OpenAPI Documentation**
```bash
# Access interactive API documentation
GET /api-docs

# Get OpenAPI JSON specification
GET /api-docs/swagger.json
```

## 🎯 **Common Query Parameters**

### **Pagination**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

### **Sorting**
- `sortBy` - Field to sort by
- `sortOrder` - Sort order (asc/desc)

### **Yacht Specifications**
- `minCabins`/`maxCabins` - Cabin range
- `minDraft`/`maxDraft` - Draft measurement range
- `minEnginePower`/`maxEnginePower` - Engine power range
- `minDeposit`/`maxDeposit` - Deposit amount range
- `minToilets`/`maxToilets` - Toilets/bathrooms range
- `minLength`/`maxLength` - Yacht length range
- `minYear`/`maxYear` - Build year range
- `minBerths`/`maxBerths` - Berths/sleeping capacity range
- `minBeam`/`maxBeam` - Yacht beam/width range

### **Status Filters**
- `isPremium` - Filter for premium yachts (boolean)
- `onSale` - Filter for yachts on sale (boolean)
- `fuelType` - Filter by fuel type (string)
- `disabled` - Filter by disabled status (boolean)
- `pac` - Filter by PAC status (boolean)

### **Location Filters**
- `country` - Country name (multi-language)
- `region` - Region name (multi-language)
- `location` - Location/marina name (multi-language)
- `countryId` - Country ID
- `locationId` - Location ID

### **Journey Filters**
- `startDestination` - Start destination name
- `endDestination` - End destination name

### **Date Filters**
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `free` - Only available yachts (requires startDate and endDate)

### **Cabin Charter Filters**
- `companyId` - Charter company ID
- `city` - Company city name

## 📝 **Response Format**

### **Standard Response Structure**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### **Error Response Structure**
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🌍 **Multi-Language Support**

The API supports filtering by location names in 20+ languages:

**Supported Languages**: English, German, French, Italian, Spanish, Croatian, Czech, Hungarian, Lithuanian, Latvian, Dutch, Norwegian, Polish, Russian, Swedish, Slovenian, Slovak, Turkish

**Examples**:
```bash
# Croatia in different languages
GET /api/yachts?country=Croatia&limit=5      # English
GET /api/yachts?country=Hrvatska&limit=5     # Croatian
GET /api/yachts?country=Kroatien&limit=5     # German
GET /api/yachts?country=Chorvatsko&limit=5   # Czech
```

## 🔧 **Testing Examples**

### **PowerShell/Windows**
```powershell
# Test basic endpoint
Invoke-RestMethod -Uri "http://3.69.225.186:3000/api/yachts?limit=5" -Method GET

# Test cabin charter endpoint
Invoke-RestMethod -Uri "http://3.69.225.186:3000/api/cabin-charters/bases?limit=5" -Method GET

# Test with filters
Invoke-RestMethod -Uri "http://3.69.225.186:3000/api/yachts?minCabins=5&maxCabins=8&limit=5" -Method GET
```

### **cURL**
```bash
# Test basic endpoint
curl "http://3.69.225.186:3000/api/yachts?limit=5"

# Test cabin charter endpoint
curl "http://3.69.225.186:3000/api/cabin-charters/bases?limit=5"

# Test with filters
curl "http://3.69.225.186:3000/api/yachts?minCabins=5&maxCabins=8&limit=5"
```

### **JavaScript/Fetch**
```javascript
// Test basic endpoint
fetch('http://3.69.225.186:3000/api/yachts?limit=5')
  .then(response => response.json())
  .then(data => console.log(data));

// Test cabin charter endpoint
fetch('http://3.69.225.186:3000/api/cabin-charters/bases?limit=5')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🚨 **Error Handling**

### **Common HTTP Status Codes**
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### **Error Response Examples**
```json
{
  "success": false,
  "message": "Yacht not found"
}
```

## 📊 **Data Synchronization**

The API automatically synchronizes data with the Nausys API v6 every 24 hours. This includes:
- Yacht data
- Reservation data
- Catalogue data
- Journey data
- **Cabin charter data** (bases and companies)

Manual sync can be triggered by running:
```bash
npm run sync
```

## 🔒 **Rate Limiting & Performance**

- **Rate Limiting**: Configurable request limits per time window
- **Pagination**: Maximum 100 items per page
- **Caching**: Built-in caching for catalogue data
- **Database Indexing**: Optimized queries with proper indexes

## 📞 **Support**

For additional support or questions:
- **API Documentation**: `http://3.69.225.186:3000/api-docs`
- **Debug Endpoints**: Use `/debug/` endpoints for troubleshooting
- **Logs**: Check application logs for detailed error information

---

**Last Updated**: September 2, 2025  
**API Version**: 3.0.0  
**Status**: ✅ **PRODUCTION READY**

---

*This guide covers all available endpoints and features of the Yacht Charter API v3.0 including the new cabin charter API.*
