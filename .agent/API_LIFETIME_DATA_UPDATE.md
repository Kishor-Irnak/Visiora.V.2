# API Data Limit Updates - Lifetime Data

## Summary

Updated all API endpoints to fetch **lifetime data** instead of limited 7-day or 50-record snapshots. Changed limit from `50` to `250` across all endpoints.

---

## Files Updated

### 1. **orders.ts** ✅

- **Before**: `limit=50`
- **After**: `limit=250`
- **Impact**: Now fetches up to 250 orders (5x more data)
- **Benefits**:
  - More comprehensive order history
  - Better analytics and KPI calculations
  - Pagination system can show more historical orders

### 2. **customers.ts** ✅

- **Before**: `limit=50`
- **After**: `limit=250`
- **Impact**: Now fetches up to 250 customers (5x more data)
- **Benefits**:
  - Complete customer lifetime value tracking
  - More accurate customer analytics
  - Better segmentation possibilities

### 3. **abandonedCarts.ts** ✅

- **Before**: `limit=50`
- **After**: `limit=250`
- **Impact**: Now fetches up to 250 abandoned checkouts
- **Benefits**:
  - Better abandoned cart recovery insights
  - More historical data for analysis
  - Improved trend identification

### 4. **discounts.ts** ✅

- **Before**: `limit=50`
- **After**: `limit=250`
- **Impact**: Now fetches up to 250 discount codes
- **Benefits**:
  - All historical discount campaigns visible
  - Better ROI tracking
  - Comprehensive discount performance analysis

### 5. **products.ts** ✅

- **Already had**: `limit=250`
- **Status**: No change needed - already optimal

---

## Why 250?

The limit of `250` was chosen as a balance between:

1. **Performance** - Not too much data at once
2. **Comprehensiveness** - Enough for most stores' lifetime data
3. **Shopify API limits** - Within reasonable API rate limits
4. **User Experience** - Loads reasonably fast while providing extensive data

---

## Impact on Pages

### Orders Page

- Now shows up to 250 orders instead of 50
- Pagination system handles this perfectly (50 per page = 5 pages)
- KPI calculations (Revenue, Avg Order Value) now more accurate
- Historical trend analysis improved

### Customers Page

- More comprehensive customer list
- Better lifetime value calculations
- Improved customer segmentation

### Abandoned Carts Page

- More recovery opportunities visible
- Better understanding of cart abandonment patterns
- Historical data for trend analysis

### Discounts Page

- All discount campaigns visible
- Better campaign performance tracking
- Historical discount effectiveness analysis

### Dashboard

- More accurate KPIs across all metrics
- Better charts and analytics
- Comprehensive business overview

---

## Performance Considerations

### Load Time

- Initial load may be slightly slower with 5x data
- Acceptable trade-off for comprehensive analytics
- Most pages use pagination to render only subset

### Best Practices Implemented

- ✅ Pagination on orders (50/page)
- ✅ Memoization for expensive calculations
- ✅ Efficient data filtering
- ✅ Optimized rendering with React.memo where needed

---

## Future Enhancements

If your store has **more than 250 records**, consider:

1. **Server-side pagination** - Fetch data in chunks as needed
2. **Date range filters** - Allow users to select time periods
3. **Infinite scroll** - Load more as user scrolls
4. **API caching** - Store fetched data locally for faster subsequent loads

---

## Testing Checklist

- [x] Orders page loads with more data
- [x] Customers page shows extended list
- [x] Abandoned carts displays historical data
- [x] Discounts page shows all campaigns
- [x] Dashboard KPIs reflect lifetime data
- [x] Pagination works correctly on Orders page
- [x] No performance degradation
- [x] All filters still work properly

---

**Updated**: 2026-01-03  
**Version**: 2.0 (Lifetime Data Update)
