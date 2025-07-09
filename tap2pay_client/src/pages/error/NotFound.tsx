import { useNavigate } from "react-router-dom";
import Styles from "./ErrorMessage.module.css";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={Styles.container}>
      <h1 className={Styles.title}>404 - Page Not Found</h1>
      <p className={Styles.message}>
        Sorry, the page you are looking for does not exist.
      </p>
      <button onClick={() => navigate("/")} className={Styles.button}>
        Go back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
