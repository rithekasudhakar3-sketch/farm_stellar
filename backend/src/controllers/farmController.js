const Farm = require('../models/Farm');

exports.updateMyFarm = async (req, res) => {
  try {
    const { name, address, size, primaryCrop } = req.body;
    const farm = await Farm.findOneAndUpdate(
      { userId: req.user.userId },
      { name, address, landSize: size, primaryCrop, farmLocation: req.body.farmLocation, geofence: req.body.geofence },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(farm);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
