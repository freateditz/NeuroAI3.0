import { useAuth } from "../contexts/AuthContext";

const Modal = ({ isOpen, onClose }) => {
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        onClose();
    };

    if (!isOpen) return null;
    return (
        <div
            className="absolute right-0 flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg dark:shadow-gray-900/50 transition-colors"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleLogout}
                    className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Modal;
