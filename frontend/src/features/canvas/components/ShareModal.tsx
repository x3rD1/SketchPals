import { createPortal } from "react-dom";
import styles from "./ShareModal.module.css";
import useSearchUser from "../hooks/search/useSearchUser";
import { useState } from "react";
import useDebounce from "../hooks/search/useDebounce";
import useCanvasMembers from "../hooks/search/useCanvasMembers";
import UserItem from "./UserItem";
import useCanvasPermissions from "../hooks/search/useCanvasPermissions";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  canvasId: string;
};

function ShareModal({ isOpen, onClose, canvasId }: ShareModalProps) {
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input);

  const { data: usersData } = useSearchUser(debouncedInput, canvasId);
  const { data: members } = useCanvasMembers(canvasId);

  const permissions = useCanvasPermissions(debouncedInput, canvasId);

  const searchResults = usersData?.map((user) => (
    <UserItem
      key={user.id}
      user={user}
      canvasId={canvasId}
      members={members}
      permissions={permissions}
    />
  ));

  const membersList = members?.map((m) => (
    <UserItem
      key={m.id}
      user={m}
      canvasId={canvasId}
      members={members}
      permissions={permissions}
    />
  ));

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2>Set up permissions</h2>
        <div className={styles.search}>
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search users..."
          />
        </div>

        <div className={styles.lists}>{searchResults}</div>

        <div>
          <h3>Members:</h3>
          {membersList}
        </div>

        <div className={styles.closeBtn}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ShareModal;
