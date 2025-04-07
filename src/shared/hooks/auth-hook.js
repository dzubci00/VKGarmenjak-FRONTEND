import { useState, useCallback, useEffect } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
  const [userId, setUserId] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);

  const login = useCallback((uid, token, admin, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setIsAdmin(admin);

    const calculatedExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); // Default to 1 hour
    setTokenExpirationDate(calculatedExpirationDate);

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: calculatedExpirationDate.toISOString(),
        isAdmin: admin,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setIsAdmin(false);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();

      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }

      const timer = setTimeout(logout, remainingTime);
      setLogoutTimer(timer);
    } else {
      // If no token or token expired, clean up the timer
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    }
  }, [token, tokenExpirationDate, logout]); // We remove logoutTimer from the dependency list here

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, storedData.isAdmin, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId, isAdmin };
};
