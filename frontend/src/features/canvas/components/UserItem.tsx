import type { User } from "../api/types";
import type useCanvasPermissions from "../hooks/search/useCanvasPermissions";
import styles from "./UserItem.module.css";

type UserItemProps = {
  user: User;
  canvasId: string;
  members: User[] | undefined;
  permissions: ReturnType<typeof useCanvasPermissions>;
};

function UserItem({ user, canvasId, members, permissions }: UserItemProps) {
  const { addCanvasMember, removeCanvasMember } = permissions;

  const isMember = members?.some((m) => m.id === user.id);

  const handleClick = () => {
    if (isMember) {
      removeCanvasMember.mutate({ memberId: user.id, canvasId });
    } else {
      addCanvasMember.mutate({ memberId: user.id, canvasId });
    }
  };

  return (
    <li className={styles.item}>
      <div className={styles.userInfo}>
        <span className={styles.username}>{user.username}</span>
        <span className={styles.email}>{user.email}</span>
      </div>
      <button onClick={handleClick}>{isMember ? "remove" : "add"}</button>
    </li>
  );
}

export default UserItem;
