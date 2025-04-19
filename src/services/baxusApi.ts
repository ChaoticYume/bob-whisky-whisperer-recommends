
export async function fetchBaxusBarData(username: string) {
  const response = await fetch(`http://services.baxus.co/api/bar/user/${username}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch bar data');
  }
  
  return response.json();
}
