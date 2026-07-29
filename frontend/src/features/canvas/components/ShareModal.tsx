import { createPortal } from "react-dom";
import styles from "./ShareModal.module.css";
import useSearchUser from "../hooks/search/useSearchUser";
import { useState } from "react";
import useDebounce from "../hooks/search/useDebounce";
import useCanvasMembers from "../hooks/search/useCanvasMembers";
import UserItem from "./UserItem";
import useCanvasPermissions from "../hooks/search/useCanvasPermissions";
import { X } from "lucide-react";

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
        <h2>Share canvas</h2>
        <div className={styles.search}>
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search users..."
          />
        </div>

        <div className={styles.lists}>
          <ul>{searchResults}</ul>
        </div>

        <div className={styles.members}>
          <h3>Members</h3>
          <ul className={styles.memberList}>{membersList}</ul>
        </div>

        <div className={styles.closeBtn}>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ShareModal;
