// Generate dummy data for health monitoring
export async function generateData(client) {
  try {
    await client.rpc('generate_dummy_data');
    return { success: true };
  } catch (error) {
    console.error('Error generating data:', error);
    return { success: false, error: error.message };
  }
}