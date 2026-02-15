import { FaEye, FaEdit, FaTrash, FaCog, FaCopy } from 'react-icons/fa';

import IconButton from './IconButton';

const ActionsCell = ({
  id,
  onView,
  onEdit,
  onDelete,
  onCanvasToggle,
  onDuplicate,
}) => {
  return (
    <div className="d-flex gap-2">
      {onCanvasToggle !== undefined && (
        <IconButton
          icon={<FaCog />}
          onClick={() => onCanvasToggle(id)}
          className="text-info"
        />
      )}
      {onView !== undefined && (
        <IconButton
          icon={<FaEye />}
          onClick={() => onView(id)}
          className="text-primary"
          title="View"
        />
      )}
      {onDuplicate !== undefined && (
        <IconButton
          icon={<FaCopy />}
          onClick={() => onDuplicate(id)}
          className="text-warning"
          title="Duplicate"
        />
      )}
      {onEdit !== undefined && (
        <IconButton
          icon={<FaEdit />}
          onClick={() => onEdit(id)}
          className="text-success"
          title="Edit"
        />
      )}
      {onDelete !== undefined && (
        <IconButton
          icon={<FaTrash />}
          onClick={() => onDelete(id)}
          className="text-danger"
          title="Delete"
        />
      )}
    </div>
  );
};

export default ActionsCell;
