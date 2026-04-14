import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Category } from "../components/Categories";
import { useAuth } from "../context/AuthContext";
import "../styles/Discover.css";

function Discover() {
  const navigate = useNavigate();
  const { token } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/signin", { replace: true });
    }
  }, [token, navigate]);

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/private/discover/${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <div className="discover-container">
      <Typography variant="h4" className="main-title">
        Discover Events
      </Typography>

      <Typography className="sub-text">
        Explore popular events near you, browse by category, or check out some of the great
        community calendars.
      </Typography>

      <Typography variant="h5" className="section-title">
        Browse by Category
      </Typography>

      <div className="category-grid">
        {Category.map((item) => (
          <div
            key={item.id}
            className="category-card"
            onClick={() => handleCategoryClick(item.title)}
          >
            <div className="category-icon">{item.icon}</div>

            <div className="category-text">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discover;
