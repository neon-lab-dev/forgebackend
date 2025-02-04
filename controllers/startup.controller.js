import catchAsyncError from "../middlewares/catch-async-error.js"
import startupModel from "../models/startup.model.js";
import imageModel from "../models/file.model.js";
import { bulkDeleteFiles } from "../utils/upload.js";
export const createStartup = catchAsyncError(async (req, res) => {
  const {
    name,
    websiteUrl,
    hardwareTech,
    hardwareInnovations,
    about,
    logo,
    keyInvestors,
    CustomersDetails,
    metricFeatures,
    category,
    grants
  } = req.body;


  

  const newStartup = new startupModel({
    name,
    logo: logo || '',
    websiteUrl,
    hardwareTech,
    hardwareInnovations,
    about,
    keyInvestors: keyInvestors || [],
    CustomersDetails: CustomersDetails || [],
    metricFeatures: metricFeatures || [],
    category,
    grants: grants || []
  });

  await newStartup.save();

  res.status(201).json({ message: "Startup created successfully!", startup: newStartup });
});

export const getStartups = catchAsyncError(async (req, res) => {
  const { futureScope, stages, programmes } = req.query;
  const query = {};

  // Build the query with proper nested paths
  if (futureScope) {
    query["category.futureScope"] = {
      $regex: futureScope,
      $options: "i"
    };
  }
  if (stages) {
    query["category.stages"] = {
      $regex: stages,
      $options: "i"
    };
  }
  if (programmes) {
    query["category.programmes"] = {
      $regex: programmes,
      $options: "i"
    };
  }

  const startups = await startupModel
    .find(query)
    .populate("logo")
    .populate("keyInvestors")
    .populate("CustomersDetails")
    .populate("metricFeatures.icon");

  if (!startups.length) {
    return res.status(404).json({ message: "No startups found." });
  }

  res.status(200).json({ message: "Startups retrieved successfully!", startups });
});


export const getSingleStartup = catchAsyncError(async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "Startup ID is required." });
  }

  const startup = await startupModel
    .findById(req.params.id)
    .populate("logo") // Populate logo field
    .populate("keyInvestors") // Populate keyInvestors array
    .populate("CustomersDetails") // Populate CustomersDetails array
    .populate("metricFeatures.icon"); // Populate icon field in metricFeatures

  if (!startup) {
    return res.status(404).json({ message: "Startup not found." });
  }

  res.status(200).json({ message: "Startup retrieved successfully!", startup });
});




export const editStartup = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    websiteUrl,
    hardwareTech,
    hardwareInnovations,
    about,
    logo,
    keyInvestors,
    CustomersDetails,
    metricFeatures,
    category,
    grants
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Startup ID is required." });
  }


  const startup = await startupModel.findById(id);

  if (!startup) {
    return res.status(404).json({ message: "Startup not found." });
  }


  if (logo && logo !== startup.logo.toString()) {

    const oldLogo = await imageModel.findById(startup.logo);
    if (oldLogo) {
      await oldLogo.remove();
    }

    const newLogo = await imageModel.findById(logo);
    if (newLogo) {
      startup.logo = logo;
    }
  }


  if (keyInvestors) {

    for (let i = 0; i < startup.keyInvestors.length; i++) {
      const investorImage = await imageModel.findById(startup.keyInvestors[i]);
      if (!investorImage) {
        startup.keyInvestors.splice(i, 1);
      }
    }

    for (const investorId of keyInvestors) {
      const investorImage = await imageModel.findById(investorId);
      if (investorImage) {
        startup.keyInvestors.push(investorId);
      }
    }
  }

  if (CustomersDetails) {
    for (let i = 0; i < startup.CustomersDetails.length; i++) {
      const customerImage = await imageModel.findById(startup.CustomersDetails[i]);
      if (!customerImage) {
        startup.CustomersDetails.splice(i, 1);
      }
    }
    for (const customerId of CustomersDetails) {
      const customerImage = await imageModel.findById(customerId);
      if (customerImage) {
        startup.CustomersDetails.push(customerId);
      }
    }
  }

  if (metricFeatures) {
    for (const feature of metricFeatures) {
      if (feature.icon) {
        const oldIcon = await imageModel.findById(feature.icon);
        if (!oldIcon) {
          feature.icon = null;
        }
        const newIcon = await imageModel.findById(feature.icon);
        if (newIcon) {
          feature.icon = feature.icon;
        }
      }
    }
    startup.metricFeatures = metricFeatures;
  }

  if (category) {
    startup.category = category;
  }
  if (grants) startup.grants = grants;

  if (name) startup.name = name;
  if (websiteUrl) startup.websiteUrl = websiteUrl;
  if (hardwareTech) startup.hardwareTech = hardwareTech;
  if (hardwareInnovations) startup.hardwareInnovations = hardwareInnovations;
  if (about) startup.about = about;

  await startup.save();

  res.status(200).json({
    message: "Startup updated successfully!",
    startup,
  });
});

