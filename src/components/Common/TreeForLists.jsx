import { useEffect, useState, useCallback, useRef, memo } from 'react';
import { Tree } from 'react-arborist';
import {
  Card,
  CardBody,
  Col,
  Row,
  Button,
  Form,
  // UncontrolledTooltip,
  FormLabel,
  FormCheck,
  Spinner,
} from 'react-bootstrap';
import { useDragDropManager } from 'react-dnd';
import { useTranslation } from 'react-i18next';
import {
  FaFolder,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaSearch,
} from 'react-icons/fa';
import useResizeObserver from 'use-resize-observer';
import { v4 as uuidv4 } from 'uuid';

import { useAuth } from '../../hooks/useAuth';
import { useFetchAddressStructure } from '../../queries/address_structure_query';
import FetchErrorHandler from './FetchErrorHandler';

const TreeForLists = ({
  onNodeSelect,
  setInclude,
  isCollapsed,
  setIsCollapsed,
}) => {
  const { t, i18n } = useTranslation();
  const dndManager = useDragDropManager();
  const treeRef = useRef();
  const searchInputRef = useRef();
  const { userId } = useAuth();
  const { data, isLoading, isError, error, refetch } =
    useFetchAddressStructure(userId);
  const [treeData, setTreeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState({});
  const [includeChecked, setIncludeChecked] = useState(false);
  const { ref, width, height } = useResizeObserver();

  useEffect(() => {
    if (data) {
      const transformData = (regions) =>
        regions.map((region) => ({
          ...region,
          id: region.id?.toString() || uuidv4(),
          children:
            region.children?.map((zone) => ({
              ...zone,
              id: zone.id?.toString() || uuidv4(),
              children:
                zone.children?.map((woreda) => ({
                  ...woreda,
                  id: woreda.id?.toString() || uuidv4(),
                })) || [],
            })) || [],
        }));
      setTreeData(transformData(data));
    }
  }, [data]);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIncludeChecked(checked);
    if (setInclude) {
      setInclude(checked ? 1 : 0);
    }
  };

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNodeSelect = (nodeData) => {
    onNodeSelect(nodeData);
    setSelectedNode(() => {
      if (Object.keys(nodeData).length === 0) return {};
      return {
        ...nodeData,
        level: nodeData.level || 'unknown',
      };
    });
  };

  const handleExpandAndFocusSearch = () => {
    setIsCollapsed(false);
    setTimeout(() => {
      if (selectedNode?.id) {
        treeRef.current?.select(selectedNode.id);
        treeRef.current?.scrollTo(selectedNode.id);
      }
      searchInputRef.current?.focus();
    }, 200);
  };

  const searchMatch = useCallback((node, term, lang) => {
    if (!term) return true;
    const searchTerm = term.toLowerCase();
    const getNodeName = (node) => {
      if (!node?.data) return '';
      if (lang === 'en' && node.data.add_name_en)
        return node.data.add_name_en.toLowerCase();
      if (lang === 'am' && node.data.add_name_am)
        return node.data.add_name_am.toLowerCase();
      return node.data.name?.toLowerCase() || '';
    };
    const nameExists = (currentNode) => {
      if (getNodeName(currentNode).includes(searchTerm)) return true;
      if (currentNode.parent) return nameExists(currentNode.parent);
      return false;
    };
    return nameExists(node);
  }, []);

  const lang = i18n.language;
  if (isError) setIsCollapsed(false);
  if (isLoading || isError) {
    return (
      <div
        style={{
          position: 'relative',
          flex: isCollapsed ? '0 0 60px' : '0 0 25%',
          minWidth: isCollapsed ? '60px' : '250px',
          transition: 'all 0.3s ease',
        }}
        className="w-20 flex-shrink-0 p-3 border-end overflow-auto shadow-sm"
      >
        {isCollapsed ? (
          <div className="d-flex justify-content-center align-items-center mb-2 mx-auto w-100">
            <>
              <Button
                id="expand-tree-button"
                size="sm"
                variant="light"
                onClick={handleExpandAndFocusSearch}
              >
                <FaBars />
              </Button>
              {/* <UncontrolledTooltip
                placement="right"
                target="expand-tree-button"
              >
                Expand
              </UncontrolledTooltip> */}
            </>
          </div>
        ) : (
          <h5>{t('regional_structure')}</h5>
        )}
        <hr />
        <div className="text-center">
          {isLoading ? (
            <Spinner size={'sm'} variant="primary" />
          ) : (
            <div className="absolute top-0">
              <FetchErrorHandler error={error} refetch={refetch} onTree />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: isCollapsed ? '0 0 60px' : '0 0 25%',
        minWidth: isCollapsed ? '60px' : '250px',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="d-flex"
        style={{
          transition: 'width 0.3s ease',
          width: '100%',
          height: '100%',
        }}
      >
        <Card
          className="border-0 w-100"
          style={isCollapsed ? { minHeight: '100vh' } : {}}
        >
          <CardBody className="p-2">
            {isCollapsed ? (
              <div className="d-flex justify-content-center align-items-center mb-2 mx-auto w-100">
                <>
                  <Button
                    id="expand-tree-button"
                    size="sm"
                    variant="light"
                    onClick={handleExpandAndFocusSearch}
                  >
                    <FaBars />
                  </Button>
                  {/* <UncontrolledTooltip
                    placement="right"
                    target="expand-tree-button"
                  >
                    Expand
                  </UncontrolledTooltip> */}
                </>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">{t('regional_structure')}</h5>
                <Button
                  id="collapse-tree-button"
                  size="sm"
                  variant="light"
                  onClick={() => setIsCollapsed(true)}
                  className="ms-auto"
                >
                  <FaBars />
                </Button>
                {/* <UncontrolledTooltip
                  placement="top"
                  target="collapse-tree-button"
                >
                  Collapse
                </UncontrolledTooltip> */}
              </div>
            )}

            {isCollapsed ? (
              <div className="d-flex justify-content-center align-items-start mb-2 mt-3 mx-auto h-100">
                <div className="d-flex flex-column align-items-center gap-3">
                  <>
                    <FormCheck
                      id="collapsed-include"
                      type="checkbox"
                      checked={includeChecked}
                      onChange={handleCheckboxChange}
                    />
                    {/* <UncontrolledTooltip
                      placement="right"
                      target="collapsed-include"
                    >
                      {t('include_sub_address')}
                    </UncontrolledTooltip> */}
                  </>
                  <>
                    <Button
                      id="collapsed-search-button"
                      size="sm"
                      variant="light"
                      onClick={handleExpandAndFocusSearch}
                    >
                      <FaSearch />
                    </Button>
                    {/* <UncontrolledTooltip
                      placement="right"
                      target="collapsed-search-button"
                    >
                      Search
                    </UncontrolledTooltip> */}
                  </>
                  {selectedNode && Object.keys(selectedNode).length > 0 && (
                    <>
                      <div
                        id="selected-node-tooltip"
                        className="d-flex align-items-center gap-1 bg-info-subtle px-2 py-1 rounded"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleNodeSelect({})}
                      >
                        <span className="text-warning">
                          <FaFolder />
                        </span>
                        <span
                          className="text-danger"
                          style={{ fontWeight: 900, fontSize: '0.9rem' }}
                        >
                          {selectedNode.level.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {/* <UncontrolledTooltip
                        placement="right"
                        target="selected-node-tooltip"
                      >
                        {lang === 'en' && selectedNode.add_name_en
                          ? selectedNode.add_name_en
                          : lang === 'am' && selectedNode.add_name_am
                            ? selectedNode.add_name_am
                            : selectedNode.name}
                      </UncontrolledTooltip> */}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Row className="mb-2">
                  <Col className="d-flex align-items-center gap-2 my-auto">
                    <FormCheck
                      id="include"
                      type="checkbox"
                      checked={includeChecked}
                      onChange={handleCheckboxChange}
                      className="my-auto"
                    />
                    <FormLabel htmlFor="include" className="my-auto">
                      {t('include_sub_address')}
                    </FormLabel>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col className="d-flex gap-2">
                    <Form.Control
                      id="searchterm"
                      type="text"
                      size="sm"
                      ref={searchInputRef}
                      placeholder={t('search')}
                      value={searchTerm}
                      onChange={handleSearchTerm}
                    />
                    <>
                      <Button
                        id="close-all-button"
                        onClick={() => {
                          onNodeSelect({});
                          treeRef.current?.closeAll();
                        }}
                        size="sm"
                        variant="light"
                        className="border"
                      >
                        <FaChevronUp />
                      </Button>
                      {/* <UncontrolledTooltip
                        placement="top"
                        target="close-all-button"
                      >
                        {t('Close All')}
                      </UncontrolledTooltip> */}
                    </>
                  </Col>
                </Row>
                <div
                  ref={ref}
                  className="border rounded p-1"
                  style={{
                    height: '100vh',
                    overflow: 'auto',
                  }}
                >
                  {treeData.length > 0 && width && height && (
                    <Tree
                      initialData={treeData}
                      openByDefault={false}
                      searchTerm={searchTerm}
                      searchMatch={(node, term) =>
                        searchMatch(node, term, lang)
                      }
                      ref={treeRef}
                      width={Math.max(width || 350, 350)}
                      height={height || 800}
                      indent={24}
                      rowHeight={36}
                      overscanCount={1}
                      disableDrag
                      disableDrop
                      dndManager={dndManager}
                    >
                      {({ node, style, dragHandle }) => (
                        <Node
                          node={node}
                          style={style}
                          dragHandle={dragHandle}
                          onNodeSelect={handleNodeSelect}
                        />
                      )}
                    </Tree>
                  )}
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const Node = ({ node, style, dragHandle, onNodeSelect }) => {
  const { i18n } = useTranslation();

  const lang = i18n.language;
  const isLeafNode = node.isLeaf;
  const chevronIcon = node.isOpen ? <FaChevronDown /> : <FaChevronRight />;

  const handleNodeClick = (node) => {
    node.toggle();
    onNodeSelect(node.data);
  };
  if (!node?.data) return null;
  return (
    <div
      onClick={() => handleNodeClick(node)}
      style={{ ...style, display: 'flex', cursor: 'pointer' }}
      ref={dragHandle}
      className={`${
        node.isSelected ? 'bg-info-subtle' : ''
      } py-1 rounded hover-zoom`}
    >
      {!isLeafNode && node.data.level !== 'woreda' && (
        <span className="me-2 ps-2">{chevronIcon}</span>
      )}
      <span
        className={`${
          node.data.level === 'woreda' ? 'ms-4' : ''
        }  me-1 text-warning`}
      >
        <FaFolder />
      </span>
      <span className="text-danger my-auto px-1" style={{ fontWeight: 900 }}>
        {node.data.level.charAt(0).toUpperCase()}
      </span>
      <span
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      >
        {lang === 'en' && node.data.add_name_en
          ? node.data.add_name_en
          : lang === 'am' && node.data.add_name_am
            ? node.data.add_name_am
            : node.data.name}
      </span>
    </div>
  );
};

export default memo(TreeForLists);
