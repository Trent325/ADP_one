import React, { useState, useEffect } from "react";
import { oceanRegions } from "../../data/oceanRegions";
import { Container, ListGroup, ListGroupItem, Button, Card } from "react-bootstrap";
import MapView from "../map/Map"; // Import the MapView component
import axios from "axios"; // For fetching weather data

const RegionSelector: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [confirmedRegion, setConfirmedRegion] = useState<string | null>(null);
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (confirmedRegion) {
      // Generate the API request URL based on the selected region
      const fetchWeather = async () => {
        try {
          // Replace spaces with '%20' for URL encoding
          const regionName = encodeURIComponent(confirmedRegion);
          
          const response = await axios.get(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${regionName}?unitGroup=metric&key=LD83BRK2SM7EXQ6J9URERG9DJ&contentType=json`,
            {
              method: "GET",
              headers: {},
            }
          );
          console.log(response);
          setWeather(response.data);
        } catch (error) {
          console.error("Error fetching weather data", error);
        }
      };

      fetchWeather();
    }
  }, [confirmedRegion]);

  const handleSelect = (regionName: string) => {
    setSelectedRegion(regionName);
  };

  const handleConfirm = () => {
    if (selectedRegion) {
      setConfirmedRegion(selectedRegion);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Select a New Jersey Ocean Region</h2>
      <ListGroup>
        {oceanRegions.map((region) => (
          <ListGroupItem
            key={region.id}
            action
            active={selectedRegion === region.name}
            onClick={() => handleSelect(region.name)}
          >
            {region.name}
          </ListGroupItem>
        ))}
      </ListGroup>
      {selectedRegion && !confirmedRegion && (
        <Button variant="primary" className="mt-3" onClick={handleConfirm}>
          Confirm Selection: {selectedRegion}
        </Button>
      )}
      {confirmedRegion && (
        <>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => {
              setConfirmedRegion(null);
              setSelectedRegion(null);
            }}
          >
            Change Selection
          </Button>
          <MapView regionName={confirmedRegion} /> {/* Render the MapView component */}
          {weather && (
            <Card className="mt-4">
              <Card.Body>
                <Card.Title>Weather Forecast for {confirmedRegion}</Card.Title>
                <Card.Text>
                  <strong>Temperature:</strong> {weather.currentConditions.temp}°C
                </Card.Text>
                <Card.Text>
                  <strong>Wind:</strong> {weather.currentConditions.windspeed} m/s
                </Card.Text>
                <Card.Text>
                  <strong>Precipitation:</strong> {weather.currentConditions.precipitation} mm
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};

export default RegionSelector;
