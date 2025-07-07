import React, { useState, useEffect } from 'react';

import AdvancedSearch from './AdvancedSearch';
import TreeForLists from './TreeForLists';

export default function TreeSearchWrapper({
  children,
  searchHook,
  textSearchKeys,
  dropdownSearchKeys,
  checkboxSearchKeys,
  dateSearchKeys,
  Component,
  component_params = {},
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projectParams, setProjectParams] = useState({});
  const [prjLocationRegionId, setPrjLocationRegionId] = useState(null);
  const [prjLocationZoneId, setPrjLocationZoneId] = useState(null);
  const [prjLocationWoredaId, setPrjLocationWoredaId] = useState(null);
  const [include, setInclude] = useState(0);

  useEffect(() => {
    setProjectParams({
      ...(prjLocationRegionId && {
        prj_location_region_id: prjLocationRegionId,
      }),
      ...(prjLocationZoneId && { prj_location_zone_id: prjLocationZoneId }),
      ...(prjLocationWoredaId && {
        prj_location_woreda_id: prjLocationWoredaId,
      }),
      ...(include === 1 && { include }),
    });
  }, [prjLocationRegionId, prjLocationZoneId, prjLocationWoredaId, include]);

  const handleNodeSelect = (node) => {
    if (node.level === 'region') {
      setPrjLocationRegionId(node.id);
      setPrjLocationZoneId(null);
      setPrjLocationWoredaId(null);
    } else if (node.level === 'zone') {
      setPrjLocationZoneId(node.id);
      setPrjLocationWoredaId(null);
    } else if (node.level === 'woreda') {
      setPrjLocationWoredaId(node.id);
    }
  };

  return (
    <>
      <div className="w-100 d-flex gap-2">
        <TreeForLists
          onNodeSelect={handleNodeSelect}
          setInclude={setInclude}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <div
          style={{
            flex: isCollapsed ? '1 1 auto' : '0 0 75%',
            transition: 'all 0.3s ease',
          }}
        >
          <AdvancedSearch
            searchHook={searchHook}
            textSearchKeys={textSearchKeys}
            dropdownSearchKeys={dropdownSearchKeys}
            checkboxSearchKeys={checkboxSearchKeys}
            dateSearchKeys={dateSearchKeys}
            Component={Component}
            component_params={component_params}
            additionalParams={projectParams}
            setAdditionalParams={setProjectParams}
          >
            {children}
          </AdvancedSearch>
        </div>
      </div>
    </>
  );
}
