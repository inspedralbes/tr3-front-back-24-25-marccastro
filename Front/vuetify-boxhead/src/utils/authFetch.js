const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!options.headers) {
    options.headers = {};
  }

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, options);
  return response.json();
};

export default fetchWithAuth;