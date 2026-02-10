import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';
import { useEffect, useCallback, useRef, useMemo } from 'react';

export const usePageFilters = (searchKeysConfig = {}) => {
  const {
    textSearchKeys = [],
    dropdownSearchKeys = [],
    dateSearchKeys = [],
  } = searchKeysConfig;

  // -----------------------------
  // URL schema
  // -----------------------------
  const urlSchema = useMemo(() => {
    const schema = {
      regionId: parseAsString,
      zoneId: parseAsString,
      woredaId: parseAsString,
      include: parseAsInteger.withDefault(1),

      // Pagination (same across all pages)
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(10),
    };

    textSearchKeys.forEach((key) => {
      schema[key] = parseAsString;
    });

    dropdownSearchKeys.forEach(({ key }) => {
      schema[key] = parseAsString;
    });

    dateSearchKeys.forEach((key) => {
      schema[`${key}_start`] = parseAsString;
      schema[`${key}_end`] = parseAsString;
    });

    return schema;
  }, [textSearchKeys, dropdownSearchKeys, dateSearchKeys]);

  const [filters, setFilters] = useQueryStates(urlSchema, {
    shallow: false,
    clearOnDefault: false,
  });

  // -----------------------------
  // Track previous values
  // -----------------------------
  const prevRegionIdRef = useRef(filters.regionId);
  const prevSearchValuesRef = useRef({});

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

  // -----------------------------
  // Reset page ONLY after user-driven filter changes
  // -----------------------------
  useEffect(() => {
    const regionChanged = prevRegionIdRef.current !== filters.regionId;

    const searchChanged = Object.keys(currentSearchValues).some(
      (key) => prevSearchValuesRef.current[key] !== currentSearchValues[key]
    );

    if (
      (regionChanged || searchChanged) &&
      filters.page &&
      filters.page !== 1
    ) {
      setFilters({ page: 1 }, { shallow: false });
    }

    prevRegionIdRef.current = filters.regionId;
    prevSearchValuesRef.current = currentSearchValues;
  }, [filters.regionId, filters.page, currentSearchValues, setFilters]);

  // -----------------------------
  // Public setter (user actions only)
  // -----------------------------
  const updateFilters = useCallback(
    (updates, options = {}) => {
      const shouldResetPage =
        'regionId' in updates ||
        'zoneId' in updates ||
        'woredaId' in updates ||
        textSearchKeys.some((key) => key in updates) ||
        dropdownSearchKeys.some(({ key }) => key in updates) ||
        dateSearchKeys.some(
          (key) => `${key}_start` in updates || `${key}_end` in updates
        );

      setFilters(
        (current) => ({
          ...current,
          ...updates,
          ...(shouldResetPage ? { page: 1 } : {}),
        }),
        {
          shallow: options.shallow ?? false,
        }
      );
    },
    [setFilters, textSearchKeys, dropdownSearchKeys, dateSearchKeys]
  );

  // -----------------------------
  // Clear filters (explicit action)
  // -----------------------------
  const clearFilters = useCallback(() => {
    const cleared = {
      regionId: null,
      zoneId: null,
      woredaId: null,
      include: null,
      page: 1,
      pageSize: null,
    };

    textSearchKeys.forEach((key) => (cleared[key] = null));
    dropdownSearchKeys.forEach(({ key }) => (cleared[key] = null));
    dateSearchKeys.forEach((key) => {
      cleared[`${key}_start`] = null;
      cleared[`${key}_end`] = null;
    });

    setFilters(cleared, { shallow: false });
  }, [setFilters, textSearchKeys, dropdownSearchKeys, dateSearchKeys]);

  // -----------------------------
  // API params (DEFAULTS LIVE HERE)
  // -----------------------------
  const getApiParams = useCallback(() => {
    return {
      page: filters.page ?? 1,
      per_page: filters.pageSize ?? 10,

      ...(filters.regionId && {
        prj_location_region_id: filters.regionId,
      }),
      ...(filters.zoneId && {
        prj_location_zone_id: filters.zoneId,
      }),
      ...(filters.woredaId && {
        prj_location_woreda_id: filters.woredaId,
      }),
      ...(filters.include === 1 && { include: 1 }),

      ...Object.fromEntries(
        textSearchKeys
          .filter((key) => filters[key])
          .map((key) => [key, filters[key]])
      ),

      ...Object.fromEntries(
        dropdownSearchKeys
          .filter(({ key }) => filters[key])
          .map(({ key }) => [key, filters[key]])
      ),

      ...Object.fromEntries(
        dateSearchKeys.flatMap((key) =>
          [
            filters[`${key}_start`] && [
              `${key}_start`,
              filters[`${key}_start`],
            ],
            filters[`${key}_end`] && [`${key}_end`, filters[`${key}_end`]],
          ].filter(Boolean)
        )
      ),
    };
  }, [filters, textSearchKeys, dropdownSearchKeys, dateSearchKeys]);

  const hasActiveFilters = useMemo(() => {
    return Boolean(
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
