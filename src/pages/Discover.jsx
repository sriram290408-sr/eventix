import React from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import { Category } from "../components/Categories";
import "../styles/Discover.css";
import { Translate } from "@mui/icons-material";

function Discover() {
  return (
    <div className="discover-container">
      <Typography variant="h4" className="main-title">
        Discover Events
      </Typography>

      <Typography className="sub-text">
        Explore popular events near you, browse by category, or check out some
        of the great community calendars.
      </Typography>

      <Typography variant="h5" className="section-title">
        Browse by Category
      </Typography>

      <Grid container spacing={3}>
        {Category.map((item) => {
          return (
            <Grid
              key={item.id}
              size={{ xs: 12, sm: 6, md: 3 }}
              sx={{
                borderColor: "white",
                border: 2,
                borderRadius: "20px",
                "&:hover": {
                  color: "#64a0fa",
                  transform: "rotate(45deg), Translate(40, 30), scale(1.5)",
                  cursor: "pointer",
                },
              }}
            >
              <Card
                className="category-card"
                component={Link}
                to={item.link}
                sx={{
                  textDecoration: "none",
                  color: "white",
                }}
              >
                <CardContent className="card-content">
                  <div className="icon-box">{item.icon}</div>

                  <div className="text-box">
                    <Typography
                      className="card-title"
                      sx={{
                        marginTop: "10px",
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography className="card-description">
                      {item.description}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default Discover;
