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