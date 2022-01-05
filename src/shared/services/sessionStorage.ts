enum StorageKey {
  Token = "token",
}

export const loadJwtToken = () => localStorage.getItem(StorageKey.Token);
