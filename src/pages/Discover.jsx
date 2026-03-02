import React from "react";
import { Typography, Grid, Card, CardContent } from "@mui/material";
import Navbar from "../components/Navbar";
import { Category } from "../context/Categories";
import "../styles/Discover.css";

function Discover() {
  return (
    <div>
      <Navbar />

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
          {Category.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card className="category-card">
                <CardContent className="card-content">
                  <div className="icon-box">{item.icon}</div>

                  <div className="text-box">
                    <Typography className="card-title">{item.title}</Typography>

                    <Typography className="card-description">
                      {item.description}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export default Discover;
