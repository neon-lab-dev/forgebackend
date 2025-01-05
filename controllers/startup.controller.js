import catchAsyncError from "../middlewares/catch-async-error.js"
import startupModel from "../models/startup.model.js";
export const createStartup = catchAsyncError(async (req, res) => {
  const { name, websiteUrl, hardwareTech, hardwareInnovations, about, metricFeatures, category, logo, keyInvestors, CustomersDetails } = req.body;

  if (!name || !websiteUrl || !hardwareTech || !hardwareInnovations || !about) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  const parsedMetricFeatures = metricFeatures && typeof metricFeatures === "string" ? JSON.parse(metricFeatures) : metricFeatures;
  const parsedCategory = category && typeof category === "string" ? JSON.parse(category) : category;
  const parsedLogo = logo && typeof logo === "string" ? JSON.parse(logo) : logo;
  const parsedKeyInvestors = keyInvestors && typeof keyInvestors === "string" ? JSON.parse(keyInvestors) : keyInvestors;
  const parsedCustomersDetails = CustomersDetails && typeof CustomersDetails === "string" ? JSON.parse(CustomersDetails) : CustomersDetails;

  const newStartup = new startupModel({
    name,
    websiteUrl,
    hardwareTech,
    hardwareInnovations,
    about,
    logo: parsedLogo,
    keyInvestors: parsedKeyInvestors || [],
    CustomersDetails: parsedCustomersDetails || [],
    metricFeatures: parsedMetricFeatures || [],
    category: parsedCategory || [],
  });

  await newStartup.save();

  res.status(201).json({ message: "Startup created successfully!", startup: newStartup });
});

export const getStartups = catchAsyncError(async (req, res) => {
  const { futureScope, stages, programmes } = req.query;

  const categoryFilter = {};

  if (futureScope) {
    categoryFilter.futureScope = { $regex: futureScope, $options: "i" }; // Case-insensitive partial match
  }
  if (stages) {
    categoryFilter.stages = { $regex: stages, $options: "i" };
  }
  if (programmes) {
    categoryFilter.programmes = { $regex: programmes, $options: "i" };
  }

  const query = categoryFilter && Object.keys(categoryFilter).length > 0
    ? { category: { $elemMatch: categoryFilter } } // Match any category object
    : {}; // No filter, return all startups

  const startups = await startupModel.find(query);

  if (!startups.length) {
    return res.status(404).json({ message: "No startups found." });
  }

  res.status(200).json({ message: "Startups retrieved successfully!", startups });
});

export const getSingleStartup = catchAsyncError(async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Startup ID is required." });
  }
  const startup = await startupModel.findById(req.params.id);

  if (!startup) {
    return res.status(404).json({ message: "Startup not found." });
  }

  res.status(200).json({ message: "Startup retrieved successfully!", startup });
});