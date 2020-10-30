const express = require("express");
const router = express.Router();
const Vehicle = require("../../models/vehicleModel");

router.get("/allvehicles", async (req, res) => {
  try {
    const data = await Vehicle.find({});
    res.send(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// finds car with matching model

router.get("/get/:model", async (req, res) => {
  try {
    const S2000 = await Vehicle.find({ model: req.params.model.toUpperCase() });
    res.status(200).json(S2000);
  } catch (err) {
    res.status(400).json(err);
  }
});

// finds car with matching model and changes img address (req.body.img)

router.post("/update/:model", async (req, res) => {
  try {
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { model: req.params.model.toUpperCase() },
      {
        img: req.body.img,
      },
      { new: true }
    );
    res.status(200).json(updatedVehicle);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/remove/:model", async (req, res) => {
  try {
    const removedVehicle = Vehicle.remove({
      model: req.params.model.toUpperCase(),
    });
    res.json(removedVehicle);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/newvehicles", async (req, res) => {
  const vehicle = new Vehicle({
    make: req.body.make,
    model: req.body.model,
    year: req.body.year,
    transmission: req.body.transmission,
    color: req.body.color,
    type: req.body.type,
    price: req.body.price,
    img: req.body.img,
  });
  try {
    const savedVehicle = await vehicle.save();
    res.status(201).send(savedVehicle);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