export const deleteStartup = catchAsyncError(async (req, res) => {
  const { id } = req.params; // Startup ID from URL

  if (!id) {
    return res.status(400).json({ message: "Startup ID is required." });
  }

  // Fetch the startup by ID and populate image references
  const startup = await startupModel
    .findById(req.params.id)
    .populate("logo") // Populate logo field
    .populate("keyInvestors") // Populate keyInvestors array
    .populate("CustomersDetails") // Populate CustomersDetails array
    .populate("metricFeatures.icon"); // Populate icon field in metricFeatures
  if (!startup) {
    return res.status(404).json({ message: "Startup not found." });
  }

  // Collect all fileIds (logo, keyInvestors, CustomersDetails, and metricFeatures)
  const fileIds = [];

  // Logo
  if (startup.logo) fileIds.push(startup.logo.fileId);

  // KeyInvestors (array of ObjectIds, populated)
  startup.keyInvestors.forEach((investor) => {
    if (investor && investor.fileId) {
      fileIds.push(investor.fileId);
    }
  });

  // CustomersDetails (array of ObjectIds, populated)
  startup.CustomersDetails.forEach((customer) => {
    if (customer && customer.fileId) {
      fileIds.push(customer.fileId);
    }
  });

  // MetricFeatures (array of objects, populated)
  startup.metricFeatures.forEach((feature) => {
    if (feature.icon && feature.icon.fileId) {
      fileIds.push(feature.icon.fileId);
    }
  });
  console.log(fileIds)
  // Remove images from ImageKit using bulkDeleteFiles utility
  try {
    const result = await bulkDeleteFiles(fileIds); // Delete from ImageKit

    // Now delete images from Image model
    await imageModel.deleteMany({ fileId: { $in: fileIds } }); // Delete images from Image model


    // Finally, delete the startup
    await startupModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Images successfully deleted from ImageKit, Image model, and references removed from Startup.",
      result,
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting images: " + err.message });
  }
});

export const makeInactive = async (req, res) => {
  const { id } = req.params; // Startup ID from URL

  if (!id) {
    return res.status(400).json({ message: "Startup ID is required." });
  }

  const result = await startupModel.findByIdAndUpdate(id,
    {
      status: "Inactive"
    },
    {
      new: true,
      runValidators: true,
    });

  return res.status(200).json({
    message: "Status changed to inactive successfully",
    result,
  });
};

export const makeActive = async (req, res) => {
  const { id } = req.params; // Startup ID from URL

  if (!id) {
    return res.status(400).json({ message: "Startup ID is required." });
  }

  const result = await startupModel.findByIdAndUpdate(id,
    {
      status: "Active"
    },
    {
      new: true,
      runValidators: true,
    });

  return res.status(200).json({
    message: "Status changed to active successfully",
    result,
  });
};
// export const getProgrammes = catchAsyncError(async (req, res) => {
//   // Get distinct programmes from all startups' category.programmes
//   const programmes = await startupModel.distinct('category.programmes');
//   // const programmes = await startupModel.find();


//   if (!programmes.length) {
//     return res.status(404).json({ message: "No programmes found." });
//   }

//   res.status(200).json({
//     message: "Programmes retrieved successfully!",
//     programmes
//   });
// });

export const getProgramsAndGrants = catchAsyncError(async (req, res) => {
  const programmes = await startupModel.distinct('category.programmes');
  const grants = await startupModel.distinct('grants');

  if ((!programmes || programmes.length === 0) && (!grants || grants.length === 0)) {
    return res.status(404).json({ message: "No programmes or grants found." });
  }

  res.status(200).json({
    message: "Programs and grants retrieved successfully!",
    data: {
      programmes,
      grants,
    },
  });
});
