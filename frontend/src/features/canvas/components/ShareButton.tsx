import { useState } from "react";
import { Share2 } from "lucide-react";

import ShareModal from "./ShareModal";
import styles from "./ShareButton.module.css";

function ShareButton({ canvasId }: { canvasId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen((prev) => !prev);
  const closeModal = () => setIsOpen(false);

  return (
    <div className={styles.shareButton}>
      <button onClick={toggleModal}>
        <Share2 size={18} />
        <span>Share</span>
      </button>

      <ShareModal isOpen={isOpen} onClose={closeModal} canvasId={canvasId} />
    </div>
  );
}

export default ShareButton;
