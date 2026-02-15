import { useFormik } from 'formik';
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/CardBody';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { EtCalendar } from 'react-ethiopian-calendar';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../hooks/useAuth';
import { useFetchAddressStructure } from '../../queries/address_structure_query';
import 'react-ethiopian-calendar/dist/index.css';

import { parseDateString, toYMDDateString } from '../../utils/commonMethods';
import FetchErrorHandler from './FetchErrorHandler';

const AdvancedSearch = ({
  ref,
  searchHook,
  pageFilter,
  textSearchKeys,
  dropdownSearchKeys,
  dropdownSearchKeys2,
  checkboxSearchKeys,
  dateSearchKeys,
  Component,
  component_params = {},
  additionalParams,
  setAdditionalParams,
  onSearchResult,
  onSearchLabels,
  setIsSearchLoading,
  setSearchResults,
  setShowSearchResult,
  getSearchParams,
  setExportSearchParams,
  setPaginationInfo,
  onClear,
  children,
  onSearchClick, // Callback to get tree selection values
  onClearClick, // Callback to clear tree selection
  treeSelection, // Current tree selection state
  allowEmptySearch = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  // Use URL state from usePageFilters with dynamic search keys
  const { filters, setFilters, getApiParams, hasActiveFilters } = pageFilter;

  // Local state for form inputs (not synced to URL until Search is clicked)
  const [localParams, setLocalParams] = useState(() => {
    const initial = {};
    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        initial[key] = filters[key] || '';
      });
    }
    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key, defaultValue }) => {
        initial[key] = filters[key] || defaultValue || '';
      });
    }
    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        initial[`${key}_start`] = filters[`${key}_start`] || '';
        initial[`${key}_end`] = filters[`${key}_end`] || '';
      });
    }
    return initial;
  });

  const [paramsWithLabels, setParamsWithLabels] = useState({});

  const { userId } = useAuth();
  const { regions, zones, woredas } = useFetchAddressStructure(userId);

  // Build search params from URL filters + additional params
  // Only include search params if there are active filters (prevent initial load)
  const searchParams = useMemo(() => {
    if (!hasActiveFilters && !allowEmptySearch) {
      return null; // Return null to prevent initial data fetch
    }
    const apiParams = getApiParams();
    return {
      ...apiParams,
      ...(additionalParams || {}),
    };
  }, [getApiParams, additionalParams, hasActiveFilters, allowEmptySearch]);

  const {
    data = [],
    isFetching,
    refetch,
    isError,
    error,
  } = searchHook(searchParams);

  // Create initial values for ALL search fields including component fields
  const createInitialValues = () => {
    const values = {};

    // Add component field values
    if (component_params) {
      Object.values(component_params).forEach((fieldName) => {
        values[fieldName] = '';
      });
    }

    // Add text search fields from local params
    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        values[key] = localParams[key] || '';
      });
    }

    // Add dropdown search fields from local params
    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key, defaultValue }) => {
        values[key] = localParams[key] || defaultValue || '';
      });
    }

    // Add date search fields from local params
    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        values[`${key}_start`] = localParams[`${key}_start`] || '';
        values[`${key}_end`] = localParams[`${key}_end`] || '';
      });
    }

    return values;
  };

  const validation = useFormik({
    initialValues: createInitialValues(),
    enableReinitialize: true,
  });

  // Handle updates for all input types (only updates local state, not URL)
  const handleSearchKey = (key, value, type = 'text', label = '') => {
    validation.setFieldValue(key, value);

    // Update local params (not URL yet)
    setLocalParams((prevParams) => {
      if (type === 'checkbox') {
        const currentValues = prevParams[key] || [];
        const updatedValues = Array.isArray(currentValues)
          ? currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value]
          : [value];

        return { ...prevParams, [key]: updatedValues };
      }

      if (value === '') {
        const updatedParams = { ...prevParams };
        delete updatedParams[key];
        return updatedParams;
      }

      return { ...prevParams, [key]: value };
    });

    // Update labels in a separate state
    setParamsWithLabels((prevLabels) => {
      if (value === '') {
        const updatedLabels = { ...prevLabels };
        delete updatedLabels[key];
        return updatedLabels;
      }
      return { ...prevLabels, [key]: label };
    });
  };

  const handleSearch = (resetToPageOne = false) => {
    const allValues = validation.values;

    // Filter out empty values
    const transformedValues = Object.fromEntries(
      Object.entries(allValues)
        // eslint-disable-next-line no-unused-vars
        .filter(([_key, value]) => value !== '' && value != null)
    );

    // Update URL state with search values using actual key names (shallow: false for server-side fetch)
    const urlUpdates = {};

    // Map text search keys to URL using actual key names (e.g., 'title', 'name', etc.)
    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        urlUpdates[key] = transformedValues[key] || null;
      });
    }

    // Map dropdown search keys using actual key names
    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key }) => {
        urlUpdates[key] = transformedValues[key] || null;
      });
    }

    // Map date search keys using actual key names with _start/_end suffixes
    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        urlUpdates[`${key}_start`] = transformedValues[`${key}_start`] || null;
        urlUpdates[`${key}_end`] = transformedValues[`${key}_end`] || null;
      });
    }

    // Get tree selection values from callback (if provided) and combine with search values
    const treeSelectionValues = onSearchClick ? onSearchClick() : {};

    // Combine all updates: tree selection + search values
    // setFilters here is actually updateFilters which handles merging internally
    const finalUpdates = {
      ...treeSelectionValues,
      ...urlUpdates,
      page: resetToPageOne ? 1 : filters.page || 1,
      pageSize: filters.pageSize || 10,
    };

    // Update URL (setFilters is updateFilters wrapper that merges internally)
    setFilters(finalUpdates, { shallow: false });

    // Map helper
    const findLabel = (list, id) => {
      const match = list?.find((item) => String(item.id) === String(id));
      return match ? match.name : id;
    };

    // Build labels
    const combinedParamsLabels = {
      ...paramsWithLabels,
      ...(additionalParams?.prj_location_region_id && {
        prj_location_region_id: findLabel(
          regions,
          additionalParams.prj_location_region_id
        ),
      }),
      ...(additionalParams?.prj_location_zone_id && {
        prj_location_zone_id: findLabel(
          zones,
          additionalParams.prj_location_zone_id
        ),
      }),
      ...(additionalParams?.prj_location_woreda_id && {
        prj_location_woreda_id: findLabel(
          woredas,
          additionalParams.prj_location_woreda_id
        ),
      }),
    };

    if (onSearchLabels) {
      onSearchLabels(combinedParamsLabels);
    }
    if (getSearchParams) {
      getSearchParams(searchParams);
    }
  };

  // Ref to track previous searchParams to prevent duplicate refetches
  const prevSearchParamsRef = React.useRef(null);

  // Refetch whenever searchParams changes (only if hasActiveFilters)
  useEffect(() => {
    // Serialize searchParams for comparison
    const searchParamsStr = searchParams ? JSON.stringify(searchParams) : null;

    // Skip if searchParams haven't actually changed
    if (prevSearchParamsRef.current === searchParamsStr) {
      return;
    }

    prevSearchParamsRef.current = searchParamsStr;

    const fetchData = async () => {
      try {
        if (setIsSearchLoading) setIsSearchLoading(true);
        const result = await refetch();
        const { data, error } = result;
        if (onSearchResult) onSearchResult({ data, error });
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        if (setIsSearchLoading) setIsSearchLoading(false);
      }
    };

    // Only fetch if searchParams exists and has values (hasActiveFilters ensures this)
    if (searchParams && Object.keys(searchParams).length > 0) {
      fetchData();
    }
  }, [searchParams, refetch, onSearchResult, setIsSearchLoading]);

  // Sync local params with URL state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const updatedLocalParams = { ...localParams };
    let hasChanges = false;

    // Sync text search from URL using actual key names
    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        const urlValue = filters[key] || '';
        if (updatedLocalParams[key] !== urlValue) {
          updatedLocalParams[key] = urlValue;
          hasChanges = true;
        }
      });
    }

    // Sync dropdown from URL using actual key names
    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key }) => {
        const urlValue = filters[key] || '';
        if (updatedLocalParams[key] !== urlValue) {
          updatedLocalParams[key] = urlValue;
          hasChanges = true;
        }
      });
    }

    // Sync date from URL using actual key names
    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        const startValue = filters[`${key}_start`] || '';
        const endValue = filters[`${key}_end`] || '';
        if (
          updatedLocalParams[`${key}_start`] !== startValue ||
          updatedLocalParams[`${key}_end`] !== endValue
        ) {
          updatedLocalParams[`${key}_start`] = startValue;
          updatedLocalParams[`${key}_end`] = endValue;
          hasChanges = true;
        }
      });
    }

    if (hasChanges) {
      setLocalParams(updatedLocalParams);
    }
    // Depend on filters object and search key configs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, textSearchKeys, dropdownSearchKeys, dateSearchKeys]);

  const handleClear = () => {
    // Clear local params
    const clearedLocalParams = {};
    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        clearedLocalParams[key] = '';
      });
    }
    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key }) => {
        clearedLocalParams[key] = '';
      });
    }
    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        clearedLocalParams[`${key}_start`] = '';
        clearedLocalParams[`${key}_end`] = '';
      });
    }
    setLocalParams(clearedLocalParams);

    // Clear tree selection
    if (onClearClick) {
      onClearClick();
    }

    // Clear URL state including tree selection
    const clearedFilters = {
      regionId: null,
      zoneId: null,
      woredaId: null,
      include: 0,
      page: 1,
    };
    if (textSearchKeys) {
      textSearchKeys.forEach((key) => {
        clearedFilters[key] = null;
      });
    }
    if (dropdownSearchKeys) {
      dropdownSearchKeys.forEach(({ key }) => {
        clearedFilters[key] = null;
      });
    }
    if (dateSearchKeys) {
      dateSearchKeys.forEach((key) => {
        clearedFilters[`${key}_start`] = null;
        clearedFilters[`${key}_end`] = null;
      });
    }
    setFilters(clearedFilters, { shallow: false });

    setParamsWithLabels({});
    if (setSearchResults) setSearchResults(null);
    if (setShowSearchResult) setShowSearchResult(false);
    validation.resetForm();

    if (setAdditionalParams) {
      setAdditionalParams({});
    }
    if (setExportSearchParams) {
      setExportSearchParams({});
    }

    if (setPaginationInfo) {
      setPaginationInfo({
        current_page: 1,
        per_page: 10,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
      });
    }
    if (onClear) {
      onClear();
    }
  };

  const isButtonDisabled = useMemo(() => {
    // Check if there's any tree selection
    const hasTreeSelection =
      treeSelection &&
      (treeSelection.regionId ||
        treeSelection.zoneId ||
        treeSelection.woredaId);

    // Check if there's any search value
    const hasAnyValue = Object.entries({
      ...localParams,
      ...validation.values,
      ...additionalParams,
    }).some(([key, value]) => {
      if (key === 'include') {
        return false;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value != null && value !== '';
    });

    // Button is enabled if there's tree selection OR search values OR empty search is allowed
    return !hasTreeSelection && !hasAnyValue && !allowEmptySearch;
  }, [
    localParams,
    validation.values,
    additionalParams,
    treeSelection,
    allowEmptySearch,
  ]);

  // Expose method to get search values
  useImperativeHandle(ref, () => ({
    refreshSearch: async () => refetch(),
    searchWithCurrentPagination: () => handleSearch(false),
  }));

  const inputStyles = {
    width: '100%',
    maxWidth: '100%',
    minWidth: '0',
  };

  if (isError) {
    return <FetchErrorHandler error={error} refetch={refetch} />;
  }

  return (
    <React.Fragment>
      <Card className="p-0 m-0 mb-3">
        <CardBody className="p-1">
          <form action="#">
            <Row
              xxl={12}
              lg={12}
              className="pt-2 d-flex flex-row flex-wrap justify-content-center align-items-center gap-1"
            >
              <Row xxl={12} lg={12}>
                <Col xxl={10} lg={10}>
                  <div
                    className="d-grid gap-2 mb-1"
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(220px, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    {dateSearchKeys &&
                      dateSearchKeys.map((key) => (
                        <div key={key}>
                          <InputGroup className="rounded" style={inputStyles}>
                            <EtCalendar
                              calendarType={true}
                              lang="en"
                              dateRange={true}
                              placeholder={t(key)}
                              onChange={(dateRange) => {
                                if (
                                  dateRange &&
                                  dateRange.startDate &&
                                  dateRange.endDate
                                ) {
                                  const start = toYMDDateString(
                                    dateRange.startDate
                                  );
                                  const end = toYMDDateString(
                                    dateRange.endDate
                                  );

                                  handleSearchKey(
                                    `${key}_start`,
                                    start,
                                    'date',
                                    start
                                  );
                                  handleSearchKey(
                                    `${key}_end`,
                                    end,
                                    'date',
                                    end
                                  );
                                } else {
                                  handleSearchKey(
                                    `${key}_start`,
                                    '',
                                    'date',
                                    ''
                                  );
                                  handleSearchKey(`${key}_end`, '', 'date', '');
                                }
                              }}
                              value={
                                localParams[`${key}_start`] &&
                                localParams[`${key}_end`]
                                  ? {
                                      startDate: parseDateString(
                                        localParams[`${key}_start`]
                                      ),
                                      endDate: parseDateString(
                                        localParams[`${key}_end`]
                                      ),
                                    }
                                  : null
                              }
                              style={inputStyles}
                            />
                          </InputGroup>
                        </div>
                      ))}

                    {textSearchKeys &&
                      textSearchKeys.map((key) => (
                        <div key={key}>
                          <Form.Control
                            type="text"
                            id={key}
                            name={key}
                            autoComplete="off"
                            placeholder={t(key)}
                            value={localParams[key] || ''}
                            onChange={(e) =>
                              handleSearchKey(
                                key,
                                e.target.value,
                                'text',
                                e.target.value
                              )
                            }
                            style={inputStyles}
                          />
                        </div>
                      ))}

                    {dropdownSearchKeys &&
                      dropdownSearchKeys.map(({ key, options }) => (
                        <div key={key} style={{ minWidth: 0 }}>
                          <Form.Select
                            value={localParams[key] || ''}
                            onChange={(event) => {
                              const value = event.target.value;
                              const label =
                                event.target.options[event.target.selectedIndex]
                                  .text;
                              handleSearchKey(key, value, 'text', label);
                            }}
                            style={inputStyles}
                          >
                            <option value="">
                              {t('Select')} {t(key)}
                            </option>
                            {Object.entries(options || {}).map(
                              ([value, label]) => (
                                <option key={`${value}-${key}`} value={value}>
                                  {t(label)}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </div>
                      ))}
                  </div>
                </Col>
                <Col
                  xxl={2}
                  lg={2}
                  md={2}
                  sm={12}
                  className="d-flex flex-row flex-wrap justify-content-center align-items-start gap-1"
                >
                  <div
                    id="search-icon-wrapper"
                    className=" flex-grow-1 mb-2"
                    style={{ display: 'flex' }}
                  >
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="search-tooltip">
                          {t('srch_search')}
                        </Tooltip>
                      }
                    >
                      <span className="d-inline-block h-100 w-100">
                        <button
                          id="search-icon"
                          type="button"
                          className="btn btn-primary h-100 w-100 p-2"
                          onClick={() => handleSearch(true)}
                          disabled={isButtonDisabled}
                        >
                          <i className="bx bx-search-alt align-middle"></i>
                        </button>
                      </span>
                    </OverlayTrigger>
                  </div>
                  <div className=" flex-grow-1 mb-2">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="clear-tooltip">{t('srch_clear')}</Tooltip>
                      }
                    >
                      <button
                        type="button"
                        className="btn btn-outline-danger align-middle h-100 w-100 p-2"
                        onClick={handleClear}
                        id="clear-button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          fill="currentColor"
                          className="bi bi-x-square"
                          viewBox="0 0 16 16"
                        >
                          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                      </button>
                    </OverlayTrigger>
                  </div>

                  {(checkboxSearchKeys?.length > 0 ||
                    dropdownSearchKeys2?.length > 0 ||
                    Component) && (
                    <div className=" flex-grow-1 mb-2">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="clear-tooltip">
                            {t('srch_more_filters')}
                          </Tooltip>
                        }
                      >
                        <button
                          type="button"
                          id="more-filter-icon"
                          onClick={toggle}
                          className="btn btn-secondary h-100 w-100 p-2"
                        >
                          <i className="bx bx-filter-alt align-middle"></i>
                        </button>
                      </OverlayTrigger>
                    </div>
                  )}
                </Col>
              </Row>

              <Collapse in={isOpen}>
                <div>
                  <Row>
                    <Col>
                      {Component && validation && (
                        <Component
                          {...component_params}
                          validation={validation}
                          isEdit={false}
                        />
                      )}
                    </Col>
                  </Row>

                  <hr />

                  <Row className="g-3 m-1">
                    {/* Dropdown filters */}
                    <Col xs={12}>
                      <div
                        className="d-grid mb-1"
                        style={{
                          gridTemplateColumns:
                            'repeat(auto-fill, minmax(220px, 1fr))',
                          gap: '2rem',
                        }}
                      >
                        {dropdownSearchKeys2 &&
                          dropdownSearchKeys2.map(({ key, options }) => (
                            <div key={key} style={{ minWidth: 0 }}>
                              <Form.Select
                                value={localParams[key] || ''}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  const label =
                                    event.target.options[
                                      event.target.selectedIndex
                                    ].text;
                                  handleSearchKey(key, value, 'text', label);
                                }}
                                style={inputStyles}
                              >
                                <option value="">
                                  {t('Select')} {t(key)}
                                </option>
                                {Object.entries(options || {}).map(
                                  ([value, label]) => (
                                    <option
                                      key={`${value}-${key}`}
                                      value={value}
                                    >
                                      {t(label)}
                                    </option>
                                  )
                                )}
                              </Form.Select>
                            </div>
                          ))}
                      </div>
                    </Col>

                    {/* Checkbox filters */}
                    {checkboxSearchKeys &&
                      checkboxSearchKeys.map(({ key, options }) => (
                        <Col key={key} xxl={4} lg={6}>
                          <Form.Label className="fw-semibold">
                            {t(key)}
                          </Form.Label>

                          {(options || []).map((item, index) => (
                            <Form.Check
                              inline
                              key={index}
                              type="checkbox"
                              id={`${key}-checkbox-${index}`}
                              label={item.label}
                              value={item.value}
                              checked={(localParams[key] || []).includes(
                                item.value
                              )}
                              onChange={(e) =>
                                handleSearchKey(
                                  key,
                                  e.target.checked ? item.value : null,
                                  'checkbox',
                                  item.label
                                )
                              }
                            />
                          ))}
                        </Col>
                      ))}
                  </Row>
                </div>
              </Collapse>
            </Row>
          </form>
        </CardBody>
      </Card>
      <div>
        {typeof children === 'function'
          ? children({ result: data, isLoading: isFetching })
          : React.cloneElement(children, {
              result: data,
              isLoading: isFetching,
            })}
      </div>
    </React.Fragment>
  );
};

export default AdvancedSearch;
