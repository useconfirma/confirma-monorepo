declare global {
  // Express exposes Request through a global namespace for module augmentation.
  namespace Express {
    interface Request {
      userId?: string;
      accountId?: string;
    }
  }
}

export {};
