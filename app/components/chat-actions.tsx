import { Menu } from "@/app/components/ui-lib";
import DeleteIcon from "../icons/delete.svg";
import EditIcon from "../icons/edit.svg";
import ShareIcon from "../icons/share.svg";
import styles from "@/app/components/ui-lib.module.scss";

export function ChatActionsModal(props: {
  point: DOMPoint;
  onClose: () => void;
  onShare: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const closeHandler = (fn: () => void) => () => {
    try {
      fn();
    } finally {
      props.onClose();
    }
  };

  return (
    <div className="modal-mask">
      <Menu point={props.point} onClose={props.onClose}>
        <div
          className={styles["menu-item"]}
          onClick={closeHandler(props.onShare)}
        >
          <ShareIcon /> Share
        </div>
        <div
          className={styles["menu-item"]}
          onClick={closeHandler(props.onRename)}
        >
          <EditIcon /> Rename
        </div>
        <div
          className={styles["menu-item"]}
          onClick={closeHandler(props.onDelete)}
        >
          <DeleteIcon /> Delete
        </div>
      </Menu>
    </div>
  );
}
