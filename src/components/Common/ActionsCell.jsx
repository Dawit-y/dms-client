import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

import IconButton from './IconButton';

const ActionsCell = ({
  id,
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
}) => {
  return (
    <div className="d-flex gap-2">
      {showView && (
        <IconButton
          icon={<FaEye />}
          onClick={() => onView(id)}
          className="text-primary"
          title="View"
        />
      )}
      {showEdit && (
        <IconButton
          icon={<FaEdit />}
          onClick={() => onEdit(id)}
          className="text-success"
          title="Edit"
        />
      )}
      {showDelete && (
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
