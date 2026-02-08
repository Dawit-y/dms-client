import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';
import { useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * Custom hook that centralizes all URL state management using nuqs
 * Automatically resets page to 1 when regionId or any search key changes
 *
 * @param {Object} searchKeysConfig - Configuration for dynamic search keys
 * @param {string[]} searchKeysConfig.textSearchKeys - Array of text search field names (e.g., ['title', 'name'])
 * @param {Array} searchKeysConfig.dropdownSearchKeys - Array of dropdown search configs (e.g., [{key: 'status', ...}])
 * @param {string[]} searchKeysConfig.dateSearchKeys - Array of date search field names (e.g., ['created'])
 */
export const usePageFilters = (searchKeysConfig = {}) => {
  const {
    textSearchKeys = [],
    dropdownSearchKeys = [],
    dateSearchKeys = [],
  } = searchKeysConfig;

  // Build dynamic URL schema based on search keys
  const urlSchema = useMemo(() => {
    const schema = {
      // Tree/Location filters (same across all pages)
      regionId: parseAsString,
      zoneId: parseAsString,
      woredaId: parseAsString,
      include: parseAsInteger.withDefault(1),

      // Pagination (same across all pages)
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(10),
    };

    // Add dynamic text search keys (e.g., 'title', 'name', etc.)
    textSearchKeys.forEach((key) => {
      schema[key] = parseAsString;
    });

    // Add dynamic dropdown search keys
    dropdownSearchKeys.forEach(({ key }) => {
      schema[key] = parseAsString;
    });

    // Add dynamic date search keys (with _start and _end suffixes)
    dateSearchKeys.forEach((key) => {
      schema[`${key}_start`] = parseAsString;
      schema[`${key}_end`] = parseAsString;
    });

    return schema;
  }, [textSearchKeys, dropdownSearchKeys, dateSearchKeys]);

  // Define all URL search params with parsers
  const [filters, setFilters] = useQueryStates(urlSchema, {
    shallow: false, // Use false for server-side data fetch
    clearOnDefault: false, // Remove from URL if value is default
  });

  // Track previous values to detect changes
  const prevRegionIdRef = useRef(filters.regionId);
  const prevSearchKeysRef = useRef({});

  // Build array of all search key values for comparison
  const currentSearchValues = useMemo(() => {
    const values = {};
    textSearchKeys.forEach((key) => {
      values[key] = filters[key];
    });
    dropdownSearchKeys.forEach(({ key }) => {
      values[key] = filters[key];
    });
    dateSearchKeys.forEach((key) => {
      values[`${key}_start`] = filters[`${key}_start`];
      values[`${key}_end`] = filters[`${key}_end`];
    });
    return values;
  }, [filters, textSearchKeys, dropdownSearchKeys, dateSearchKeys]);

  // Reset page to 1 when regionId or any search key changes (but NOT when only page changes)
  useEffect(() => {
    const regionIdChanged = prevRegionIdRef.current !== filters.regionId;

    // Check if any search key changed
    const searchKeysChanged = Object.keys(currentSearchValues).some(
      (key) => prevSearchKeysRef.current[key] !== currentSearchValues[key]
    );

    // Only reset page if regionId or search keys changed (not if only page changed)
    if ((regionIdChanged || searchKeysChanged) && filters.page !== 1) {
      setFilters({ page: 1 }, { shallow: false });
    }

    prevRegionIdRef.current = filters.regionId;
    prevSearchKeysRef.current = currentSearchValues;
    // Note: filters.page is intentionally NOT in dependencies to prevent reset on page-only changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.regionId,
    setFilters,
    currentSearchValues,
    textSearchKeys,
    dropdownSearchKeys,
    dateSearchKeys,
  ]);

  // Helper function to update filters and reset page if needed
  // This merges updates with existing filters (nuqs setFilters needs all values)
  const updateFilters = useCallback(
    (updates, options = {}) => {
      const shouldResetPage =
        updates.regionId !== undefined ||
        updates.zoneId !== undefined ||
        updates.woredaId !== undefined ||
        // Check if any search key is being updated
        textSearchKeys.some((key) => updates[key] !== undefined) ||
        dropdownSearchKeys.some(({ key }) => updates[key] !== undefined) ||
        dateSearchKeys.some(
          (key) =>
            updates[`${key}_start`] !== undefined ||
            updates[`${key}_end`] !== undefined
        );

      // Get current filters at call time (not from closure)
      setFilters(
        (currentFilters) => {
          // Merge updates with current filters to preserve all values
          const mergedUpdates = shouldResetPage
            ? { ...currentFilters, ...updates, page: 1 }
            : { ...currentFilters, ...updates };

          return mergedUpdates;
        },
        {
          shallow: options.shallow ?? false,
          ...options,
        }
      );
    },
    [setFilters, textSearchKeys, dropdownSearchKeys, dateSearchKeys]
  );

  // Helper to clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      regionId: null,
      zoneId: null,
      woredaId: null,
      include: 0,
      page: 1,
      pageSize: 10,
    };

    // Clear all dynamic search keys
    textSearchKeys.forEach((key) => {
      clearedFilters[key] = null;
    });
    dropdownSearchKeys.forEach(({ key }) => {
      clearedFilters[key] = null;
    });
    dateSearchKeys.forEach((key) => {
      clearedFilters[`${key}_start`] = null;
      clearedFilters[`${key}_end`] = null;
    });

    setFilters(clearedFilters, { shallow: false });
  }, [setFilters, textSearchKeys, dropdownSearchKeys, dateSearchKeys]);

  // Convert filters to API params format
  const getApiParams = useCallback(() => {
    const params = {
      page: filters.page,
      per_page: filters.pageSize,
    };

    // Tree/Location params
    if (filters.regionId) {
      params.prj_location_region_id = filters.regionId;
    }
    if (filters.zoneId) {
      params.prj_location_zone_id = filters.zoneId;
    }
    if (filters.woredaId) {
      params.prj_location_woreda_id = filters.woredaId;
    }
    if (filters.include === 1) {
      params.include = filters.include;
    }

    // Dynamic text search keys (use the actual key name for API)
    textSearchKeys.forEach((key) => {
      if (filters[key]) {
        params[key] = filters[key];
      }
    });

    // Dynamic dropdown search keys (use the actual key name for API)
    dropdownSearchKeys.forEach(({ key }) => {
      if (filters[key]) {
        params[key] = filters[key];
      }
    });

    // Dynamic date search keys (use the actual key name with _start/_end for API)
    dateSearchKeys.forEach((key) => {
      if (filters[`${key}_start`]) {
        params[`${key}_start`] = filters[`${key}_start`];
      }
      if (filters[`${key}_end`]) {
        params[`${key}_end`] = filters[`${key}_end`];
      }
    });

    return params;
  }, [filters, textSearchKeys, dropdownSearchKeys, dateSearchKeys]);

  // Check if there are any active filters (for preventing initial data load)
  const hasActiveFilters = useMemo(() => {
    return (
      filters.regionId ||
      filters.zoneId ||
      filters.woredaId ||
      textSearchKeys.some((key) => filters[key]) ||
      dropdownSearchKeys.some(({ key }) => filters[key]) ||
      dateSearchKeys.some(
        (key) => filters[`${key}_start`] || filters[`${key}_end`]
      )
    );
  }, [filters, textSearchKeys, dropdownSearchKeys, dateSearchKeys]);

  return {
    filters,
    setFilters: updateFilters,
    clearFilters,
    getApiParams,
    hasActiveFilters,
  };
};
