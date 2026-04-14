const crypto = require("crypto");
const generateSlug = async (text, checkExists) => {
  let baseSlug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!baseSlug) {
    baseSlug = "event";
  }

  if (!checkExists) {
    return baseSlug;
  }

  let finalSlug = baseSlug;
  let exists = await checkExists(finalSlug);

  let attempts = 0;
  const MAX_ATTEMPTS = 5;

  while (exists && attempts < MAX_ATTEMPTS) {
    const suffix = crypto.randomBytes(3).toString("hex");
    finalSlug = `${baseSlug}-${suffix}`;
    exists = await checkExists(finalSlug);
    attempts++;
  }

  if (exists) {
    throw new Error("Failed to generate unique slug after multiple attempts");
  }

  return finalSlug;
};

module.exports = generateSlug;
